import { Wallet, TrendingUp, Building2, UtensilsCrossed } from 'lucide-react'
import StatCard from '../hotel/StatCard'
import StatusBadge from '../hotel/StatusBadge'

export default function FinancialView({ stats, bookings, restaurants }) {
    const completedBookings = bookings.filter(b => b.status === 'completed')

    // Per restaurant breakdown
    const restaurantBreakdown = restaurants.map(r => {
        const rBookings = completedBookings.filter(b => b.restaurant_id === r.id)
        const hotelPaid = rBookings.reduce((total, b) => total + b.commission_earned, 0)
        const platformPaid = rBookings.reduce((total, b) => total + (b.commission_platform_earned || 0), 0)
        return {
            name: r.restaurant_name,
            bookings: rBookings.length,
            hotelPaid,
            platformPaid,
            totalOwed: hotelPaid + platformPaid
        }
    }).filter(r => r.bookings > 0)

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Wallet} label="Platform Revenue" value={`€${stats.platformEarnings}`} accent />
                <StatCard icon={TrendingUp} label="Hotel Payouts" value={`€${stats.earnings}`} />
                <StatCard icon={Building2} label="Total Revenue" value={`€${stats.totalRevenue}`} accent />
                <StatCard icon={UtensilsCrossed} label="Completed Bookings" value={stats.completed} />
            </div>

            {/* Restaurant Breakdown */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                    <h3 className="text-sm font-bold text-foreground">Restaurant Commission Breakdown</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">What each restaurant owes per completed bookings</p>
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            {['Restaurant', 'Completed Bookings', 'Hotel Payout', 'Platform Cut', 'Total Owed'].map(h => (
                                <th key={h} className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-6 py-3">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {restaurantBreakdown.map(r => (
                            <tr key={r.name} className="hover:bg-muted/50 transition-colors">
                                <td className="px-6 py-4 text-sm font-semibold text-foreground">{r.name}</td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">{r.bookings}</td>
                                <td className="px-6 py-4 text-sm font-bold text-primary">€{r.hotelPaid}</td>
                                <td className="px-6 py-4 text-sm font-bold text-accent">€{r.platformPaid}</td>
                                <td className="px-6 py-4 text-sm font-bold text-foreground">€{r.totalOwed}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {restaurantBreakdown.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground text-sm">No completed bookings yet.</div>
                )}
            </div>

            {/* Recent Completed Bookings */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                    <h3 className="text-sm font-bold text-foreground">Completed Bookings</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">All bookings that generated commission</p>
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            {['Restaurant', 'Guest', 'Date', 'Status', 'Hotel Earned', 'Platform Earned'].map(h => (
                                <th key={h} className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-6 py-3">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {completedBookings.map(booking => (
                            <tr key={booking.id} className="hover:bg-muted/50 transition-colors">
                                <td className="px-6 py-3.5 text-sm font-semibold text-foreground">{booking.restaurant_name}</td>
                                <td className="px-6 py-3.5 text-sm text-muted-foreground">{booking.guest}</td>
                                <td className="px-6 py-3.5 text-sm text-muted-foreground">{booking.booking_date}</td>
                                <td className="px-6 py-3.5"><StatusBadge status={booking.status} /></td>
                                <td className="px-6 py-3.5 text-sm font-bold text-primary">€{booking.commission_earned}</td>
                                <td className="px-6 py-3.5 text-sm font-bold text-accent">€{booking.commission_platform_earned || 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {completedBookings.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground text-sm">No completed bookings yet.</div>
                )}
            </div>
        </div>
    )
}
