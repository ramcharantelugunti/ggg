import React from 'react';

export default function RiskGraph({ riskLevel }) {
    // Simple CSS/SVG Bar Chart Fallback (Robust against React 19 crashes)
    return (
        <div className="glass-panel p-6 rounded-3xl h-full border border-white/10 relative overflow-hidden flex flex-col">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-blue-400">📈</span> Risk Analysis Trend
            </h3>

            <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-2 border-b border-white/10">
                {[30, 45, 20, 60, riskLevel === 'High' ? 80 : 35, riskLevel === 'High' ? 90 : 25].map((h, i) => (
                    <div key={i} className="w-full flex flex-col justify-end items-center gap-2 group">
                        <div
                            className="w-full bg-water-500/50 rounded-t-md transition-all duration-1000 group-hover:bg-water-400"
                            style={{ height: `${h}%` }}
                        />
                        <span className="text-[10px] text-white/40">{['J', 'F', 'M', 'A', 'M', 'J'][i]}</span>
                    </div>
                ))}
            </div>

            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="white">
                    <path d="M16 6l2.29 2.29-4.88 4.88-4 4L2 9.41 3.41 8l6 6 4-4 6.3 6.29L22 14V6h-6z" />
                </svg>
            </div>
        </div>
    );
}
