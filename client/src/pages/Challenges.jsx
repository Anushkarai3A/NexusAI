import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Dumbbell, FolderOpen, Search } from 'lucide-react';

export default function Challenges() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPattern, setSelectedPattern] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/problems');
                setProblems(res.data);
            } catch (error) {
                console.error('Error fetching problems:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProblems();
    }, []);

    // Define all patterns explicitly
    const allPatterns = [
        'Prefix Sum',
        'Two Pointers',
        'Sliding Window',
        'Fast & Slow Pointers',
        'Linked List In-Place Reversal',
        'Monotonic Stack',
        'Top K Elements',
        'Overlapping Intervals',
        'Modified Binary Search',
        'Binary Tree Traversal',
        'DFS',
        'BFS',
        'Matrix Traversal',
        'Backtracking',
        'Dynamic Programming'
    ];

    const patterns = ['All', ...allPatterns];

    // Filter problems
    const filteredProblems = problems.filter(p => {
        const matchesPattern = selectedPattern === 'All' || p.category === selectedPattern;
        const matchesDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesPattern && matchesDifficulty && matchesSearch;
    });

    // Group by pattern
    const groupedProblems = filteredProblems.reduce((acc, problem) => {
        const category = problem.category;
        if (!acc[category]) acc[category] = [];
        acc[category].push(problem);
        return acc;
    }, {});

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center bg-[#f8fafc]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10b981]"></div>
        </div>
    );

    return (
        <div className="p-8 bg-[#f8fafc] min-h-screen animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3"><Dumbbell size={28} className="text-gray-400" /> Coding Challenges</h1>
                <p className="text-gray-600">Master {problems.length}+ problems across 15 coding patterns</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Search</label>
                        <input
                            type="text"
                            placeholder="Search problems..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                        />
                    </div>

                    {/* Pattern Filter */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Pattern</label>
                        <select
                            value={selectedPattern}
                            onChange={(e) => setSelectedPattern(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-gray-900"
                        >
                            {patterns.map(pattern => (
                                <option key={pattern} value={pattern}>{pattern}</option>
                            ))}
                        </select>
                    </div>

                    {/* Difficulty Filter */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Difficulty</label>
                        <select
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-gray-900"
                        >
                            <option value="All">All</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-6 text-xs">
                    <div><span className="font-bold text-gray-900">{filteredProblems.length}</span> <span className="text-gray-500">problems</span></div>
                    <div><span className="font-bold text-emerald-500">{filteredProblems.filter(p => p.difficulty === 'Easy').length}</span> <span className="text-gray-500">Easy</span></div>
                    <div><span className="font-bold text-amber-500">{filteredProblems.filter(p => p.difficulty === 'Medium').length}</span> <span className="text-gray-500">Medium</span></div>
                    <div><span className="font-bold text-rose-500">{filteredProblems.filter(p => p.difficulty === 'Hard').length}</span> <span className="text-gray-500">Hard</span></div>
                </div>
            </div>

            {/* Problems Grid */}
            <div className="space-y-8">
                {Object.entries(groupedProblems).map(([category, categoryProblems]) => (
                    <div key={category} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FolderOpen size={24} className="text-gray-400" />
                            {category}
                            <span className="text-xs font-normal text-gray-500 ml-2">({categoryProblems.length} problems)</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categoryProblems.map(problem => (
                                <Link
                                    key={problem._id}
                                    to={`/interview/${problem._id}`}
                                    className="group"
                                >
                                    <div className="p-4 border border-gray-200 rounded-xl hover:border-emerald-500 hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-600 transition-colors flex-1">
                                                {problem.title}
                                            </h3>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ml-2 flex-shrink-0 ${problem.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                                                problem.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-rose-100 text-rose-700'
                                                }`}>
                                                {problem.difficulty}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 line-clamp-2 mb-3">{problem.description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-gray-500">{category}</span>
                                            <span className="text-[10px] text-emerald-600 group-hover:text-emerald-700 font-bold">Start →</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {filteredProblems.length === 0 && (
                <div className="text-center py-20">
                    <Search size={48} className="mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No problems found</h3>
                    <p className="text-gray-600">Try adjusting your filters</p>
                </div>
            )}
        </div>
    );
}
