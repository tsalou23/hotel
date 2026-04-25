import { useState } from 'react'
import { CalendarDays, Clock, Users } from 'lucide-react'
import StatusBadge from './StatusBadge'

// ─── FILTER TABS ──────────────────────────────────────────────────────────────
// Add or remove filter options here
// Values must match the status values in the bookings data
const filterTabs = ['all', 'pending', 'confirmed', 'completed']

// ─── BOOKINGS VIEW ────────────────────────────────────────────────────────────
// Shows all hotel bookings in a filterable table
// Props: bookings (array) — comes from useHotelData.js
// When connecting Supabase: only useHotelData.js changes, this file stays the same
export default function BookingsView({ bookings }) {

    // ─── FILTER STATE ─────────────────────────────────────────────────────────
    // activeFilter controls which bookings are shown
    // 'all' shows everything, other values filter by status
    const [activeFilter, setActiveFilter] = useState('all')

    const filtered = activeFilter === 'all'
        ? bookings
        : bookings.filter((b) => b.status === activeFilter)

    return (
        <div className="space-y-6">

            {/* ── FILTER TABS ───────────────────────────────────────────────────
                Active tab: bg-foreground (dark) text-background (white)
                Inactive tab: bg-card (white) with border
                Change rounded-full to rounded-lg for square tabs */}
            <div className="flex gap-2">
                {filterTabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveFilter(tab)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition-all duration-200 cursor-pointer ${activeFilter === tab
                            ? 'bg-foreground text-background shadow-lg'
                            : 'bg-card text-muted-foreground border border-border hover:bg-muted'
                            }`}
                    >
                        {tab}
                        {/* Count badge next to tab label */}
                        <span className="ml-1.5 opacity-60">
                            {tab === 'all' ? bookings.length : bookings.filter((b) => b.status === tab).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* ── BOOKINGS TABLE ────────────────────────────────────────────────
                Add/remove columns by editing the headers array AND the matching td below
                hover:bg-muted/50 = row highlight on hover — change color here */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                {/* ── TABLE HEADERS — add/remove to match columns below */}
                                {['Restaurant', 'Guest', 'Date & Time', 'Guests', 'Status', 'Commission'].map(h => (
                                    <th key={h} className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-6 py-4">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filtered.map((booking) => (
                                <tr key={booking.id} className="hover:bg-muted/50 transition-colors duration-150">

                                    {/* ── RESTAURANT NAME */}
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-semibold text-foreground">{booking.restaurant_name}</span>
                                    </td>

                                    {/* ── GUEST NAME */}
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-muted-foreground">{booking.guest}</span>
                                    </td>

                                    {/* ── DATE & TIME — stacked with icons */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <CalendarDays className="w-3.5 h-3.5 flex-shrink-0" />
                                            <span>{booking.booking_date}</span>
                                            <Clock className="w-3.5 h-3.5 flex-shrink-0 ml-1" />
                                            <span>{booking.booking_time}</span>
                                        </div>
                                    </td>

                                    {/* ── NUMBER OF GUESTS */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <Users className="w-3.5 h-3.5" />
                                            {booking.number_of_guests}
                                        </div>
                                    </td>

                                    {/* ── STATUS BADGE — colors defined in StatusBadge.jsx */}
                                    <td className="px-6 py-4">
                                        <StatusBadge status={booking.status} />
                                    </td>

                                    {/* ── COMMISSION — only shows for completed bookings */}
                                    <td className="px-6 py-4 text-right">
                                        <span className={`text-sm font-bold ${booking.status === 'completed' ? 'text-accent' : 'text-muted-foreground/30'}`}>
                                            {booking.status === 'completed' ? `€${booking.commission_earned}` : '—'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ── EMPTY STATE — shown when no bookings match the filter */}
                {filtered.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                        No bookings found for this filter.
                    </div>
                )}
            </div>
        </div>
    )
}
