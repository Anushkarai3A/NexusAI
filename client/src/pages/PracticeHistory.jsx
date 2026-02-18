import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ClipboardList, Search } from 'lucide-react';

export default function PracticeHistory() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/interviews');
                setSessions(res.data);
            } catch (error) {
                console.error('Error fetching sessions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, []);

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-emerald-500';
        if (score >= 70) return 'text-blue-500';
        if (score >= 50) return 'text-amber-500';
        return 'text-rose-500';
    };

    const getScoreBg = (score) => {
        if (score >= 90) return 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20';
        if (score >= 70) return 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20';
        if (score >= 50) return 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20';
        return 'bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20';
    };

    const getScoreLabel = (score) => {
        if (score >= 90) return 'Excellent';
        if (score >= 70) return 'Good';
        if (score >= 50) return 'Average';
        return 'Needs Work';
    };

    const filteredSessions = sessions.filter(s => {
        if (filter === 'All') return true;
        const score = s.score?.total || 0;
        if (filter === 'Excellent') return score >= 90;
        if (filter === 'Good') return score >= 70 && score < 90;
        if (filter === 'Needs Work') return score < 70;
        return true;
    });

    const totalSessions = sessions.length;
    const avgScore = totalSessions > 0
        ? Math.round(sessions.reduce((sum, s) => sum + (s.score?.total || 0), 0) / totalSessions)
        : 0;
    const bestScore = totalSessions > 0
        ? Math.max(...sessions.map(s => s.score?.total || 0))
        : 0;

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center bg-[#f8fafc] dark:bg-[#0a0f1a]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10b981]"></div>
        </div>
    );

    return (
        <div className="p-8 bg-[#f8fafc] dark:bg-[#0a0f1a] min-h-screen animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3"><ClipboardList size={28} className="text-gray-400" /> Practice History</h1>
                <p className="text-gray-500 dark:text-gray-400">Track your progress and review past sessions</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total Sessions</p>
                    <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{totalSessions}</p>
                </div>
                <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Average Score</p>
                    <p className={`text-3xl font-extrabold ${getScoreColor(avgScore)}`}>{avgScore}%</p>
                </div>
                <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Best Score</p>
                    <p className={`text-3xl font-extrabold ${getScoreColor(bestScore)}`}>{bestScore}%</p>
                </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-3 mb-6">
                {['All', 'Excellent', 'Good', 'Needs Work'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === f
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30'
                            : 'bg-white dark:bg-[#111827] text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                    >
                        {f} {f === 'All' ? `(${sessions.length})` : ''}
                    </button>
                ))}
            </div>

            {/* Sessions List */}
            {filteredSessions.length === 0 ? (
                <div className="text-center py-20">
                    <Search size={48} className="mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No sessions found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        {totalSessions === 0 ? 'Start practicing to see your history here!' : 'Try adjusting your filter'}
                    </p>
                    {totalSessions === 0 && (
                        <Link to="/challenges" className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all">
                            Start Practicing →
                        </Link>
                    )}
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filteredSessions.map((session, idx) => {
                        const score = session.score?.total || 0;
                        return (
                            <div key={session._id || idx} className={`bg-white dark:bg-[#111827] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-md transition-all`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-lg font-extrabold border ${getScoreBg(score)} ${getScoreColor(score)}`}>
                                            {score}%
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                                                {session.problem?.title || 'Practice Session'}
                                            </h3>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] text-gray-400">
                                                    {session.createdAt ? new Date(session.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                                </span>
                                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ${session.problem?.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500' :
                                                    session.problem?.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-500' :
                                                        'bg-rose-500/10 text-rose-500'
                                                    }`}>
                                                    {session.problem?.difficulty || 'N/A'}
                                                </span>
                                                <span className="text-[10px] text-gray-400">{session.problem?.category || ''}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <span className={`text-xs font-bold ${getScoreColor(score)}`}>{getScoreLabel(score)}</span>
                                            <div className="flex gap-3 mt-1">
                                                <span className="text-[9px] text-gray-400">Tech: <span className="text-gray-600 dark:text-gray-300 font-medium">{session.score?.technical || 0}%</span></span>
                                                <span className="text-[9px] text-gray-400">Comm: <span className="text-gray-600 dark:text-gray-300 font-medium">{session.score?.communication || 0}%</span></span>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/interview/${session.problem?._id || session._id}`}
                                            className="px-4 py-2 bg-gray-900 dark:bg-emerald-500 text-white rounded-xl text-[10px] font-bold hover:opacity-90 transition-all"
                                        >
                                            Retry →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
