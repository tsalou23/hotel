import { Wallet, TrendingUp, CheckCircle, CalendarDays } from 'lucide-react'
import StatCard from './StatCard'
import StatusBadge from './StatusBadge'

// ─── EARNINGS VIEW ────────────────────────────────────────────────────────────
// Shows earnings stats and completed bookings table
// Props:
//   stats   — { totalBookings, completed, confirmed, pending, earnings } from useHotelData.js
//   bookings — full bookings array, filtered to completed inside this component
export default function EarningsView({ stats, bookings }) {

    // ─── CALCULATIONS ─────────────────────────────────────────────────────────
    // completedBookings — only bookings with status 'completed'
    // avgCommission — earnings divided by number of completed bookings
    const completedBookings = bookings.filter((b) => b.status === 'completed')
    const avgCommission = completedBookings.length
        ? Math.round(stats.earnings / completedBookings.length)
        : 0

    return (
        <div className="space-y-6">

            {/* ── STAT CARDS ROW ────────────────────────────────────────────────
                Add/remove StatCard components to change what stats are shown
                accent=true → green color, accent=false → blue color
                Change icons by importing different lucide-react icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Wallet} label="Total Earnings" value={`€${stats.earnings}`} accent />
                <StatCard icon={CheckCircle} label="Completed" value={stats.completed} />
                <StatCard icon={TrendingUp} label="Avg. Commission" value={`€${avgCommission}`} accent />
                <StatCard icon={CalendarDays} label="Total Bookings" value={stats.totalBookings} />
            </div>

            {/* ── COMPLETED BOOKINGS TABLE ──────────────────────────────────────
                Only shows bookings with status 'completed'
                Add/remove columns by editing headers array AND matching td below */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">

                {/* ── TABLE HEADER SECTION ──────────────────────────────────────
                    Change title and subtitle text here */}
                <div className="px-6 py-4 border-b border-border">
                    <h3 className="text-sm font-bold text-foreground">Completed Bookings</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Bookings that have earned commission</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                {/* ── TABLE HEADERS — add/remove to match columns below */}
                                {['Restaurant', 'Guest', 'Date', 'Status', 'Earned'].map(h => (
                                    <th key={h} className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-6 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {completedBookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-muted/50 transition-colors duration-150">
                                    <td className="px-6 py-3.5 text-sm font-semibold text-foreground">{booking.restaurant_name}</td>
                                    <td className="px-6 py-3.5 text-sm text-muted-foreground">{booking.guest}</td>
                                    <td className="px-6 py-3.5 text-sm text-muted-foreground">{booking.booking_date}</td>
                                    <td className="px-6 py-3.5"><StatusBadge status={booking.status} /></td>
                                    {/* ── EARNED — green accent color */}
                                    <td className="px-6 py-3.5 text-sm font-bold text-accent">€{booking.commission_earned}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ── EMPTY STATE — shown when no completed bookings exist */}
                {completedBookings.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                        No completed bookings yet.
                    </div>
                )}
            </div>
        </div>
    )
}
