import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageSwitcher({ className = "" }) {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className={`bg-white/5 hover:bg-white/10 text-white/80 p-2 rounded-lg text-xs font-bold border border-white/10 transition-all uppercase ${className}`}
            title="Switch Language"
            type="button"
        >
            {language === 'en' ? 'TE' : 'EN'}
        </button>
    );
}
