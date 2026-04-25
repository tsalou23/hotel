# Athens Concierge Platform - Complete Project Documentation

## TABLE OF CONTENTS
1. Project Overview
2. Business Model
3. Tech Stack
4. Database Structure
5. Project File Structure
6. Component Architecture
7. Design System
8. Current Status
9. File by File Documentation
10. Next Steps
11. Future Features
12. Developer Notes

---

## 1. PROJECT OVERVIEW

**Name:** Athens Concierge
**Type:** Commission-based booking platform
**Purpose:** Connects hotels with restaurants (and taxis) in Athens, Greece

### How It Works:
- Hotel concierges use the platform to book restaurants for their tourists
- Restaurants receive booking requests, accept/reject, and mark as completed
- Hotels earn €3 commission per completed booking
- Restaurants pay €4 per completed booking (€3 to hotel, €1 to platform)
- Payments handled OFFLINE (cash/bank transfer) - platform only tracks data

### User Roles:
1. **Hotel** - Browse restaurants, make bookings, track earnings
2. **Restaurant** - Manage incoming requests, confirm/complete bookings
3. **Taxi** - Manage ride requests (future)
4. **Admin** - Oversee everything, generate reports

---

## 2. BUSINESS MODEL

### Commission Flow:
```
Tourist wants restaurant
       ↓
Hotel concierge books via platform
       ↓
Restaurant confirms booking
       ↓
Booking completed
       ↓
Restaurant pays €4
├── Hotel receives €3
└── Platform keeps €1
```

### Key Business Rules:
- Commission is FLEXIBLE per restaurant (not fixed €3 for all)
- Each restaurant has its own commission_hotel and commission_platform rates
- commission_earned is stored in each booking (snapshot at time of booking)
- This is important because restaurant rates might change later
- Payments are offline - platform only tracks who owes what

---

## 3. TECH STACK

### Frontend:
- **React 19** - UI framework
- **Vite 7** - Build tool (fast dev server with HMR)
- **React Router v7** - Client-side routing
- **Tailwind CSS v4** - Styling (utility-first)
- **Supabase JS v2** - Database client

### Backend:
- **Supabase** - PostgreSQL database + Authentication
- Project URL: https://zpuppghpoyzdjgreiqke.supabase.co

### Important Tailwind v4 Note:
Tailwind v4 does NOT use tailwind.config.js or npx tailwindcss init
Setup is just ONE line in index.css:
```css
@import "tailwindcss";
```

---

## 4. DATABASE STRUCTURE

### Tables in Supabase:

#### auth.users (Supabase managed)
- Handles all authentication
- Each user has a role (hotel/restaurant/taxi/admin)

#### restaurants
```
id                  uuid (primary key)
restaurant_name     text
cuisine             text
price_range         text (€€, €€€, €€€€)
location            text
phone               text
rating              numeric (3,1) e.g. 4.8
commission_hotel    numeric (10,2) default 3.00
commission_platform numeric (10,2) default 1.00
user_id             uuid (foreign key to auth.users)
created_at          timestamp with time zone
```

#### restaurant_bookings
```
id                  uuid (primary key)
hotel_id            uuid (foreign key)
restaurant_id       uuid (foreign key)
booking_date        date
booking_time        time without time zone
number_of_guests    integer
status              text (pending/confirmed/completed)
commission_earned   numeric (10,2) default 0.00
notes               text
created_at          timestamp with time zone
```

#### taxis (structure similar to restaurants - not built yet)
#### taxi_bookings (structure similar to restaurant_bookings - not built yet)
#### hotels (basic hotel info - not fully built yet)

### Important Column Name Notes:
These column names MUST match in code (mock data uses same names):
- restaurant_name (NOT name)
- price_range (NOT price)
- booking_date (NOT date)
- booking_time (NOT time)
- number_of_guests (NOT pax or guests)
- commission_earned (in bookings)
- commission_hotel (in restaurants)
- commission_platform (in restaurants)

