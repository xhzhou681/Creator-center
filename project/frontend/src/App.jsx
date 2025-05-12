import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { AuthProvider, useAuth } from './context/AuthContext'

// Import actual components
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Dashboard from './components/dashboard/Dashboard'

// Placeholder components - to be implemented in future phases
const Videos = () => <div>Videos Management Page</div>
const Analytics = () => <div>Analytics Dashboard</div>
const Trending = () => <div>Trending Content Page</div>
const AIAssistant = () => <div>AI Assistant Page</div>

// Protected route component
const ProtectedRoute = ({ element }) => {
  const { currentUser, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  
  return currentUser ? element : <Login />
}

function AppContent() {
  const { currentUser } = useAuth()
  
  return (
    <div className="app-container">
      {!currentUser && (
        <header className="app-header">
          <h1>Creator Center</h1>
        </header>
      )}
      
      <main className="app-main">
        <Routes>
          <Route path="/" element={currentUser ? <Dashboard /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/videos" element={<ProtectedRoute element={<Videos />} />} />
          <Route path="/analytics" element={<ProtectedRoute element={<Analytics />} />} />
          <Route path="/trending" element={<ProtectedRoute element={<Trending />} />} />
          <Route path="/ai-assistant" element={<ProtectedRoute element={<AIAssistant />} />} />
        </Routes>
      </main>
      
      {!currentUser && (
        <footer className="app-footer">
          <p>© {new Date().getFullYear()} Creator Center</p>
        </footer>
      )}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App
