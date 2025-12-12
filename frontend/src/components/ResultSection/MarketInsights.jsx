import React from 'react';
import priceData from '../../data/crop_prices.json';

export default function MarketInsights({ currentCrop, suggestions }) {
    const prices = priceData.market_prices;

    // Helper to extract crop names from suggestions strings if they are like "Switch to Millets"
    // But our backend returns strings like "Switch to Millets", "Install Drip...".
    // The suggestions are actions, not just crop names.
    // Exception: if suggestion contains "Switch to [Crop]", we can extract it.

    const relevantCrops = new Set();

    if (prices[currentCrop]) {
        relevantCrops.add(currentCrop);
    }

    // Naive extraction of crops from suggestions
    suggestions.forEach(sugg => {
        Object.keys(prices).forEach(crop => {
            if (sugg.includes(crop) && crop !== currentCrop) {
                relevantCrops.add(crop);
            }
        });
    });

    const cropList = Array.from(relevantCrops);

    if (cropList.length === 0) return null;

    return (
        <div className="glass-panel p-6 rounded-3xl text-gray-100 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="text-2xl">💰</span> Market Insights
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cropList.map(crop => {
                    const info = prices[crop];
                    const isCurrent = crop === currentCrop;
                    return (
                        <div key={crop} className={`p-4 rounded-2xl border ${isCurrent ? 'bg-white/10 border-nature-500/50' : 'bg-black/20 border-white/5'} relative group hover:border-white/20 transition-all`}>
                            {isCurrent && (
                                <span className="absolute -top-3 left-4 bg-nature-600 text-xs px-2 py-1 rounded-full border border-nature-400 font-bold shadow-lg">Current Crop</span>
                            )}

                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-lg text-white/90">{crop}</h4>
                                <span className={`text-xs px-2 py-0.5 rounded-md border ${info.trend === 'up' ? 'bg-green-500/20 text-green-300 border-green-500/30' : info.trend === 'down' ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'}`}>
                                    {info.trend === 'up' ? '↗ Rising' : info.trend === 'down' ? '↘ Falling' : '→ Stable'}
                                </span>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/50">Market Avg:</span>
                                    <span className="font-mono font-bold text-yellow-400">₹{info.market_avg}</span>
                                </div>
                                {info.msp && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/50">Govt MSP:</span>
                                        <span className="font-mono text-white/80">₹{info.msp}</span>
                                    </div>
                                )}
                                <div className="text-[10px] text-right text-white/30 pt-1">
                                    per Quintal
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <p className="text-xs text-white/30 mt-4 text-center">
                * Prices are indicative averages for 2024-25. Actual mandi prices may vary.
            </p>
        </div>
    );
}
