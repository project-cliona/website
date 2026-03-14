import { z } from "zod";

export const createWhatsappTemplateSchema = z.object({
  name: z
    .string()
    .min(1, "Template name is required")
    .max(512)
    .regex(/^[a-zA-Z0-9_]+$/, "Only alphanumeric characters and underscores allowed"),
  language: z.enum(["en", "en_US", "hi", "ta", "te", "mr", "bn", "gu", "kn", "ml", "pa"]),
  category: z.enum(["utility", "marketing", "authentication"]),
  wabaId: z.string().min(1, "WABA ID is required"),
  headerType: z.enum(["none", "text", "image", "video", "document"]).optional().default("none"),
  headerValue: z.string().optional(),
  body: z.string().min(1, "Body text is required").max(1024),
  footer: z.string().max(60).optional(),
  buttons: z
    .array(
      z.object({
        type: z.enum(["quick_reply", "url", "phone"]),
        text: z.string().min(1, "Button text is required").max(25),
        value: z.string().optional(),
      })
    )
    .max(3)
    .optional(),
});

export type CreateWhatsappTemplateForm = z.input<typeof createWhatsappTemplateSchema>;

export const addContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  countryCode: z.string().min(1, "Country code is required"),
  phoneNumber: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(/^\d+$/, "Digits only"),
});

export type AddContactForm = z.infer<typeof addContactSchema>;

export const sendWhatsappCampaignSchema = z.object({
  campaignName: z.string().min(1, "Campaign name is required"),
  templateId: z.string().min(1, "Template is required"),
  mobileNumbers: z.string().optional(),
  uploadedFile: z.any().nullable().optional(),
  scheduledAt: z.string().optional(),
  removeDuplicates: z.boolean().optional().default(false),
});

export type SendWhatsappCampaignForm = z.input<typeof sendWhatsappCampaignSchema>;
