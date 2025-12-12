import React from 'react';

export default function BackgroundAnimated() {
    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-slate-900">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 animate-gradient-slow"></div>

            {/* Abstract floating shapes */}
            <div className="absolute top-10 left-10 w-96 h-96 bg-nature-500/20 rounded-full blur-3xl animate-float-slow"></div>
            <div className="absolute bottom-20 right-20 w-[30rem] h-[30rem] bg-water-500/10 rounded-full blur-3xl animate-float-delayed"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-blue-500/5 rounded-full blur-[100px] animate-pulse-slow"></div>

            {/* Grid pattern overlay for texture */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-20"></div>
        </div>
    );
}
