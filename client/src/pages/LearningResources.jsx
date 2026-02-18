import { useState } from 'react';
import { Plus, ArrowLeftRight, PanelLeft, Rabbit, RefreshCcw, Layers, Trophy, BarChart3, Search, TreePine, ArrowDown, ArrowRight, Grid3x3, Undo2, Calculator, BookOpen, Puzzle, Lightbulb, Map, ClipboardList, Zap, BookOpenText, Eye, BookText, ExternalLink } from 'lucide-react';

const patterns = [
    {
        name: 'Prefix Sum',
        Icon: Plus,
        description: 'Build a prefix sum array to answer range sum queries in O(1) time.',
        tip: 'Think prefix sum when you need cumulative sums or subarray sums efficiently.',
        timeComplexity: 'O(n) build, O(1) query',
        link: 'https://leetcode.com/tag/prefix-sum/'
    },
    {
        name: 'Two Pointers',
        Icon: ArrowLeftRight,
        description: 'Use two pointers moving toward each other or in the same direction to solve array problems.',
        tip: 'Sort the array first, then use two pointers from both ends for pair/sum problems.',
        timeComplexity: 'O(n) or O(n log n)',
        link: 'https://leetcode.com/tag/two-pointers/'
    },
    {
        name: 'Sliding Window',
        Icon: PanelLeft,
        description: 'Maintain a window of elements and slide it across the array to find optimal subarrays.',
        tip: 'Use when asked about contiguous subarrays/substrings with some constraint (max, min, exact).',
        timeComplexity: 'O(n)',
        link: 'https://leetcode.com/tag/sliding-window/'
    },
    {
        name: 'Fast & Slow Pointers',
        Icon: Rabbit,
        description: 'Use two pointers moving at different speeds to detect cycles or find middle elements.',
        tip: 'Classic for linked list cycle detection and finding the middle node.',
        timeComplexity: 'O(n)',
        link: 'https://leetcode.com/tag/linked-list/'
    },
    {
        name: 'Linked List In-Place Reversal',
        Icon: RefreshCcw,
        description: 'Reverse portions of a linked list by manipulating node pointers in place.',
        tip: 'Track prev, curr, and next pointers. Draw it out before coding!',
        timeComplexity: 'O(n)',
        link: 'https://leetcode.com/tag/linked-list/'
    },
    {
        name: 'Monotonic Stack',
        Icon: Layers,
        description: 'Use a stack that maintains elements in increasing or decreasing order.',
        tip: 'Great for "next greater element" and "largest rectangle" style problems.',
        timeComplexity: 'O(n)',
        link: 'https://leetcode.com/tag/monotonic-stack/'
    },
    {
        name: 'Top K Elements',
        Icon: Trophy,
        description: 'Use a heap/priority queue to efficiently find the K largest or smallest elements.',
        tip: 'Use a min-heap of size K for top K largest, max-heap for top K smallest.',
        timeComplexity: 'O(n log k)',
        link: 'https://leetcode.com/tag/heap-priority-queue/'
    },
    {
        name: 'Overlapping Intervals',
        Icon: BarChart3,
        description: 'Sort intervals by start time and merge or process overlapping ones.',
        tip: 'Always sort by start time first. Compare current end with next start.',
        timeComplexity: 'O(n log n)',
        link: 'https://leetcode.com/tag/intervals/'
    },
    {
        name: 'Modified Binary Search',
        Icon: Search,
        description: 'Adapt binary search for rotated arrays, finding boundaries, or search spaces.',
        tip: 'When the search space is sorted or can be framed as monotonic, think binary search.',
        timeComplexity: 'O(log n)',
        link: 'https://leetcode.com/tag/binary-search/'
    },
    {
        name: 'Binary Tree Traversal',
        Icon: TreePine,
        description: 'Traverse trees using inorder, preorder, postorder, or level-order strategies.',
        tip: 'BFS for level-order, DFS (recursive/stack) for depth-based traversals.',
        timeComplexity: 'O(n)',
        link: 'https://leetcode.com/tag/binary-tree/'
    },
    {
        name: 'DFS',
        Icon: ArrowDown,
        description: 'Explore as deep as possible before backtracking. Used for trees, graphs, and paths.',
        tip: 'Use recursion or an explicit stack. Track visited nodes for graphs.',
        timeComplexity: 'O(V + E)',
        link: 'https://leetcode.com/tag/depth-first-search/'
    },
    {
        name: 'BFS',
        Icon: ArrowRight,
        description: 'Explore level by level using a queue. Ideal for shortest path in unweighted graphs.',
        tip: 'Always use a queue. BFS guarantees shortest path in unweighted graphs.',
        timeComplexity: 'O(V + E)',
        link: 'https://leetcode.com/tag/breadth-first-search/'
    },
    {
        name: 'Matrix Traversal',
        Icon: Grid3x3,
        description: 'Navigate 2D grids using DFS/BFS for island counting, path finding, etc.',
        tip: 'Use direction arrays: dx = [-1,1,0,0], dy = [0,0,-1,1] for 4 directions.',
        timeComplexity: 'O(m × n)',
        link: 'https://leetcode.com/tag/matrix/'
    },
    {
        name: 'Backtracking',
        Icon: Undo2,
        description: 'Build solutions incrementally and abandon paths that fail constraints.',
        tip: 'Template: choose → explore → unchoose. Prune early for performance.',
        timeComplexity: 'O(2^n) or O(n!)',
        link: 'https://leetcode.com/tag/backtracking/'
    },
    {
        name: 'Dynamic Programming',
        Icon: Calculator,
        description: 'Break problems into overlapping subproblems and store intermediate results.',
        tip: 'Define state, recurrence relation, and base case. Start with recursion + memoization.',
        timeComplexity: 'Varies',
        link: 'https://leetcode.com/tag/dynamic-programming/'
    }
];

