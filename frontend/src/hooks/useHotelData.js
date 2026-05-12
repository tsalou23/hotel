import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useHotelData() {
    const [bookings, setBookings] = useState([])
    const [restaurants, setRestaurants] = useState([])
    const [hotelId, setHotelId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    async function fetchData() {
        setLoading(true)
        setError(null)

        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setLoading(false); return }

        // Get hotel record for this user
        const { data: hotelData } = await supabase
            .from('hotels')
            .select('id')
            .eq('user_id', user.id)
            .single()

        if (hotelData) setHotelId(hotelData.id)

        // Fetch bookings for this hotel only
        const { data: bookingsData, error: bookingsError } = await supabase
            .from('restaurant_bookings')
            .select('*, restaurants(restaurant_name)')
            .eq('hotel_id', hotelData?.id)
            .order('created_at', { ascending: false })

        if (bookingsError) {
            setError(bookingsError.message)
            setLoading(false)
            return
        }

        const flatBookings = bookingsData.map(b => ({
            ...b,
            restaurant_name: b.restaurants?.restaurant_name ?? 'Unknown'
        }))

        const { data: restaurantsData, error: restaurantsError } = await supabase
            .from('restaurants')
            .select('*')
            .order('restaurant_name', { ascending: true })

        if (restaurantsError) {
            setError(restaurantsError.message)
            setLoading(false)
            return
        }

        setBookings(flatBookings)
        setRestaurants(restaurantsData)
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const completed = bookings.filter(b => b.status === 'completed').length
    const confirmed = bookings.filter(b => b.status === 'confirmed').length
    const pending = bookings.filter(b => b.status === 'pending').length
    const earnings = bookings
        .filter(b => b.status === 'completed')
        .reduce((total, booking) => total + booking.commission_earned, 0)

    const stats = { totalBookings: bookings.length, completed, confirmed, pending, earnings }

    return { bookings, restaurants, stats, loading, error, refetch: fetchData, hotelId }
}
