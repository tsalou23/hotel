import { useSearchParams } from 'react-router-dom'

// ─── USE DASHBOARD ────────────────────────────────────────────────────────────
// Manages which view is currently active
// Persists the active view in the URL (?view=bookings) so reloading keeps position
// Used by ALL dashboards (hotel, restaurant, taxi, admin)
//
// Usage:
//   const { activeView, setActiveView } = useDashboard('bookings')
//
// Parameters:
//   defaultView — which view to show on first load e.g. 'bookings'
//
// Returns:
//   activeView    — current view string e.g. 'bookings'
//   setActiveView — function to change the view e.g. setActiveView('earnings')
export function useDashboard(defaultView) {

    // useSearchParams reads/writes the URL query string
    // e.g. /hotel?view=restaurants
    const [searchParams, setSearchParams] = useSearchParams()

    // Read 'view' from URL, fall back to defaultView if not set
    const activeView = searchParams.get('view') || defaultView

    // Update the URL when view changes — this is what persists on reload
    const setActiveView = (view) => {
        setSearchParams({ view })
    }

    return { activeView, setActiveView }
}
