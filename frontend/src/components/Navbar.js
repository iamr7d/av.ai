import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SocialLoginButtons from './SocialLoginButtons';
import PhoneLogin from './PhoneLogin';
import SuccessAnimation from './SuccessAnimation';

const Navbar = () => {
  const { user, signIn, signUp, signOut, resetPassword } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [isPhoneLoginOpen, setIsPhoneLoginOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Handle scroll events to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Always use dark mode
    document.documentElement.classList.add('dark');
    localStorage.theme = 'dark';
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  // Reset form state when modals are closed
  useEffect(() => {
    if (!isSignInOpen) {
      resetForm();
    }
  }, [isSignInOpen]);
  
  // When user signs in, close all modals
  useEffect(() => {
    if (user) {
      setIsSignInOpen(false);
      setIsPhoneLoginOpen(false);
      setIsForgotPasswordOpen(false);
    }
  }, [user]);
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setResetEmail('');
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(false);
    setIsForgotPasswordOpen(false);
  };
  
  // Handle password reset request
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);
    
    try {
      const { error, success } = await resetPassword(resetEmail);
      
      if (error) {
        setErrorMessage(error.message || 'Failed to send password reset email');
      } else if (success) {
        setSuccessMessage('Password reset instructions have been sent to your email');
        setShowSuccessAnimation(true);
        setTimeout(() => {
          setIsForgotPasswordOpen(false);
          setShowSuccessAnimation(false);
        }, 3000);
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred');
      console.error('Password reset error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  // Handle sign in form submission
  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);
    setShowSuccessAnimation(false);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setErrorMessage(error.message || 'Failed to sign in');
      } else {
        setSuccessMessage('Signed in successfully!');
        setShowSuccessAnimation(true);
        
        setTimeout(() => {
          setIsSignInOpen(false);
          setShowSuccessAnimation(false);
        }, 2000);
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred');
      console.error('Sign in error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  // Handle sign up form submission
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);
    setShowSuccessAnimation(false);
    
    try {
      const { error } = await signUp(email, password, fullName);
      
      if (error) {
        setErrorMessage(error.message || 'Failed to create account');
      } else {
        setSuccessMessage('Account created successfully! Please check your email to verify your account.');
        setShowSuccessAnimation(true);
        
        // Don't close the modal automatically for signup since user needs to see verification instructions
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred');
      console.error('Sign up error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Add Lottie player script to the document head if not already present
  useEffect(() => {
    if (!document.querySelector('script[src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs"]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs';
      document.head.appendChild(script);
    }
  }, []);

  return (
    <>      <nav className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-3 transition-all duration-300 backdrop-blur-xl bg-black/30 border-b border-white/10 shadow-lg`}>        <div className="container mx-auto flex items-center justify-between">          {/* Logo */}
          <div className="flex items-center gap-3" style={{height:'56px', minHeight:'56px', paddingTop:'2px', paddingBottom:'2px'}}>
            <span style={{display:'inline-block',width:'38px',height:'38px',verticalAlign:'middle'}}>
              <dotlottie-player src="https://lottie.host/aa6b885f-5caf-40a3-ae81-e712f2f642ab/gy1OAyPCkb.lottie" background="transparent" speed="1" style={{width:'38px',height:'38px'}} loop autoplay></dotlottie-player>
            </span>
            <span className="font-bold text-xl text-white tracking-tight" style={{lineHeight:'1.1'}}>Avocado Space</span>
          </div>
            {/* Main Navigation */}
          <div className="hidden md:flex space-x-8">
            <a href="#home" className="text-gray-100 hover:text-primary-light transition-colors">Home</a>
            {user && (
              <a href="#feed" className="text-gray-100 hover:text-primary-light transition-colors">Feed</a>
            )}
            <a href="#search" className="text-gray-100 hover:text-primary-light transition-colors">Search</a>
            <a href="#features" className="text-gray-100 hover:text-primary-light transition-colors">Features</a>
            <a href="#about" className="text-gray-100 hover:text-primary-light transition-colors">About</a>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {!user ? (
              // Not logged in - show sign in button
              <button 
                onClick={() => setIsSignInOpen(true)} 
                className="px-5 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark transition-colors rounded-full shadow-lg"
              >
                Sign In
              </button>
            ) : (
              // Logged in - show user menu
              <div className="relative group">
                <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white rounded-full bg-black/30 hover:bg-white/10 border border-white/10 transition-colors">
                  <span>{user.user_metadata?.full_name || user.email}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 py-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-sm text-white font-medium truncate">{user.email}</p>
                  </div>                  <a href="#profile" className="block px-4 py-2 text-sm text-gray-200 hover:text-white hover:bg-white/10">
                    Your Profile
                  </a>
                  <a href="#feed" className="block px-4 py-2 text-sm text-gray-200 hover:text-white hover:bg-white/10">
                    Opportunity Feed
                  </a>
                  <a href="#saved" className="block px-4 py-2 text-sm text-gray-200 hover:text-white hover:bg-white/10">
                    Saved Opportunities
                  </a>
                  <button 
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:text-white hover:bg-white/10"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button className="p-2 rounded-md text-gray-300 hover:bg-white/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Sign In Modal */}
      {isSignInOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsSignInOpen(false)}
          ></div>
          <div
            className="relative bg-black/40 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border border-white/10 shadow-2xl auth-box"
          >
            {/* Multiple moving neon light effects */}
            <div className="neon-light"></div>
            
            <button 
              onClick={() => setIsSignInOpen(false)}
              className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center enhanced-gradient-text">Welcome to Avocado Space</h2>
          
            {/* Enhanced Tabs for Sign In and Sign Up with interactive effects */}
            <div className="flex mb-6 relative">
              <div 
                className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-in-out"
                style={{ 
                  left: activeTab === 'signin' ? '0%' : '50%', 
                  width: '50%',
                  boxShadow: '0 0 10px #6366f1, 0 0 20px rgba(99, 102, 241, 0.5)'
                }}
              ></div>
              <button 
                className={`flex-1 py-2 text-center transition-colors ${activeTab === 'signin' ? 'text-white font-medium' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('signin')}
              >
                Sign In
              </button>
              <button 
                className={`flex-1 py-2 text-center transition-colors ${activeTab === 'signup' ? 'text-white font-medium' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('signup')}
              >
                Sign Up
              </button>
            </div>            {/* Error Messages */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-white rounded-lg text-sm">
                {errorMessage}
              </div>
            )}
            
            {/* Success Messages (only when not showing animation) */}
            {successMessage && !showSuccessAnimation && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 text-white rounded-lg text-sm">
                {successMessage}
              </div>
            )}
            
            {/* Success Animation */}
            {showSuccessAnimation && (
              <SuccessAnimation message={successMessage} />
            )}
              {showSuccessAnimation ? null : activeTab === 'signin' ? (
              <form className="space-y-6" onSubmit={handleSignIn}>
                <div className="relative group">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1 transition-all duration-300 group-focus-within:text-primary">Email</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 backdrop-blur-sm"
                      placeholder="your@email.com"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))', filter: 'blur(8px)' }}></div>
                  </div>
                </div>

                <div className="relative group">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1 transition-all duration-300 group-focus-within:text-primary">Password</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 backdrop-blur-sm"
                      placeholder="••••••••"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(45deg, rgba(236, 72, 153, 0.2), rgba(139, 92, 246, 0.2))', filter: 'blur(8px)' }}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input 
                      id="remember" 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-white/30 bg-white/10 text-primary focus:ring-primary"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-300">Remember me</label>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-sm font-medium text-primary hover:text-primary-light transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>            
                  <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
                
                <div className="mt-6">
                  <SocialLoginButtons 
                    setShowPhoneLogin={() => {
                      setIsSignInOpen(false);
                      setIsPhoneLoginOpen(true);
                    }} 
                    compact={false} 
                  />
                </div>              </form>
            ) : !showSuccessAnimation ? (
              <form className="space-y-6" onSubmit={handleSignUp}>
                <div className="relative group">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1 transition-all duration-300 group-focus-within:text-primary">Full Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      id="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 backdrop-blur-sm"
                      placeholder="John Doe"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.2), rgba(99, 102, 241, 0.2))', filter: 'blur(8px)' }}></div>
                  </div>
                </div>

                <div className="relative group">
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-300 mb-1 transition-all duration-300 group-focus-within:text-primary">Email</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      id="signup-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 backdrop-blur-sm"
                      placeholder="your@email.com"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))', filter: 'blur(8px)' }}></div>
                  </div>
                </div>

                <div className="relative group">
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-300 mb-1 transition-all duration-300 group-focus-within:text-primary">Password</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      id="signup-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 backdrop-blur-sm"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                    <div className="absolute inset-0 rounded-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(45deg, rgba(236, 72, 153, 0.2), rgba(139, 92, 246, 0.2))', filter: 'blur(8px)' }}></div>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">Password must be at least 6 characters</p>
                </div>                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
                
                <div className="mt-6">
                  <div className="text-center text-sm text-gray-400 mb-4">Or sign up with:</div>
                  <SocialLoginButtons 
                    setShowPhoneLogin={() => {
                      setIsSignInOpen(false);
                      setIsPhoneLoginOpen(true);
                    }} 
                    compact={true} 
                  />
                </div>              </form>
            ) : null}
            
            <div className="relative mt-8 pt-6 text-center border-t border-white/10">            
              <div className="absolute w-full h-px top-0 left-0" style={{ 
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                boxShadow: '0 0 8px rgba(255, 255, 255, 0.3)'
              }}></div>
              
              <p className="text-sm text-gray-400">
                {activeTab === 'signin' ? 
                  (<>New to Avocado Space? <button onClick={() => setActiveTab('signup')} className="font-medium text-primary hover:text-primary-light transition-colors">Create an account</button></>) : 
                  (<>Already have an account? <button onClick={() => setActiveTab('signin')} className="font-medium text-primary hover:text-primary-light transition-colors">Sign in</button></>)
                }
              </p>
            </div>
          </div>
        </div>      )}
        {/* Phone Login Modal */}
      {isPhoneLoginOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsPhoneLoginOpen(false)}
          ></div>
          <div className="relative z-10">
            <PhoneLogin onClose={() => setIsPhoneLoginOpen(false)} />
          </div>
        </div>
      )}
      
      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => {
              if (!isSubmitting) setIsForgotPasswordOpen(false);
            }}
          ></div>
          <div 
            className="relative bg-black/40 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border border-white/10 shadow-2xl auth-box"
          >
            {/* Multiple moving neon light effects */}
            <div className="neon-light"></div>
            
            <button 
              onClick={() => {
                if (!isSubmitting) setIsForgotPasswordOpen(false);
              }}
              disabled={isSubmitting}
              className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center enhanced-gradient-text">Reset Password</h2>
          
            {/* Error Messages */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-white rounded-lg text-sm">
                {errorMessage}
              </div>
            )}
            
            {/* Success Messages (only when not showing animation) */}
            {successMessage && !showSuccessAnimation && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 text-white rounded-lg text-sm">
                {successMessage}
              </div>
            )}
            
            {/* Success Animation */}
            {showSuccessAnimation ? (
              <SuccessAnimation message={successMessage} />
            ) : (
              <form className="space-y-6" onSubmit={handleResetPassword}>
                <div className="relative group">
                  <label htmlFor="reset-email" className="block text-sm font-medium text-gray-300 mb-1 transition-all duration-300 group-focus-within:text-primary">Email</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      id="reset-email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 backdrop-blur-sm"
                      placeholder="your@email.com"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))', filter: 'blur(8px)' }}></div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting || !resetEmail}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </div>
                  ) : (
                    'Send Reset Instructions'
                  )}
                </button>
                
                <div className="text-center">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsForgotPasswordOpen(false);
                      setIsSignInOpen(true);
                    }}
                    className="text-sm font-medium text-primary hover:text-primary-light transition-colors"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