---

## 5. PROJECT FILE STRUCTURE

```
hotel/
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── bookings/          (empty - reserved for future)
    │   │   ├── common/
    │   │   │   └── ProtectedRoute.jsx
    │   │   ├── hotel/
    │   │   │   ├── BookingsView.jsx      ✅ DONE
    │   │   │   ├── RestaurantsView.jsx   ❌ NOT STARTED
    │   │   │   └── EarningsView.jsx      ❌ NOT STARTED
    │   │   ├── layout/
    │   │   │   ├── DashboardLayout.jsx   ✅ DONE
    │   │   │   ├── Header.jsx            ✅ DONE
    │   │   │   └── Sidebar.jsx           ✅ DONE
    │   │   └── ui/
    │   │       ├── Badge.jsx             ✅ DONE
    │   │       ├── Button.jsx            ✅ DONE
    │   │       ├── Card.jsx              ✅ DONE
    │   │       └── Table.jsx             ✅ DONE
    │   ├── contexts/
    │   │   └── AuthContext.jsx
    │   ├── hooks/
    │   │   ├── useDashboard.js           ✅ DONE
    │   │   └── useHotelData.js           ✅ DONE
    │   ├── pages/
    │   │   ├── admin/                    ❌ NOT STARTED
    │   │   ├── auth/
    │   │   │   └── LoginPage.jsx         ✅ DONE
    │   │   ├── hotel/
    │   │   │   ├── HotelDashboard.jsx    ⚠️ NEEDS UPDATING
    │   │   │   └── HotelDashboard2.jsx   (test file - can delete)
    │   │   ├── restaurant/               ❌ NOT STARTED
    │   │   └── taxi/                     ❌ NOT STARTED
    │   ├── services/                     (empty - for Supabase queries later)
    │   ├── utils/                        (empty - for helper functions later)
    │   ├── App.css
    │   ├── App.jsx                       ✅ DONE
    │   ├── index.css                     ✅ DONE (has @import "tailwindcss")
    │   ├── main.jsx
    │   └── supabaseClient.js             ✅ DONE
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── README.md
    └── vite.config.js
```

---

## 6. COMPONENT ARCHITECTURE

### Philosophy:
Professional Option B approach - separated concerns:

```
UI Components (building blocks - used everywhere)
├── Button.jsx    - Reusable button with variants
├── Badge.jsx     - Status indicators (pending/confirmed/completed)
├── Card.jsx      - White card container
└── Table.jsx     - Reusable table with headers

Layout Components (structure/skeleton)
├── Sidebar.jsx         - Left navigation
├── Header.jsx          - Top bar with title and stats
└── DashboardLayout.jsx - Combines Sidebar + Header + Main area

Hotel View Components (content - uses UI components)
├── BookingsView.jsx     - Shows bookings table
├── RestaurantsView.jsx  - Shows restaurants list
└── EarningsView.jsx     - Shows earnings stats

Hooks (reusable logic)
├── useDashboard.js  - Shared activeView state (used by ALL dashboards)
└── useHotelData.js  - Hotel specific data + calculations

Pages (top level - connects everything)
└── HotelDashboard.jsx - Brain: uses hooks + passes data to components
```

### Component Hierarchy:
```
HotelDashboard (brain)
└── DashboardLayout (structure)
    ├── Sidebar (navigation)
    ├── Header (top bar)
    └── Main area
        └── BookingsView / RestaurantsView / EarningsView (content)
            ├── Table (ui)
            ├── Badge (ui)
            ├── Button (ui)
            └── Card (ui)
```

### How Props Flow:
```
HotelDashboard CREATES:
- activeView, setActiveView (from useDashboard hook)
- bookings, restaurants, stats (from useHotelData hook)

HotelDashboard PASSES TO DashboardLayout:
- activeView, setActiveView, title, subtitle, stats, children

DashboardLayout PASSES TO Sidebar:
- activeView, setActiveView, stats

DashboardLayout PASSES TO Header:
- title, subtitle, stats

DashboardLayout PASSES TO Main (via children):
- BookingsView, RestaurantsView, or EarningsView
```

