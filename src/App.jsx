import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import LandingPage from './component/landingPage/LandingPage'
import HeaderLayout from './component/header/headerlayout'
import Dashboard from './component/Dashboard/Dashboard'
import Login from './component/auth/Login'
import ForgotPasswordOtp from './component/auth/ForgotPasswordOtp'
import ForgotPassword from './component/auth/ForgotPassword'
import VerifyOtp from './component/auth/VerifyOtp'

function App() {

  return (
    <Router>
      <Routes>
        <Route element={<HeaderLayout />}>
          <Route path='/' element={<LandingPage />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/forgotpasswordotp' element={<ForgotPasswordOtp />} />
        <Route path='/verifyotp' element={<VerifyOtp />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
      </Routes>
    </Router>
  )
}

export default App
