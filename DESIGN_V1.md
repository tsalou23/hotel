# Design V1 - Current Tailwind Design (Backup)

If you want to restore this design, copy each code block back into its file.

---

## Sidebar.jsx
```jsx
import { useNavigate} from 'react-router-dom'
import{ supabase} from '../../supabaseClient'
export default function Sidebar ({ activeView, setActiveView,stats}){
    const navigate=useNavigate()
    const handleLogout = async()=>{
        await supabase.auth.signOut()
        navigate('/login')
    }
    const menuItems=[
        {id:'bookings',label:'My Bookings',icon:'📋' },
        {id: 'restaurants',label:'Restaurants',icon :'🍽️'},
        {id: 'earnings',label:"Earnings",icon:'💰'}
    ]
    return (
        <aside className="w-60 bg-slate-800 text-white flex flex-col h-screen">
            <div className="p-6 border-b border-slate-700">
                <h1 className="text-xl font-bold">Athens Concierge</h1>
                <p className="text-sm text-slate-400">Hotel Portal</p>
            </div>
            <nav className="flex-1 p-4">
                {menuItems.map(item=>(
                    <button
                    key={item.id}
                    onClick={()=>setActiveView(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                        activeView===item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className ="text-sm font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t border-slate-700">
                <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-3 mb-3">
                    <p className ="text-xs text-slate-400">This Month</p>
                    <p className="text-2xl font-bold">€{stats.earnings}</p>
                    <p className="text-xs text-slate-400">{stats.completed} completed</p>
                </div>
                <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
                >
                    Logout
                </button>
            </div>
        </aside>
    )
}
```

---

## Header.jsx
```jsx
export default function Header({ title, subtitle, stats }) {
    return (
      <header className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center" style={{minHeight: '88px'}}>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="text-right">
            <p className="text-xs text-slate-500">Bookings</p>
            <p className="text-xl font-bold text-slate-900">{stats.totalBookings}</p>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Earnings</p>
            <p className="text-xl font-bold text-slate-900">€{stats.earnings}</p>
          </div>
        </div>
      </header>
    )
  }
```

---

## DashboardLayout.jsx
```jsx
import Sidebar from './Sidebar'
import Header from './Header'

export default function DashboardLayout({
    activeView,
    setActiveView,
    title,
    subtitle,
    stats,
    children
}) {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar
                activeView={activeView}
                setActiveView={setActiveView}
                stats={stats}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    title={title}
                    subtitle={subtitle}
                    stats={stats}
                />
                <main className="flex-1 overflow-auto bg-slate-50 p-8 px-10">
                    {children}
                </main>
            </div>
        </div>
    )
}
```

---

## Button.jsx
```jsx
export default function Button({ 
    children ,
    variant ='primary',
    onClick,className =''
}){
    const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-colors'
    const variants ={
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary : 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        danger: 'bg-red-600 text-white hover:bg-red-700'
    }
    return (
        <button
        onClick={onClick}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    )
}
```

---

## Badge.jsx
```jsx
export default function Badge ({children,
    variant='default'
}){
    const variants={
        default: 'bg-gray-100 text-gray-800',
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800'
    }
    return(
        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${variants[variant]}`}>
            {children}
        </span>
    )
}
```

---

## Card.jsx
```jsx
export default function Card ({
    children,
    className=''
}){
    return (
        <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
        {children}
        </div>
    )
}
```

---

## Table.jsx
```jsx
export default function Table ({headers ,children}){
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full border-collapse">
                <thead className="bg-slate-50">
                    <tr>
                        {headers.map((header,index)=>(
                            <th
                            key={index}
                            className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {children}
                </tbody>
            </table>
        </div>
    )
}
```

---

## BookingsView.jsx
```jsx
import Table from '../ui/Table'
import Badge from '../ui/Badge'
export default function BookingsView({ bookings }) {
    const headers = ['Restaurant', 'Guest', 'Date', 'Time', 'Guests', 'Phone', 'Status', 'Commission']

    return (
        <div>
            <div className="flex gap-3 mb-6">
                <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-slate-500 hover:bg-gray-50 transition-colors cursor-pointer">
                    All ({bookings.length})
                </button>
                <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-slate-500 hover:bg-gray-50 transition-colors cursor-pointer">
                    Pending ({bookings.filter(b => b.status === 'pending').length})
                </button>
                <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-slate-500 hover:bg-gray-50 transition-colors cursor-pointer">
                    Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
                </button>
                <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-slate-500 hover:bg-gray-50 transition-colors cursor-pointer">
                    Completed ({bookings.filter(b => b.status === 'completed').length})
                </button>
            </div>
            <Table headers={headers}>
                {bookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                        <td className="px-6 py-5 text-sm font-semibold text-slate-900">{booking.restaurant_name}</td>
                        <td className="px-6 py-5 text-sm text-slate-500">{booking.guest}</td>
                        <td className="px-6 py-5 text-sm text-slate-500">
                            <div>{booking.booking_date}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{booking.booking_time}</div>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-500">{booking.number_of_guests} people</td>
                        <td className="px-6 py-5 text-sm text-slate-500">{booking.phone}</td>
                        <td className="px-6 py-5">
                            <Badge variant={booking.status}>{booking.status}</Badge>
                        </td>
                        <td className="px-6 py-5 text-sm font-bold" style={{color: booking.status === 'completed' ? '#10b981' : '#cbd5e1'}}>
                            {booking.status === 'completed' ? `€${booking.commission_earned}` : '€0.00'}
                        </td>
                    </tr>
                ))}
            </Table>
        </div>
    )
}
```

---

## RestaurantsView.jsx
```jsx
import { useState } from 'react'
import Table from '../ui/Table'
import Button from '../ui/Button'

