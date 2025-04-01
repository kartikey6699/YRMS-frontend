import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import LandingPage from './component/landingPage/LandingPage'
import HeaderLayout from './component/header/headerlayout'
import Dashboard from './component/Dashboard/Dashboard'
import Login from './component/auth/Login'
import ForgotPasswordOtp from './component/auth/ForgotPasswordOtp'
import ForgotPassword from './component/auth/ForgotPassword'
import VerifyOtp from './component/auth/VerifyOtp'
import ManageResource from './component/Dashboard/Admin/ManageResource'
import Analytics from './component/Dashboard/Admin/Analytics'
import ManageBaseline from './component/Dashboard/Admin/ManageBaseline'
import ManageTrainer from './component/Dashboard/Admin/ManageTrainer'
import AssignTraining from './component/Dashboard/Admin/AssignTraining'
import Opportunities from './component/Dashboard/Admin/Opportunity' // Import Opportunities component
import InternList from './component/Dashboard/Admin/ManageIntern/InternList'
import AddIntern from './component/Dashboard/Admin/ManageIntern/AddIntern'

function App() {

  return (
    <Router>
      <Routes>
        <Route element={<HeaderLayout />}>
          <Route path='/' element={<LandingPage />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path="/manage-resources" element={<ManageResource />} />
          <Route path="/manage-trainers" element={<ManageTrainer />} />
          <Route path="/manage-baseline/:publicId" element={<ManageBaseline />} />
          <Route path="/opportunities/:publicId" element={<Opportunities />} />
          <Route path="/manage-training" element={<AssignTraining />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/interns" element={<InternList />} />
          <Route path='/interns/add' element={<AddIntern />} />
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