### Shared Layout Strategy:
ALL dashboards (hotel, restaurant, taxi, admin) use the SAME DashboardLayout.
Each dashboard sends its own:
- menuItems (different navigation per role)
- data (different content per role)
- stats (different metrics per role)

This means: change Sidebar design once → ALL dashboards update!

---

## 7. DESIGN SYSTEM

### Colors:
- Sidebar background: #1e293b (slate-800)
- Active nav button: #2563eb (blue-600)
- Page background: #f8fafc (gray-50)
- Card background: white
- Border color: #e2e8f0 (gray-200)
- Primary text: #0f172a (slate-900)
- Secondary text: #475569 (slate-600)
- Muted text: #94a3b8 (slate-400)

### Status Badge Colors:
- Pending: bg-yellow-100 text-yellow-800
- Confirmed: bg-blue-100 text-blue-800
- Completed: bg-green-100 text-green-800

### Typography:
- Font: system-ui, -apple-system (system font stack)
- Page title: text-2xl font-bold
- Section title: text-xl font-semibold
- Table header: text-xs font-semibold uppercase tracking-wider
- Body text: text-sm or text-base

### Layout:
- Sidebar width: w-60 (240px)
- Content padding: p-8 (32px)
- Card border radius: rounded-lg (8px) or rounded-xl (12px)
- Gap between elements: gap-4 or gap-6

### Design Inspiration:
- Stripe Dashboard (data/earnings display)
- Booking.com (reservation management)
- Airbnb Host Dashboard (clean professional look)

### Design Preferences (user stated):
- Sidebar navigation ✅
- List/table view for restaurants (NOT cards) ✅
- Dense/efficient layout (more info on screen) ✅
- Booking management as primary focus ✅
- Professional blue theme ✅
- NO: cluttered layouts, too much whitespace, playful designs

---

## 8. CURRENT STATUS

### What's Working:
✅ Authentication (login/logout via Supabase)
✅ Protected routes
✅ Login page
✅ Old HotelDashboard (inline styles version - currently showing)
✅ Tailwind CSS configured and working
✅ All UI components (Button, Badge, Card, Table)
✅ All layout components (Sidebar, Header, DashboardLayout)
✅ useDashboard hook
✅ useHotelData hook with mock data
✅ BookingsView (almost done)

### What's In Progress:
⚠️ BookingsView - filter button text capitalization fix needed
⚠️ HotelDashboard.jsx - needs to be updated to use new components

### What's Not Started:
❌ RestaurantsView.jsx
❌ EarningsView.jsx
❌ Restaurant dashboard
❌ Taxi dashboard
❌ Admin dashboard
❌ Connecting real Supabase data (currently using mock data)
❌ Booking form (actual booking functionality)

---

## 9. FILE BY FILE DOCUMENTATION

### App.jsx
```jsx
// Routes:
/ → redirects to /login
/login → LoginPage
/hotel → HotelDashboard (protected)
```

### supabaseClient.js
```js
// Supabase connection
URL: https://zpuppghpoyzdjgreiqke.supabase.co
// Uses anon key for client-side auth
```

### index.css
```css
@import "tailwindcss";
// Tailwind v4 - this is ALL that's needed
```

### components/ui/Button.jsx
```jsx
// Props: children, variant ('primary'|'secondary'|'danger'), onClick, className
// Usage: <Button variant="primary" onClick={fn}>Click me</Button>
```

### components/ui/Badge.jsx
```jsx
// Props: children, variant ('default'|'pending'|'confirmed'|'completed')
// Usage: <Badge variant="pending">Pending</Badge>
```

### components/ui/Card.jsx
```jsx
// Props: children, className (extra classes)
// Usage: <Card className="p-6">Content here</Card>
```

