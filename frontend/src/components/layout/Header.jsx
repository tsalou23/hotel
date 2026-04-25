import { Bell, CalendarDays, UtensilsCrossed, Wallet } from 'lucide-react'

// ─── MOBILE NAVIGATION ITEMS ────────────────────────────────────────────────────
// These show in the header on mobile (when sidebar is hidden)
// Keep in sync with navItems in Sidebar.jsx
const navItems = [
    { key: 'bookings', label: 'Bookings', icon: CalendarDays },
    { key: 'restaurants', label: 'Restaurants', icon: UtensilsCrossed },
    { key: 'earnings', label: 'Earnings', icon: Wallet },
]

export default function Header({ title, subtitle, stats, activeView, setActiveView }) {
    return (
        // ─── HEADER CONTAINER ────────────────────────────────────────────────────
        // bg-card = white background (defined in index.css)
        // Change px-6 py-4 to adjust header padding
        <header className="bg-card border-b border-border px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">

                    {/* ── MOBILE NAV ───────────────────────────────────────────────────
                        Only visible on small screens (lg:hidden)
                        Replaces sidebar navigation on mobile */}
                    <div className="lg:hidden flex gap-1">
                        {navItems.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setActiveView(key)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeView === key
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted'
                                    }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{label}</span>
                            </button>
                        ))}
                    </div>

                    {/* ── PAGE TITLE ───────────────────────────────────────────────────
                        title and subtitle come from HotelDashboard.jsx (titles object)
                        Only visible on desktop (hidden lg:block) */}
                    <div className="hidden lg:block">
                        <h2 className="text-xl font-bold text-foreground tracking-tight">{title}</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">

                    {/* ── STATS PILLS ──────────────────────────────────────────────────
                        Add/remove StatPill components to change what shows here
                        Each StatPill: label = text, value = number, color = bg+text classes
                        Only visible on medium screens and above (hidden md:flex) */}
                    {stats && (
                        <div className="hidden md:flex items-center gap-4 mr-4">
                            <StatPill label="Pending" value={stats.pending} color="bg-amber-100 text-amber-700" />
                            <StatPill label="Confirmed" value={stats.confirmed} color="bg-blue-100 text-blue-700" />
                            <StatPill label="Earnings" value={`€${stats.earnings}`} color="bg-emerald-100 text-emerald-700" />
                        </div>
                    )}

                    {/* ── NOTIFICATION BELL ───────────────────────────────────────────
                        Replace Bell with any lucide icon
                        The red dot is the span with bg-primary — remove it to hide the dot */}
                    <button className="relative w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                        <Bell className="w-4 h-4 text-muted-foreground" />
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card" />
                    </button>

                    {/* ── AVATAR ──────────────────────────────────────────────────────────
                        Change "HC" to the user's initials dynamically later
                        Replace with an <img> tag when you have a real avatar */}
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">HC</span>
                    </div>
                </div>
            </div>
        </header>
    )
}

// ─── STAT PILL COMPONENT ────────────────────────────────────────────────────────
// Small colored pill shown in the header
// color prop accepts any Tailwind bg + text classes e.g. "bg-amber-100 text-amber-700"
function StatPill({ label, value, color }) {
    return (
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
            {value} {label}
        </div>
    )
}
