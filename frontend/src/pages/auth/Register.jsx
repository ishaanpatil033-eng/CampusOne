import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/ui/Input'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function Register() {
  const { registerWithEmail, loginWithGoogle, error, clearError } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass]       = useState(false)
  const [loading, setLoading]         = useState(false)
  const [googleLoading, setGLoading]  = useState(false)
  const [localError, setLocalError]   = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const displayError = localError || error

  const passwordStrength = getPasswordStrength(form.password)

  function handleChange(e) {
    clearError()
    setLocalError('')
    setFieldErrors(prev => ({ ...prev, [e.target.name]: '' }))
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function validate() {
    const errors = {}
    if (!form.name.trim())    errors.name    = 'Full name is required.'
    if (!form.email.trim())   errors.email   = 'Email is required.'
    if (form.password.length < 6) errors.password = 'Password must be at least 6 characters.'
    if (form.password !== form.confirm) errors.confirm = 'Passwords do not match.'
    return errors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errors = validate()
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return }

    setLoading(true)
    try {
      await registerWithEmail(form.email, form.password, form.name)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setLocalError(getFirebaseErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setGLoading(true)
    try {
      await loginWithGoogle()
      navigate('/dashboard', { replace: true })
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setLocalError(getFirebaseErrorMessage(err.code))
      }
    } finally {
      setGLoading(false)
    }
  }

  return (
    <div className="auth-card p-8 sm:p-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
        <p className="text-slate-500 mt-1">Join CampusOne and get started today</p>
      </div>

      {/* Google sign-up */}
      <button
        id="google-register-btn"
        onClick={handleGoogle}
        disabled={googleLoading || loading}
        className="btn-google flex items-center justify-center gap-3 mb-6"
      >
        {googleLoading ? (
          <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        Continue with Google
      </button>

      <div className="flex items-center gap-3 mb-6">
        <hr className="flex-1 border-slate-200" />
        <span className="text-xs text-slate-400 font-medium">or register with email</span>
        <hr className="flex-1 border-slate-200" />
      </div>

      {displayError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {displayError}
        </div>
      )}

      <form id="register-form" onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="register-name"
          label="Full name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Jane Smith"
          autoComplete="name"
          error={fieldErrors.name}
          required
        />
        <Input
          id="register-email"
          label="Email address"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@university.edu"
          autoComplete="email"
          error={fieldErrors.email}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="register-password" className="text-sm font-medium text-slate-700">
            Password
          </label>
          <div className="relative">
            <input
              id="register-password"
              name="password"
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              autoComplete="new-password"
              className={`form-input pr-12 ${fieldErrors.password ? 'border-red-400 focus:ring-red-500' : ''}`}
              required
            />
            <button
              type="button"
              id="toggle-reg-password-btn"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {fieldErrors.password && <p className="text-xs text-red-500">⚠ {fieldErrors.password}</p>}
          {form.password && (
            <div className="flex gap-1 mt-1">
              {[1,2,3,4].map(i => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300
                    ${passwordStrength >= i
                      ? i <= 1 ? 'bg-red-400'
                        : i <= 2 ? 'bg-yellow-400'
                        : i <= 3 ? 'bg-blue-400'
                        : 'bg-green-500'
                      : 'bg-slate-200'
                    }`
                  }
                />
              ))}
            </div>
          )}
        </div>

        <Input
          id="register-confirm"
          label="Confirm password"
          type="password"
          name="confirm"
          value={form.confirm}
          onChange={handleChange}
          placeholder="Repeat your password"
          autoComplete="new-password"
          error={fieldErrors.confirm}
          required
        />

        <button
          id="register-submit-btn"
          type="submit"
          disabled={loading || googleLoading}
          className="btn-primary flex items-center justify-center gap-2"
        >
          {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" id="login-link" className="text-primary-600 hover:text-primary-700 font-semibold">
          Sign in
        </Link>
      </p>
    </div>
  )
}

function getPasswordStrength(pwd) {
  if (!pwd) return 0
  let score = 0
  if (pwd.length >= 6)  score++
  if (pwd.length >= 10) score++
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd) && /[^a-zA-Z0-9]/.test(pwd)) score++
  return score
}

function getFirebaseErrorMessage(code) {
  const messages = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email':        'Please enter a valid email address.',
    'auth/weak-password':        'Password is too weak. Use at least 6 characters.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  }
  return messages[code] || 'Registration failed. Please try again.'
}
