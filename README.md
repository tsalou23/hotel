# Athens Concierge Platform

## TABLE OF CONTENTS
1. Project Overview
2. Business Model
3. Tech Stack
4. Database Structure
5. Project File Structure
6. Component Architecture
7. Design System
8. Current Status
9. User Roles & Login
10. Future Features
11. Developer Notes

---

## 1. PROJECT OVERVIEW

**Name:** Athens Concierge
**Type:** Commission-based booking platform
**Purpose:** Connects hotels with restaurants in Athens, Greece

### How It Works:
- Hotel concierges use the platform to book restaurants for their tourists
- Restaurants receive booking requests, confirm/reject, and mark as completed
- Hotels earn commission per completed booking
- Restaurants pay commission per completed booking
- Payments handled OFFLINE (cash/bank transfer) — platform only tracks data

### User Roles:
1. **Hotel** — Browse restaurants, make bookings, track earnings
2. **Restaurant** — Manage incoming requests, confirm/complete bookings
3. **Admin** — Oversee everything, view all bookings and restaurants
4. **Taxi** — Future feature

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
Restaurant pays commission
├── Hotel receives commission_hotel (e.g. €3)
└── Platform keeps commission_platform (e.g. €1)
```

### Key Business Rules:
- Commission is FLEXIBLE per restaurant (not fixed for all)
- Each restaurant has its own commission_hotel and commission_platform rates
- commission_earned is stored in each booking (snapshot at time of booking)
- Payments are offline — platform only tracks who owes what

---

## 3. TECH STACK

### Frontend:
- **React 19** — UI framework
- **Vite 7** — Build tool
- **React Router v7** — Client-side routing
- **Tailwind CSS v3** — Styling (with custom design system via CSS variables)
- **Supabase JS v2** — Database client
- **lucide-react** — Icons

### Backend:
- **Supabase** — PostgreSQL database + Authentication
- Project URL: https://zpuppghpoyzdjgreiqke.supabase.co

### Tailwind v3 Setup:
- Requires `tailwind.config.js` with custom color system
- CSS variables defined in `index.css`
- PostCSS configured in `postcss.config.js`
- `@tailwindcss/vite` NOT used (v3 uses PostCSS instead)

### Design System:
Uses CSS variables mapped to Tailwind classes:
- `bg-background` — page background
- `bg-card` — white card background
- `bg-primary` — blue (#3b82f6)
- `bg-sidebar` — dark sidebar background
- `text-foreground` — primary text
- `text-muted-foreground` — secondary text
- `text-accent` — green (for earnings/success)
- `border-border` — border color

---

## 4. DATABASE STRUCTURE

### Tables in Supabase:

#### auth.users (Supabase managed)
- Handles all authentication
- Role is determined by which table the user_id appears in

#### hotels
```
id          uuid (primary key)
user_id     uuid (foreign key to auth.users)
hotel_name  text
created_at  timestamp
```

#### restaurants
```
id                  uuid (primary key)
restaurant_name     text
cuisine             text
price_range         text (€€, €€€, €€€€)
location            text
phone               text
rating              numeric
commission_hotel    numeric default 3.00
commission_platform numeric default 1.00
user_id             uuid (foreign key to auth.users)
created_at          timestamp
```

#### restaurant_bookings
```
id                  uuid (primary key)
hotel_id            uuid (foreign key to hotels.id)
restaurant_id       uuid (foreign key to restaurants.id)
booking_date        date
booking_time        time
number_of_guests    integer
status              text (pending/confirmed/completed/cancelled)
commission_earned   numeric default 0.00
notes               text
guest               text
phone               text
created_at          timestamp
```

### RLS Policies:
```sql
-- restaurants: allow read
CREATE POLICY "allow read restaurants" ON restaurants FOR SELECT USING (true);

-- restaurant_bookings: allow read, insert, update
CREATE POLICY "allow read restaurant_bookings" ON restaurant_bookings FOR SELECT USING (true);
CREATE POLICY "allow insert restaurant_bookings" ON restaurant_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "allow update restaurant_bookings" ON restaurant_bookings FOR UPDATE USING (true);

