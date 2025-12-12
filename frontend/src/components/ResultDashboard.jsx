import React, { useEffect, useState } from 'react';
import PredictionCard from './PredictionCard';
import SuggestionList from './SuggestionList';
import RiskGraph from './ResultSection/RiskGraph';
import StateMap from './ResultSection/StateMap';
import GovtSchemes from './ResultSection/GovtSchemes';
import MarketInsights from './ResultSection/MarketInsights';
import { useAuth } from '../contexts/AuthContext';

export default function ResultDashboard({ result, inputData }) {
    const [show, setShow] = useState(false);
    const { sendReport, currentUser } = useAuth();
    const [sendingReport, setSendingReport] = useState(false);

    useEffect(() => {
        setShow(true);
    }, []);

    const handleSendReport = async () => {
        setSendingReport(true);
        // Use current user phone or prompt if not logged in (mocking usually logged in flow)
        const phone = currentUser?.phoneNumber || "Current User Mobile";

        try {
            await sendReport(phone, result);
            alert(`Report sent successfully to your registered mobile number: ${phone}`);
        } catch (error) {
            alert("Failed to send report");
        }
        setSendingReport(false);
    };

    if (!result) return null;

    return (
        <div className={`space-y-6 transition-all duration-500 ease-out ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

            {/* Top Row: Prediction & Map */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`transition-all duration-700 delay-100 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <PredictionCard
                        riskLevel={result.risk_level}
                        probability={result.probability_of_failure}
                    />
                </div>

                <div className={`transition-all duration-700 delay-200 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <StateMap state={inputData?.state || "India"} />
                </div>
            </div>

            {/* Middle Row: Graph */}
            <div className={`transition-all duration-700 delay-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <RiskGraph riskLevel={result.risk_level} />
            </div>

            {/* Market Insights */}
            <div className={`transition-all duration-700 delay-350 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <MarketInsights
                    currentCrop={inputData?.crop_history || "Rice"}
                    suggestions={result.suggestions}
                />
            </div>

            {/* Bottom Row: Suggestions */}
            <div className={`transition-all duration-700 delay-400 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <SuggestionList suggestions={result.suggestions} />
            </div>

            {/* Schemes Config */}
            <div className={`mt-6 transition-all duration-700 delay-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <GovtSchemes schemes={result.schemes} />
            </div>

            {/* Action Bar */}
            <div className={`flex flex-col sm:flex-row justify-center gap-4 pt-8 transition-all duration-700 delay-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <button
                    onClick={() => window.print()}
                    className="bg-white/5 hover:bg-white/10 text-gray-300 px-8 py-3 rounded-full border border-white/10 backdrop-blur-md transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                    <span>📥</span> Download Report
                </button>

                <button
                    onClick={handleSendReport}
                    disabled={sendingReport}
                    className="bg-green-500/10 hover:bg-green-500/20 text-green-300 px-8 py-3 rounded-full border border-green-500/20 backdrop-blur-md transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                    {sendingReport ? (
                        <><span>⏳</span> Sending...</>
                    ) : (
                        <><span>📱</span> Send to Mobile</>
                    )}
                </button>
            </div>

        </div>
    );
}
