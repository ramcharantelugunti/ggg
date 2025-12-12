import React, { useState } from 'react';

export default function StateMap({ state }) {
    const displayState = state || "India";
    const [imageError, setImageError] = useState(false);

    // Format state name to filename (e.g. "Andhra Pradesh" -> "andhra_pradesh")
    const mapFileName = displayState.toLowerCase().replace(/\s+/g, '_');
    const mapSrc = `/maps/${mapFileName}.png`;

    return (
        <div className="glass-panel p-6 rounded-3xl h-full border border-white/10 relative overflow-hidden flex flex-col items-center justify-center group">
            <h3 className="text-xl font-bold text-white mb-4 w-full text-left flex items-center gap-2">
                <span className="text-nature-500">🗺️</span> Regional Focus: {displayState}
            </h3>

            <div className="relative w-64 h-64 flex items-center justify-center transition-all duration-500 hover:scale-105">

                {!imageError ? (
                    /* Dynamic State Image */
                    <div className="relative w-full h-full">
                        <div className="absolute inset-0 bg-nature-500/20 blur-3xl opacity-50 animate-pulse-slow"></div>
                        <img
                            src={mapSrc}
                            alt={displayState}
                            className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                            onError={() => setImageError(true)}
                        />

                        {/* Location Pin Animation */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <span className="flex h-3 w-3 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nature-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-nature-500"></span>
                            </span>
                        </div>
                    </div>
                ) : (
                    /* Fallback Abstract SVG (For states without images) */
                    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(34,197,94,0.3)] opacity-80">
                        <path
                            d="M198 10L220 30L250 40L280 80L300 120L340 140L360 180L350 220L320 250L340 280L330 320L300 360L280 400L250 450L200 490L150 450L120 400L100 350L80 300L60 250L40 200L50 150L80 100L120 60L160 30L198 10Z"
                            fill="rgba(255,255,255,0.05)"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="2"
                        />
                        <circle cx="200" cy="250" r="10" fill="#22c55e" className="animate-ping" />
                        <circle cx="200" cy="250" r="5" fill="white" />
                        <path d="M50 250H350" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
                        <path d="M200 100V400" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
                    </svg>
                )}

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-16 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-nature-100 border border-nature-500/30 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    📍 {displayState} Region
                </div>
            </div>

            <p className="text-white/60 text-sm mt-6 text-center">
                Geospatial Analysis for <span className="text-nature-400 font-semibold">{displayState}</span>
            </p>
        </div>
    );
}
