import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Settings } from 'lucide-react';
import { X } from 'lucide-react';

export default function Profile() {
    const { user } = useAuth();
    const fileInputRef = useRef(null);

    const [profilePic, setProfilePic] = useState(() => localStorage.getItem('profilePic') || '');
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [bio, setBio] = useState(() => localStorage.getItem('profileBio') || '');
    const [location, setLocation] = useState(() => localStorage.getItem('profileLocation') || '');
    const [github, setGithub] = useState(() => localStorage.getItem('profileGithub') || '');
    const [linkedin, setLinkedin] = useState(() => localStorage.getItem('profileLinkedin') || '');
    const [skills, setSkills] = useState(() => {
        const saved = localStorage.getItem('profileSkills');
        return saved ? JSON.parse(saved) : [];
    });
    const [newSkill, setNewSkill] = useState('');
    const [saved, setSaved] = useState(false);
    const [stats, setStats] = useState({ sessions: 0, avgScore: 0, bestScore: 0, problemsSolved: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/interviews');
                const sessions = res.data;
                const total = sessions.length;
                const avg = total > 0 ? Math.round(sessions.reduce((s, x) => s + (x.score?.total || 0), 0) / total) : 0;
                const best = total > 0 ? Math.max(...sessions.map(x => x.score?.total || 0)) : 0;
                setStats({ sessions: total, avgScore: avg, bestScore: best, problemsSolved: total });
            } catch (err) {
                console.error('Error fetching stats:', err);
            }
        };
        fetchStats();
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('Image must be under 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setProfilePic(reader.result);
            localStorage.setItem('profilePic', reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setProfilePic('');
        localStorage.removeItem('profilePic');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleAddSkill = () => {
        const trimmed = newSkill.trim();
        if (trimmed && !skills.includes(trimmed)) {
            setSkills([...skills, trimmed]);
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skill) => {
        setSkills(skills.filter(s => s !== skill));
    };

    const handleSave = () => {
        const updatedUser = { ...user, username, email };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('profileBio', bio);
        localStorage.setItem('profileLocation', location);
        localStorage.setItem('profileGithub', github);
        localStorage.setItem('profileLinkedin', linkedin);
        localStorage.setItem('profileSkills', JSON.stringify(skills));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        alert('✅ Profile saved successfully!');
    };

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-emerald-500';
        if (score >= 70) return 'text-blue-500';
        if (score >= 50) return 'text-amber-500';
        return 'text-rose-500';
    };

    return (
        <div className="p-8 bg-[#f8fafc] dark:bg-[#0a0f1a] min-h-screen animate-fade-in">
            {/* Saved Toast */}
            {saved && (
                <div className="fixed top-6 right-6 bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-xl z-50 animate-fade-in">
                    ✅ Profile saved!
                </div>
            )}

            <div className="max-w-4xl mx-auto">
                {/* Profile Header Card */}
                <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden mb-8">
                    {/* Banner */}
                    <div className="h-32 bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-600 relative">
                        <div className="absolute inset-0 bg-black/10"></div>
                    </div>

                    {/* Profile Info */}
                    <div className="px-8 pb-8 -mt-16 relative">
                        <div className="flex items-end gap-6 mb-6">
                            {/* Profile Picture */}
                            <div className="relative group">
                                <div className="w-28 h-28 rounded-2xl border-4 border-white dark:border-[#111827] shadow-xl overflow-hidden bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                                    {profilePic ? (
                                        <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-extrabold text-white">{username?.charAt(0)?.toUpperCase() || '?'}</span>
                                    )}
                                </div>
                                {/* Upload Overlay */}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                >
                                    <span className="text-white text-xs font-bold">📷 Change</span>
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                {profilePic && (
                                    <button
                                        onClick={handleRemoveImage}
                                        className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 text-white rounded-full text-[10px] font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-600"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                            <div className="pb-1">
                                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{username}</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[9px] px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full font-bold uppercase tracking-wider">Learner</span>
                                    {location && <span className="text-[10px] text-gray-400">📍 {location}</span>}
                                </div>
                            </div>
                        </div>

                        {bio && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 max-w-xl">{bio}</p>
                        )}

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {github && (
                                <a href={github.startsWith('http') ? github : `https://github.com/${github}`} target="_blank" rel="noopener noreferrer"
                                    className="text-[10px] px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                                    🐙 GitHub
                                </a>
                            )}
                            {linkedin && (
                                <a href={linkedin.startsWith('http') ? linkedin : `https://linkedin.com/in/${linkedin}`} target="_blank" rel="noopener noreferrer"
                                    className="text-[10px] px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                                    💼 LinkedIn
                                </a>
                            )}
                            <Link to="/settings" className="text-[10px] px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                                <Settings size={14} className="inline mr-1" /> Edit Settings
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {/* Left: Stats */}
                    <div className="col-span-1 space-y-6">
                        <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Practice Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Sessions</span>
                                    <span className="font-extrabold text-gray-900 dark:text-white">{stats.sessions}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Avg Score</span>
                                    <span className={`font-extrabold ${getScoreColor(stats.avgScore)}`}>{stats.avgScore}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Best Score</span>
                                    <span className={`font-extrabold ${getScoreColor(stats.bestScore)}`}>{stats.bestScore}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Problems Tried</span>
                                    <span className="font-extrabold text-gray-900 dark:text-white">{stats.problemsSolved}</span>
                                </div>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Skills</h3>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {skills.map((skill, idx) => (
                                    <span key={idx} className="text-[10px] px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg font-medium flex items-center gap-1 group">
                                        {skill}
                                        <button onClick={() => handleRemoveSkill(skill)} className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-600 transition-all ml-0.5"><X size={12} /></button>
                                    </span>
                                ))}
                                {skills.length === 0 && <p className="text-[10px] text-gray-400">No skills added yet</p>}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                                    placeholder="Add a skill..."
                                    className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-[11px] outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                                <button onClick={handleAddSkill} className="px-3 py-2 bg-emerald-500 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-600 transition-all">+</button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Edit Form */}
                    <div className="col-span-2">
                        <div className="bg-white dark:bg-[#111827] rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-white/5">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Edit Profile</h2>

                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Username</label>
                                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Email</label>
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Bio</label>
                                    <textarea value={bio} onChange={(e) => setBio(e.target.value)}
                                        rows={3} placeholder="Tell us about yourself..."
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none" />
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Location</label>
                                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                                        placeholder="e.g. Bangalore, India"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">GitHub</label>
                                        <input type="text" value={github} onChange={(e) => setGithub(e.target.value)}
                                            placeholder="username or full URL"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">LinkedIn</label>
                                        <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)}
                                            placeholder="username or full URL"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                                    </div>
                                </div>

                                {/* Profile Picture Upload Section */}
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Profile Picture</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center flex-shrink-0">
                                            {profilePic ? (
                                                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xl font-extrabold text-white">{username?.charAt(0)?.toUpperCase() || '?'}</span>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => fileInputRef.current?.click()}
                                                className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                                                📷 Upload Photo
                                            </button>
                                            {profilePic && (
                                                <button onClick={handleRemoveImage}
                                                    className="px-4 py-2.5 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/10 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all">
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-gray-400 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                                </div>
                            </div>

                            <button onClick={handleSave}
                                className="mt-8 px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30">
                                Save Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
