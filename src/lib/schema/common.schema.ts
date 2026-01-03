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

export type SignupForm = z.infer<typeof signupSchema>
