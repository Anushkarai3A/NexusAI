import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Home, User, BarChart3, Dumbbell, FolderKanban, ClipboardList, BookOpen, Settings, Sun, Moon, LogOut } from 'lucide-react';

const Sidebar = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const menuItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: User, label: 'Profile', path: '/profile' },
        { icon: BarChart3, label: 'My Sessions', path: '/problems' },
        { icon: Dumbbell, label: 'Challenges', path: '/challenges' },
        { icon: FolderKanban, label: 'Projects', path: '/projects' },
        { icon: ClipboardList, label: 'Practice History', path: '/history' },
        { icon: BookOpen, label: 'Resources', path: '/resources' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-20 bg-[#1e1e1e] flex flex-col items-center py-6 z-50">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-10 shadow-lg">
                <span className="text-xl font-bold text-black">A</span>
            </div>

            <nav className="flex flex-col gap-3">
                {menuItems.map((item, index) => {
                    const isActive = location.pathname === item.path || (item.path === '/problems' && location.pathname.startsWith('/problems'));
                    const Icon = item.icon;
                    return (
                        <Link
                            key={index}
                            to={item.path}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 group relative ${isActive
                                ? 'bg-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <Icon size={20} strokeWidth={2} />
                            <span className="absolute left-16 bg-black text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[100] shadow-xl">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto flex flex-col items-center gap-6">
                <button
                    onClick={toggleTheme}
                    className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-emerald-500 transition-all active:scale-95 group relative"
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    <span className="absolute left-16 bg-black text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[100] shadow-xl">
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </span>
                </button>

                <button
                    onClick={handleLogout}
                    className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-rose-500 transition-colors group relative"
                >
                    <LogOut size={20} />
                    <span className="absolute left-16 bg-rose-500 text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[100] shadow-xl">
                        Logout
                    </span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
