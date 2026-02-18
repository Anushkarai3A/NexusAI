import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { User, Palette, Code2, Lock, Settings as SettingsIcon, Sun, Moon, Trash2 } from 'lucide-react';

export default function Settings() {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('profile');
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [saved, setSaved] = useState(false);

    // Preferences stored in localStorage
    const [codeFont, setCodeFont] = useState(() => localStorage.getItem('codeFont') || 'monospace');
    const [fontSize, setFontSize] = useState(() => localStorage.getItem('fontSize') || '14');
    const [autoSave, setAutoSave] = useState(() => localStorage.getItem('autoSave') !== 'false');
    const [soundEffects, setSoundEffects] = useState(() => localStorage.getItem('soundEffects') !== 'false');
    const [timerEnabled, setTimerEnabled] = useState(() => localStorage.getItem('timerEnabled') !== 'false');
    const [difficulty, setDifficulty] = useState(() => localStorage.getItem('preferredDifficulty') || 'All');

    const handleSaveProfile = () => {
        const updatedUser = { ...user, username, email };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleSavePreferences = () => {
        localStorage.setItem('codeFont', codeFont);
        localStorage.setItem('fontSize', fontSize);
        localStorage.setItem('autoSave', autoSave);
        localStorage.setItem('soundEffects', soundEffects);
        localStorage.setItem('timerEnabled', timerEnabled);
        localStorage.setItem('preferredDifficulty', difficulty);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleDeleteData = () => {
        if (window.confirm('Are you sure you want to clear all your local practice data? This cannot be undone.')) {
            localStorage.removeItem('codeFont');
            localStorage.removeItem('fontSize');
            localStorage.removeItem('autoSave');
            localStorage.removeItem('soundEffects');
            localStorage.removeItem('timerEnabled');
            localStorage.removeItem('preferredDifficulty');
            alert('Local data cleared successfully!');
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', Icon: User },
        { id: 'appearance', label: 'Appearance', Icon: Palette },
        { id: 'coding', label: 'Coding', Icon: Code2 },
        { id: 'account', label: 'Account', Icon: Lock },
    ];

    return (
        <div className="p-8 bg-[#f8fafc] dark:bg-[#0a0f1a] min-h-screen animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3"><SettingsIcon size={28} className="text-gray-400" /> Settings</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your account and preferences</p>
            </div>

            {/* Saved Toast */}
            {saved && (
                <div className="fixed top-6 right-6 bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-xl z-50 animate-fade-in">
                    ✅ Saved successfully!
                </div>
            )}

            <div className="flex gap-8">
                {/* Sidebar Tabs */}
                <div className="w-56 flex-shrink-0">
                    <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                        {tabs.map(tab => {
                            const TabIcon = tab.Icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full text-left px-5 py-3.5 text-xs font-bold transition-all flex items-center gap-2.5 ${activeTab === tab.id
                                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-l-2 border-emerald-500'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border-l-2 border-transparent'
                                        }`}
                                >
                                    <TabIcon size={14} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 max-w-2xl">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="bg-white dark:bg-[#111827] rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-white/5">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Profile Information</h2>

                            <div className="flex items-center gap-5 mb-8">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-3xl font-extrabold text-white shadow-lg">
                                    {username?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">{username}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{email}</p>
                                    <span className="text-[9px] px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full font-bold uppercase tracking-wider mt-1 inline-block">Learner</span>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Username</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <button onClick={handleSaveProfile} className="mt-6 px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30">
                                Save Changes
                            </button>
                        </div>
                    )}

                    {/* Appearance Tab */}
                    {activeTab === 'appearance' && (
                        <div className="bg-white dark:bg-[#111827] rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-white/5">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Appearance</h2>

                            <div className="space-y-6">
                                {/* Theme Toggle */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">Dark Mode</h3>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
                                    </div>
                                    <button
                                        onClick={toggleTheme}
                                        className={`w-14 h-7 rounded-full transition-all relative ${isDarkMode ? 'bg-emerald-500' : 'bg-gray-300'}`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-1 transition-all ${isDarkMode ? 'left-8' : 'left-1'}`}></div>
                                    </button>
                                </div>

                                {/* Theme Preview */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div
                                        onClick={() => { if (isDarkMode) toggleTheme(); }}
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${!isDarkMode ? 'border-emerald-500 shadow-lg' : 'border-gray-200 dark:border-white/10 hover:border-gray-300'}`}
                                    >
                                        <div className="bg-white rounded-lg p-3 mb-2 border border-gray-100">
                                            <div className="h-2 bg-gray-200 rounded w-3/4 mb-1.5"></div>
                                            <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                                        </div>
                                        <p className="text-xs font-bold text-gray-900 dark:text-white text-center flex items-center justify-center gap-1"><Sun size={14} /> Light</p>
                                    </div>
                                    <div
                                        onClick={() => { if (!isDarkMode) toggleTheme(); }}
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${isDarkMode ? 'border-emerald-500 shadow-lg' : 'border-gray-200 dark:border-white/10 hover:border-gray-300'}`}
                                    >
                                        <div className="bg-gray-900 rounded-lg p-3 mb-2 border border-gray-700">
                                            <div className="h-2 bg-gray-700 rounded w-3/4 mb-1.5"></div>
                                            <div className="h-2 bg-gray-800 rounded w-1/2"></div>
                                        </div>
                                        <p className="text-xs font-bold text-gray-900 dark:text-white text-center flex items-center justify-center gap-1"><Moon size={14} /> Dark</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Coding Preferences Tab */}
                    {activeTab === 'coding' && (
                        <div className="bg-white dark:bg-[#111827] rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-white/5">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Coding Preferences</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Code Font</label>
                                    <select
                                        value={codeFont}
                                        onChange={(e) => setCodeFont(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm outline-none"
                                    >
                                        <option value="monospace">Monospace (Default)</option>
                                        <option value="'Fira Code', monospace">Fira Code</option>
                                        <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
                                        <option value="'Source Code Pro', monospace">Source Code Pro</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Font Size: {fontSize}px</label>
                                    <input
                                        type="range"
                                        min="12"
                                        max="20"
                                        value={fontSize}
                                        onChange={(e) => setFontSize(e.target.value)}
                                        className="w-full accent-emerald-500"
                                    />
                                    <div className="flex justify-between text-[9px] text-gray-400 mt-1">
                                        <span>12px</span>
                                        <span>20px</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Preferred Difficulty</label>
                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm outline-none"
                                    >
                                        <option value="All">All Difficulties</option>
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>

                                {/* Toggles */}
                                {[
                                    { label: 'Auto-save Code', desc: 'Automatically save your code while typing', value: autoSave, setter: setAutoSave },
                                    { label: 'Sound Effects', desc: 'Play sounds for test pass/fail', value: soundEffects, setter: setSoundEffects },
                                    { label: 'Practice Timer', desc: 'Show a countdown timer during practice', value: timerEnabled, setter: setTimerEnabled },
                                ].map((toggle, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{toggle.label}</h3>
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400">{toggle.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => toggle.setter(!toggle.value)}
                                            className={`w-14 h-7 rounded-full transition-all relative ${toggle.value ? 'bg-emerald-500' : 'bg-gray-300'}`}
                                        >
                                            <div className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-1 transition-all ${toggle.value ? 'left-8' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button onClick={handleSavePreferences} className="mt-6 px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30">
                                Save Preferences
                            </button>
                        </div>
                    )}

                    {/* Account Tab */}
                    {activeTab === 'account' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-[#111827] rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-white/5">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Account Actions</h2>

                                <div className="space-y-4">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group"
                                    >
                                        <div className="text-left">
                                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Sign Out</h3>
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400">Log out of your account</p>
                                        </div>
                                        <span className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">→</span>
                                    </button>

                                    <button
                                        onClick={handleDeleteData}
                                        className="w-full flex items-center justify-between p-4 bg-rose-50 dark:bg-rose-500/5 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-500/10 transition-all group border border-rose-100 dark:border-rose-500/10"
                                    >
                                        <div className="text-left">
                                            <h3 className="font-bold text-rose-600 dark:text-rose-400 text-sm">Clear Local Data</h3>
                                            <p className="text-[11px] text-rose-400 dark:text-rose-500">Reset all preferences to defaults</p>
                                        </div>
                                        <Trash2 size={18} className="text-rose-400 group-hover:text-rose-600 transition-colors" />
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-[#111827] rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-white/5">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">About</h2>
                                <div className="space-y-2 text-[11px] text-gray-500 dark:text-gray-400">
                                    <p><span className="font-bold text-gray-700 dark:text-gray-300">App:</span> AI Interview Platform</p>
                                    <p><span className="font-bold text-gray-700 dark:text-gray-300">Version:</span> 1.0.0</p>
                                    <p><span className="font-bold text-gray-700 dark:text-gray-300">Problems:</span> 94 across 15 patterns</p>
                                    <p><span className="font-bold text-gray-700 dark:text-gray-300">Engine:</span> JavaScript V1.0</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
