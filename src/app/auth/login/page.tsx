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
  const { refetchUser, refetchProfile,userAuthLoading  } = useUser()
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
                  href="/auth/forgot-password"
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
              <p className="text-center text-sm text-gray-500 mb-3">
                Or sign in with
              </p>
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  <span className="text-sm">Google</span>
                </button>
              </div>
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
