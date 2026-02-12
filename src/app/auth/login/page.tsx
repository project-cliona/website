'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { loginSchema, LoginForm } from '@/lib/schema/common.schema'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Checkbox } from '@/components/ui/checkbox'
import { apiClient } from '@/lib/axios'
import { supabase } from '@/lib/supabase/client'
import { useUser } from '@/providers/userProvider'

export default function Login() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const { refetchUser, refetchProfile, userAuthLoading } = useUser()
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true)
      setApiError('')

      const response = await apiClient().post('/auth/login', {
        email: data.email,
        password: data.password
      })

      localStorage.setItem('accessToken', response.data.result.accessToken)
      await Promise.all([refetchUser(), refetchProfile()])
    } catch (error: any) {
      setApiError(
        error?.response?.data?.message || 'Invalid email or password'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error(error.message)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      {userAuthLoading ? (
        <div className="text-center">
          <p>Loading authentication...</p>
          <div className="mt-4 animate-spin h-6 w-6 border-b-2 border-gray-900 rounded-full mx-auto"></div>
        </div>
      ) : (
        <div className="max-w-md w-full space-y-8">

          {/* Logo */}
          <div className="text-center">
            <Link href="/">
              <h1 className="text-3xl font-semibold">Cliona</h1>
            </Link>
            <p className="mt-2 text-muted-foreground">CPaaS Platform</p>
          </div>

          {/* Form */}
          <div className="border rounded-xl p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {apiError && (
                <p className="text-sm text-red-600">{apiError}</p>
              )}

              {/* Email */}
              <div className="space-y-1">
                <Label htmlFor="email">Email Address *</Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input id="email" placeholder="Enter your email" {...field} />
                  )}
                />
                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label htmlFor="password">Password *</Label>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input id="password" type="password" {...field} />
                  )}
                />
                {errors.password && (
                  <p className="text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Remember Me + Forgot */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Controller
                    name="rememberMe"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                    )}
                  />
                  <Label className="text-sm">Remember me</Label>
                </div>

                <Link
                  href="/auth/forget-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-3 rounded-lg disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Social Login */}
            <div className="mt-6">
              <div className="mt-4">
                <Link href="/auth/verify" >
                  <button
                    type="button"
                    className="w-full py-3 rounded-lg border cursor-pointer border-gray-300 text-sm font-medium hover:bg-gray-50 transition"
                  >
                    Continue with Email OTP (Passwordless)
                  </button></Link>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Google Sign-in */}
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 533.5 544.3">
                  <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.3-4.7-50.7H272v95.9h147.1c-6.3 33.8-25 62.5-53.2 81.6v67h85.8c50.1-46.1 79-114.3 79-193.8z" />
                  <path fill="#34A853" d="M272 544.3c71.8 0 132.1-23.8 176.1-64.6l-85.8-67c-23.9 16-54.7 25.3-90.3 25.3-69 0-127.5-46.6-148.6-109.3H33.3v68.7c44.1 87.1 135.8 147.9 238.7 147.9z" />
                  <path fill="#FBBC05" d="M123.4 322.7c-10.5-31-10.5-64.2 0-95.2V158.8H33.3c-42.8 85.5-42.8 187.2 0 272.7l90.1-68.8z" />
                  <path fill="#EA4335" d="M272 107.6c37.4-.6 73.4 13.3 100.6 38.6l75.4-75.4C404.1 25.7 343.8 0 272 0 169.1 0 77.4 60.8 33.3 147.9l90.1 68.7C144.5 154.2 203 107.6 272 107.6z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  Continue with Google
                </span>
              </button>
            </div>
          </div>

          {/* Signup */}
          <p className="text-center text-sm text-gray-500">
            Don’t have an account?{' '}
            <Link href="/auth/signup" className="underline">
              Sign up
            </Link>
          </p>
        </div>)}
    </div>
  )
}
