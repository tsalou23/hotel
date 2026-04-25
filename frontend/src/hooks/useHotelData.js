// ─── USE HOTEL DATA ───────────────────────────────────────────────────────────
// Provides all data and calculated stats for the hotel dashboard
// Currently uses mock data — when connecting Supabase, ONLY this file changes
// Everything else (BookingsView, RestaurantsView etc.) stays exactly the same
//
// Returns:
//   bookings    — array of booking objects
//   restaurants — array of restaurant objects
//   stats       — { totalBookings, completed, confirmed, pending, earnings }
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useHotelData() {

    // ─── MOCK BOOKINGS ────────────────────────────────────────────────────────
    // Column names MUST match Supabase column names exactly
    // When connecting Supabase: replace this array with a database query
    const [bookings, setBookings] = useState([])
    const [restaurants, setRestaurants] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    async function fetchData() {
        setLoading(true)
        setError(null)

        const { data: bookingsData, error: bookingsError } = await supabase
            .from('restaurant_bookings')
            .select('* ,restaurants(restaurant_name)')
            .order('created_at', { ascending: false })
        if (bookingsError) {
            setError(bookingsError.message)
            setLoading(false)
            return
        }
        const flatBookings = bookingsData.map(b => ({
            ...b,
            restaurant_name: b.restaurants?.restaurant_name ?? 'Unkown'
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

  

    // ─── MOCK RESTAURANTS ─────────────────────────────────────────────────────
    // Column names MUST match Supabase column names exactly
    // When connecting Supabase: replace this array with a database query
  

    // ─── STATS CALCULATIONS ───────────────────────────────────────────────────
    const completed = bookings.filter(b => b.status === 'completed').length
    const confirmed = bookings.filter(b => b.status === 'confirmed').length
    const pending = bookings.filter(b => b.status === 'pending').length

    const earnings = bookings
        .filter(b => b.status === 'completed')
        .reduce((total, booking) => total + booking.commission_earned, 0)

    const stats = {
        totalBookings: bookings.length,
        completed,
        confirmed,
        pending,
        earnings
    }

    return { bookings, restaurants, stats ,loading,error,refetch:fetchData}
}