### components/ui/Table.jsx
```jsx
// Props: headers (array of strings), children (table rows)
// Usage:
// <Table headers={['Name', 'Status']}>
//   <tr><td>John</td><td>Active</td></tr>
// </Table>
```

### components/layout/Sidebar.jsx
```jsx
// Props: activeView, setActiveView, stats
// stats shape: { earnings: number, completed: number }
// Has hardcoded menuItems for hotel (needs to be made flexible for other dashboards)
// Has logout functionality built in
```

### components/layout/Header.jsx
```jsx
// Props: title, subtitle, stats
// stats shape: { totalBookings: number, earnings: number }
// Shows page title + quick stats on right
```

### components/layout/DashboardLayout.jsx
```jsx
// Props: activeView, setActiveView, title, subtitle, stats, children
// Combines Sidebar (left) + Header (top) + Main content area
// children = the view component (BookingsView etc.)
// Fixed layout: flex h-screen overflow-hidden (no layout shifts!)
```

### hooks/useDashboard.js
```js
// Usage: const { activeView, setActiveView } = useDashboard('bookings')
// Parameter: defaultView (starting page)
// Returns: activeView (current page), setActiveView (function to change page)
// Used by ALL dashboards
```

### hooks/useHotelData.js
```js
// Usage: const { bookings, restaurants, stats } = useHotelData()
// Returns mock data that matches Supabase column names exactly
// stats shape: { totalBookings, completed, confirmed, pending, earnings }
// earnings calculated from commission_earned per booking (flexible per restaurant)
// When connecting Supabase: only this file changes, everything else stays same
```

### components/hotel/BookingsView.jsx
```jsx
// Props: bookings (array)
// Shows filter buttons (All/Pending/Confirmed/Completed)
// Uses Table component for layout
// Uses Badge component for status
// Column names match Supabase: restaurant_name, booking_date, booking_time, number_of_guests
```

### pages/hotel/HotelDashboard.jsx
```jsx
// CURRENTLY: Old version with inline styles (working but not using new components)
// NEEDS TO BE: Updated to use new component architecture
// Final version should be:
//
// import { useDashboard } from '../../hooks/useDashboard'
// import { useHotelData } from '../../hooks/useHotelData'
// import DashboardLayout from '../../components/layout/DashboardLayout'
// import BookingsView from '../../components/hotel/BookingsView'
// import RestaurantsView from '../../components/hotel/RestaurantsView'
// import EarningsView from '../../components/hotel/EarningsView'
//
// export default function HotelDashboard() {
//   const { activeView, setActiveView } = useDashboard('bookings')
//   const { bookings, restaurants, stats } = useHotelData()
//
//   const titles = {
//     bookings: { title: 'My Bookings', subtitle: 'Manage all reservations' },
//     restaurants: { title: 'Browse Restaurants', subtitle: 'Find restaurants for guests' },
//     earnings: { title: 'Earnings Overview', subtitle: 'Track commission earnings' },
//   }
//
//   return (
//     <DashboardLayout
//       activeView={activeView}
//       setActiveView={setActiveView}
//       title={titles[activeView].title}
//       subtitle={titles[activeView].subtitle}
//       stats={stats}
//     >
//       {activeView === 'bookings' && <BookingsView bookings={bookings} />}
//       {activeView === 'restaurants' && <RestaurantsView restaurants={restaurants} />}
//       {activeView === 'earnings' && <EarningsView stats={stats} bookings={bookings} />}
//     </DashboardLayout>
//   )
// }
```

---

## 10. NEXT STEPS (In Order)

### Step 1: Fix BookingsView.jsx
- Capitalize filter button text (Pending, Confirmed, Completed)

### Step 2: Create RestaurantsView.jsx
File: /frontend/src/components/hotel/RestaurantsView.jsx
- Search input (filter by name or location)
- Cuisine dropdown filter
- Price range dropdown filter
- Table showing: restaurant_name, cuisine, location, price_range, rating, phone, commission_hotel
- "Book Now" button per row
- Uses Table component and Button component

