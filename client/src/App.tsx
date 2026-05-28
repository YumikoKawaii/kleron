import { Routes, Route, Navigate } from 'react-router-dom'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Callback } from './pages/Callback'
import { History } from './pages/History'
import { Reading } from './pages/Reading'
import { getToken } from './lib/auth'

const AUTH_BYPASS = import.meta.env.VITE_AUTH_BYPASS === 'true'

function RequireAuth({ children }: { children: React.ReactNode }) {
  return AUTH_BYPASS || getToken() ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<Callback />} />
      <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
      <Route path="/reading/:id" element={<RequireAuth><Reading /></RequireAuth>} />
      <Route path="/history" element={<RequireAuth><History /></RequireAuth>} />
    </Routes>
  )
}
