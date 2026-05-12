import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useRestaurantData() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    async function fetchData() {
        setLoading(true)
        setError(null)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setLoading(false); return }

        const { data: restaurantData } = await supabase
            .from('restaurants')
            .select('id')
            .eq('user_id', user.id)
            .single()
        if (!restaurantData) { setLoading(false); return }
        const { data: bookingsData, error: bookingsError } = await supabase
            .from('restaurant_bookings')
            .select('*')
            .eq('restaurant_id', restaurantData.id)
            .order('created_at', { ascending: false })
        if (bookingsError) {
            setError(bookingsError.message)
            setLoading(false)
            return
        }
        setBookings(bookingsData)
        setLoading(false)

    }
    useEffect(() => {
        fetchData()
    }, [])
    const completed = bookings.filter(b => b.status === 'completed').length
    const confirmed = bookings.filter(b => b.status === 'confirmed').length
    const pending =bookings.filter(b=> b.status==='pending').length
    const earnings=bookings
        .filter(b => b.status === 'completed')
        .reduce((total, b) => total + b.commission_earned, 0)
    const stats = { totalBookings: bookings.length, completed, confirmed, pending, earnings }
    return { bookings, stats, loading, error, refetch: fetchData }
}