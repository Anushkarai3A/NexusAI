import { useState } from 'react';
import { Rocket, StickyNote, BookOpen, ClipboardList, Settings, Target, Bug, Dumbbell, Bot, ShieldCheck, Bell, Inbox } from 'lucide-react';

const updates = [
    {
        id: 1,
        type: 'feature',
        Icon: Rocket,
        title: 'Profile Page Launched',
        desc: 'You can now upload a profile picture from your device, add a bio, social links, and manage your skills.',
        date: 'Feb 18, 2026',
        isNew: true,
    },
    {
        id: 2,
        type: 'feature',
        Icon: StickyNote,
        title: 'Sticky Notes Added',
        desc: 'Jot down quick notes on your dashboard! Colorful sticky notes auto-save as you type.',
        date: 'Feb 18, 2026',
        isNew: true,
    },
    {
        id: 3,
        type: 'feature',
        Icon: BookOpen,
        title: 'Learning Resources Page',
        desc: 'New page with 15 coding patterns, study guides, and interview tips to help you prepare.',
        date: 'Feb 18, 2026',
        isNew: true,
    },
    {
        id: 4,
        type: 'feature',
        Icon: ClipboardList,
        title: 'Practice History',
        desc: 'Track all your past coding sessions with scores, filters, and retry options.',
        date: 'Feb 18, 2026',
        isNew: true,
    },
    {
        id: 5,
        type: 'improvement',
        Icon: Settings,
        title: 'Settings Page Revamp',
        desc: 'Functional settings with Profile, Appearance (dark/light mode), Coding Preferences, and Account management.',
        date: 'Feb 18, 2026',
        isNew: false,
    },
    {
        id: 6,
        type: 'improvement',
        Icon: Target,
        title: 'AI Score Feedback Improved',
        desc: 'Score summary now shows candidate-friendly motivational feedback and areas to focus on.',
        date: 'Feb 17, 2026',
        isNew: false,
    },
    {
        id: 7,
        type: 'fix',
        Icon: Bug,
        title: 'Code Execution Bug Fixed',
        desc: 'Fixed in-place modification problems (like Merge Sorted Array) now pass tests correctly.',
        date: 'Feb 17, 2026',
        isNew: false,
    },
    {
        id: 8,
        type: 'feature',
        Icon: Dumbbell,
        title: '94 Coding Challenges',
        desc: 'Practice across 15 patterns including Two Pointers, Sliding Window, Dynamic Programming, and more.',
        date: 'Feb 16, 2026',
        isNew: false,
    },
    {
        id: 9,
        type: 'feature',
        Icon: Bot,
        title: 'AI-Powered Interviews',
        desc: 'Get real-time AI feedback on your code, communication, and problem-solving approach.',
        date: 'Feb 16, 2026',
        isNew: false,
    },
    {
        id: 10,
        type: 'feature',
        Icon: ShieldCheck,
        title: 'Authentication System',
        desc: 'Secure login and registration with JWT tokens to protect your practice data.',
        date: 'Feb 16, 2026',
        isNew: false,
    },
];

const typeColors = {
    feature: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', label: 'New Feature' },
    improvement: { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', label: 'Improvement' },
    fix: { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', label: 'Bug Fix' },
};

export default function Notifications() {
    const [filter, setFilter] = useState('all');

    const filtered = filter === 'all' ? updates : updates.filter(u => u.type === filter);
    const newCount = updates.filter(u => u.isNew).length;

    return (
        <div className="p-8 bg-[#f8fafc] dark:bg-[#0a0f1a] min-h-screen animate-fade-in">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <Bell size={28} className="text-gray-400" /> Notifications
                        </h1>
                        {newCount > 0 && (
                            <span className="px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full">{newCount} new</span>
                        )}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">Latest platform updates and changelogs</p>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6">
                    {[
                        { id: 'all', label: 'All Updates', FilterIcon: null },
                        { id: 'feature', label: 'Features', FilterIcon: Rocket },
                        { id: 'improvement', label: 'Improvements', FilterIcon: Target },
                        { id: 'fix', label: 'Fixes', FilterIcon: Bug },
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${filter === f.id
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30'
                                : 'bg-white dark:bg-[#111827] text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            {f.FilterIcon && <f.FilterIcon size={12} />}
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                    {filtered.map((update) => {
                        const color = typeColors[update.type];
                        const ItemIcon = update.Icon;
                        return (
                            <div
                                key={update.id}
                                className={`bg-white dark:bg-[#111827] rounded-2xl p-5 shadow-sm border transition-all hover:shadow-md ${update.isNew
                                    ? 'border-emerald-200 dark:border-emerald-500/20'
                                    : 'border-gray-100 dark:border-white/5'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-xl ${color.bg} flex items-center justify-center flex-shrink-0`}>
                                        <ItemIcon size={18} className={color.text} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{update.title}</h3>
                                            <span className={`text-[9px] px-2 py-0.5 ${color.bg} ${color.text} rounded-full font-bold uppercase tracking-wider`}>
                                                {color.label}
                                            </span>
                                            {update.isNew && (
                                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{update.desc}</p>
                                        <p className="text-[9px] text-gray-400 mt-2 font-medium">{update.date}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <Inbox size={40} className="mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-400 text-sm">No updates in this category</p>
                    </div>
                )}
            </div>
        </div>
    );
}
