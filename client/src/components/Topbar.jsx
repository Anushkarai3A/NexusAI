import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, Bell } from 'lucide-react';

const Topbar = ({ title, subtitle }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [profilePic, setProfilePic] = useState('');

    useEffect(() => {
        setProfilePic(localStorage.getItem('profilePic') || '');
        const handleStorage = () => setProfilePic(localStorage.getItem('profilePic') || '');
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    return (
        <header className="h-16 flex items-center justify-between px-8 bg-white dark:bg-[#111827] border-b border-gray-100 dark:border-white/5 sticky top-0 z-40 transition-colors duration-300">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group active:scale-90"
                >
                    <ChevronLeft size={18} className="text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                </button>
                <div>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{title}</h1>
                    <p className="text-xs text-gray-400 font-medium">{subtitle}</p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button
                    onClick={() => navigate('/notifications')}
                    className="relative p-2 text-gray-400 hover:text-emerald-500 transition-all active:scale-90"
                >
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#111827] shadow-sm animate-bounce"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-gray-100 dark:border-white/5 group cursor-pointer" onClick={() => navigate('/profile')}>
                    <div className="text-right">
                        <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors">{user?.username || 'User'}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Learner</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 border-2 border-white dark:border-white/5 shadow-sm overflow-hidden group-hover:border-emerald-500/20 transition-all flex items-center justify-center">
                        {profilePic ? (
                            <img src={profilePic} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-sm font-extrabold text-white">{user?.username?.charAt(0)?.toUpperCase() || '?'}</span>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
