import { createClient } from '@supabase/supabase-js'

// Supabase credentials from environment variables
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://nndpekqscmejnsfcghic.supabase.co'
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uZHBla3FzY21lam5zZmNnaGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NDc4NDQsImV4cCI6MjA2MzIyMzg0NH0.rehN4dtCV5mDR4gCVbQdUGTtZi8KLsLrSVp-0yMkBQk'

// Create client with proper site URL configuration
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
    flowType: 'pkce',
    // Define our application URL as the site URL
    // This helps with proper branding during OAuth flows
    site: window.location.origin,
    // Configure global redirect behavior
    redirectTo: `${window.location.origin}/auth/callback`,
    // Set the auto confirm to true to use redirect flow
    autoConfirmSignUp: true,
    // Branding for OAuth
    supabase_client_name: 'Avocado Space'
  }
})
