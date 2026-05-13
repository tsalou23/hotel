import { useState } from 'react'
import { MapPin, Star } from 'lucide-react'
import EditCommissionModal from './EditCommissionModal'

export default function AdminRestaurantsView({ restaurants, onRefresh }) {
    const [selectedRestaurant, setSelectedRestaurant] = useState(null)

    return (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
                <h3 className="text-sm font-bold text-foreground">All Restaurants</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{restaurants.length} restaurants registered</p>
            </div>
            <table className="w-full">
                <thead>
                    <tr className="border-b border-border">
                        {['Restaurant', 'Cuisine', 'Location', 'Price', 'Rating', 'Commission Hotel', 'Commission Platform', ''].map(h => (
                            <th key={h} className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-6 py-3">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {restaurants.map(r => (
                        <tr key={r.id} className="hover:bg-muted/50 transition-colors">
                            <td className="px-6 py-4 text-sm font-semibold text-foreground">{r.restaurant_name}</td>
                            <td className="px-6 py-4">
                                <span className="px-2.5 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium">{r.cuisine}</span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {r.location}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">{r.price_range}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full w-fit">
                                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                    <span className="text-xs font-bold text-amber-700">{r.rating}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-accent">€{r.commission_hotel}</td>
                            <td className="px-6 py-4 text-sm font-bold text-primary">€{r.commission_platform}</td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => setSelectedRestaurant(r)}
                                    className="px-3 py-1.5 bg-secondary text-secondary-foreground text-xs font-semibold rounded-lg hover:bg-secondary/80 transition-colors cursor-pointer"
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {restaurants.length === 0 && (
                <div className="text-center py-12 text-muted-foreground text-sm">No restaurants yet.</div>
            )}

            {selectedRestaurant && (
                <EditCommissionModal
                    restaurant={selectedRestaurant}
                    onClose={() => setSelectedRestaurant(null)}
                    onSuccess={() => {
                        setSelectedRestaurant(null)
                        onRefresh()
                    }}
                />
            )}
        </div>
    )
}
