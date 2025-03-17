import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import LandingPage from './component/landingPage/LandingPage'
import HeaderLayout from './component/header/headerlayout'
import Dashboard from './component/Dashboard/Dashboard'
import Login from './component/auth/Login'
import ManageResource from './component/Dashboard/Admin/ManageResource'
import Analytics from './component/Dashboard/Admin/Analytics'
import ManageBaseline from './component/Dashboard/Admin/ManageBaseline'
import ManageTrainer from './component/Dashboard/Admin/ManageTrainer'
import AssignTraining from './component/Dashboard/Admin/AssignTraining'

function App() {

  return (
    <Router>
      <Routes>
        <Route element={<HeaderLayout />}>
          <Route path='/' element={<LandingPage />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path="/manage-resources" element={<ManageResource />} />
          <Route path="/manage-trainers" element={<ManageTrainer />} />
          <Route path="/manage-baseline" element={<ManageBaseline />} />
          <Route path="/manage-training" element={<AssignTraining />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
        <Route path='/login' element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App
