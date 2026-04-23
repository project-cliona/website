import { z } from "zod";

const phoneRule = z
  .string()
  .trim()
  .min(10, "Phone must be at least 10 digits")
  .max(15, "Phone must be at most 15 digits")
  .regex(/^\d+$/, "Phone must contain only digits");

const tagRule = z
  .string()
  .trim()
  .toLowerCase()
  .min(1)
  .max(30, "Tag must be 30 characters or fewer");

export const contactFormSchema = z.object({
  countryCode: z
    .string()
    .trim()
    .regex(/^\d{1,4}$/, "Country code must be 1–4 digits")
    .default("91"),
  phoneNumber: phoneRule,
  name: z.string().trim().max(256).optional().or(z.literal("")),
  email: z
    .string()
    .trim()
    .email("Not a valid email")
    .optional()
    .or(z.literal("")),
  tags: z.array(tagRule).max(20, "Maximum 20 tags per contact").default([]),
});
export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const csvImportOptionsSchema = z.object({
  saveAsList: z
    .string()
    .trim()
    .max(100, "List name must be 100 characters or fewer")
    .optional()
    .or(z.literal("")),
});
export type CsvImportOptions = z.infer<typeof csvImportOptionsSchema>;

export const listFormSchema = z.object({
  name: z.string().trim().min(1, "List name is required").max(100),
  description: z.string().trim().max(500).optional().or(z.literal("")),
});
export type ListFormValues = z.infer<typeof listFormSchema>;
