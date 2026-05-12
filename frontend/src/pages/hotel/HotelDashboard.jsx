import { useDashboard } from '../../hooks/useDashboard'
import { useHotelData } from '../../hooks/useHotelData'
import DashboardLayout from '../../components/layout/DashboardLayout'
import BookingsView from '../../components/hotel/BookingsView'
import RestaurantsView from '../../components/hotel/RestaurantsView'
import EarningsView from '../../components/hotel/EarningsView'
import{CalendarDays ,UtensilsCrossed,Wallet} from 'lucide-react'
const titles = {
    bookings: { title: 'My Bookings', subtitle: 'Manage all reservations' },
    restaurants: { title: 'Browse Restaurants', subtitle: 'Find restaurants for guests' },
    earnings: { title: 'Earnings Overview', subtitle: 'Track commission earnings' },
}

export default function HotelDashboard() {
    const { activeView, setActiveView } = useDashboard('bookings')
    const { bookings, restaurants, stats, loading, error, refetch, hotelId } = useHotelData()
    const menuItems=[
        {key:'bookings',label:'Bookings',icon:CalendarDays},
        {key:'restaurants',label:'Restaurants',icon:UtensilsCrossed},
        {key:'earnings',label:'Earnings',icon:Wallet}
    ]

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
            {activeView === 'bookings' && <BookingsView bookings={bookings} />}
            {activeView === 'restaurants' && <RestaurantsView restaurants={restaurants} hotelId={hotelId} onBookingCreated={refetch} />}
            {activeView === 'earnings' && <EarningsView stats={stats} bookings={bookings} />}
        </DashboardLayout>
    )
}
