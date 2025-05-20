import { createClient } from '@supabase/supabase-js'

// Supabase credentials
const SUPABASE_URL = 'https://nndpekqscmejnsfcghic.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uZHBla3FzY21lam5zZmNnaGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NDc4NDQsImV4cCI6MjA2MzIyMzg0NH0.rehN4dtCV5mDR4gCVbQdUGTtZi8KLsLrSVp-0yMkBQk'

// Create basic client with minimal configuration
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    detectSessionInUrl: false // We'll handle this manually
  }
})
