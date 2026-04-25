import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

// ─── PROTECTED ROUTE ──────────────────────────────────────────────────────────
// Security guard — blocks access to pages that require login
// Wrap any route in App.jsx that should be protected:
//   <ProtectedRoute><HotelDashboard /></ProtectedRoute>
//
// Three possible outcomes:
//   1. Still checking Supabase → show loading
//   2. No logged in user       → redirect to /login
//   3. User is logged in       → show the page (children)
function ProtectedRoute({ children }) {

    // Read user and loading state from AuthContext
    const { user, loading } = useAuth()

    // ── LOADING STATE ─────────────────────────────────────────────────────────
    // Wait for Supabase session check before deciding
    // Without this, app would flash /login even when user IS logged in
    // Change the loading UI here — e.g. add a spinner component
    if (loading) {
        return <div>Loading...</div>
    }

    // ── NOT LOGGED IN ─────────────────────────────────────────────────────────
    // No user found → redirect to login page
    // Change '/login' if your login route is different
    if (!user) {
        return <Navigate to="/login" />
    }

    // ── LOGGED IN ─────────────────────────────────────────────────────────────
    // User exists → render the protected page
    return children
}

export default ProtectedRoute
