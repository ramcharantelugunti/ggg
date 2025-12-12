import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock OTP Store (In a real app, this would be backend/redis)
  const [mockOtp, setMockOtp] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    // Simulate network API call
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);

    if ((password === 'password' || password === '123456') || (email.includes('farmer') && password.length >= 4)) {
      setCurrentUser({ email: email, uid: 'demo-user', role: 'farmer' });
    } else {
      throw new Error("Invalid Credentials");
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Real Firebase Auth State
  const [confirmationResult, setConfirmationResult] = useState(null);

  const setupRecaptcha = (phoneNumber) => {
    const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // onSignInSubmit(); 
        console.log("Recaptcha Verified");
      }
    });
    return recaptchaVerifier;
  };

  const sendOtp = async (phoneNumber) => {
    setLoading(true);
    try {
      const appVerifier = setupRecaptcha(phoneNumber);
      // Format number to E.164 standard (assuming +91 for India if not present)
      const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

      const confirmation = await signInWithPhoneNumber(auth, formattedNumber, appVerifier);
      setConfirmationResult(confirmation);
      console.log("OTP Sent via Firebase to", formattedNumber);
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Error sending OTP:", error);
      setLoading(false);
      throw error;
    }
  };

  const verifyOtp = async (inputOtp) => {
    setLoading(true);
    try {
      if (!confirmationResult) throw new Error("No OTP request found.");
      const result = await confirmationResult.confirm(inputOtp);
      const user = result.user;
      console.log("User verified:", user);
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setLoading(false);
      throw error;
    }
  };

  const signup = async (phoneNumber, password, farmerId) => {
    setLoading(true);
    // Simulate network API call for signup
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);

    // Create user session
    setCurrentUser({
      phoneNumber: phoneNumber,
      uid: farmerId,
      role: 'farmer',
      isNewUser: true
    });
  };

  const sendReport = async (phoneNumber, reportData) => {
    // Simulate sending SMS with report
    console.log(`[MOCK SMS] Sending Report to ${phoneNumber}:`, reportData);
    await new Promise(r => setTimeout(r, 1000));
    return true;
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    sendOtp,
    verifyOtp,
    sendReport
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
