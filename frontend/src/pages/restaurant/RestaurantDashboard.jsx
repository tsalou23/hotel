import { useDashboard } from '../../hooks/useDashboard'
import { useRestaurantData } from '../../hooks/useRestaurantData'
import DashboardLayout from '../../components/layout/DashboardLayout'
import IncomingBookingsView from '../../components/restaurant/IncomingBookingsView'
import EarningsView from '../../components/hotel/EarningsView'
import { CalendarDays, Wallet } from 'lucide-react'

const menuItems = [
    { key: 'bookings', label: 'Bookings', icon: CalendarDays },
    { key: 'earnings', label: 'Earnings', icon: Wallet },
]

const titles = {
    bookings: { title: 'Incoming Bookings', subtitle: 'Manage reservation requests' },
    earnings: { title: 'Earnings Overview', subtitle: 'Track your commission earnings' },
}

export default function RestaurantDashboard() {
    const { activeView, setActiveView } = useDashboard('bookings')
    const { bookings, stats, loading, error, refetch } = useRestaurantData()

    if (loading) return null
    if (error) return <div className="flex items-center justify-center h-screen text-destructive">Error: {error}</div>

    return (
        <DashboardLayout
            activeView={activeView}
            setActiveView={setActiveView}
            title={titles[activeView].title}
            subtitle={titles[activeView].subtitle}
            stats={stats}
            menuItems={menuItems}
        >
            {activeView === 'bookings' && <IncomingBookingsView bookings={bookings} onRefresh={refetch} />}
            {activeView === 'earnings' && <EarningsView stats={stats} bookings={bookings} />}
        </DashboardLayout>
    )
}
