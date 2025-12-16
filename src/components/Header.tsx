import { useNavigate } from 'react-router-dom'
import { FaSignOutAlt } from 'react-icons/fa'
import { authService } from '@/services/auth.service'

function Header() {
  const navigate = useNavigate()
  
  const isLoggedIn = authService.isAuthenticated()

  const handleLogout = async () => {
    await authService.logout() 
  }

  const handleLogin = () => navigate('/login')
  const handleSignup = () => navigate('/signup')

  return (
    <header className="absolute top-0 left-0 right-0 z-20">
      <div className="flex items-center justify-between p-10">
        <div>
          <a href="/" className="block group">
            <img src="/logo.svg" alt="Flux Logo" width={60} height={60} className="transition-all duration-300 group-hover:scale-110" />
          </a>
        </div>

        <div className="flex space-x-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="group inline-flex h-10 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm text-neutral-300 hover:bg-neutral-800/80 transition-all px-6 font-medium"
            >
              Logout <FaSignOutAlt className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <>
              <button onClick={handleLogin} className="inline-flex h-10 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm text-neutral-300 hover:bg-neutral-800/80 px-6 font-medium">
                Login
              </button>
              <button onClick={handleSignup} className="group inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 px-6 font-medium">
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
