'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, SignupForm } from '@/lib/schema/common.schema'
import { useState } from 'react'

import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Checkbox } from '@/components/ui/checkbox'

export default function Signup() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      phone: '',
      password: '',
      confirmPassword: '',
      terms: false
    }
  })

  const onSubmit = async (data: SignupForm) => {
    setLoading(true)

    setTimeout(() => {
      localStorage.setItem(
        'user',
        JSON.stringify({
          name: data.name,
          email: data.email,
          company: data.company,
          role: 'user'
        })
      )

      router.push('/dashboard')
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
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

            {/* Name */}
            <div className="space-y-1">
              <Label htmlFor="name">Full Name *</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input id="name" placeholder="Enter your full name" {...field} />
                )}
              />
              {errors.name && (
                <p className="text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>

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

            {/* Company */}
            <div className="space-y-1">
              <Label htmlFor="company">Company Name</Label>
              <Controller
                name="company"
                control={control}
                render={({ field }) => (
                  <Input id="company" placeholder="Enter company name" {...field} />
                )}
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <Label htmlFor="phone">Phone Number</Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input id="phone" placeholder="+91-9876543210" {...field} />
                )}
              />
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

            {/* Confirm Password */}
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <Input id="confirmPassword" type="password" {...field} />
                )}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <Controller
                name="terms"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked === true)
                    }}
                  />
                )}
              />
              <Label className="text-sm leading-snug">
                I agree to the Terms & Privacy Policy
              </Label>
            </div>
            {errors.terms && (
              <p className="text-xs text-red-600">{errors.terms.message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 rounded-lg"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
