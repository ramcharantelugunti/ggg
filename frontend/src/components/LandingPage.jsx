import React, { useState } from 'react';
import heroImage from '../assets/hero-image.png';
import { useLanguage } from '../contexts/LanguageContext';
import featureDetails from '../data/feature_details.json';

export default function LandingPage({ onRunDemo }) {
    const { t } = useLanguage();
    const [selectedFeature, setSelectedFeature] = useState(null);

    const handleCardClick = (featureKey) => {
        const details = featureDetails[featureKey];
        if (details) {
            setSelectedFeature({ ...details, key: featureKey });
        }
    };

    const handleCloseModal = () => {
        setSelectedFeature(null);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-full py-12 px-6 lg:px-12 relative overflow-hidden">

            {/* Modal */}
            {selectedFeature && (
                <FeatureModal
                    feature={selectedFeature}
                    onClose={handleCloseModal}
                    onTryDemo={() => {
                        onRunDemo?.(selectedFeature.demoScenario);
                        handleCloseModal();
                    }}
                />
            )}

            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-nature-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-water-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 max-w-4xl w-full text-center">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md shadow-lg animate-fade-in-up">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-xs font-semibold tracking-wider text-white/80 uppercase">{t('badge')}</span>
                </div>

                {/* Hero Title */}
                <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-6 animate-fade-in-up delay-100 drop-shadow-2xl">
                    {t('heroTitlePrefix')} <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-nature-400 via-white to-water-400">
                        {t('heroTitleHighlight')}
                    </span>
                </h1>

                <p className="text-lg text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-200">
                    {t('heroDescription')}
                </p>

                {/* Image Container */}
                <div className="relative w-full max-w-3xl mx-auto mb-12 group animate-fade-in-up delay-300">
                    <div className="absolute -inset-1 bg-gradient-to-r from-nature-500 to-water-500 rounded-2xl opacity-30 group-hover:opacity-50 blur transition duration-500"></div>
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-video bg-black/40">
                        <img
                            src={heroImage}
                            alt="AI Farm Dashboard"
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                        />

                        {/* Overlay UI elements for tech feel */}
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                            <div className="flex gap-2">
                                <div className="h-2 w-16 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full w-2/3 bg-nature-400"></div>
                                </div>
                            </div>
                            <div className="text-[10px] bg-black/60 backdrop-blur-md px-2 py-1 rounded text-white/70 font-mono">
                                {t('sysReady')}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up delay-500">
                    <FeatureCard
                        icon="💧"
                        title={t('featureWaterTitle')}
                        desc={t('featureWaterDesc')}
                        onClick={() => handleCardClick('water')}
                    />
                    <FeatureCard
                        icon="🌾"
                        title={t('featureCropTitle')}
                        desc={t('featureCropDesc')}
                        onClick={() => handleCardClick('crop')}
                    />
                    <FeatureCard
                        icon="📊"
                        title={t('featureRiskTitle')}
                        desc={t('featureRiskDesc')}
                        onClick={() => handleCardClick('risk')}
                    />
                </div>

            </div>
        </div>
    );
}

function FeatureModal({ feature, onClose, onTryDemo }) {
    if (!feature) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative z-10 w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
                {/* Header Gradient */}
                <div className="h-32 bg-gradient-to-br from-nature-500/20 to-water-500/20 p-8 flex flex-col justify-end relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 text-white/50 hover:text-white hover:bg-black/40 flex items-center justify-center transition-all"
                    >
                        ✕
                    </button>
                    <h3 className="text-sm font-bold text-nature-300 uppercase tracking-widest mb-1">{feature.subtitle}</h3>
                    <h2 className="text-3xl font-black text-white">{feature.title}</h2>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6">
                    <p className="text-white/70 leading-relaxed text-sm">
                        {feature.description}
                    </p>

                    <div className="space-y-3">
                        {feature.details.map((detail, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <span className="text-nature-400 mt-1">✓</span>
                                <span className="text-white/80 text-sm">{detail}</span>
                            </div>
                        ))}
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        {feature.metrics.map((metric, idx) => (
                            <div key={idx} className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                                <div className="text-xs text-white/40 uppercase mb-1">{metric.label}</div>
                                <div className="text-sm font-bold text-white">{metric.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={onTryDemo}
                        className="w-full py-4 mt-4 bg-gradient-to-r from-nature-500 to-nature-600 hover:from-nature-400 hover:to-nature-500 text-white font-bold rounded-xl shadow-lg shadow-nature-500/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group"
                    >
                        <span>🚀</span> Try Live Demo
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, desc, onClick }) {
    return (
        <div
            onClick={onClick}
            className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-nature-500/30 transition-all duration-300 group text-left cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-nature-500/10"
        >
            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-nature-400 transition-colors">{title}</h3>
            <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
        </div>
    );
}
