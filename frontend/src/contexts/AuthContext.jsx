import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

// ─── AUTH CONTEXT ─────────────────────────────────────────────────────────────
// Global container that holds the logged in user state
// Any component in the app can read from this via useAuth()
// Do not modify this file unless changing the auth provider (e.g. switching from Supabase)
const AuthContext = createContext({})

// ─── AUTH PROVIDER ────────────────────────────────────────────────────────────
// Wraps the entire app in main.jsx: <AuthProvider><App /></AuthProvider>
// Checks Supabase for an existing session on load
// Listens for auth changes (login/logout) in real time
export const AuthProvider = ({ children }) => {

    // user    — the logged in user object (or null if not logged in)
    // loading — true while we're checking Supabase, false once we know
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        // ── CHECK EXISTING SESSION ────────────────────────────────────────────
        // On app load, ask Supabase "is there already a logged in user?"
        // (from a previous session stored in the browser)
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false) // we now know the answer, stop loading
        })

        // ── LISTEN FOR AUTH CHANGES ───────────────────────────────────────────
        // Fires automatically when user logs in or logs out
        // This keeps user state in sync with Supabase at all times
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        // ── CLEANUP ───────────────────────────────────────────────────────────
        // Unsubscribe when component unmounts to prevent memory leaks
        return () => subscription.unsubscribe()
    }, []) // [] = run once on mount only

    // ── PROVIDE USER STATE TO ENTIRE APP ──────────────────────────────────────
    // Any component can access { user, loading } via useAuth()
    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

// ─── USE AUTH ─────────────────────────────────────────────────────────────────
// Custom hook — shortcut to read from AuthContext
// Usage: const { user, loading } = useAuth()
// Import in any file that needs to know if the user is logged in
export const useAuth = () => {
    return useContext(AuthContext)
}
