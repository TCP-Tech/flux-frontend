import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { FaSignOutAlt } from 'react-icons/fa'

function Header() {
  const navigate = useNavigate()
  const [cookies, , removeCookie] = useCookies(['flux_jwt_session'])

  const authToken = cookies.flux_jwt_session || null

  const handleLogout = () => {
    removeCookie('flux_jwt_session', { path: '/' })
  }

  const handleLogin = () => {
    navigate('/login')
  }

  const handleSignup = () => {
    navigate('/signup')
  }

  return (
    <header className="absolute top-0 left-0 right-0 z-20">
      <div className="flex items-center justify-between p-10">
        {/* Logo - Left */}
        <div>
          <a href="/" className="block group">
            <img
              src="/logo.svg"
              alt="Flux Logo"
              width={60}
              height={60}
              className="transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]"
            />
          </a>
        </div>

        {/* Auth Buttons - Right */}
        <div className="flex space-x-4">
          {authToken ? (
            <button
              onClick={handleLogout}
              className="group inline-flex h-10 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm text-neutral-300 hover:bg-neutral-800/80 hover:text-white hover:border-neutral-700 transition-all duration-300 px-6 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-950 hover:shadow-lg hover:shadow-primary-500/20"
            >
              Logout <FaSignOutAlt className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <>
              <button
                onClick={handleLogin}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm text-neutral-300 hover:bg-neutral-800/80 hover:text-white hover:border-neutral-700 transition-all duration-300 px-6 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
              >
                Login
              </button>
              <button
                onClick={handleSignup}
                className="group inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 transition-all duration-300 px-6 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-950 hover:shadow-lg hover:shadow-primary-500/50 hover:scale-105"
              >
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

