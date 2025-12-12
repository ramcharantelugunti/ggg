import React from 'react';

export default function SuggestionList({ suggestions }) {
  return (
    <div className="glass-panel p-6 rounded-3xl text-gray-100">
      <h3 className="text-xl font-bold mb-4 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-amber-400">
        <span className="text-2xl mr-2">🌱</span> Recommended Actions
      </h3>
      <ul className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="flex items-start p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-nature-500 to-nature-800 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 shadow-md">
              {index + 1}
            </span>
            <span className="text-gray-200 font-light tracking-wide">{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
