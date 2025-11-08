import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import NightSky3DPage from './pages/NightSky3D'

const App = () => {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', position: 'relative' }}>
        <nav style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          display: 'flex',
          gap: '1rem'
        }}>
          <Link 
            to="/" 
            style={{
              color: '#e0f2fe',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '8px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              backdropFilter: 'blur(10px)'
            }}
          >
            2D View
          </Link>
          <Link 
            to="/3d" 
            style={{
              color: '#e0f2fe',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '8px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              backdropFilter: 'blur(10px)'
            }}
          >
            3D View
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/3d" element={<NightSky3DPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

