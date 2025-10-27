import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../../services/auth.service'
import { getErrorMessage } from '../../config/axios'

function SignupPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'email' | 'details'>('email')
  const [formData, setFormData] = useState({
    email: '',
    verification_token: '',
    first_name: '',
    last_name: '',
    roll_no: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  const handleSendVerification = async () => {
    if (!formData.email) {
      setError('Please enter your email address')
      return
    }

    setError(null)
    setLoading(true)

    try {
      await authService.sendSignupEmail(formData.email)
      setEmailSent(true)
      setSuccess('Verification code sent to your email!')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    if (!formData.email || !formData.verification_token) {
      setError('Please enter your email and verification code')
      return
    }
    setError(null)
    setStep('details')
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await authService.signup({
        email: formData.email,
        verification_token: formData.verification_token,
        first_name: formData.first_name,
        last_name: formData.last_name,
        roll_no: formData.roll_no,
        password: formData.password,
      })

      // Success
      setSuccess('Account created successfully! Please login.')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

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
          {step === 'email' ? (
            /* Step 1: Email Verification */
            <div className="space-y-6">
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
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={emailSent}
                    className="flex-1 px-4 py-2 bg-neutral-950 border border-neutral-700 rounded-md text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                    placeholder="your.email@example.com"
                  />
                  <button
                    type="button"
                    onClick={handleSendVerification}
                    disabled={loading || emailSent}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition-colors"
                  >
                    {loading ? 'Sending...' : emailSent ? 'Sent ✓' : 'Send Code'}
                  </button>
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  We'll send you a verification code
                </p>
              </div>

              {/* Verification Token */}
              {emailSent && (
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
                    value={formData.verification_token}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 rounded-md text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter verification code from email"
                  />
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="p-3 rounded-md bg-green-900/20 border border-green-900/50">
                  <p className="text-sm text-green-400">{success}</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-md bg-red-900/20 border border-red-900/50">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Continue Button */}
              <button
                type="button"
                onClick={handleContinue}
                disabled={!emailSent || !formData.verification_token}
                className="w-full h-12 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
              >
                Continue
              </button>
            </div>
          ) : (
            /* Step 2: User Details */
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    minLength={4}
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
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    minLength={4}
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
                  value={formData.roll_no}
                  onChange={handleChange}
                  required
                  maxLength={8}
                  pattern="[0-9]{8}"
                  className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 rounded-md text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Your college roll no (8 digits)"
                />
                <p className="mt-1 text-xs text-neutral-500">Must be exactly 8 digits</p>
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
                  minLength={7}
                  maxLength={20}
                  className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 rounded-md text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="7-20 characters"
                />
              </div>

              {/* Success Message */}
              {success && (
                <div className="p-3 rounded-md bg-green-900/20 border border-green-900/50">
                  <p className="text-sm text-green-400">{success}</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-md bg-red-900/20 border border-red-900/50">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep('email')
                    setError(null)
                  }}
                  className="flex-1 h-12 border border-neutral-700 text-neutral-300 font-medium rounded-md hover:bg-neutral-800 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-12 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>
          )}

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
