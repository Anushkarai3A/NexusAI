import React from 'react';

const CandidateCard = ({ candidate, active }) => {
    const { name, role, status, score, avatar } = candidate;

    const statusColors = {
        'Approved': 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
        'Rejected': 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400',
        'Pending': 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
    };

    const progressColors = {
        'Approved': 'bg-emerald-500',
        'Rejected': 'bg-rose-400',
        'Pending': 'bg-amber-400'
    };

    return (
        <div className={`p-4 rounded-xl border transition-all cursor-pointer group ${active
            ? 'bg-emerald-500/10 border-emerald-500/20 dark:bg-emerald-500/20 dark:border-emerald-500/30'
            : 'bg-white dark:bg-[#111827] border-transparent hover:border-gray-200 dark:hover:border-white/10 hover:shadow-sm'}`}>
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden ring-2 ring-white dark:ring-white/5 ring-offset-2 dark:ring-offset-[#111827]">
                    <img src={avatar} alt={name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-bold truncate transition-colors ${active ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white group-hover:text-[#10b981]'}`}>{name}</h4>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{role}</p>
                </div>
                <div className="text-right">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ${statusColors[status] || 'bg-gray-100 dark:bg-gray-800 dark:text-gray-400'}`}>
                        {status}
                    </span>
                    <p className="text-xs font-bold text-gray-900 dark:text-white mt-1">{score}/100</p>
                </div>
            </div>

            <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${progressColors[status] || 'bg-gray-300'}`}
                    style={{ width: `${score}%` }}
                ></div>
            </div>
        </div>
    );
};

export default CandidateCard;
