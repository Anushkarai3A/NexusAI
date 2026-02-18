import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AIInterviewer from '../components/AIInterviewer';
import CircularScore from '../components/CircularScore';
import LiveVideoFeed from '../components/LiveVideoFeed';

export default function InterviewRoom() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [problem, setProblem] = useState(null);
    const [aiScores, setAiScores] = useState({
        professionalism: 0,
        technical: 0,
        communication: 0,
        closing: 0
    });
    const { user } = useAuth();
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/problems/${id}`);
                setProblem(res.data);
            } catch (error) {
                console.error('Error fetching problem:', error);
            }
        };
        fetchProblem();
    }, [id]);

    if (!problem) return (
        <div className="h-full w-full flex items-center justify-center bg-[#0f172a]">
            <div className="animate-pulse text-emerald-500 font-black tracking-widest uppercase text-xs">Entering Interview Room...</div>
        </div>
    );

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-[#0f172a] text-white overflow-hidden font-inter animate-fade-in">
            {/* Header / Intro */}
            <div className="px-10 py-6 bg-[#1e293b]/50 border-b border-white/5 flex items-center justify-between flex-shrink-0">
                <div>
                    <h1 className="text-xl font-black uppercase tracking-tighter">Phase 1: Persona Interview</h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Initial Assessment & Soft Skills</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Candidate</p>
                        <p className="text-xs font-black text-emerald-400 uppercase tracking-tighter">{user?.username || 'Guest'}</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex p-8 gap-8 overflow-hidden min-h-0">
                {/* Left side: Large Video Feed (Candidate Perspective) */}
                <div className="flex-[1.5] flex flex-col gap-6 min-h-0">
                    <div className="flex-1 bg-black rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 relative group">
                        <LiveVideoFeed />

                        {/* Interview Progress Overlay */}
                        <div className="absolute top-8 left-8 flex gap-4 pointer-events-none">
                            <div className="px-6 py-3 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Session Duration</p>
                                <p className="text-sm font-black text-white tabular-nums">04:12</p>
                            </div>
                        </div>

                        {/* Status Label */}
                        <div className="absolute top-8 right-8">
                            <div className="px-4 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                Live Assessment
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Below Video */}
                    <div className="h-32 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 flex items-center justify-between">
                        <div className="flex-1 grid grid-cols-4 gap-8">
                            <CircularScore score={aiScores.professionalism} label="Soft Skills" color="#10b981" size={55} />
                            <CircularScore score={aiScores.technical} label="Technical" color="#0ea5e9" size={55} />
                            <CircularScore score={aiScores.communication} label="Clarity" color="#f59e0b" size={55} />
                            <CircularScore score={aiScores.closing} label="Success" color="#8b5cf6" size={55} />
                        </div>
                    </div>
                </div>

                {/* Right side: AI Interviewer (The Persona) */}
                <div className="w-[450px] flex flex-col gap-6 flex-shrink-0 min-h-0 overflow-hidden">
                    <div className="flex-1 min-h-0 overflow-hidden">
                        <AIInterviewer
                            problem={problem}
                            onUpdateStatus={(s) => {
                                if (s === 'Interview Complete') setIsComplete(true);
                            }}
                            onUpdateScores={(s) => setAiScores(s)}
                        />
                    </div>

                    {/* Proceed Button - only shown/active when ready */}
                    <button
                        onClick={() => navigate(`/problems/${id}`, { state: { initialScores: aiScores } })}
                        disabled={!isComplete}
                        className={`w-full py-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-4 ${isComplete
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95 shadow-emerald-500/20'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5 opacity-50'
                            }`}
                    >
                        <span>Stage 2: Coding Challenge</span>
                        <span className="text-xl">➔</span>
                    </button>
                    {!isComplete && (
                        <p className="text-center text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                            Complete initial interview to unlock coding part
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
