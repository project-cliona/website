import { z } from "zod"

export const signupSchema = z
    .object({
        name: z.string().min(1, "Full name is required"),
        email: z.string().email("Invalid email address"),
        company: z.string().optional(),
        phone: z.string().optional(),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(1, "Confirm your password"),
        terms: z
            .boolean()
            .refine((val) => val === true, {
                message: "You must accept the terms"
            })
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match"
    })

export const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password is required'),
    rememberMe: z.boolean().optional(),
})

export const kycSchema = z.object({
    userId: z.number(),
    fullName: z.string().min(3, "Full Name is required"),
    mobile: z.string().min(10, "Mobile number is required"),
    address: z.string().min(3, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    companyName: z.string().optional(),
    companyUrl: z.string().url("Enter a valid URL").optional(),
});


export type SignupForm = z.infer<typeof signupSchema>
export type LoginForm = z.infer<typeof loginSchema>
export type KycFormType = z.infer<typeof kycSchema>;