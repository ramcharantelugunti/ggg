import React from 'react';

export default function GovtSchemes({ schemes }) {
    if (!schemes || schemes.length === 0) return null;

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <span>🏛️</span> Recommended Government Schemes
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schemes.map((scheme, index) => (
                    <div
                        key={index}
                        className="group relative bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/20"
                    >
                        <div className="mb-4">
                            <div className="flex flex-wrap gap-2 mb-3">
                                {scheme.tags.map((tag, idx) => (
                                    <span key={idx} className="text-xs font-medium px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                                {scheme.name}
                            </h4>
                            <p className="text-sm text-gray-300 line-clamp-3">
                                {scheme.description}
                            </p>
                        </div>

                        <a
                            href={scheme.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-all duration-300 shadow-lg shadow-emerald-900/30 group-hover:shadow-emerald-500/20"
                        >
                            Apply Now ↗
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
