import React, { createContext, useState, useContext } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en'); // Default to English

    const toggleLanguage = () => {
        setLanguage((prevLang) => (prevLang === 'en' ? 'te' : 'en'));
    };

    const t = (key) => {
        return translations[language][key] || key; // Fallback to key if not found
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
