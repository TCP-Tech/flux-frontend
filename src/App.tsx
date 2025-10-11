import { useCookies } from 'react-cookie'
import {
  FaDiscord,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaSignOutAlt,
  FaArrowRight,
  FaTrophy,
  FaCode,
} from 'react-icons/fa'

const socialMediaLinks = [
  { href: 'https://www.facebook.com', icon: <FaFacebook size={24} />, label: 'Facebook' },
  { href: 'https://www.twitter.com', icon: <FaTwitter size={24} />, label: 'Twitter' },
  { href: 'https://www.instagram.com', icon: <FaInstagram size={24} />, label: 'Instagram' },
  { href: 'https://www.discord.com', icon: <FaDiscord size={24} />, label: 'Discord' },
]

const mainButtons = [
  { href: '/contests', text: 'Browse Contests', icon: <FaTrophy size={16} /> },
  { href: '/problems', text: 'Solve Problems', icon: <FaCode size={16} /> },
]

function App() {
  const [cookies, , removeCookie] = useCookies(['flux_jwt_session'])

  const authToken = cookies.flux_jwt_session || null

  const handleLogout = () => {
    removeCookie('flux_jwt_session', { path: '/' })
  }

  const handleLogin = () => {
    // TODO: Navigate to login page
    console.warn('Login clicked - implement navigation')
  }

  const handleSignup = () => {
    // TODO: Navigate to signup page
    console.warn('Signup clicked - implement navigation')
  }

  const ghostButtons = authToken
    ? []
    : [
        { onClick: handleLogin, text: 'Login' },
        { onClick: handleSignup, text: 'Sign Up' },
      ]

  return (
    <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Logo - Top Left */}
      <div className="absolute top-11 left-10 z-20">
        <a href="/" className="block">
          <img
            src="/logo.svg"
            alt="Flux Logo"
            width={60}
            height={60}
            className="hover:opacity-80 transition-opacity"
          />
        </a>
      </div>

      {/* Social Media Links - Bottom Left */}
      <div className="absolute bottom-10 left-12 z-20 hidden md:flex flex-col space-y-4">
        <div
          style={{
            borderTop: '40px solid #404040',
            width: '5px',
            height: '40px',
            marginLeft: '8px',
          }}
        />
        {socialMediaLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white transition-colors"
            aria-label={link.label}
          >
            {link.icon}
          </a>
        ))}
      </div>

      {/* Auth Buttons - Top Right */}
      <div className="absolute top-12 right-12 z-20 flex space-x-4">
        {authToken ? (
          <button
            onClick={handleLogout}
            className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-600 transition-all px-4 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
          >
            Logout <FaSignOutAlt className="ml-2" />
          </button>
        ) : (
          ghostButtons.map((button, index) => (
            <button
              key={index}
              onClick={button.onClick}
              className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-600 transition-all px-4 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
            >
              {button.text}
            </button>
          ))
        )}
      </div>

      {/* Main Content */}
      <div className="p-4 relative z-10 w-full text-center">
        <h1 className="mt-20 md:mt-0 mb-5 text-2xl md:text-5xl font-bold text-neutral-300">
          Welcome to
        </h1>
        <h1 className="mt-10 md:mt-0 text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          Flux
        </h1>
        <p className="mt-12 md:mt-20 font-normal text-base md:text-lg text-neutral-400 max-w-lg mx-auto">
          Compete. Code. Conquer.
        </p>
        <p className="mt-4 font-normal text-base md:text-2xl text-neutral-300 mx-auto">
          <span className="font-bold text-primary-500">Advanced Platform</span> for Competitive
          Programming
        </p>

        {/* Main Action Buttons */}
        <div className="mb-4 mt-14 p-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
          {mainButtons.map((button, index) => (
            <a key={index} href={button.href}>
              <button className="inline-flex h-12 items-center justify-center rounded-md border border-primary-600 bg-primary-600 hover:bg-primary-700 px-6 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-950">
                <span>{button.text}</span>
                <span className="ml-2">{button.icon}</span>
              </button>
            </a>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto px-4">
          <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-900 hover:border-neutral-700 transition-colors">
            <FaTrophy className="text-3xl text-primary-500 mb-3 mx-auto" />
            <h3 className="text-lg font-semibold text-neutral-200 mb-2">Contests</h3>
            <p className="text-sm text-neutral-400">
              Compete in timed contests and multi-round tournaments
            </p>
          </div>
          <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-900 hover:border-neutral-700 transition-colors">
            <FaCode className="text-3xl text-secondary-500 mb-3 mx-auto" />
            <h3 className="text-lg font-semibold text-neutral-200 mb-2">Problems</h3>
            <p className="text-sm text-neutral-400">
              Access curated competitive programming challenges
            </p>
          </div>
          <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-900 hover:border-neutral-700 transition-colors">
            <FaArrowRight className="text-3xl text-accent-500 mb-3 mx-auto" />
            <h3 className="text-lg font-semibold text-neutral-200 mb-2">Leaderboards</h3>
            <p className="text-sm text-neutral-400">Track your progress and compete with others</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-center z-20 text-xs text-neutral-500">
        <p>&copy; {new Date().getFullYear()} Flux. Built for competitive programmers.</p>
      </footer>
    </div>
  )
}

export default App
