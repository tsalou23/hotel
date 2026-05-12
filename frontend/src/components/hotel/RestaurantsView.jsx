import { useState } from 'react'
import { Search, Star, MapPin, Phone } from 'lucide-react'
import BookingModal from './BookingModal'

// ─── RESTAURANTS VIEW ─────────────────────────────────────────────────────────
// Shows all restaurants in a searchable, filterable table
// Props: restaurants (array) — comes from useHotelData.js
// When connecting Supabase: only useHotelData.js changes, this file stays the same
export default function RestaurantsView({ restaurants, onBookingCreated, hotelId }) {

    // ─── FILTER STATE ─────────────────────────────────────────────────────────
    // search — filters by restaurant name or location
    // cuisineFilter — filters by cuisine type
    // priceFilter — filters by price range
    const [search, setSearch] = useState('')
    const [cuisineFilter, setCuisineFilter] = useState('All')
    const [priceFilter, setPriceFilter] = useState('All')
    const [selectedRestaurant,setSelectedRestaurant]=useState(null)

    // ─── CUISINE OPTIONS ──────────────────────────────────────────────────────
    // Dynamically built from the restaurants data — no hardcoding needed
    // 'All' is added manually at the start
    const cuisines = ['All', ...new Set(restaurants.map(r => r.cuisine))]

    // ─── FILTERING LOGIC ──────────────────────────────────────────────────────
    // All three filters must pass for a restaurant to show
    const filtered = restaurants.filter((r) => {
        const matchesSearch =
            r.restaurant_name.toLowerCase().includes(search.toLowerCase()) ||
            r.location.toLowerCase().includes(search.toLowerCase())
        const matchesCuisine = cuisineFilter === 'All' || r.cuisine === cuisineFilter
        const matchesPrice = priceFilter === 'All' || r.price_range === priceFilter
        return matchesSearch && matchesCuisine && matchesPrice
    })

    return (
        <div className="space-y-6">

            {/* ── SEARCH + PRICE FILTER ROW ─────────────────────────────────────
                max-w-sm limits search input width — change to make it wider
                Add more <select> dropdowns here for additional filters */}
            <div className="flex gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search restaurants or locations..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>

                {/* ── PRICE FILTER DROPDOWN ─────────────────────────────────────
                    Add/remove <option> values to match your price ranges */}
                <select
                    value={priceFilter}
                    onChange={e => setPriceFilter(e.target.value)}
                    className="px-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                    <option value="All">All Prices</option>
                    <option value="€€">€€</option>
                    <option value="€€€">€€€</option>
                    <option value="€€€€">€€€€</option>
                </select>
            </div>

            {/* ── CUISINE FILTER PILLS ──────────────────────────────────────────
                Built dynamically from restaurant data — no manual updates needed
                Active pill: bg-foreground (dark) — change here to update active style
                Inactive pill: bg-card with border */}
            <div className="flex gap-2 flex-wrap">
                {cuisines.map((cuisine) => (
                    <button
                        key={cuisine}
                        onClick={() => setCuisineFilter(cuisine)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${cuisineFilter === cuisine
                            ? 'bg-foreground text-background shadow-lg'
                            : 'bg-card text-muted-foreground border border-border hover:bg-muted'
                            }`}
                    >
                        {cuisine}
                    </button>
                ))}
            </div>

            {/* ── RESTAURANTS TABLE ─────────────────────────────────────────────
                Add/remove columns by editing the headers array AND matching td below */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            {/* ── TABLE HEADERS — add/remove to match columns below */}
                            {['Restaurant', 'Cuisine', 'Location', 'Price', 'Rating', 'Phone', 'Commission', ''].map(h => (
                                <th key={h} className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-6 py-4">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filtered.map((r) => (
                            <tr key={r.id} className="hover:bg-muted/50 transition-colors duration-150">

                                {/* ── RESTAURANT NAME */}
                                <td className="px-6 py-4 text-sm font-semibold text-foreground">{r.restaurant_name}</td>

                                {/* ── CUISINE PILL */}
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium">{r.cuisine}</span>
                                </td>

                                {/* ── LOCATION with icon */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {r.location}
                                    </div>
                                </td>

                                {/* ── PRICE RANGE */}
                                <td className="px-6 py-4 text-sm text-muted-foreground">{r.price_range}</td>

                                {/* ── RATING — amber star badge */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full w-fit">
                                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                        <span className="text-xs font-bold text-amber-700">{r.rating}</span>
                                    </div>
                                </td>

                                {/* ── PHONE with icon */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <Phone className="w-3.5 h-3.5" />
                                        {r.phone}
                                    </div>
                                </td>

                                {/* ── COMMISSION — green accent color */}
                                <td className="px-6 py-4 text-sm font-bold text-accent">€{r.commission_hotel}</td>

                                {/* ── BOOK NOW BUTTON
                                    Add onClick handler here when booking form is ready */}
                                <td className="px-6 py-4">
                                    <button 
                                    onClick={()=>setSelectedRestaurant(r)}
                                    className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors cursor-pointer">
                                        Book Now
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* ── EMPTY STATE — shown when no restaurants match filters */}
                {filtered.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                        No restaurants match your search.
                    </div>
                )}

            </div>
            {selectedRestaurant &&(
                <BookingModal
                restaurant={selectedRestaurant}
                hotelId={hotelId}
                onClose={()=>setSelectedRestaurant(null)}
                onSuccess={()=>{
                    setSelectedRestaurant(null)
                    onBookingCreated()
                }}
                />

            )}
        </div>
    )
}