-- hotels: allow read
CREATE POLICY "allow read hotels" ON hotels FOR SELECT USING (true);
```

### Important Column Name Notes:
- restaurant_name (NOT name)
- price_range (NOT price)
- booking_date (NOT date)
- booking_time (NOT time)
- number_of_guests (NOT pax or guests)
- commission_earned (in bookings)
- commission_hotel (in restaurants)

---

## 5. PROJECT FILE STRUCTURE

```
hotel/
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── admin/
    │   │   │   ├── AdminRestaurantsView.jsx  ✅
    │   │   │   └── OverviewView.jsx          ✅
    │   │   ├── common/
    │   │   │   └── ProtectedRoute.jsx        ✅
    │   │   ├── hotel/
    │   │   │   ├── BookingModal.jsx          ✅
    │   │   │   ├── BookingsView.jsx          ✅
    │   │   │   ├── EarningsView.jsx          ✅
    │   │   │   ├── RestaurantsView.jsx       ✅
    │   │   │   ├── StatCard.jsx              ✅
    │   │   │   └── StatusBadge.jsx           ✅
    │   │   ├── layout/
    │   │   │   ├── DashboardLayout.jsx       ✅
    │   │   │   ├── Header.jsx                ✅
    │   │   │   └── Sidebar.jsx               ✅
    │   │   └── restaurant/
    │   │       └── IncomingBookingsView.jsx  ✅
    │   ├── contexts/
    │   │   └── AuthContext.jsx               ✅
    │   ├── hooks/
    │   │   ├── useAdminData.js               ✅
    │   │   ├── useDashboard.js               ✅
    │   │   ├── useHotelData.js               ✅
    │   │   └── useRestaurantData.js          ✅
    │   ├── lib/
    │   │   └── utils.js                      ✅ (cn() helper)
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   └── AdminDashboard.jsx        ✅
    │   │   ├── auth/
    │   │   │   └── LoginPage.jsx             ✅
    │   │   ├── hotel/
    │   │   │   └── HotelDashboard.jsx        ✅
    │   │   ├── restaurant/
    │   │   │   └── RestaurantDashboard.jsx   ✅
    │   │   └── taxi/                         ❌ future
    │   ├── App.css
    │   ├── App.jsx                           ✅
    │   ├── index.css                         ✅
    │   ├── main.jsx                          ✅
    │   └── supabaseClient.js                 ✅
    ├── .env                                  ✅ (not in git)
    ├── .gitignore
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 6. COMPONENT ARCHITECTURE

```
Layout (shared by ALL dashboards)
├── DashboardLayout.jsx  — flex layout: sidebar + header + main
├── Sidebar.jsx          — accepts menuItems prop (flexible per role)
└── Header.jsx           — title, subtitle, stats pills

UI Components (shared by ALL dashboards)
├── StatusBadge.jsx  — colored pill for booking status
└── StatCard.jsx     — stat card with icon, label, value

Hotel Components
├── BookingsView.jsx     — filterable bookings table
├── RestaurantsView.jsx  — searchable restaurants table + Book Now
├── EarningsView.jsx     — stat cards + completed bookings table
└── BookingModal.jsx     — modal form to create a booking

Restaurant Components
└── IncomingBookingsView.jsx  — bookings table with Confirm/Complete/Reject

Admin Components
├── OverviewView.jsx          — platform stats + recent bookings
└── AdminRestaurantsView.jsx  — all restaurants table

Hooks
├── useDashboard.js      — manages activeView, persists in URL
├── useHotelData.js      — hotel bookings + restaurants from Supabase
├── useRestaurantData.js — restaurant bookings from Supabase
└── useAdminData.js      — all bookings + restaurants + hotels

Pages (brains — connect hooks + layout + views)
├── HotelDashboard.jsx
├── RestaurantDashboard.jsx
└── AdminDashboard.jsx
```

