import React from 'react';

const CircularScore = ({ score, label, color = "#10b981", size = 80 }) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width: size, height: size }}>
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="transparent"
                        stroke="#f1f5f9"
                        strokeWidth="6"
                    />
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth="6"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-base font-bold text-gray-900 dark:text-white">{score}%</span>
                </div>
            </div>
            {label && <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wide">{label}</p>}
        </div>
    );
};

export default CircularScore;
