import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import CodeEditor from '../components/CodeEditor';
import { useAuth } from '../context/AuthContext';
import ProctoringOverlay from '../components/ProctoringOverlay';

import CircularScore from '../components/CircularScore';

export default function ProblemDetail() {
    const { id } = useParams();
    const location = useLocation();
    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [violations, setViolations] = useState([]);
    const [showWarning, setShowWarning] = useState(false);
    const [lastMalpractice, setLastMalpractice] = useState('');

    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleViolation = (v) => {
        setViolations(prev => [...prev, v]);
        if (v.type.startsWith('Malpractice')) {
            setLastMalpractice(v.type);
            setShowWarning(true);
        }
        console.warn('Security Violation:', v);
    };

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const res = await axios.get(`/api/problems/${id}`);
                setProblem(res.data);
                setCode(res.data.starterCode || '// Write your code here');
            } catch (error) {
                console.error('Error fetching problem:', error);
            }
        };
        fetchProblem();
    }, [id]);

    const [aiScores, setAiScores] = useState(location.state?.initialScores || {
        professionalism: 0,
        technical: 0,
        communication: 0,
        closing: 0
    });

    const handleRun = async () => {
        setIsRunning(true);
        setOutput('Running...');
        try {
            const res = await axios.post('/api/problems/run', {
                code,
                problemId: id,
                language: 'javascript'
            });

            const { passed, results, summary } = res.data;

            // Format output to show all test results
            let outputText = `${summary}\n\n`;

            results.forEach((result, idx) => {
                outputText += `Test Case ${result.testCase}:\n`;
                if (result.stderr) {
                    outputText += `  Error: ${result.stderr}\n`;
                } else {
                    outputText += `  Expected: ${result.expected}\n`;
                    outputText += `  Got: ${result.actual}\n`;
                    outputText += `  ${result.passed ? '✅ Passed' : '❌ Failed'}\n`;
                }
                outputText += '\n';
            });

            setOutput(outputText);

            if (passed) {
                setAiScores(prev => ({ ...prev, closing: Math.min(100, prev.closing + 30) }));
            }

            return outputText;
        } catch (error) {
            const err = 'Execution failed: ' + (error.response?.data?.error || error.message);
            setOutput(err);
            return err;
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // First run the code to get latest results
            const outputValue = await handleRun();

            await axios.post('/api/interviews/submit', {
                candidateId: user?.id || user?._id,
                problemId: id,
                code,
                outputValue
            });
            alert('Interview submitted successfully!');
        } catch (error) {
            console.error('Submission Error:', error);
            alert('Failed to submit interview result.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!problem) return (
        <div className="h-full w-full flex items-center justify-center bg-[#1e1e1e]">
            <div className="animate-pulse text-gray-500 font-bold tracking-widest uppercase text-xs">Loading Problem...</div>
        </div>
    );

    return (
        <div className="flex h-[calc(100vh-64px)] bg-[#121212] text-white overflow-hidden animate-fade-in font-inter">
            {/* Malpractice Warning Modal */}
            {/* ... modal logic remains same ... */}

            {/* Left Column: Problem Information (20%) */}
            <div className="w-[20%] min-w-[300px] flex flex-col border-r border-white/5 bg-[#1a1a1a]">
                <div className="flex bg-[#2a2a2a] border-b border-white/5">
                    <button className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest border-b-2 border-[#10b981] text-white">Question</button>
                    <button className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-300">Hints</button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <h2 className="text-2xl font-black mb-4 tracking-tight text-white">{problem.title}</h2>
                    <div className="flex items-center gap-3 mb-6">
                        <span className={`px-2 py-0.5 text-[9px] font-black rounded-md uppercase tracking-tighter ${problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                            {problem.difficulty}
                        </span>
                    </div>

                    <div className="prose prose-invert prose-xs max-w-none">
                        <p className="text-gray-400 leading-relaxed text-[11px] whitespace-pre-wrap mb-8">
                            {problem.description}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2">Example</h4>
                            <div className="space-y-2 font-mono text-[10px]">
                                <p><span className="text-gray-500">In:</span> <span className="text-emerald-400">{problem.testCases[0].input}</span></p>
                                <p><span className="text-gray-500">Out:</span> <span className="text-amber-400">{problem.testCases[0].output}</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-white/5">
                    <Link to="/problems" className="flex items-center gap-2 text-[9px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
                        ← Dashboard
                    </Link>
                </div>
            </div>

            {/* Middle Column: Editor & Console (flex-1) */}
            <div className="flex-1 flex flex-col border-r border-white/5 relative bg-[#121212]">
                {/* Proctoring Video (Top Left Overlay) */}
                <div className="absolute top-4 left-4 z-40 scale-75 origin-top-left pointer-events-none opacity-80 hover:opacity-100 transition-opacity">
                    <ProctoringOverlay onViolation={handleViolation} />
                </div>

                {/* Editor Section */}
                <div className="flex-1 flex flex-col">
                    {violations.length > 0 && (
                        <div className="bg-rose-500/10 border-b border-rose-500/20 px-6 py-1.5 flex items-center justify-between">
                            <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest animate-pulse">
                                Security Alert: {violations[violations.length - 1].type}
                            </p>
                        </div>
                    )}
                    <div className="flex items-center justify-between px-6 py-2 bg-[#1a1a1a] border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">JavaScript Engine v1.0</span>
                        </div>
                    </div>
                    <div className="flex-1 bg-[#1a1a1a]">
                        <CodeEditor code={code} setCode={setCode} language="javascript" />
                    </div>
                </div>

                {/* Console Section */}
                <div className="h-[200px] border-t border-white/10 bg-[#121212] flex flex-col">
                    <div className="flex justify-between items-center px-6 py-2.5 bg-[#1a1a1a] border-b border-white/5">
                        <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-500">Console</h3>
                        <div className="flex gap-3">
                            <button
                                onClick={handleRun}
                                disabled={isRunning}
                                className="bg-white/5 hover:bg-white/10 text-white font-black py-1 px-4 rounded-lg text-[9px] uppercase tracking-widest transition-all border border-white/10"
                            >
                                {isRunning ? '...' : 'Run'}
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-[#10b981] hover:bg-emerald-400 text-white font-black py-1 px-6 rounded-lg text-[9px] uppercase tracking-widest transition-all"
                            >
                                {isSubmitting ? '...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 p-5 font-mono text-[10px] overflow-auto custom-scrollbar">
                        {output ? (
                            <pre className={`whitespace-pre-wrap ${output.includes('✅') ? 'text-emerald-400' : 'text-gray-400'}`}>{output}</pre>
                        ) : (
                            <p className="text-gray-600 italic">No output yet...</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column: Progress & Stats (300px) */}
            <div className="w-[300px] flex flex-col bg-[#0f172a] border-l border-white/5">
                {/* AI Breakdown Stats */}
                <div className="p-8 bg-[#111827]">
                    <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Technical Progress</h3>
                    <div className="grid grid-cols-2 gap-y-10 gap-x-6">
                        <CircularScore score={aiScores.professionalism} label="Persona" color="#10b981" size={65} />
                        <CircularScore score={aiScores.technical} label="Tech Base" color="#0ea5e9" size={65} />
                        <CircularScore score={aiScores.communication} label="Confidence" color="#f59e0b" size={65} />
                        <CircularScore score={aiScores.closing} label="Logic Success" color="#8b5cf6" size={65} />
                    </div>
                </div>

                {/* Technical Metadata */}
                <div className="flex-1 p-8 bg-[#0f172a]/50 border-t border-white/5">
                    <div className="space-y-6">
                        <div>
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Technical Focus</p>
                            <div className="flex flex-wrap gap-2">
                                {problem.tags?.map(t => (
                                    <span key={t} className="px-2 py-1 bg-white/5 rounded text-[8px] font-bold text-slate-300">{t}</span>
                                )) || (
                                        <>
                                            <span className="px-2 py-1 bg-white/5 rounded text-[8px] font-bold text-slate-300">DSA</span>
                                            <span className="px-2 py-1 bg-white/5 rounded text-[8px] font-bold text-slate-300">Problem Solving</span>
                                        </>
                                    )}
                            </div>
                        </div>
                        <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter mb-1">Live Coding Phase</p>
                            <p className="text-[9px] text-slate-400 leading-relaxed">Your logic is being assessed in real-time as you solve this challenge.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
