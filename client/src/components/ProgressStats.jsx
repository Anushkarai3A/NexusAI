import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ProgressStats({ sessions }) {
    const [stats, setStats] = useState({
        totalSessions: 0,
        averageScore: 0,
        improvement: 0,
        streak: 0,
        chartData: []
    });

    useEffect(() => {
        if (!sessions || sessions.length === 0) return;

        // Calculate total sessions
        const totalSessions = sessions.length;

        // Calculate average score
        const totalScore = sessions.reduce((sum, s) => sum + (s.score?.total || 0), 0);
        const averageScore = Math.round(totalScore / totalSessions);

        // Calculate improvement (compare last 3 vs first 3)
        const recentSessions = sessions.slice(0, Math.min(3, sessions.length));
        const oldSessions = sessions.slice(-Math.min(3, sessions.length));
        const recentAvg = recentSessions.reduce((sum, s) => sum + (s.score?.total || 0), 0) / recentSessions.length;
        const oldAvg = oldSessions.reduce((sum, s) => sum + (s.score?.total || 0), 0) / oldSessions.length;
        const improvement = Math.round(((recentAvg - oldAvg) / oldAvg) * 100) || 0;

        // Calculate streak (consecutive days with practice)
        const today = new Date();
        let streak = 0;
        const sortedSessions = [...sessions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        for (let i = 0; i < sortedSessions.length; i++) {
            const sessionDate = new Date(sortedSessions[i].createdAt);
            const daysDiff = Math.floor((today - sessionDate) / (1000 * 60 * 60 * 24));

            if (daysDiff === i) {
                streak++;
            } else {
                break;
            }
        }

        // Prepare chart data (last 10 sessions)
        const chartData = sessions
            .slice(0, 10)
            .reverse()
            .map((s, idx) => ({
                session: `#${idx + 1}`,
                score: s.score?.total || 0,
                technical: s.score?.technical || 0,
                softSkills: s.score?.professionalism || 0
            }));

        setStats({
            totalSessions,
            averageScore,
            improvement,
            streak,
            chartData
        });
    }, [sessions]);

    return (
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5 transition-colors">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">Your Progress</h3>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-500">{stats.totalSessions}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wide">Sessions</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">{stats.averageScore}%</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wide">Avg Score</div>
                </div>
                <div className="text-center">
                    <div className={`text-2xl font-bold ${stats.improvement >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {stats.improvement > 0 ? '+' : ''}{stats.improvement}%
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wide">Improvement</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-amber-500">{stats.streak} 🔥</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wide">Day Streak</div>
                </div>
            </div>

            {/* Chart */}
            {stats.chartData.length > 0 && (
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats.chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis
                                dataKey="session"
                                stroke="#9ca3af"
                                style={{ fontSize: '10px' }}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                style={{ fontSize: '10px' }}
                                domain={[0, 100]}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="score"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={{ fill: '#10b981', r: 4 }}
                                name="Overall"
                            />
                            <Line
                                type="monotone"
                                dataKey="technical"
                                stroke="#0ea5e9"
                                strokeWidth={2}
                                dot={{ fill: '#0ea5e9', r: 3 }}
                                name="Technical"
                            />
                            <Line
                                type="monotone"
                                dataKey="softSkills"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                dot={{ fill: '#f59e0b', r: 3 }}
                                name="Soft Skills"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
