import { useState } from 'react'
import { supabase } from '../../supabaseClient'
import StatusBadge from '../hotel/StatusBadge'
import { CalendarDays, Clock, Users } from 'lucide-react'

const filterTabs = ['all', 'pending', 'confirmed', 'completed']

export default function IncomingBookingsView({ bookings, onRefresh }) {
    const [activeFilter, setActiveFilter] = useState('all')
    const [loadingId, setLoadingId] = useState(null)

    let filtered
    if (activeFilter === 'all') {
        filtered = bookings
    } else {
        filtered = bookings.filter(b => b.status === activeFilter)
    }

    async function updateStatus(bookingId, newStatus) {
        setLoadingId(bookingId)
        await supabase
            .from('restaurant_bookings')
            .update({ status: newStatus })
            .eq('id', bookingId)
        setLoadingId(null)
        onRefresh()
    }

    return (
        <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="flex gap-2">
                {filterTabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveFilter(tab)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition-all duration-200 cursor-pointer ${activeFilter === tab
                            ? 'bg-foreground text-background shadow-lg'
                            : 'bg-card text-muted-foreground border border-border hover:bg-muted'
                            }`}
                    >
                        {tab}
                        <span className="ml-1.5 opacity-60">
                            {tab === 'all' ? bookings.length : bookings.filter(b => b.status === tab).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Bookings Table */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            {['Guest', 'Date & Time', 'Guests', 'Notes', 'Status', 'Actions'].map(h => (
                                <th key={h} className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-6 py-4">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filtered.map(booking => (
                            <tr key={booking.id} className="hover:bg-muted/50 transition-colors duration-150">
                                <td className="px-6 py-4">
                                    <p className="text-sm font-semibold text-foreground">{booking.guest}</p>
                                    <p className="text-xs text-muted-foreground">{booking.phone}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CalendarDays className="w-3.5 h-3.5" />
                                        <span>{booking.booking_date}</span>
                                        <Clock className="w-3.5 h-3.5 ml-1" />
                                        <span>{booking.booking_time}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <Users className="w-3.5 h-3.5" />
                                        {booking.number_of_guests}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                    {booking.notes || '—'}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={booking.status} />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        {booking.status === 'pending' && (
                                            <button
                                                onClick={() => updateStatus(booking.id, 'confirmed')}
                                                disabled={loadingId === booking.id}
                                                className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
                                            >
                                                Confirm
                                            </button>
                                        )}
                                        {booking.status === 'confirmed' && (
                                            <button
                                                onClick={() => updateStatus(booking.id, 'completed')}
                                                disabled={loadingId === booking.id}
                                                className="px-3 py-1.5 bg-accent text-accent-foreground text-xs font-semibold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 cursor-pointer"
                                            >
                                                Complete
                                            </button>
                                        )}
                                        {booking.status === 'pending' && (
                                            <button
                                                onClick={() => updateStatus(booking.id, 'cancelled')}
                                                disabled={loadingId === booking.id}
                                                className="px-3 py-1.5 bg-destructive text-destructive-foreground text-xs font-semibold rounded-lg hover:bg-destructive/90 transition-colors disabled:opacity-50 cursor-pointer"
                                            >
                                                Reject
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                        No bookings found.
                    </div>
                )}
            </div>
        </div>
    )
}