export default function RestaurantsView({ restaurants }) {
    const [search, setSearch] = useState('')
    const [cuisine, setCuisine] = useState('all')
    const [priceRange, setPriceRange] = useState('all')

    const cuisines = ['all', ...new Set(restaurants.map(r => r.cuisine))]

    const filtered = restaurants.filter(r => {
        const matchesSearch = r.restaurant_name.toLowerCase().includes(search.toLowerCase()) ||
            r.location.toLowerCase().includes(search.toLowerCase())
        const matchesCuisine = cuisine === 'all' || r.cuisine === cuisine
        const matchesPrice = priceRange === 'all' || r.price_range === priceRange
        return matchesSearch && matchesCuisine && matchesPrice
    })

    const headers = ['Restaurant', 'Cuisine', 'Location', 'Price', 'Rating', 'Phone', 'Commission', '']

    return (
        <div>
            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Search by name or location..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm flex-1 max-w-xs"
                />
                <select
                    value={cuisine}
                    onChange={e => setCuisine(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
                >
                    {cuisines.map(c => (
                        <option key={c} value={c}>{c === 'all' ? 'All Cuisines' : c}</option>
                    ))}
                </select>
                <select
                    value={priceRange}
                    onChange={e => setPriceRange(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
                >
                    <option value="all">All Prices</option>
                    <option value="€€">€€</option>
                    <option value="€€€">€€€</option>
                    <option value="€€€€">€€€€</option>
                </select>
            </div>
            <Table headers={headers}>
                {filtered.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                        <td className="px-6 py-5 text-sm font-semibold text-gray-900">{r.restaurant_name}</td>
                        <td className="px-6 py-5">
                            <span className="px-2.5 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-600">{r.cuisine}</span>
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-500">{r.location}</td>
                        <td className="px-6 py-5 text-sm text-gray-500">{r.price_range}</td>
                        <td className="px-6 py-5 text-sm font-semibold text-amber-500">★ {r.rating}</td>
                        <td className="px-6 py-5 text-sm text-gray-500">{r.phone}</td>
                        <td className="px-6 py-5 text-sm font-bold text-green-500">€{r.commission_hotel}</td>
                        <td className="px-6 py-5">
                            <Button variant="primary">Book Now</Button>
                        </td>
                    </tr>
                ))}
            </Table>
        </div>
    )
}
```

---

## EarningsView.jsx
```jsx
import Card from '../ui/Card'
import Table from '../ui/Table'

export default function EarningsView({ stats, bookings }) {
    const headers = ['Restaurant', 'Date', 'Guests', 'Commission']

    return (
        <div>
            <div className="grid grid-cols-3 gap-6 mb-8">
                <Card className="p-7">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Total Earnings</p>
                    <p className="text-5xl font-bold text-slate-900 mb-2 leading-none">€{stats.earnings}</p>
                    <p className="text-sm font-medium text-green-500">↑ {stats.completed} completed bookings</p>
                </Card>
                <Card className="p-7">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Pending Earnings</p>
                    <p className="text-5xl font-bold text-slate-900 mb-2 leading-none">€{(stats.pending + stats.confirmed) * 3}</p>
                    <p className="text-sm text-slate-400">{stats.pending + stats.confirmed} bookings in progress</p>
                </Card>
                <Card className="p-7">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Commission Rate</p>
                    <p className="text-5xl font-bold text-slate-900 mb-2 leading-none">
                        €{stats.completed > 0 ? (stats.earnings / stats.completed).toFixed(2) : '0.00'}
                    </p>
                    <p className="text-sm text-slate-400">per completed booking</p>
                </Card>
            </div>
            <Table headers={headers}>
                {bookings.filter(b => b.status === 'completed').map(b => (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                        <td className="px-6 py-5 text-sm font-semibold text-gray-900">{b.restaurant_name}</td>
                        <td className="px-6 py-5 text-sm text-gray-500">{b.booking_date}</td>
                        <td className="px-6 py-5 text-sm text-gray-500">{b.number_of_guests}</td>
                        <td className="px-6 py-5 text-sm font-bold text-green-500">€{b.commission_earned}</td>
                    </tr>
                ))}
            </Table>
        </div>
    )
}
```
