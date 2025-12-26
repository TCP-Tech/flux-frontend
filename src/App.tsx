import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CookiesProvider } from 'react-cookie'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/auth/LoginPage'
import SignupPage from '@/pages/auth/SignupPage'
import NotFoundPage from '@/pages/NotFoundPage'
import LocksPage from '@/pages/locks/LocksPage'
import ProtectedRoute from '@/components/ProtectedRoute' 


function App() {
  return (
    <CookiesProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route element={<ProtectedRoute />}>
          <Route path="/locks" element={<LocksPage />} />
          {/* TODO: Protected Routes */}
          {/* <Route path="/contests" element={<ContestsPage />} /> */}
          {/* <Route path="/problems" element={<ProblemsPage />} /> */}
          {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
          </Route>
          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
  )
}

export default App
