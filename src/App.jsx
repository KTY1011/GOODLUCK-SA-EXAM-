import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Exam from './components/Exam'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/exam/:examId" element={<Exam />} />
      </Routes>
    </Router>
  )
}

export default App

