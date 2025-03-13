import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import LandingPage from './component/landingPage/LandingPage'
import HeaderLayout from './component/header/headerlayout'

function App() {

  return (
    <Router>
      <Routes>
        <Route element={<HeaderLayout />}>
          <Route path='/' element={<LandingPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