const studyGuides = [
    { title: 'Neetcode 150 Roadmap', url: 'https://neetcode.io/roadmap', desc: 'Structured roadmap covering all essential patterns', Icon: Map },
    { title: 'Blind 75 Must-Do List', url: 'https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions', desc: 'The original 75 most frequently asked interview questions', Icon: ClipboardList },
    { title: 'Big-O Cheat Sheet', url: 'https://www.bigocheatsheet.com/', desc: 'Time and space complexity reference for all data structures', Icon: Zap },
    { title: 'Tech Interview Handbook', url: 'https://www.techinterviewhandbook.org/', desc: 'Comprehensive guide to technical interviews', Icon: BookOpenText },
    { title: 'Visualgo', url: 'https://visualgo.net/', desc: 'Visualize data structures and algorithms step by step', Icon: Eye },
    { title: 'JavaScript Info', url: 'https://javascript.info/', desc: 'Deep dive into JavaScript fundamentals', Icon: BookText },
];

const interviewTips = [
    { title: 'Clarify Before Coding', desc: 'Always ask clarifying questions about edge cases, input constraints, and expected output before writing any code.' },
    { title: 'Think Out Loud', desc: 'Explain your thought process as you work. Interviewers evaluate how you think, not just whether you get the right answer.' },
    { title: 'Start with Brute Force', desc: 'Describe the brute force solution first, then optimize. This shows you understand the problem.' },
    { title: 'Test Your Code', desc: 'Walk through your solution with the example test cases before submitting. Check edge cases too.' },
    { title: 'Know Your Complexities', desc: 'Always state the time and space complexity of your solution. Be prepared to explain why.' },
    { title: 'Practice Under Pressure', desc: 'Use timed sessions to simulate real interview conditions. Aim to solve medium problems in 20-25 minutes.' },
];

export default function LearningResources() {
    const [activeTab, setActiveTab] = useState('patterns');

    return (
        <div className="p-8 bg-[#f8fafc] dark:bg-[#0a0f1a] min-h-screen animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                    <BookOpen size={28} className="text-gray-400" /> Learning Resources
                </h1>
                <p className="text-gray-500 dark:text-gray-400">Master coding patterns, study guides, and interview tips</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8">
                {[
                    { id: 'patterns', label: 'Coding Patterns', count: 15, TabIcon: Puzzle },
                    { id: 'guides', label: 'Study Guides', count: studyGuides.length, TabIcon: BookOpenText },
                    { id: 'tips', label: 'Interview Tips', count: interviewTips.length, TabIcon: Lightbulb },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === tab.id
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30'
                            : 'bg-white dark:bg-[#111827] text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                    >
                        <tab.TabIcon size={14} />
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {/* Coding Patterns */}
            {activeTab === 'patterns' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {patterns.map((pattern, idx) => {
                        const PatternIcon = pattern.Icon;
                        return (
                            <div key={idx} className="bg-white dark:bg-[#111827] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-500/20 transition-all group">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                        <PatternIcon size={20} className="text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{pattern.name}</h3>
                                        <span className="text-[9px] px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full font-medium">{pattern.timeComplexity}</span>
                                    </div>
                                </div>
                                <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed mb-3">{pattern.description}</p>
                                <div className="bg-emerald-50 dark:bg-emerald-500/5 rounded-lg p-2.5 mb-3 border border-emerald-100 dark:border-emerald-500/10">
                                    <p className="text-[10px] text-emerald-700 dark:text-emerald-400 leading-relaxed flex items-start gap-1">
                                        <Lightbulb size={12} className="flex-shrink-0 mt-0.5" /> <span><span className="font-bold">Tip:</span> {pattern.tip}</span>
                                    </p>
                                </div>
                                <a href={pattern.link} target="_blank" rel="noopener noreferrer"
                                    className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1">
                                    Practice on LeetCode <ExternalLink size={10} />
                                </a>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Study Guides */}
            {activeTab === 'guides' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {studyGuides.map((guide, idx) => {
                        const GuideIcon = guide.Icon;
                        return (
                            <a key={idx} href={guide.url} target="_blank" rel="noopener noreferrer"
                                className="bg-white dark:bg-[#111827] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-500/20 transition-all group flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                    <GuideIcon size={24} className="text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{guide.title}</h3>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mb-2">{guide.desc}</p>
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">Open Resource <ExternalLink size={10} /></span>
                                </div>
                            </a>
                        );
                    })}
                </div>
            )}

            {/* Interview Tips */}
            {activeTab === 'tips' && (
                <div className="flex flex-col gap-4">
                    {interviewTips.map((tip, idx) => (
                        <div key={idx} className="bg-white dark:bg-[#111827] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-md transition-all flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-extrabold text-sm flex-shrink-0">
                                {idx + 1}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{tip.title}</h3>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{tip.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
