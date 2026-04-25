import { createClient } from '@supabase/supabase-js'

// ─── SUPABASE CLIENT ──────────────────────────────────────────────────────────
// Credentials are stored in .env file (never hardcode them here)
// .env file must be in the frontend/ folder
// VITE_ prefix is required for Vite to expose env variables to the browser
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
