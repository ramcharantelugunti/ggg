import React from 'react';

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 text-white overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-nature-500/20 via-slate-900 to-slate-900"></div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Animated Logo Container */}
                <div className="w-24 h-24 mb-8 relative">
                    <div className="absolute inset-0 bg-nature-500/30 rounded-xl blur-xl animate-pulse"></div>
                    <div className="absolute inset-0 border-2 border-nature-500/50 rounded-xl animate-spin-slow"></div>
                    <div className="absolute inset-2 border-2 border-water-400/50 rounded-lg animate-reverse-spin"></div>

                    <div className="absolute inset-0 flex items-center justify-center text-4xl animate-bounce-slight">
                        🌱
                    </div>
                </div>

                <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-nature-400 to-water-400 mb-4">
                    Water Sower
                </h1>

                <div className="flex items-center gap-2 text-white/40 text-sm font-medium tracking-widest uppercase">
                    <span className="w-2 h-2 bg-nature-500 rounded-full animate-ping"></span>
                    Initializing AI Models
                </div>
            </div>
        </div>
    );
}
