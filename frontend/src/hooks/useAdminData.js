import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useAdminData() {
    const [bookings, setBookings] = useState([])
    const [restaurants, setRestaurants] = useState([])
    const [hotels, setHotels] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    async function fetchData() {
        setLoading(true)
        setError(null)

        const [bookingsRes, restaurantsRes, hotelsRes] = await Promise.all([
            supabase.from('restaurant_bookings').select('*, restaurants(restaurant_name)').order('created_at', { ascending: false }),
            supabase.from('restaurants').select('*').order('restaurant_name', { ascending: true }),
            supabase.from('hotels').select('*'),
        ])

        if (bookingsRes.error) { setError(bookingsRes.error.message); setLoading(false); return }
        if (restaurantsRes.error) { setError(restaurantsRes.error.message); setLoading(false); return }
        if (hotelsRes.error) { setError(hotelsRes.error.message); setLoading(false); return }

        const flatBookings = bookingsRes.data.map(b => ({
            ...b,
            restaurant_name: b.restaurants?.restaurant_name ?? 'Unknown'
        }))

        setBookings(flatBookings)
        setRestaurants(restaurantsRes.data)
        setHotels(hotelsRes.data)
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const completed = bookings.filter(b => b.status === 'completed').length
    const confirmed = bookings.filter(b => b.status === 'confirmed').length
    const pending = bookings.filter(b => b.status === 'pending').length
    const hotelEarnings = bookings
        .filter(b => b.status === 'completed')
        .reduce((total, b) => total + b.commission_earned, 0)
    const platformEarnings = bookings
        .filter(b => b.status === 'completed')
        .reduce((total, b) => total + (b.commission_platform_earned || 0), 0)
    const totalRevenue = hotelEarnings + platformEarnings

    const stats = {
        totalBookings: bookings.length,
        completed,
        confirmed,
        pending,
        earnings: hotelEarnings,
        platformEarnings,
        totalRevenue,
        totalRestaurants: restaurants.length,
        totalHotels: hotels.length,
    }

    return { bookings, restaurants, hotels, stats, loading, error, refetch: fetchData }
}
