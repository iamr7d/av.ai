import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const PhoneLogin = ({ onClose }) => {
  const { signInWithPhone, verifyPhoneOTP } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState(1); // 1 = phone entry, 2 = OTP entry
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Format phone number as user types
  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const phoneOnly = value.replace(/\D/g, '');
    return phoneOnly;
  };

  // Handle phone number submission
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Ensure phone is in correct format: +[countrycode][number]
      let formattedPhone = phoneNumber;
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+' + formattedPhone;
      }

      const { error, success } = await signInWithPhone(formattedPhone);

      if (error) {
        setError(error.message || 'Error sending verification code. Please try again.');
      } else if (success) {
        setSuccessMessage('Verification code sent!');
        setStep(2);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Ensure phone is in correct format
      let formattedPhone = phoneNumber;
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+' + formattedPhone;
      }

      const { error, success } = await verifyPhoneOTP(formattedPhone, verificationCode);

      if (error) {
        setError(error.message || 'Invalid verification code. Please try again.');
      } else if (success) {
        setSuccessMessage('Phone verified successfully!');
        setTimeout(() => {
          onClose(); // Close the phone login modal
        }, 1500);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border border-white/10 shadow-2xl auth-box">
      {/* Multiple moving neon light effects */}
      <div className="neon-light"></div>
      
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h2 className="text-2xl font-bold mb-6 text-center enhanced-gradient-text">
        {step === 1 ? 'Sign In with Phone' : 'Verify Phone Number'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-white rounded-lg text-sm">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 text-white rounded-lg text-sm">
          {successMessage}
        </div>
      )}

      {step === 1 ? (
        // Step 1: Phone number entry
        <form onSubmit={handleSendOTP} className="space-y-6">
          <div className="relative group">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1 transition-all duration-300 group-focus-within:text-primary">
              Phone Number
            </label>
            <div className="relative">
              <input 
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 backdrop-blur-sm"
                placeholder="+12345678901"
                required
              />
              <div className="absolute inset-0 rounded-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.2), rgba(59, 130, 246, 0.2))', filter: 'blur(8px)' }}></div>
            </div>
            <p className="mt-1 text-xs text-gray-400">Include country code (e.g., +1 for US)</p>
          </div>

          <button 
            type="submit"
            disabled={isLoading || !phoneNumber}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-slide-right opacity-0 hover:opacity-100" />
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending Code...
              </div>
            ) : (
              'Send Verification Code'
            )}
          </button>
        </form>
      ) : (
        // Step 2: OTP verification
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <div className="relative group">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-1 transition-all duration-300 group-focus-within:text-primary">
              Verification Code
            </label>
            <div className="relative">
              <input 
                type="text"
                id="otp"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 backdrop-blur-sm"
                placeholder="Enter 6-digit code"
                required
              />
              <div className="absolute inset-0 rounded-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.2), rgba(59, 130, 246, 0.2))', filter: 'blur(8px)' }}></div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading || verificationCode.length < 6}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-slide-right opacity-0 hover:opacity-100" />
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </div>
            ) : (
              'Verify & Sign In'
            )}
          </button>
          
          <div className="text-center mt-4">
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="text-sm font-medium text-primary hover:text-primary-light transition-colors"
            >
              Try a different number
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PhoneLogin;