import { CalendarDays, UtensilsCrossed, Wallet, LogOut, Landmark } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '../../supabaseClient'
import { useNavigate } from 'react-router-dom'

// ─── NAVIGATION ITEMS ────────────────────────────────────────────────────────
// Add, remove or rename menu items here
// key must match the activeView values used in HotelDashboard.jsx
// icon must be a lucide-react component
const navItems = [
    { key: 'bookings', label: 'Bookings', icon: CalendarDays },
    { key: 'restaurants', label: 'Restaurants', icon: UtensilsCrossed },
    { key: 'earnings', label: 'Earnings', icon: Wallet },
]

export default function Sidebar({ activeView, setActiveView, stats }) {
    const navigate = useNavigate()
    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    return (
        // ─── SIDEBAR WIDTH ───────────────────────────────────────────────────
        // Change w-64 to make sidebar wider or narrower
        // bg-sidebar color is defined in index.css (--sidebar-background)
        <aside className="hidden lg:flex flex-col w-64 bg-sidebar text-sidebar-foreground flex-shrink-0">

            {/* ── LOGO SECTION ─────────────────────────────────────────────────
                Change the icon: replace Building2 with any lucide icon
                Change "Athens" and "Concierge" to your app name
                bg-primary color is defined in index.css (--primary) */}
            <div className="p-6 border-b border-sidebar-border">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                        <Landmark className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-white tracking-wide">Athens</h1>
                        <p className="text-xs text-sidebar-foreground/60 font-medium">Concierge</p>
                    </div>
                </div>
            </div>

            {/* ── NAVIGATION SECTION ───────────────────────────────────────────
                Change "Dashboard" label to rename the nav section title
                Active item style: bg-primary (blue) — change in cn() below
                Inactive item style: hover:bg-sidebar-accent — change in cn() below */}
            <nav className="flex-1 p-4 space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40 font-semibold px-3 mb-3">
                    Dashboard
                </p>
                {navItems.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setActiveView(key)}
                        className={cn(
                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                            activeView === key
                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                                : 'text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent'
                        )}
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                    </button>
                ))}
            </nav>

            {/* ── QUICK STATS SECTION ──────────────────────────────────────────
                Change the 3 rows to show different stats
                stats object comes from useHotelData.js
                text-accent color is defined in index.css (--accent) */}
            {stats && (
                <div className="p-4 mx-4 mb-4 rounded-xl bg-sidebar-accent/50 border border-sidebar-border">
                    <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40 font-semibold mb-3">
                        Quick Stats
                    </p>
                    <div className="space-y-2.5">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-sidebar-foreground/60">Bookings</span>
                            <span className="text-xs font-bold text-white">{stats.totalBookings}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-sidebar-foreground/60">Completed</span>
                            <span className="text-xs font-bold text-accent">{stats.completed}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-sidebar-foreground/60">Earnings</span>
                            <span className="text-xs font-bold text-accent">€{stats.earnings}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* ── LOGOUT SECTION ───────────────────────────────────────────────
                Change "Sign Out" to rename the logout button
                Change LogOut icon to any lucide icon
                handleLogout signs out from Supabase and redirects to /login */}
            <div className="p-4 border-t border-sidebar-border">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-sidebar-foreground/50 hover:text-white hover:bg-sidebar-accent transition-all duration-200"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    )
}
