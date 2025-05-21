import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [status, setStatus] = useState('Processing your login...');
  useEffect(() => {
    // This function handles the OAuth callback
    async function handleAuthCallback() {
      setStatus('Completing authentication...');
      try {
        // Extract URL parameters
        const fragment = window.location.hash;
        const query = window.location.search;
        console.log('Auth callback - URL fragment:', fragment);
        console.log('Auth callback - URL query:', query);
        
        // Check for errors in the URL
        const urlParams = new URLSearchParams(query);
        if (urlParams.has('error')) {
          const error = urlParams.get('error');
          const description = urlParams.get('error_description');
          console.error('OAuth error from URL:', error, description);
          setStatus(`Error: ${description || error}`);
          setTimeout(() => navigate('/'), 3000);
          return;
        }        // Try to get session from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setStatus('Error checking session');
          setTimeout(() => navigate('/'), 3000);
          return;
        }
        
        if (session?.user) {
          // We have a session!
          console.log('Session successfully established:', session);
          setUser(session.user);
          setStatus('Authentication successful! Redirecting...');
          setTimeout(() => navigate('/'), 1000);
          return;
        }        // If no session, try to extract tokens from URL fragment and set session manually
        if (fragment && fragment.startsWith('#')) {
          console.log('Processing URL fragment for tokens');
          const fragParams = new URLSearchParams(fragment.slice(1));
          const access_token = fragParams.get('access_token');
          const refresh_token = fragParams.get('refresh_token');
          
          if (access_token && refresh_token) {
            console.log('Found tokens in URL fragment, setting session');
            // Set session manually
            const { data, error } = await supabase.auth.setSession({
              access_token,
              refresh_token
            });
            
            if (error) {
              console.error('Error setting session:', error);
              setStatus('Error setting session: ' + error.message);
              setTimeout(() => navigate('/'), 3000);
              return;
            }
            
            setUser(data.session.user);
            setStatus('Authentication successful! Redirecting...');
            setTimeout(() => navigate('/'), 1000);
            return;
          } else {
            console.log('No tokens found in URL fragment');
          }
        }        // If we reach here, check for authorization code (used in PKCE flow)
        if (urlParams.has('code')) {
          console.log('Found authorization code, letting Supabase handle it');
          // Supabase will handle the code exchange automatically in getSession above
          // Just attempt to get the session again
          const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.getSession();
          
          if (refreshError) {
            console.error('Error refreshing session:', refreshError);
            setStatus('Error processing authorization code');
            setTimeout(() => navigate('/'), 3000);
            return;
          }
          
          if (refreshedSession?.user) {
            setUser(refreshedSession.user);
            setStatus('Authentication successful! Redirecting...');
            setTimeout(() => navigate('/'), 1000);
            return;
          }
        }
        
        // If we reach here, no session or code found
        setStatus('No session or authorization data found');
        setTimeout(() => navigate('/'), 3000);
      } catch (err) {
        setStatus('Unexpected error: ' + err.message);
        setTimeout(() => navigate('/'), 3000);
      }
    }
    handleAuthCallback();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center max-w-md p-8 bg-black/50 rounded-xl backdrop-blur-lg border border-white/10">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-6"></div>
        <p className="text-white text-lg mb-2">{status}</p>
        <p className="text-gray-400 text-sm">Please do not close this window</p>
      </div>
    </div>
  );
};

export default AuthCallback;
