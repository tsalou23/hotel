import { cn } from '@/lib/utils'

// ─── STATUS VARIANTS ──────────────────────────────────────────────────────────
// Add new statuses here by adding a new key with bg + text + border classes
// Uses Tailwind color classes — change colors here to update all badges at once
const variants = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
// Reusable pill that shows booking status
// Props: status (string) — must match a key in variants above
// Used in: BookingsView.jsx, EarningsView.jsx
export default function StatusBadge({ status }) {
    return (
        // capitalize = auto capitalizes first letter (pending → Pending)
        // fallback = bg-muted if status doesn't match any variant
        <span className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize',
            variants[status] || 'bg-muted text-muted-foreground border-border'
        )}>
            {status}
        </span>
    )
}
