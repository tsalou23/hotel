import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import HotelDashboard from './pages/hotel/HotelDashboard'
import ProtectedRoute from './components/common/ProtectedRoute'
import AdminDashboard from './pages/admin/AdminDashboard'
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard'

import './App.css'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/hotel" element={
                    <ProtectedRoute>
                        <HotelDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/restaurant" element={
                    <ProtectedRoute>
                        <RestaurantDashboard/>
                    </ProtectedRoute>
                }/>
                <Route path="/admin" element={
                    <ProtectedRoute>
                        <AdminDashboard/>
                    </ProtectedRoute>
                }/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
