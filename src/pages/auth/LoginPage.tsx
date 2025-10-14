import { Link } from 'react-router-dom'

function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/">
            <img src="/logo.svg" alt="Flux Logo" className="w-16 h-16 mx-auto mb-4" />
          </Link>
          <h1 className="text-3xl font-bold text-neutral-50 mb-2">Welcome Back</h1>
          <p className="text-neutral-400">Sign in to your Flux account</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8">
          <form className="space-y-6">
            {/* Username or Roll No */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-neutral-300 mb-2">
                Username or Roll Number
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 rounded-md text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your username or roll number"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 rounded-md text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 bg-neutral-950 border-neutral-700 rounded focus:ring-primary-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-neutral-400">Remember me for a month</span>
              </label>
              <Link
                to="/reset-password"
                className="text-sm text-primary-500 hover:text-primary-400 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
            >
              Sign In
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <span className="text-neutral-400 text-sm">Don't have an account? </span>
            <Link
              to="/signup"
              className="text-primary-500 hover:text-primary-400 font-medium text-sm transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-neutral-400 hover:text-neutral-300 text-sm transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
