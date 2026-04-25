import{ BrowserRouter , Routes,Route,Navigate} from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import HotelDashboard from './pages/hotel/HotelDashboard'
//import HotelDashboard from './pages/hotel/HotelDashboard1' // old inline styles version
import './App.css'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" />}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/hotel" element={
        <ProtectedRoute>
          <HotelDashboard />
        </ProtectedRoute>
        }/>
    </Routes>
    </BrowserRouter>
  )
}

export default App