### Step 3: Create EarningsView.jsx
File: /frontend/src/components/hotel/EarningsView.jsx
- 3 stat cards: Total Earnings, Pending Earnings, Commission Rate
- Uses Card component
- Breakdown table by restaurant
- Uses Table component

### Step 4: Update HotelDashboard.jsx
- Replace old inline styles version
- Use useDashboard hook
- Use useHotelData hook
- Use DashboardLayout
- Render correct view based on activeView

### Step 5: Make Sidebar flexible
- Accept menuItems as prop (not hardcoded)
- So Restaurant/Taxi/Admin dashboards can have different menu items

### Step 6: Connect Supabase
- Update useHotelData.js to fetch from Supabase
- Add loading states
- Add error handling

### Step 7: Build other dashboards
- RestaurantDashboard
- TaxiDashboard
- AdminDashboard

---

## 11. FUTURE FEATURES

### Booking Form:
- Modal or page for making actual bookings
- Select restaurant, date, time, number of guests
- Add notes/special requests
- Submit creates record in restaurant_bookings table

### Restaurant Dashboard:
- View incoming booking requests
- Accept/reject bookings
- Mark bookings as completed
- View earnings

### Admin Dashboard:
- Overview of all bookings
- All hotels, restaurants, taxis
- Commission reports
- User management

### Notifications:
- Real-time updates when booking status changes
- Supabase Realtime feature

### Restaurant Profiles:
- Photos, menu, description
- Registration form for restaurants to fill their own data

---

## 12. DEVELOPER NOTES

### Styling Rules:
- Use ONLY Tailwind CSS classes (no inline styles)
- No CSS files (except index.css for Tailwind import)
- No CSS modules
- Extra classes via className prop on components

### Naming Conventions:
- Components: PascalCase (BookingsView.jsx)
- Hooks: camelCase starting with 'use' (useDashboard.js)
- Files with JSX: .jsx extension
- Files without JSX (hooks, utils): .js extension

### Mock Data Rules:
- All mock data column names MUST match Supabase column names exactly
- This makes Supabase integration seamless later
- Mock data lives in useHotelData.js (and future useRestaurantData.js etc.)

### Props Pattern:
- Always destructure props in function signature
- Always provide default values where appropriate
- children prop is automatic (React handles it)
- className prop for extra styling flexibility

### Key React Concepts Used:
- useState - for activeView state
- Custom hooks - for reusable logic
- Props - for passing data between components
- children prop - for component composition
- Conditional rendering - {condition && <Component />}
- Array.map() - for rendering lists
- Array.filter() - for filtering data

### How to Switch Dashboard Designs (for testing):
In App.jsx change:
```jsx
import HotelDashboard from './pages/hotel/HotelDashboard'
// to:
import HotelDashboard from './pages/hotel/HotelDashboard2'
```

### Running the Project:
```bash
cd /Users/giorgostsaloukidis/Desktop/hotel/frontend
npm run dev
# Opens at http://localhost:5173
```

### Supabase Project:
- Was paused (free tier pauses after 1 week inactivity)
- Resume from Supabase dashboard when needed
- Data is safe for 90 days after pause

---

## IMPORTANT REMINDERS FOR NEXT CHAT SESSION:

1. Read this entire README before doing anything
2. Check current file states before making changes
3. The user is LEARNING - explain everything step by step
4. User prefers: professional approach, best practices, understanding WHY
5. Always verify files after user says "done" using file read tool
6. User makes typos - always check files before moving on
7. The old HotelDashboard.jsx (inline styles) is still the active one
8. New component architecture is built but not connected yet
9. Next immediate task: Fix BookingsView filter buttons, then create RestaurantsView
10. User wants to see the design working before connecting Supabase

---

*Last updated: Current session*
*Project path: /Users/giorgostsaloukidis/Desktop/hotel/frontend*
