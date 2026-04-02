import { Routes, Route, Navigate } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Bio from './pages/Bio'
import Books from './pages/Books'
import Publications from './pages/Publications'
import Interviews from './pages/Interviews'
import Facilitation from './pages/Facilitation'
import Contact from './pages/Contact'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'

function AdminRoute({ children }) {
  const authed = sessionStorage.getItem('ky_admin') === '1'
  return authed ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Nav />
      <main style={{ paddingTop: 'var(--nav-height)', minHeight: '80vh' }}>
        <Routes>
          <Route path="/"             element={<Bio />} />
          <Route path="/books"        element={<Books />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/interviews"   element={<Interviews />} />
          <Route path="/facilitation" element={<Facilitation />} />
          <Route path="/contact"      element={<Contact />} />
          <Route path="/admin/login"  element={<AdminLogin />} />
          <Route path="/admin"        element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
