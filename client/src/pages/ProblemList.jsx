import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import CandidateCard from '../components/CandidateCard';
import CircularScore from '../components/CircularScore';
import LiveVideoFeed from '../components/LiveVideoFeed';
import StickyNotes from '../components/StickyNotes';
import { StickyNote, User, Copy, Info, Target, FileText, ThumbsUp, Lightbulb } from 'lucide-react';
import ProgressStats from '../components/ProgressStats';

export default function ProblemList() {
    const [problems, setProblems] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSession, setSelectedSession] = useState(null);
    const [isHiring, setIsHiring] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [problemsRes, sessionsRes] = await Promise.all([
                    api.get('/problems'),
                    api.get('/interviews')
                ]);
                setProblems(problemsRes.data);
                setSessions(sessionsRes.data);
                if (sessionsRes.data.length > 0) {
                    setSelectedSession(sessionsRes.data[0]);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleStatusUpdate = async (sessionId, newStatus) => {
        try {
            const res = await axios.patch(`/api/interviews/${sessionId}/status`, { status: newStatus });
            setSessions(sessions.map(s => s._id === sessionId ? res.data : s));
            if (selectedSession?._id === sessionId) {
                setSelectedSession(res.data);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleHire = async () => {
        setIsHiring(true);
        setTimeout(() => {
            setIsHiring(false);
            alert(`🎉 Congratulations! You've mastered ${activeSession?.problem?.title}!`);
            handleStatusUpdate(activeSession._id, 'Approved');
        }, 1500);
    };

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center bg-[#f8fafc]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10b981]"></div>
        </div>
    );

    const activeSession = selectedSession || sessions[0];

    return (
        <div className="p-8 h-full bg-[#f8fafc] animate-fade-in">
            <div className="grid grid-cols-12 gap-8 h-full">
                {/* Left Column: Recent Interviews */}
                <div className="col-span-3 flex flex-col gap-6">
                    <div className="bg-[#1e1e1e] dark:bg-black rounded-2xl p-5 shadow-xl text-white">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold">Recent Practice Sessions</h3>
                            <span className="text-[10px] text-gray-500">{sessions.length} sessions</span>
                        </div>
                        <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {sessions.length > 0 ? sessions.map((s) => (
                                <div key={s._id} onClick={() => setSelectedSession(s)}>
                                    <CandidateCard
                                        active={selectedSession?._id === s._id}
                                        candidate={{
                                            name: s.candidate?.username || 'Anonymous',
                                            role: s.problem?.title || 'Unknown Task',
                                            status: s.status,
                                            score: s.score?.total || 0,
                                            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.candidate?.username}`
                                        }}
                                    />
                                </div>
                            )) : (
                                <div className="text-center py-10 text-gray-500 text-xs">No practice sessions yet. Start your first interview!</div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 transition-colors">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><StickyNote size={16} /> Sticky Notes</h3>
                            <button
                                onClick={() => {
                                    const colors = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fecdd3', '#e9d5ff', '#fed7aa', '#a5f3fc'];
                                    const existing = JSON.parse(localStorage.getItem('stickyNotes') || '[]');
                                    const newNote = { id: Date.now(), text: '', color: colors[Math.floor(Math.random() * colors.length)] };
                                    localStorage.setItem('stickyNotes', JSON.stringify([newNote, ...existing]));
                                    window.dispatchEvent(new Event('notesUpdated'));
                                }}
                                className="text-emerald-500 text-xs font-bold hover:underline"
                            >
                                + Add
                            </button>
                        </div>
                        <StickyNotes />
                    </div>
                </div>

                {/* Middle Column: Progress Stats & Video */}
                <div className="col-span-6 flex flex-col gap-6">
                    {/* Progress Stats */}
                    <ProgressStats sessions={sessions} />

                    {/* Video Feed */}
                    <div className="bg-white dark:bg-[#111827] rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5 relative group transition-all duration-500">
                        <LiveVideoFeed />

                        <div className="absolute top-6 left-6 flex items-center gap-3 z-10 pointer-events-none">
                            <div className="w-10 h-10 rounded-xl bg-white/90 dark:bg-[#111827]/90 backdrop-blur-sm flex items-center justify-center border-2 border-white dark:border-white/10 shadow-xl text-lg font-bold text-emerald-600">
                                {activeSession?.candidate?.username?.charAt(0) || <User size={14} />}
                            </div>
                            <div className="bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10">
                                <h4 className="text-white font-bold text-xs shadow-sm">{activeSession?.candidate?.username || 'Candidate'}</h4>
                                <p className="text-white/80 text-[8px] uppercase tracking-wider font-bold">{activeSession?.problem?.title || 'Technical Interview'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5 transition-colors">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-900 dark:text-white">Task Details</h3>
                                <div className="flex gap-2">
                                    <button onClick={() => alert('Transcript downloaded!')} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-xs"><FileText size={12} /></button>
                                    <button onClick={() => alert('Code copied to clipboard!')} className="text-[#10b981] hover:text-emerald-600 transition-colors text-xs"><Copy size={12} /></button>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 mb-4">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Attempted Code</h4>
                                <pre className="text-[10px] text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 p-2 rounded border border-gray-100 dark:border-white/5 max-h-32 overflow-auto custom-scrollbar font-mono">
                                    {activeSession?.code || '// No code submitted'}
                                </pre>
                            </div>
                            <button className="w-full py-2 bg-gray-900 dark:bg-emerald-500 text-white rounded-xl text-[10px] font-bold hover:opacity-90 transition-all">
                                View Full Submission
                            </button>
                        </div>

                        <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5 transition-colors">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="p-1.5 bg-[#10b981]/10 text-[#10b981] rounded text-[10px]"><Info size={12} /></span>
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">AI Score Summary</h3>
                            </div>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{activeSession?.score?.total || 0}%</span>
                                <span className={`font-bold text-xs ${(activeSession?.score?.total || 0) >= 90 ? 'text-emerald-500' :
                                    (activeSession?.score?.total || 0) >= 70 ? 'text-blue-500' :
                                        (activeSession?.score?.total || 0) >= 50 ? 'text-amber-500' :
                                            'text-rose-500'
                                    }`}>
                                    {(activeSession?.score?.total || 0) >= 90 ? 'Excellent' :
                                        (activeSession?.score?.total || 0) >= 70 ? 'Good' :
                                            (activeSession?.score?.total || 0) >= 50 ? 'Average' :
                                                'Needs Improvement'}
                                </span>
                            </div>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                                {(activeSession?.score?.total || 0) >= 90
                                    ? 'Outstanding performance! You demonstrated excellent problem-solving skills and clear communication. You\'re interview-ready!'
                                    : (activeSession?.score?.total || 0) >= 70
                                        ? 'Strong performance! Your technical skills are solid. Focus on optimizing your approach and explaining your thought process more clearly.'
                                        : (activeSession?.score?.total || 0) >= 50
                                            ? 'Decent attempt! Review the core concepts and practice explaining your reasoning. Try breaking problems into smaller steps.'
                                            : 'Keep practicing! Focus on understanding the fundamentals and work through more problems in this pattern. You\'ll improve with consistency!'}
                            </p>
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Areas to Focus</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {(activeSession?.score?.technical || 0) < 70 && <span className="text-[9px] px-2 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full font-medium">Technical Skills</span>}
                                    {(activeSession?.score?.communication || 0) < 70 && <span className="text-[9px] px-2 py-1 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full font-medium">Communication</span>}
                                    {(activeSession?.score?.professionalism || 0) < 70 && <span className="text-[9px] px-2 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full font-medium">Soft Skills</span>}
                                    {(activeSession?.score?.closing || 0) < 70 && <span className="text-[9px] px-2 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-full font-medium">Problem Solving</span>}
                                    {(activeSession?.score?.total || 0) >= 70 && <span className="text-[9px] px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full font-medium flex items-center gap-1"><Target size={10} /> Keep it up!</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: AI breakdown & Available Problems */}
                <div className="col-span-3 flex flex-col gap-6">
                    <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5 transition-colors">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-8">AI breakdown</h3>
                        <div className="grid grid-cols-2 gap-y-10 gap-x-4">
                            <CircularScore score={activeSession?.score?.professionalism || 0} label="Soft Skills" color="#10b981" />
                            <CircularScore score={activeSession?.score?.technical || 0} label="Technical" color="#0ea5e9" />
                            <CircularScore score={activeSession?.score?.communication || 0} label="Clarity" color="#f59e0b" />
                            <CircularScore score={activeSession?.score?.closing || 0} label="Problem Solve" color="#10b981" />
                        </div>
                    </div>

                    <div className="bg-[#1e1e1e] dark:bg-black rounded-3xl p-6 shadow-xl text-white flex-1 overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold">Available Challenges</h3>
                            <span className="text-[10px] px-2 py-0.5 bg-gray-800 rounded-full font-bold">5 Easy</span>
                        </div>
                        <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
                            {problems
                                .filter(p => p.difficulty === 'Easy')
                                .sort(() => Math.random() - 0.5)
                                .slice(0, 5)
                                .map(problem => (
                                    <Link to={`/interview/${problem._id}`} key={problem._id}>
                                        <div className="p-4 bg-white/5 rounded-2xl border border-transparent hover:border-white/10 hover:bg-white/10 transition-all group">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-xs font-bold group-hover:text-[#10b981] transition-colors max-w-[70%]">{problem.title}</h4>
                                                <span className="text-[8px] px-2 py-0.5 bg-white/10 rounded text-gray-400 font-bold uppercase tracking-widest">{problem.category || 'General'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight bg-emerald-500/20 text-emerald-400">
                                                    {problem.difficulty}
                                                </span>
                                                <span className="text-[10px] text-gray-500 group-hover:text-[#10b981] transition-colors">Start Practice →</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
