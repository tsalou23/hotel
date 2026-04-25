import { useDashboard } from '../../hooks/useDashboard'
import { useHotelData } from '../../hooks/useHotelData'
import DashboardLayout from '../../components/layout/DashboardLayout'
import BookingsView from '../../components/hotel/BookingsView'
import RestaurantsView from '../../components/hotel/RestaurantsView'
import EarningsView from '../../components/hotel/EarningsView'

// ─── HOTEL DASHBOARD ──────────────────────────────────────────────────────────
// The "brain" of the hotel portal — connects all hooks, layout and views
// This file should contain NO styling — only logic and composition
export default function HotelDashboard() {

    // ─── HOOKS ────────────────────────────────────────────────────────────────
    // useDashboard — manages which view is active, persists in URL
    // useHotelData — provides all data and calculated stats
    const { activeView, setActiveView } = useDashboard('bookings')
    const { bookings, restaurants, stats, loading, error, refetch } = useHotelData()

    if (loading) return null
    if (error) return <div className="flex items-center justify-center h-screen text-destructive">Error: {error}</div>

    // ─── PAGE TITLES ──────────────────────────────────────────────────────────
    // Change title and subtitle text for each view here
    // Add a new entry when adding a new view
    const titles = {
        bookings: { title: 'My Bookings', subtitle: 'Manage all reservations' },
        restaurants: { title: 'Browse Restaurants', subtitle: 'Find restaurants for guests' },
        earnings: { title: 'Earnings Overview', subtitle: 'Track commission earnings' },
    }

    return (
        // ─── DASHBOARD LAYOUT ─────────────────────────────────────────────────
        // Customize sidebar and header in their respective files
        // Add new views by adding a new conditional render below
        <DashboardLayout
            activeView={activeView}
            setActiveView={setActiveView}
            title={titles[activeView].title}
            subtitle={titles[activeView].subtitle}
            stats={stats}
        >
            {/* ── VIEW RENDERING ────────────────────────────────────────────────
                Only one view renders at a time based on activeView
                To add a new view:
                1. Create the component in components/hotel/
                2. Import it above
                3. Add a new line here: {activeView === 'newview' && <NewView />}
                4. Add a new entry in titles above
                5. Add a new navItem in Sidebar.jsx */}
            {activeView === 'bookings' && <BookingsView bookings={bookings} />}
            {activeView === 'restaurants' && <RestaurantsView restaurants={restaurants} onBookingCreated={refetch} />}
            {activeView === 'earnings' && <EarningsView stats={stats} bookings={bookings} />}
        </DashboardLayout>
    )
}
