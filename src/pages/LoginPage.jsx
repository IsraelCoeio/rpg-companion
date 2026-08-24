import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import PageContainer from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { loginUser } from '@/services/authService'

function LoginPage() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleLogin(event) {
    event.preventDefault()

    const normalizedUsername = username.trim()

    if (!normalizedUsername) {
      setErrorMessage('Username is required.')
      return
    }

    if (!password) {
      setErrorMessage('Password is required.')
      return
    }

    setIsLoggingIn(true)
    setErrorMessage('')

    try {
      await loginUser({
  username: normalizedUsername,
  password,
})

    navigate('/', {
      replace: true,
    })

    } catch (error) {
      console.error(error)

      if (error.code === 'auth/invalid-credential') {
        setErrorMessage('Invalid username or password.')
      } else {
        setErrorMessage('Failed to log in. Please try again.')
      }
    } finally {
      setIsLoggingIn(false)
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
            Welcome back, adventurer.
          </p>
        </div>

        {/* Login Card */}

        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">

          <h2 className="mb-6 text-center font-display text-2xl">
            Log In
          </h2>

          <form
            onSubmit={handleLogin}
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
                placeholder="Your username"
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
                placeholder="Your password"
                autoComplete="current-password"
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
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Logging in...' : 'Log In'}
            </Button>

          </form>

        </div>

        {/* Registration */}

        <div className="text-center text-sm text-muted-foreground">
          <span>Don't have an account? </span>

          <Link
            to="/register"
            className="font-medium text-primary hover:underline"
          >
            Create one
          </Link>
        </div>

      </div>
    </PageContainer>
  )
}

export default LoginPage