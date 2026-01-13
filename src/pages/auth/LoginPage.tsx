import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../../services/auth.service'
import { getErrorMessage } from '../../config/axios'

type LoginType = 'roll_no' | 'user_name'

function LoginPage() {
  const navigate = useNavigate()
  const [loginType, setLoginType] = useState<LoginType>('roll_no')
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    remember_for_month: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Build login request based on login type
      const loginRequest = {
        [loginType]: formData.identifier,
        password: formData.password,
        remember_for_month: formData.remember_for_month,
      }

      await authService.login(loginRequest)

      // Success - redirect to home
      navigate('/contests')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

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
          {/* Login Type Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-300 mb-3">Login with</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setLoginType('roll_no')
                  setFormData(prev => ({ ...prev, identifier: '' }))
                }}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                  loginType === 'roll_no'
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                }`}
              >
                Roll Number
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginType('user_name')
                  setFormData(prev => ({ ...prev, identifier: '' }))
                }}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                  loginType === 'user_name'
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                }`}
              >
                Username
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username or Roll No */}
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-neutral-300 mb-2"
              >
                {loginType === 'roll_no' ? 'Roll Number' : 'Username'}
              </label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                required
                maxLength={loginType === 'roll_no' ? 8 : undefined}
                className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 rounded-md text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={
                  loginType === 'roll_no' ? 'Your college roll no (8 digits)' : 'Your username'
                }
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
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 rounded-md text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="remember_for_month"
                  checked={formData.remember_for_month}
                  onChange={handleChange}
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

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-md bg-red-900/20 border border-red-900/50">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
            >
              {loading ? 'Signing in...' : 'Sign In'}
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
