import { useDashboard } from '../../hooks/useDashboard'
import { useAdminData } from '../../hooks/useAdminData'
import DashboardLayout from '../../components/layout/DashboardLayout'
import OverviewView from '../../components/admin/OverviewView'
import AdminRestaurantsView from '../../components/admin/AdminRestaurantsView'
import EarningsView from '../../components/hotel/EarningsView'
import { LayoutDashboard, UtensilsCrossed, Wallet } from 'lucide-react'

const menuItems = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'restaurants', label: 'Restaurants', icon: UtensilsCrossed },
    { key: 'earnings', label: 'Earnings', icon: Wallet },
]

const titles = {
    overview: { title: 'Admin Overview', subtitle: 'Platform-wide statistics' },
    restaurants: { title: 'All Restaurants', subtitle: 'Manage restaurant partners' },
    earnings: { title: 'Platform Earnings', subtitle: 'Total commission overview' },
}

export default function AdminDashboard() {
    const { activeView, setActiveView } = useDashboard('overview')
    const { bookings, restaurants, stats, loading, error } = useAdminData()

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
            {activeView === 'overview' && <OverviewView stats={stats} bookings={bookings} />}
            {activeView === 'restaurants' && <AdminRestaurantsView restaurants={restaurants} />}
            {activeView === 'earnings' && <EarningsView stats={stats} bookings={bookings} />}
        </DashboardLayout>
    )
}
