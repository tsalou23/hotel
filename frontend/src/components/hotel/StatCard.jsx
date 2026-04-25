// ─── STAT CARD ────────────────────────────────────────────────────────────────
// Reusable card for displaying a single stat with an icon
// Props:
//   icon  — any lucide-react component e.g. Wallet, TrendingUp
//   label — text shown above the value e.g. "Total Earnings"
//   value — the number or string to display e.g. "€9" or 5
//   accent — if true uses green (accent color), if false uses blue (primary color)
// Used in: EarningsView.jsx
export default function StatCard({ icon: Icon, label, value, accent = false }) {
    return (
        // ─── CARD CONTAINER ───────────────────────────────────────────────────
        // Change p-5 to adjust card padding
        // rounded-2xl = very rounded corners — change to rounded-xl for less rounding
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow duration-200">

            {/* ── ICON + LABEL ROW ──────────────────────────────────────────────
                accent=true  → green icon background (bg-accent/10)
                accent=false → blue icon background (bg-primary/10)
                Change w-9 h-9 to resize the icon container */}
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ? 'bg-accent/10' : 'bg-primary/10'}`}>
                    <Icon className={`w-4 h-4 ${accent ? 'text-accent' : 'text-primary'}`} />
                </div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
            </div>

            {/* ── VALUE ─────────────────────────────────────────────────────────
                Change text-2xl to make the number bigger or smaller
                accent=true → green text, accent=false → default text color */}
            <p className={`text-2xl font-bold tracking-tight ${accent ? 'text-accent' : 'text-foreground'}`}>
                {value}
            </p>
        </div>
    )
}
