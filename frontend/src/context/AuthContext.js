import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track last reset attempt time
  const [lastResetAttempt, setLastResetAttempt] = useState(0);

  useEffect(() => {
    // Check for active session on component mount
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        setUser(session?.user || null);
        if (error) {
          setError(error.message);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    getSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    // Cleanup subscription on unmount
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // Sign up function
  const signUp = async (email, password, fullName) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            full_name: fullName 
          }
        }
      });
      
      if (error) {
        setError(error.message);
        return { error };
      }
      
      return { data };
    } catch (error) {
      setError(error.message);
      return { error };
    }
  };

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        setError(error.message);
        return { error };
      }
      
      return { data };
    } catch (error) {
      setError(error.message);
      return { error };
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      
      // Use a minimal configuration
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('OAuth Error:', error);
        setError(error.message);
        return { error };
      }
      
      // Redirect to Google's OAuth page
      if (data?.url) {
        window.location.href = data.url;
        return { data };
      }
      
      setError('Failed to get OAuth URL');
      return { error: new Error('Failed to get OAuth URL') };
    } catch (error) {
      console.error('OAuth Error:', error);
      setError(error.message);
      return { error };
    }
  };

  // Sign in with LinkedIn
  const signInWithLinkedIn = async () => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            response_type: 'code',
            scope: 'r_liteprofile r_emailaddress'
          }
        }
      });
      
      if (error) {
        console.error('OAuth Error:', error);
        setError(error.message);
        return { error };
      }
      
      // If we have a provider token, the sign-in was successful
      if (data?.provider && data?.url) {
        window.location.href = data.url;
        return { data };
      }
      
      return { error: new Error('Failed to get OAuth URL') };
    } catch (error) {
      console.error('OAuth Error:', error);
      setError(error.message);
      return { error };
    }
  };

  // Phone authentication step 1: Send OTP
  const signInWithPhone = async (phone) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          shouldCreateUser: true
        }
      });
      
      if (error) {
        setError(error.message);
        return { error };
      }
      
      return { data, success: true };
    } catch (error) {
      setError(error.message);
      return { error };
    }
  };

  // Phone authentication step 2: Verify OTP
  const verifyPhoneOTP = async (phone, token) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms'
      });
      
      if (error) {
        setError(error.message);
        return { error };
      }
      
      return { data, success: true };
    } catch (error) {
      setError(error.message);
      return { error };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error.message);
        return { error };
      }
      setUser(null);
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { error };
    }
  };

  // Password reset request
  const resetPassword = async (email) => {
    try {
      setError(null);
      
      // Check if enough time has passed since last attempt
      const now = Date.now();
      const timeSinceLastAttempt = now - lastResetAttempt;
      const requiredWaitTime = 15000; // 15 seconds to be safe
      
      if (timeSinceLastAttempt < requiredWaitTime) {
        const waitTimeLeft = Math.ceil((requiredWaitTime - timeSinceLastAttempt) / 1000);
        setError(`Please wait ${waitTimeLeft} seconds before requesting another reset`);
        return { error: new Error(`Please wait ${waitTimeLeft} seconds`) };
      }
      
      setLastResetAttempt(now);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) {
        setError(error.message);
        return { error };
      }
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { error };
    }
  };

  const value = {
    user,
    setUser,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithLinkedIn,
    signInWithPhone,
    verifyPhoneOTP,
    signOut,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
