'use client'

import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { loginSchema, LoginForm } from '@/lib/schema/common.schema'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/Button'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { apiClient } from '@/lib/axios'
import { supabase } from '@/lib/supabase/client'
import { useUser } from '@/providers/userProvider'
import axios from 'axios'

export default function Login() {
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
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setApiError(
          error.response?.data?.message || "Invalid email or password"
        )
      } else {
        setApiError("Something went wrong")
      }
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

  if (userAuthLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <p>Loading authentication...</p>
          <div className="mt-4 animate-spin h-6 w-6 border-b-2 border-gray-900 rounded-full mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Squalto account."
    >
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
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={loading} disabled={loading} className="w-full" size="lg">
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      {/* Social Login */}
      <div className="mt-6">
        {/* Google Sign-in */}
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => handleSocialLogin('google')}
          className="w-full"
        >
          <svg className="w-5 h-5" viewBox="0 0 533.5 544.3">
            <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.3-4.7-50.7H272v95.9h147.1c-6.3 33.8-25 62.5-53.2 81.6v67h85.8c50.1-46.1 79-114.3 79-193.8z" />
            <path fill="#34A853" d="M272 544.3c71.8 0 132.1-23.8 176.1-64.6l-85.8-67c-23.9 16-54.7 25.3-90.3 25.3-69 0-127.5-46.6-148.6-109.3H33.3v68.7c44.1 87.1 135.8 147.9 238.7 147.9z" />
            <path fill="#FBBC05" d="M123.4 322.7c-10.5-31-10.5-64.2 0-95.2V158.8H33.3c-42.8 85.5-42.8 187.2 0 272.7l90.1-68.8z" />
            <path fill="#EA4335" d="M272 107.6c37.4-.6 73.4 13.3 100.6 38.6l75.4-75.4C404.1 25.7 343.8 0 272 0 169.1 0 77.4 60.8 33.3 147.9l90.1 68.7C144.5 154.2 203 107.6 272 107.6z" />
          </svg>
          <span>Continue with Google</span>
        </Button>

        {/* Magic link / passwordless */}
        <div className="mt-3 text-center">
          <Link
            href="/auth/verify"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            Continue with Email OTP (Passwordless)
          </Link>
        </div>
      </div>

      {/* Signup */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="underline">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}
