import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Bot, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(email, password);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.error);
        }
    };

    const bubbles = [
        { size: 220, top: '5%', left: '8%', delay: '0s', duration: '18s', opacity: 0.15 },
        { size: 150, top: '65%', left: '3%', delay: '3s', duration: '22s', opacity: 0.12 },
        { size: 280, top: '15%', right: '3%', delay: '1s', duration: '20s', opacity: 0.1 },
        { size: 100, top: '78%', right: '12%', delay: '5s', duration: '16s', opacity: 0.18 },
        { size: 70, top: '40%', left: '35%', delay: '2s', duration: '14s', opacity: 0.2 },
        { size: 180, top: '85%', left: '55%', delay: '4s', duration: '24s', opacity: 0.08 },
        { size: 50, top: '12%', left: '65%', delay: '6s', duration: '12s', opacity: 0.25 },
        { size: 130, top: '50%', right: '25%', delay: '7s', duration: '19s', opacity: 0.13 },
    ];

    const glass = {
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a0015 0%, #1a0030 25%, #0d001a 50%, #15002b 75%, #0a0015 100%)' }}>
            {/* Animated metallic purple bubbles */}
            {bubbles.map((b, i) => (
                <div
                    key={i}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        width: b.size, height: b.size,
                        top: b.top, left: b.left, right: b.right,
                        opacity: b.opacity,
                        background: `radial-gradient(circle at 30% 20%, rgba(220,180,255,0.7) 0%, rgba(160,100,255,0.35) 25%, rgba(100,50,220,0.15) 55%, transparent 75%)`,
                        boxShadow: `inset 0 0 ${b.size / 3}px rgba(200,160,255,0.12), 0 0 ${b.size / 2}px rgba(139,92,246,0.06), inset ${b.size / 6}px -${b.size / 6}px ${b.size / 4}px rgba(255,255,255,0.03)`,
                        animation: `float${i % 3} ${b.duration} ease-in-out infinite`,
                        animationDelay: b.delay,
                        filter: 'blur(0.5px)',
                    }}
                />
            ))}

            {/* CSS Animations */}
            <style>{`
                @keyframes float0 { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(30px,-40px) scale(1.05); } 66% { transform: translate(-20px,25px) scale(0.95); } }
                @keyframes float1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-35px,-30px) scale(1.08); } }
                @keyframes float2 { 0%,100% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(25px,-35px) rotate(5deg); } }
                @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
                @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
            `}</style>

            {/* Back to home */}
            <Link to="/" className="absolute top-6 left-6 z-20 text-sm font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/5">
                ← Back to Home
            </Link>

            {/* Glass Login Card */}
            <div className="relative z-10 w-full max-w-md mx-4" style={{ animation: 'fadeUp 0.8s ease-out' }}>
                {/* Top refraction line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />

                <div className="rounded-[28px] p-10 flex flex-col items-center" style={glass}>
                    {/* Logo */}
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a855f7, #c084fc)', boxShadow: '0 0 35px rgba(139,92,246,0.5), inset 0 1px 0 rgba(255,255,255,0.2)' }}>
                        <Bot size={32} className="text-white" />
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl font-extrabold mb-2 text-center text-white">Welcome Back</h2>
                    <p className="text-gray-500 text-sm mb-8">Sign in to continue your journey</p>

                    {/* Error */}
                    {error && (
                        <div className="w-full p-3 rounded-xl mb-6 text-center text-xs font-bold border" style={{ background: 'rgba(244,63,94,0.1)', borderColor: 'rgba(244,63,94,0.2)', color: '#fb7185' }}>
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="w-full space-y-5">
                        <div>
                            <label className="block mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Email Address</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                <input
                                    type="email"
                                    className="w-full pl-11 pr-4 py-4 rounded-2xl text-sm font-medium text-white placeholder-gray-600 focus:outline-none transition-all"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)' }}
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                <input
                                    type="password"
                                    className="w-full pl-11 pr-4 py-4 rounded-2xl text-sm font-medium text-white placeholder-gray-600 focus:outline-none transition-all"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)' }}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full font-bold py-4 rounded-2xl transition-all active:scale-[0.98] text-white text-sm flex items-center justify-center gap-2 hover:scale-[1.02]"
                            style={{ background: 'linear-gradient(135deg, #8b5cf6, #a855f7, #c084fc)', boxShadow: '0 8px 30px rgba(139,92,246,0.4), inset 0 1px 0 rgba(255,255,255,0.2)' }}
                        >
                            Sign In <ArrowRight size={16} />
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500 font-medium">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-bold hover:underline" style={{ color: '#c084fc' }}>Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
