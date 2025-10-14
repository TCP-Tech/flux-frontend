import { Link } from 'react-router-dom'
import { FaHome, FaArrowLeft } from 'react-icons/fa'

function NotFoundPage() {
  return (
    <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        {/* Large 404 */}
        <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-600 mb-4">
          404
        </h1>

        {/* Error Message */}
        <h2 className="text-3xl font-bold text-neutral-200 mb-4">Page Not Found</h2>
        <p className="text-neutral-400 mb-8 max-w-md mx-auto">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/">
            <button className="inline-flex h-12 items-center justify-center rounded-md border border-primary-600 bg-primary-600 hover:bg-primary-700 px-6 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-950">
              <FaHome className="mr-2" />
              Go to Home
            </button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex h-12 items-center justify-center rounded-md border border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-600 transition-all px-6 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
          >
            <FaArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>

        {/* Logo */}
        <div className="mt-16">
          <Link to="/">
            <img
              src="/logo.svg"
              alt="Flux Logo"
              className="w-16 h-16 mx-auto opacity-50 hover:opacity-100 transition-opacity"
            />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
