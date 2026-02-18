import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProblemList from './pages/ProblemList';
import ProblemDetail from './pages/ProblemDetail';
import InterviewRoom from './pages/InterviewRoom';
import Challenges from './pages/Challenges';
import Projects from './pages/Projects';
import PracticeHistory from './pages/PracticeHistory';
import LearningResources from './pages/LearningResources';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Layout from './components/Layout';

import { Construction } from 'lucide-react';

const Placeholder = ({ name }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-20 animate-fade-in">
    <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-emerald-100 dark:border-emerald-500/20">
      <Construction size={40} className="text-emerald-500" />
    </div>
    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{name}</h2>
    <p className="text-gray-500 dark:text-gray-400 max-w-sm">This module is currently under development to ensure a premium experience.</p>
  </div>
);

function Home() {
  const { user } = useAuth();
  if (user) return <Navigate to="/problems" />;

  const bubbles = [
    { size: 280, top: '5%', left: '10%', delay: '0s', duration: '18s', opacity: 0.18 },
    { size: 180, top: '60%', left: '5%', delay: '3s', duration: '22s', opacity: 0.14 },
    { size: 350, top: '20%', right: '5%', delay: '1s', duration: '20s', opacity: 0.12 },
    { size: 120, top: '75%', right: '15%', delay: '5s', duration: '16s', opacity: 0.22 },
    { size: 90, top: '40%', left: '40%', delay: '2s', duration: '14s', opacity: 0.25 },
    { size: 200, top: '80%', left: '50%', delay: '4s', duration: '24s', opacity: 0.1 },
    { size: 60, top: '15%', left: '60%', delay: '6s', duration: '12s', opacity: 0.3 },
    { size: 150, top: '50%', right: '30%', delay: '7s', duration: '19s', opacity: 0.16 },
    { size: 220, top: '35%', left: '75%', delay: '8s', duration: '21s', opacity: 0.11 },
    { size: 100, top: '10%', left: '85%', delay: '1.5s', duration: '15s', opacity: 0.2 },
  ];

  const features = [
    { Icon: 'bot', title: 'AI-Powered Feedback', desc: 'Real-time analysis of your code, logic, and communication skills' },
    { Icon: 'code', title: '94+ Challenges', desc: '15 coding patterns from Two Pointers to Dynamic Programming' },
    { Icon: 'chart', title: 'Smart Analytics', desc: 'Track your progress with detailed scoring and performance trends' },
    { Icon: 'video', title: 'Video Interviews', desc: 'Practice with live video and get assessed like a real interview' },
  ];

  const featureIcons = {
    bot: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>,
    code: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
    chart: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><line x1="12" x2="12" y1="20" y2="10" /><line x1="18" x2="18" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="16" /></svg>,
    video: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.934a.5.5 0 0 0-.777-.416L16 11" /><rect width="14" height="12" x="2" y="6" rx="2" /></svg>,
  };

  const glass = {
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
  };

  const glassStrong = {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(255,255,255,0.02)',
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0015 0%, #1a0030 25%, #0d001a 50%, #15002b 75%, #0a0015 100%)' }}>
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
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(139,92,246,0.4); } 70% { box-shadow: 0 0 0 15px rgba(139,92,246,0); } 100% { box-shadow: 0 0 0 0 rgba(139,92,246,0); } }
        @keyframes glass-glow { 0%,100% { box-shadow: 0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 rgba(139,92,246,0); } 50% { box-shadow: 0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 30px rgba(139,92,246,0.1); } }
      `}</style>

      {/* Glass Navbar */}
      <nav className="relative z-10 mx-6 mt-4 px-6 py-4 flex items-center justify-between rounded-2xl" style={{ ...glass, animation: 'fadeUp 0.8s ease-out' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white text-lg" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a855f7, #c084fc)', boxShadow: '0 0 25px rgba(139,92,246,0.5)' }}>N</div>
          <span className="text-xl font-extrabold text-white tracking-tight">Nexus<span style={{ color: '#c084fc' }}>AI</span></span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-bold text-gray-300 hover:text-white px-5 py-2.5 rounded-xl transition-all hover:bg-white/5">Sign In</Link>
          <Link to="/register" className="text-sm font-bold text-white px-5 py-2.5 rounded-xl transition-all" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a855f7)', boxShadow: '0 4px 20px rgba(139,92,246,0.4)' }}>Get Started Free</Link>
        </div>
      </nav>

      {/* Glass Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-12 pb-16">
        <div className="max-w-3xl mx-auto rounded-3xl px-12 py-14" style={{ ...glassStrong, animation: 'fadeUp 1s ease-out, glass-glow 6s ease-in-out infinite' }}>
          {/* Refraction line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,160,255,0.3), rgba(255,255,255,0.2), rgba(200,160,255,0.3), transparent)' }}></div>

          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-purple-300 border border-purple-500/20" style={{ ...glass }}>
              <span className="w-2 h-2 bg-purple-400 rounded-full" style={{ animation: 'pulse-ring 2s infinite' }}></span>
              Powered by Advanced AI
            </div>
          </div>

          <h1 className="text-6xl font-extrabold text-white mb-5 leading-[1.1]">
            Ace Every Interview{' '}
            <span style={{
              background: 'linear-gradient(135deg, #c084fc, #a855f7, #7c3aed, #c084fc)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shimmer 4s linear infinite',
            }}>With AI</span>
          </h1>

          <p className="text-base text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
            Your AI-powered interview coach. Practice with real coding challenges, get instant feedback on your approach, and track your growth.
          </p>

          <div className="flex gap-4 justify-center mb-5">
            <Link to="/register" className="px-8 py-3.5 rounded-2xl font-bold text-white text-sm transition-all hover:scale-105 active:scale-95" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a855f7, #c084fc)', boxShadow: '0 8px 30px rgba(139,92,246,0.4), inset 0 1px 0 rgba(255,255,255,0.2)' }}>
              Start Practicing Free →
            </Link>
            <Link to="/login" className="px-8 py-3.5 rounded-2xl font-bold text-purple-300 text-sm transition-all hover:scale-105 active:scale-95" style={{ ...glass, borderColor: 'rgba(139,92,246,0.2)' }}>
              I Have an Account
            </Link>
          </div>

          <p className="text-[11px] text-gray-500">No credit card required • 94+ coding challenges • Free forever</p>
        </div>
      </div>

      {/* Glass Feature Cards */}
      <div className="relative z-10 max-w-5xl mx-auto px-8 pb-14">
        <div className="grid grid-cols-4 gap-4" style={{ animation: 'fadeUp 1.4s ease-out' }}>
          {features.map((f, i) => (
            <div
              key={i}
              className="relative rounded-2xl p-6 text-center transition-all hover:-translate-y-2 cursor-default group overflow-hidden"
              style={{ ...glassStrong }}
            >
              {/* Top refraction line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}></div>
              {/* Corner reflection */}
              <div className="absolute top-2 right-2 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08), transparent)' }}></div>
              <div className="mb-3 drop-shadow-lg flex justify-center">{featureIcons[f.Icon]}</div>
              <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-purple-300 transition-colors">{f.title}</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Glass Stats Bar */}
      <div className="relative z-10 max-w-3xl mx-auto px-8 pb-16">
        <div className="relative flex justify-around py-6 rounded-2xl overflow-hidden" style={{ ...glassStrong, animation: 'fadeUp 1.6s ease-out' }}>
          {/* Top refraction */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,160,255,0.25), transparent)' }}></div>
          {[
            { num: '94+', label: 'Coding Problems' },
            { num: '15', label: 'Pattern Categories' },
            { num: 'AI', label: 'Powered Feedback' },
            { num: '∞', label: 'Practice Sessions' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-extrabold mb-0.5" style={{ color: '#c084fc', textShadow: '0 0 20px rgba(192,132,252,0.3)' }}>{s.num}</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Glass Footer */}
      <div className="relative z-10 mx-8 mb-6">
        <div className="text-center py-4 rounded-2xl" style={{ ...glass }}>
          <p className="text-[11px] text-gray-500">© 2026 NexusAI. Built for developers who want to succeed.</p>
        </div>
      </div>
    </div>
  );
}


// Protected route wrapper
const ProtectedRoute = ({ children, title, subtitle }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#f8fafc]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10b981]"></div>
    </div>
  );
  if (!user) return <Navigate to="/" />;
  return <Layout title={title} subtitle={subtitle}>{children}</Layout>;
};

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/problems"
              element={
                <ProtectedRoute title="Practice Dashboard" subtitle="Track your progress">
                  <ProblemList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/challenges"
              element={
                <ProtectedRoute title="Coding Challenges" subtitle="Master 94 problems across 15 patterns">
                  <Challenges />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview/:id"
              element={
                <ProtectedRoute title="Persona Interview" subtitle="Soft Skills Assessment">
                  <InterviewRoom />
                </ProtectedRoute>
              }
            />
            <Route
              path="/problems/:id"
              element={
                <ProtectedRoute title="Coding Challenge" subtitle="Technical Assessment">
                  <ProblemDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute title="Profile" subtitle="Your profile and stats">
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute title="Notifications" subtitle="Platform updates and changelogs">
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute title="Projects" subtitle="Manage your hiring projects">
                  <Projects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute title="Practice History" subtitle="Track your progress and review past sessions">
                  <PracticeHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resources"
              element={
                <ProtectedRoute title="Learning Resources" subtitle="Master coding patterns and ace your interviews">
                  <LearningResources />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute title="Settings" subtitle="Account and system preferences">
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
