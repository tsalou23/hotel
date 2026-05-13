import { useState } from 'react'
import { supabase } from '../../supabaseClient'
import { X } from 'lucide-react'

export default function EditCommissionModal({ restaurant, onClose, onSuccess }) {
    const [commissionHotel, setCommissionHotel] = useState(restaurant.commission_hotel)
    const [commissionPlatform, setCommissionPlatform] = useState(restaurant.commission_platform)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase
            .from('restaurants')
            .update({
                commission_hotel: parseFloat(commissionHotel),
                commission_platform: parseFloat(commissionPlatform)
            })
            .eq('id', restaurant.id)

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        setLoading(false)
        onSuccess()
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Edit Commission</h2>
                        <p className="text-sm text-muted-foreground">{restaurant.restaurant_name}</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
                        <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">Hotel Commission (€)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={commissionHotel}
                            onChange={e => setCommissionHotel(e.target.value)}
                            required
                            className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        <p className="text-xs text-muted-foreground">Amount the hotel earns per completed booking</p>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">Platform Commission (€)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={commissionPlatform}
                            onChange={e => setCommissionPlatform(e.target.value)}
                            required
                            className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        <p className="text-xs text-muted-foreground">Amount Athens Concierge keeps per completed booking</p>
                    </div>

                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 bg-secondary text-secondary-foreground text-sm font-medium rounded-xl hover:bg-secondary/80 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
