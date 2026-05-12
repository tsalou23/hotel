import { Wallet, CalendarDays, CheckCircle, Clock, Building2, UtensilsCrossed } from 'lucide-react'
import StatCard from '../hotel/StatCard'
import StatusBadge from '../hotel/StatusBadge'

export default function OverviewView({ stats, bookings }) {
    const recentBookings = bookings.slice(0, 10)

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={CalendarDays} label="Total Bookings" value={stats.totalBookings} />
                <StatCard icon={CheckCircle} label="Completed" value={stats.completed} accent />
                <StatCard icon={Clock} label="Pending" value={stats.pending} />
                <StatCard icon={Wallet} label="Total Revenue" value={`€${stats.earnings}`} accent />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <StatCard icon={Building2} label="Hotels" value={stats.totalHotels} />
                <StatCard icon={UtensilsCrossed} label="Restaurants" value={stats.totalRestaurants} />
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                    <h3 className="text-sm font-bold text-foreground">Recent Bookings</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Latest 10 bookings across all hotels</p>
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            {['Restaurant', 'Guest', 'Date', 'Guests', 'Status', 'Commission'].map(h => (
                                <th key={h} className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-6 py-3">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {recentBookings.map(booking => (
                            <tr key={booking.id} className="hover:bg-muted/50 transition-colors">
                                <td className="px-6 py-3.5 text-sm font-semibold text-foreground">{booking.restaurant_name}</td>
                                <td className="px-6 py-3.5 text-sm text-muted-foreground">{booking.guest}</td>
                                <td className="px-6 py-3.5 text-sm text-muted-foreground">{booking.booking_date}</td>
                                <td className="px-6 py-3.5 text-sm text-muted-foreground">{booking.number_of_guests}</td>
                                <td className="px-6 py-3.5"><StatusBadge status={booking.status} /></td>
                                <td className="px-6 py-3.5 text-sm font-bold text-accent">
                                    {booking.status === 'completed' ? `€${booking.commission_earned}` : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {recentBookings.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground text-sm">No bookings yet.</div>
                )}
            </div>
        </div>
    )
}
