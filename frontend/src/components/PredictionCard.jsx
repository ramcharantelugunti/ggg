import React from 'react';

export default function PredictionCard({ riskLevel, probability }) {
  const getColors = () => {
    switch (riskLevel) {
      case 'High': return 'bg-red-600/20 text-red-100 border-red-500/30 shadow-[0_0_30px_rgba(220,38,38,0.2)]';
      case 'Medium': return 'bg-yellow-600/20 text-yellow-100 border-yellow-500/30 shadow-[0_0_30px_rgba(202,138,4,0.2)]';
      case 'Low': return 'bg-green-600/20 text-green-100 border-green-500/30 shadow-[0_0_30px_rgba(22,163,74,0.2)]';
      default: return 'bg-gray-600/20 text-gray-100 border-gray-500/30';
    }
  };

  return (
    <div className={`p-8 rounded-3xl border ${getColors()} backdrop-blur-md transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1`}>
      <h3 className="text-xl font-bold mb-4 opacity-90 uppercase tracking-wider text-xs">Analysis Result</h3>
      <div className="flex justify-between items-end mb-6">
        <div>
          <span className="block text-sm font-semibold opacity-70 mb-1">Risk Level</span>
          <span className="text-5xl font-extrabold tracking-tighter drop-shadow-lg">{riskLevel}</span>
        </div>
        <div className="text-right">
          <span className="block text-sm font-semibold opacity-70 mb-1">Failure Probability</span>
          <span className="text-4xl font-bold">{probability}%</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden border border-white/5">
        <div
          className="bg-current h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_currentColor] relative"
          style={{ width: `${probability}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full h-full opacity-50" />
        </div>
      </div>
    </div>
  );
}
