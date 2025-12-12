import React, { useState } from 'react';
import InputForm from './components/InputForm';
import PredictionCard from './components/PredictionCard';
import SuggestionList from './components/SuggestionList';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useLanguage } from './contexts/LanguageContext';
import ResultDashboard from './components/ResultDashboard';
import BackgroundAnimated from './components/BackgroundAnimated';
import LandingPage from './components/LandingPage';
import LoadingScreen from './components/LoadingScreen';
import LanguageSwitcher from './components/LanguageSwitcher';

// Error Boundary for safety
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 text-white p-8">
          <div className="max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-400">Something went wrong</h2>
            <p className="text-sm opacity-70 mb-4">{this.state.error?.toString()}</p>
            <button onClick={() => window.location.reload()} className="bg-white/10 px-4 py-2 rounded-full">Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function Dashboard() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputData, setInputData] = useState(null);
  // Demo State
  const [demoData, setDemoData] = useState(null);

  const { logout, currentUser } = useAuth();
  const { t } = useLanguage();

  const handlePredict = async (data) => {
    setLoading(true);
    setError(null);
    setInputData(data);
    try {
      const response = await fetch('http://localhost:8001/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const prediction = await response.json();
      setResult(prediction);
    } catch (err) {
      setError(t('error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunDemo = (scenario) => {
    // Define Scenarios
    const scenarios = {
      water: {
        state: "Karnataka",
        district: "Bangalore Urban", // Just an example, ensuring logic works
        rainfall: 800,
        groundwater: 5, // Low
        crop_history: "Sugarcane" // High water crop -> High Risk
      },
      crop: {
        state: "Punjab",
        district: "Ludhiana",
        rainfall: 600,
        groundwater: 12,
        crop_history: "Wheat"
      },
      risk: {
        state: "Maharashtra",
        district: "Pune",
        rainfall: 400,
        groundwater: 2,
        crop_history: "Rice" // Very High Risk
      }
    };

    if (scenarios[scenario]) {
      setDemoData(scenarios[scenario]);
      // Optional: You could auto-scroll to form input on mobile if needed.
    }
  };

  return (
    <ErrorBoundary>
      <BackgroundAnimated />

      {/* Main Layout Container - Split Screen */}
      <div className="flex flex-col lg:flex-row h-screen overflow-hidden font-sans text-gray-100 relative z-10 selection:bg-nature-500/30">

        {/* Left Side: Input & Control Station (Fixed on Desktop) */}
        <aside className="lg:w-[40%] xl:w-[35%] h-full flex flex-col bg-black/20 backdrop-blur-xl border-r border-white/5 relative z-20 overflow-y-auto custom-scrollbar">

          {/* Header */}
          <div className="p-8 pb-4 sticky top-0 bg-black/10 backdrop-blur-md z-30 border-b border-white/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nature-500 to-water-500 flex items-center justify-center text-xl shadow-lg shadow-nature-500/20">
                  🌱
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-white leading-none">{t('appName')}</h1>
                  <p className="text-xs font-medium text-white/50 tracking-widest uppercase mt-1">{t('appTagline')}</p>
                </div>
              </div>

              <div className='flex gap-2 items-center'>
                <LanguageSwitcher />

                <button
                  onClick={logout}
                  className="text-white/40 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all"
                  title={t('logout')}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                </button>
              </div>
            </div>
            <p className="text-xs text-white/30 truncate px-1">{t('loggedInAs')} {currentUser?.email}</p>
          </div>

          {/* Form Container */}
          <div className="p-8 pt-6 flex-1">
            <InputForm onPredict={handlePredict} loading={loading} demoData={demoData} />

            {error && (
              <div className="mt-6 glass-panel border-l-4 border-red-400 p-4 text-red-100 rounded-xl bg-red-900/20 flex items-start gap-3 animate-pulse">
                <span className="text-xl">⚠️</span>
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>

          <div className="p-6 text-center text-xs text-white/20">
            {t('poweredBy')}
          </div>
        </aside>

        {/* Right Side: Results & Dashboard (Scrollable) */}
        <main className="lg:w-[60%] xl:w-[65%] h-full relative overflow-y-auto custom-scrollbar scroll-smooth">
          <div className="p-8 md:p-12 lg:p-16 max-w-5xl mx-auto min-h-full flex flex-col justify-center">

            {result ? (
              <ResultDashboard result={result} inputData={inputData} />
            ) : (
              <LandingPage onRunDemo={handleRunDemo} />
            )}
          </div>
        </main>
      </div >
    </ErrorBoundary >
  );
}

function AppContent() {
  const { currentUser } = useAuth();
  return currentUser ? <Dashboard /> : <Login />;
}

export default function App() {
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    // Simulate initial asset loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
