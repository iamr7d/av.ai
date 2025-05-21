import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SocialLoginButtons = ({ setShowPhoneLogin, compact }) => {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState({
    google: false
  });

  const handleGoogleLogin = async () => {
    setIsLoading({ ...isLoading, google: true });
    await signInWithGoogle();
    // No need to reset loading as the page will redirect
  };

  // Renders icon-only buttons for compact mode
  if (compact) {
    return (
      <div className="flex justify-center space-x-4">
        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading.google}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 
                     transition-transform hover:scale-110 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed social-icon-btn"
          aria-label="Sign in with Google"
        >
          {isLoading.google ? (
            <span className="animate-spin w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full"></span>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M21.35,11.1H12v3.2h5.59c-0.25,1.6-1.88,4.7-5.59,4.7c-3.35,0-6.08-2.76-6.08-6.18s2.73-6.18,6.08-6.18 c1.96,0,3.28,0.83,4.03,1.55l2.54-2.45C17.18,3.49,14.77,2.5,12,2.5C7.03,2.5,3,6.53,3,11.5s4.03,9,9,9c5.2,0,8.65-3.65,8.65-8.79 C20.65,10.86,20.55,10.27,21.35,11.1z" />
            </svg>
          )}
        </button>
        
        {/* Phone Login */}
        <button
          onClick={() => setShowPhoneLogin(true)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 
                     transition-transform hover:scale-110 border border-green-600 disabled:opacity-50 disabled:cursor-not-allowed social-icon-btn"
          aria-label="Sign in with Phone Number"
        >
          <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
            <path d="M17.4,22H6.6a2,2,0,0,1-2-2V4a2,2,0,0,1,2-2H17.4a2,2,0,0,1,2,2V20A2,2,0,0,1,17.4,22ZM12,20h2a1,1,0,0,0,0-2H12a1,1,0,0,0,0,2ZM6.6,6h10.8V16H6.6Z" />
          </svg>
        </button>
      </div>
    );
  }

  // Standard button layout
  return (
    <div className="space-y-4 w-full">
      {/* Google Login Button */}
      <button 
        onClick={handleGoogleLogin}
        disabled={isLoading.google}
        className="flex items-center justify-center w-full px-4 py-2.5 bg-white hover:bg-gray-100 
                   text-black font-medium rounded-xl border border-gray-200 transition-colors 
                   disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden social-icon-btn"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-slide-right opacity-0 hover:opacity-100" />
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M21.8,10.4h-9.2v3.5h5.3c-0.5,2.5-2.7,4.3-5.3,4.3c-3.1,0-5.7-2.5-5.7-5.7s2.5-5.7,5.7-5.7 c1.4,0,2.7,0.5,3.8,1.4l2.2-2.2C16.9,4.4,14.9,3.6,12.6,3.6c-5,0-9,4-9,9s4,9,9,9c5,0,8.6-3.6,8.6-8.6 C21.2,12,21.1,11.1,21.8,10.4z" />
        </svg>
        {isLoading.google ? 'Connecting...' : 'Continue with Google'}
      </button>

      {/* Phone Login Button */}
      <button 
        onClick={() => setShowPhoneLogin(true)}
        className="flex items-center justify-center w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 
                   text-white font-medium rounded-xl border border-green-600 transition-colors relative overflow-hidden social-icon-btn"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-slide-right opacity-0 hover:opacity-100" />
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.4,22H6.6a2,2,0,0,1-2-2V4a2,2,0,0,1,2-2H17.4a2,2,0,0,1,2,2V20A2,2,0,0,1,17.4,22ZM12,20h2a1,1,0,0,0,0-2H12a1,1,0,0,0,0,2ZM6.6,6h10.8V16H6.6Z" />
        </svg>
        Continue with Phone
      </button>

      <div className="relative mt-4 mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 text-gray-400 bg-black">or</span>
        </div>
      </div>
    </div>
  );
};

export default SocialLoginButtons;