# Athens Concierge - Project Architecture Prompt

Use this prompt to give any AI full context about the project architecture, stack, and conventions.

---

## COPY THIS PROMPT:

I am building a web app called **Athens Concierge** — a commission-based booking platform connecting hotels with restaurants in Athens, Greece.

### Tech Stack:
- React 19
- Vite 7
- React Router v7
- Tailwind CSS v4 (setup is ONE line in index.css: `@import "tailwindcss"` — no config files, no tailwind.config.js)
- Supabase JS v2 (PostgreSQL + Auth)

### Tailwind v4 Important:
- No tailwind.config.js
- No npx tailwindcss init
- Only `@import "tailwindcss"` in index.css
- Also requires `@tailwindcss/vite` plugin in vite.config.js:
```js
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### App.css must have:
```css
#root {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
```

### File Structure:
```
frontend/src/
├── components/
│   ├── common/
│   │   └── ProtectedRoute.jsx
│   ├── hotel/
│   │   ├── BookingsView.jsx
│   │   ├── RestaurantsView.jsx
│   │   └── EarningsView.jsx
│   ├── layout/
│   │   ├── DashboardLayout.jsx
│   │   ├── Header.jsx
│   │   └── Sidebar.jsx
│   └── ui/
│       ├── Badge.jsx
│       ├── Button.jsx
│       ├── Card.jsx
│       └── Table.jsx
├── contexts/
│   └── AuthContext.jsx
├── hooks/
│   ├── useDashboard.js
│   └── useHotelData.js
├── pages/
│   ├── auth/
│   │   └── LoginPage.jsx
│   └── hotel/
│       └── HotelDashboard.jsx
├── services/        (empty - for Supabase queries later)
├── utils/           (empty - for helper functions later)
├── App.jsx
├── index.css
├── main.jsx
└── supabaseClient.js
```

### Component Architecture:
```
UI Components (reused everywhere)
├── Button.jsx    — variants: primary, secondary, danger
├── Badge.jsx     — variants: default, pending, confirmed, completed
├── Card.jsx      — white card container, accepts className
└── Table.jsx     — accepts headers array + children rows

Layout Components (shared by ALL dashboards)
├── Sidebar.jsx         — dark slate sidebar, navigation, stats, logout
├── Header.jsx          — white top bar, title, subtitle, stats
└── DashboardLayout.jsx — combines Sidebar + Header + main content

Hotel View Components (hotel-specific content)
├── BookingsView.jsx    — bookings table with filter tabs and stat cards
├── RestaurantsView.jsx — restaurants table with search and filters
└── EarningsView.jsx    — earnings stat cards + completed bookings table

Hooks
├── useDashboard.js  — manages activeView state, used by ALL dashboards
└── useHotelData.js  — hotel mock data + stats calculations

Pages
└── HotelDashboard.jsx — brain: connects hooks + layout + views
```

### Component Hierarchy:
```
HotelDashboard (brain)
└── DashboardLayout (structure)
    ├── Sidebar (navigation)
    ├── Header (top bar)
    └── main area (children)
        └── BookingsView / RestaurantsView / EarningsView
            ├── Table (ui)
            ├── Badge (ui)
            ├── Button (ui)
            └── Card (ui)
```

### How Props Flow:
```
HotelDashboard creates:
- activeView, setActiveView  (from useDashboard)
- bookings, restaurants, stats  (from useHotelData)

Passes to DashboardLayout:
- activeView, setActiveView, title, subtitle, stats, children

DashboardLayout passes to Sidebar:
- activeView, setActiveView, stats

DashboardLayout passes to Header:
- title, subtitle, stats

children = BookingsView / RestaurantsView / EarningsView
```

### HotelDashboard.jsx (the brain):
```jsx
export default function HotelDashboard() {
    const { activeView, setActiveView } = useDashboard('bookings')
    const { bookings, restaurants, stats } = useHotelData()

    const titles = {
        bookings: { title: 'My Bookings', subtitle: 'Manage all reservations' },
        restaurants: { title: 'Browse Restaurants', subtitle: 'Find restaurants for guests' },
        earnings: { title: 'Earnings Overview', subtitle: 'Track commission earnings' },
    }

    return (
        <DashboardLayout
            activeView={activeView}
            setActiveView={setActiveView}
            title={titles[activeView].title}
            subtitle={titles[activeView].subtitle}
            stats={stats}
        >
            {activeView === 'bookings' && <BookingsView bookings={bookings} />}
            {activeView === 'restaurants' && <RestaurantsView restaurants={restaurants} />}
            {activeView === 'earnings' && <EarningsView stats={stats} bookings={bookings} />}
        </DashboardLayout>
    )
}
```

### Database (Supabase):
#### restaurants table:
- id, restaurant_name, cuisine, price_range, location, phone, rating, commission_hotel, commission_platform, user_id, created_at

#### restaurant_bookings table:
- id, hotel_id, restaurant_id, booking_date, booking_time, number_of_guests, status (pending/confirmed/completed), commission_earned, notes, created_at

### Important Column Name Rules:
- restaurant_name (NOT name)
- price_range (NOT price)
- booking_date (NOT date)
- booking_time (NOT time)
- number_of_guests (NOT pax or guests)
- commission_earned (in bookings)
- commission_hotel (in restaurants)

### Mock Data (in useHotelData.js):
All mock data column names match Supabase exactly for seamless future integration.
stats shape: { totalBookings, completed, confirmed, pending, earnings }

### Design System:
- Sidebar: bg-slate-800
- Active nav: bg-blue-600
- Page background: bg-slate-50
- Cards: bg-white, rounded-2xl, border border-gray-100, shadow-sm
- Primary text: text-gray-800 or text-slate-900
- Secondary text: text-gray-500 or text-slate-500
- Muted text: text-gray-400
- Success/commission: text-emerald-500
- Filter tabs: pill shaped, active = bg-gray-900 text-white

### Coding Conventions:
- ONLY Tailwind utility classes for styling (no inline styles except rare cases)
- No CSS files except index.css
- Components: PascalCase (.jsx extension)
- Hooks: camelCase starting with 'use' (.js extension)
- Always destructure props in function signature
- Mock data lives in hooks (useHotelData.js etc.)
- Each dashboard role gets its own folder: components/hotel/, components/restaurant/ etc.
- Shared layout (DashboardLayout, Sidebar, Header) used by ALL dashboards

### Future Dashboards (not built yet):
- RestaurantDashboard — components/restaurant/
- TaxiDashboard — components/taxi/
- AdminDashboard — components/admin/
All will use the same DashboardLayout, Sidebar, Header.

### Currently Using Mock Data:
Real Supabase connection will be added later. Only useHotelData.js needs to change when connecting real data — all components stay the same.
