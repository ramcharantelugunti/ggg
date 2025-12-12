import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import loginBg from '../assets/login-bg.png';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState(''); // Used as Phone/ID for login
  const [password, setPassword] = useState('');

  // Registration States
  const [signupStep, setSignupStep] = useState(1); // 1: Phone, 2: OTP, 3: Password/ID
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedFarmerId, setGeneratedFarmerId] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { login, signup, sendOtp, verifyOtp, t } = useAuth(); // Assuming useAuth now exposes sendOtp, verifyOtp
  // const { t } = useLanguage(); // Removing duplicate hook call if useAuth wraps it, but sticking to original if not. 
  // Wait, original code used useLanguage separately. Let's keep it.
  const { t: langT } = useLanguage();
  // Helper to use either t from context or langT. The original code had t from useLanguage.
  // I will assume useLanguage is the source of truth for 't'.

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(langT('authFailed') || "Authentication Failed. Use Farmer ID or Phone.");
    }
    setLoading(false);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (phoneNumber.length < 10) {
      setError("Please enter a valid mobile number");
      return;
    }
    setLoading(true);
    try {
      await sendOtp(phoneNumber);
      setSignupStep(2);
    } catch (err) {
      setError("Failed to send OTP. Try again.");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyOtp(otp);
      // Generate Farmer ID
      const newId = "FID-" + Math.floor(10000 + Math.random() * 90000);
      setGeneratedFarmerId(newId);
      setSignupStep(3);
    } catch (err) {
      setError("Invalid OTP. Try '1234'");
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await signup(phoneNumber, password, generatedFarmerId);
      // Signup successful, user should be redirected by AuthContext state change or manual redirect if needed
      // Assuming AuthContext updates currentUser which triggers redirect in parent or here
    } catch (err) {
      setError("Registration Failed.");
    }
    setLoading(false);
  };

  const resetFlow = () => {
    setIsLogin(!isLogin);
    setError('');
    setSignupStep(1);
    setPhoneNumber('');
    setOtp('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen w-full flex overflow-hidden bg-slate-900">

      {/* Left Side - Image & Branding */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 text-white overflow-hidden">
        {/* Background Image absolute */}
        <div className="absolute inset-0 z-0">
          <img
            src={loginBg}
            alt="AI Agriculture Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/20 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-nature-500 to-water-500 flex items-center justify-center text-2xl shadow-lg shadow-nature-500/20">
              🌱
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">{langT('appName')}</h1>
          </div>
        </div>

        <div className="relative z-10 max-w-lg mb-12 animate-fade-in-up delay-200">
          <h2 className="text-5xl font-bold leading-tight mb-6">
            {langT('heroTitlePrefix')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nature-400 to-water-400">{langT('heroTitleHighlight')}</span>
          </h2>
          <p className="text-lg text-white/60 leading-relaxed">
            {langT('heroDescription')}
          </p>
        </div>

        <div className="relative z-10 text-xs text-white/30 animate-fade-in-up delay-300">
          © 2025 AI Water Scarcity Intelligence. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10">

        {/* Mobile Background */}
        <div className="absolute inset-0 lg:hidden z-0">
          <img src={loginBg} alt="bg" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm"></div>
        </div>

        {/* Language Toggle */}
        <LanguageSwitcher className="absolute top-6 right-6 z-20" />

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-10 lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              {isLogin ? langT('welcomeBack') : langT('createAccount')}
            </h2>
            <p className="text-white/40">
              {isLogin ? langT('enterCredentials') : "Follow the steps to register as a farmer"}
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl bg-black/40 backdrop-blur-xl">
            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-4 rounded-xl flex items-center gap-3">
                <span className="text-lg">⚠️</span>
                {error}
              </div>
            )}

            {isLogin ? (
              // === LOGIN FORM ===
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Farmer ID or Phone</label>
                  <div className="relative group">
                    <input
                      type="text"
                      required
                      className="input-field w-full p-4 pl-12 rounded-xl bg-white/5 border border-white/10 focus:border-nature-500/50 focus:ring-4 focus:ring-nature-500/10 transition-all font-light text-white placeholder-white/20"
                      placeholder="FID-XXXX or 9876543210"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-40 group-focus-within:opacity-100 transition-opacity">👤</span>
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2 ml-1">{langT('password')}</label>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="input-field w-full p-4 pl-12 pr-12 rounded-xl bg-white/5 border border-white/10 focus:border-nature-500/50 focus:ring-4 focus:ring-nature-500/10 transition-all font-light text-white placeholder-white/20"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-40 group-focus-within:opacity-100 transition-opacity">🔒</span>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-lg opacity-40 hover:opacity-100 transition-opacity focus:outline-none"
                    >
                      {showPassword ? '👁️' : '🙈'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between ml-1 animate-fade-in-up">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-nature-500 focus:ring-nature-500/50"
                    />
                    <label htmlFor="rememberMe" className="text-white/60 text-xs cursor-pointer select-none">
                      {langT('rememberMe')}
                    </label>
                  </div>
                  <button type="button" className="text-white/40 text-xs hover:text-white transition-colors">
                    {langT('forgotPassword')}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-nature-500 to-nature-600 hover:from-nature-400 hover:to-nature-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-nature-500/25 transform active:scale-[0.98] transition-all duration-300 uppercase tracking-widest text-sm mt-6 flex items-center justify-center gap-2 group"
                >
                  {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                  {langT('signIn')}
                  {!loading && <span className="group-hover:translate-x-1 transition-transform">→</span>}
                </button>
              </form>
            ) : (
              // === SIGNUP FLOW ===
              <div className="space-y-5">

                {/* Step 1: Phone Number */}
                {signupStep === 1 && (
                  <form onSubmit={handleSendOtp} className="space-y-5 animate-fade-in-up">
                    <div>
                      <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Mobile Number</label>
                      <div className="relative group">
                        <input
                          type="tel"
                          required
                          className="input-field w-full p-4 pl-12 rounded-xl bg-white/5 border border-white/10 focus:border-nature-500/50 focus:ring-4 focus:ring-nature-500/10 transition-all font-light text-white placeholder-white/20"
                          placeholder="+91 98765 43210"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-40 group-focus-within:opacity-100 transition-opacity">📱</span>
                      </div>
                    </div>
                    <div id="recaptcha-container"></div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/25 transform active:scale-[0.98] transition-all duration-300 uppercase tracking-widest text-sm mt-6 flex items-center justify-center gap-2 group"
                    >
                      {loading ? <span className="animate-spin">⏳</span> : "Get OTP"}
                    </button>
                  </form>
                )}

                {/* Step 2: Verify OTP */}
                {signupStep === 2 && (
                  <form onSubmit={handleVerifyOtp} className="space-y-5 animate-fade-in-up">
                    <div className="text-center text-white/60 text-sm mb-4">
                      OTP sent to {phoneNumber} <br /> <span className="text-xs text-white/20">(Mock: Use 1234)</span>
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Enter OTP</label>
                      <div className="relative group">
                        <input
                          type="text"
                          required
                          maxLength="4"
                          className="input-field w-full p-4 pl-12 rounded-xl bg-white/5 border border-white/10 focus:border-nature-500/50 focus:ring-4 focus:ring-nature-500/10 transition-all font-light text-white text-center tracking-[1em] text-xl placeholder-white/20"
                          placeholder="XXXX"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-40 group-focus-within:opacity-100 transition-opacity">🔐</span>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/25 transform active:scale-[0.98] transition-all duration-300 uppercase tracking-widest text-sm mt-6 flex items-center justify-center gap-2 group"
                    >
                      {loading ? <span className="animate-spin">⏳</span> : "Verify OTP"}
                    </button>
                    <button type="button" onClick={() => setSignupStep(1)} className="w-full text-xs text-white/40 hover:text-white mt-2">Change Number</button>
                  </form>
                )}

                {/* Step 3: Set Password & Success */}
                {signupStep === 3 && (
                  <form onSubmit={handleRegister} className="space-y-5 animate-fade-in-up">
                    <div className="bg-nature-500/20 border border-nature-500/40 p-4 rounded-xl text-center mb-6">
                      <p className="text-nature-300 text-xs uppercase font-bold tracking-widest mb-1">Your Farmer ID</p>
                      <p className="text-3xl font-black text-white">{generatedFarmerId}</p>
                    </div>

                    <div>
                      <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Set Password</label>
                      <div className="relative group">
                        <input
                          type="password"
                          required
                          className="input-field w-full p-4 pl-12 rounded-xl bg-white/5 border border-white/10 focus:border-nature-500/50 focus:ring-4 focus:ring-nature-500/10 transition-all font-light text-white placeholder-white/20"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-40 group-focus-within:opacity-100 transition-opacity">🔒</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
                      <div className="relative group">
                        <input
                          type="password"
                          required
                          className="input-field w-full p-4 pl-12 rounded-xl bg-white/5 border border-white/10 focus:border-nature-500/50 focus:ring-4 focus:ring-nature-500/10 transition-all font-light text-white placeholder-white/20"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-40 group-focus-within:opacity-100 transition-opacity">🔑</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-nature-500 to-nature-600 hover:from-nature-400 hover:to-nature-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-nature-500/25 transform active:scale-[0.98] transition-all duration-300 uppercase tracking-widest text-sm mt-6 flex items-center justify-center gap-2 group"
                    >
                      {loading ? <span className="animate-spin">⏳</span> : "Complete Registration"}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/40 text-sm">
              {isLogin ? langT('noAccount') : langT('haveAccount')}
              <button
                onClick={resetFlow}
                className="ml-2 text-white font-semibold hover:text-nature-400 transition-colors"
              >
                {isLogin ? langT('createAccount') : langT('signIn')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
