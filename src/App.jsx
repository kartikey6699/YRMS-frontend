import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import LandingPage from './component/landingPage/LandingPage'
import HeaderLayout from './component/header/headerlayout'
import Dashboard from './component/Dashboard/Dashboard'

function App() {

  return (
    <Router>
      <Routes>
        <Route element={<HeaderLayout />}>
          <Route path='/' element={<LandingPage />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
