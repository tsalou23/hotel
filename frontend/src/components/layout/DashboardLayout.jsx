import Sidebar from './Sidebar'
import Header from './Header'

export default function DashboardLayout({ activeView, setActiveView, title, subtitle, stats, children }) {
    return (
        // ─── OUTER CONTAINER ────────────────────────────────────────────────────
        // flex = sidebar left, content right
        // h-screen w-screen = full screen
        // bg-background = page background color (defined in index.css)
        <div className="flex h-screen w-screen overflow-hidden bg-background">

            {/* ── SIDEBAR ──────────────────────────────────────────────────────────
                Customize navigation items, logo, stats in Sidebar.jsx */}
            <Sidebar activeView={activeView} setActiveView={setActiveView} stats={stats} />

            {/* ── RIGHT SIDE (Header + Content) ────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* ── HEADER ───────────────────────────────────────────────────────
                    Customize stats pills, notification bell, avatar in Header.jsx */}
                <Header
                    title={title}
                    subtitle={subtitle}
                    stats={stats}
                    activeView={activeView}
                    setActiveView={setActiveView}
                />

                {/* ── MAIN CONTENT AREA ────────────────────────────────────────────
                    Change p-6 to adjust padding around the content
                    children = BookingsView / RestaurantsView / EarningsView */}
                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