### Props Flow:
```
Dashboard (brain)
    → passes menuItems, stats, activeView to DashboardLayout
        → passes menuItems, stats to Sidebar
        → passes title, subtitle, stats to Header
        → renders view as children
            → view receives data as props
```

---

## 7. DESIGN SYSTEM

### Font: Inter (Google Fonts)

### Colors (CSS variables in index.css):
- Background: `hsl(210 20% 98%)` — very light blue-grey
- Card: `hsl(0 0% 100%)` — white
- Primary: `hsl(217 91% 60%)` — blue
- Accent: `hsl(160 84% 39%)` — green (earnings/success)
- Sidebar: `hsl(215 28% 17%)` — dark blue-grey
- Destructive: `hsl(0 84% 60%)` — red

### Border Radius:
- `rounded-xl` = 12px
- `rounded-2xl` = 16px (cards, modals)
- `rounded-full` = pill shape (badges, filter tabs)

---

## 8. CURRENT STATUS

### What's Working:
✅ Authentication (login/logout via Supabase)
✅ Role-based login redirect (hotel → /hotel, restaurant → /restaurant, admin → /admin)
✅ Protected routes
✅ Hotel dashboard — bookings, restaurants, earnings, booking form
✅ Restaurant dashboard — incoming bookings, confirm/complete/reject, earnings
✅ Admin dashboard — overview, all restaurants, earnings
✅ Real Supabase data (no mock data)
✅ Dynamic hotel_id (not hardcoded)
✅ Flexible sidebar (menuItems as prop)
✅ Booking form creates real bookings in Supabase
✅ Auto-refresh after booking created or status updated

### What's Not Started:
❌ Taxi dashboard
❌ Registration flow (hotels/restaurants sign up themselves)
❌ Better loading states (spinners)
❌ Real-time notifications (Supabase Realtime)
❌ Restaurant profiles (photos, menu, description)

---

## 9. USER ROLES & LOGIN

### Test Credentials:
- `test@hotel.com` / `test1234` → Hotel dashboard
- `test@restaurant.com` / `test1234` → Restaurant dashboard (Taverna Plaka)
- `test@admin.com` / `test1234` → Admin dashboard

### Role Detection Logic (LoginPage.jsx):
After login, check which table the user belongs to:
1. Found in `hotels` table → redirect to `/hotel`
2. Found in `restaurants` table → redirect to `/restaurant`
3. Neither → redirect to `/admin`

---

## 10. FUTURE FEATURES

### Registration Flow:
- Hotels sign up → creates auth user + hotels record
- Restaurants sign up → creates auth user + restaurants record

### Taxi Dashboard:
- Same pattern as restaurant dashboard
- `taxis` and `taxi_bookings` tables already exist in Supabase

### Real-time Notifications:
- Supabase Realtime — when booking status changes, notify hotel instantly

### Better Security (RLS):
- Hotels can only see their own bookings
- Restaurants can only see their own bookings
- Admin can see everything

---

## 11. DEVELOPER NOTES

### Running the Project:
```bash
cd /Users/giorgostsaloukidis/Desktop/hotel/frontend
npm run dev
# Opens at http://localhost:5173
```

### Environment Variables (.env):
```
VITE_SUPABASE_URL=https://zpuppghpoyzdjgreiqke.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Git:
```bash
cd /Users/giorgostsaloukidis/Desktop/hotel
git add .
git commit -m "your message"
git push
```

### Supabase:
- Free tier pauses after 1 week inactivity
- Resume from Supabase dashboard
- Data is safe for 90 days after pause

### Adding a New Dashboard Role:
1. Create `hooks/useXxxData.js`
2. Create `components/xxx/` folder with views
3. Create `pages/xxx/XxxDashboard.jsx`
4. Add route in `App.jsx`
5. Add redirect in `LoginPage.jsx`

### Naming Conventions:
- Components: PascalCase `.jsx`
- Hooks: camelCase starting with `use` `.js`
- Utils: camelCase `.js`

*Last updated: Current session*
*Project path: /Users/giorgostsaloukidis/Desktop/hotel/frontend*
