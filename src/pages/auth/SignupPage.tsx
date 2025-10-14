import { Link } from 'react-router-dom'

function SignupPage() {
  return (
    <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/">
            <img src="/logo.svg" alt="Flux Logo" className="w-16 h-16 mx-auto mb-4" />
          </Link>
          <h1 className="text-3xl font-bold text-neutral-50 mb-2">Create Account</h1>
          <p className="text-neutral-400">Join the Flux competitive programming community</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8">
          <form className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                Email Address
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="flex-1 px-4 py-2 bg-neutral-950 border border-neutral-700 rounded-md text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-medium rounded-md transition-colors"
                >
                  Verify
                </button>
              </div>
              <p className="mt-1 text-xs text-neutral-500">We'll send you a verification code</p>
            </div>

            {/* Verification Token */}
            <div>
              <label
                htmlFor="verification_token"
                className="block text-sm font-medium text-neutral-300 mb-2"
              >
                Verification Code
              </label>
              <input
                type="text"
                id="verification_token"
                name="verification_token"
                className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 rounded-md text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter verification code from email"
              />
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-neutral-300 mb-2"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 rounded-md text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="John"
                />
              </div>
              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-neutral-300 mb-2"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 rounded-md text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Roll Number */}
            <div>
              <label htmlFor="roll_no" className="block text-sm font-medium text-neutral-300 mb-2">
                Roll Number
              </label>
              <input
                type="text"
                id="roll_no"
                name="roll_no"
                maxLength={8}
                className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 rounded-md text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="12345678 (exactly 8 digits)"
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
                placeholder="7-20 characters"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
            >
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <span className="text-neutral-400 text-sm">Already have an account? </span>
            <Link
              to="/login"
              className="text-primary-500 hover:text-primary-400 font-medium text-sm transition-colors"
            >
              Sign in
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

export default SignupPage
