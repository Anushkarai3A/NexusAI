import React, { useRef, useEffect, useState } from 'react';

const LiveVideoFeed = () => {
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [brightness, setBrightness] = useState(100);

    useEffect(() => {
        const enableVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Camera access denied:", err);
            }
        };
        enableVideo();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            videoRef.current.parentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    return (
        <div className="relative w-full h-full bg-black group overflow-hidden">
            <video
                ref={videoRef}
                autoPlay
                muted={isMuted}
                playsInline
                className="w-full h-full object-contain transition-all duration-300"
                style={{ filter: `brightness(${brightness}%)` }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                <div className="flex items-center justify-between text-white text-xs mb-3">
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        LIVE INTERVIEW
                    </span>
                    <div className="flex gap-4">
                        <button onClick={() => setBrightness(prev => (prev === 100 ? 130 : 100))} className="hover:text-emerald-400 transition-colors">
                            {brightness > 100 ? '🔆' : '🔅'}
                        </button>
                        <button onClick={() => setIsMuted(!isMuted)} className="hover:text-emerald-400 transition-colors">
                            {isMuted ? '🔇' : '🔊'}
                        </button>
                        <button onClick={toggleFullscreen} className="hover:text-emerald-400 transition-colors">
                            {isFullscreen ? '⛵' : '⛶'}
                        </button>
                    </div>
                </div>
                <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-[0%] bg-[#10b981] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                </div>
                <p className="text-white text-center mt-3 text-[11px] font-medium tracking-wide">
                    Recording Session in Progress...
                </p>
            </div>
        </div>
    );
};

export default LiveVideoFeed;
