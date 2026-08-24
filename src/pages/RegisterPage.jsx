import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import PageContainer from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { registerUser } from '@/services/authService'

function RegisterPage() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [isRegistering, setIsRegistering] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleRegister(event) {
    event.preventDefault()

    const normalizedUsername = username.trim()

    if (!normalizedUsername) {
      setErrorMessage('Username is required.')
      return
    }

    if (normalizedUsername.length < 3) {
      setErrorMessage('Username must be at least 3 characters.')
      return
    }

    if (!password) {
      setErrorMessage('Password is required.')
      return
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    setIsRegistering(true)
    setErrorMessage('')

    try {
      const user = await registerUser({
        username: normalizedUsername,
        password,
      })

      console.log('Registered user:', user.uid)

      navigate('/', { replace: true })
    } catch (error) {
      console.error(error)

      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('That username is already taken.')
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage('Password is too weak.')
      } else {
        setErrorMessage('Failed to create account. Please try again.')
      }
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <PageContainer>
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-md flex-col justify-center gap-6">

        {/* Header */}

        <div className="space-y-2 text-center">
          <h1 className="font-display text-4xl">
            RPG Companion
          </h1>

          <p className="text-muted-foreground">
            Begin your adventure.
          </p>
        </div>

        {/* Registration Card */}

        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">

          <h2 className="mb-6 text-center font-display text-2xl">
            Create Account
          </h2>

          <form
            onSubmit={handleRegister}
            className="space-y-4"
          >

            {/* Username */}

            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium"
              >
                Username
              </label>

              <input
                id="username"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value)
                  setErrorMessage('')
                }}
                placeholder="Choose a username"
                autoComplete="username"
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring/70"
              />
            </div>

            {/* Password */}

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setErrorMessage('')
                }}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring/70"
              />
            </div>

            {/* Confirm Password */}

            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="text-sm font-medium"
              >
                Confirm Password
              </label>

              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value)
                  setErrorMessage('')
                }}
                placeholder="Enter your password again"
                autoComplete="new-password"
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring/70"
              />
            </div>

            {/* Error */}

            {errorMessage && (
              <p className="rounded-xl border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-500">
                {errorMessage}
              </p>
            )}

            {/* Submit */}

            <Button
              type="submit"
              className="w-full"
              disabled={isRegistering}
            >
              {isRegistering ? 'Creating Account...' : 'Create Account'}
            </Button>

          </form>

        </div>

        {/* Login */}

        <div className="text-center text-sm text-muted-foreground">
          <span>Already have an account? </span>

          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Log in
          </Link>
        </div>

      </div>
    </PageContainer>
  )
}

export default RegisterPage