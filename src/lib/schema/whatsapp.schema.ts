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

// ---------------------------------------------------------------------------
// WhatsApp Template Builder Schemas
// ---------------------------------------------------------------------------

export const WHATSAPP_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "en_US", label: "English (US)" },
  { code: "en_GB", label: "English (UK)" },
  { code: "hi", label: "Hindi" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "mr", label: "Marathi" },
  { code: "bn", label: "Bengali" },
  { code: "gu", label: "Gujarati" },
  { code: "kn", label: "Kannada" },
  { code: "ml", label: "Malayalam" },
  { code: "pa", label: "Punjabi" },
  { code: "ur", label: "Urdu" },
  { code: "ar", label: "Arabic" },
  { code: "pt_BR", label: "Portuguese (BR)" },
  { code: "es", label: "Spanish" },
  { code: "es_AR", label: "Spanish (AR)" },
  { code: "es_MX", label: "Spanish (MX)" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "it", label: "Italian" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "zh_CN", label: "Chinese (Simplified)" },
  { code: "zh_TW", label: "Chinese (Traditional)" },
  { code: "ru", label: "Russian" },
  { code: "tr", label: "Turkish" },
  { code: "nl", label: "Dutch" },
  { code: "id", label: "Indonesian" },
  { code: "ms", label: "Malay" },
  { code: "th", label: "Thai" },
  { code: "vi", label: "Vietnamese" },
  { code: "pl", label: "Polish" },
  { code: "ro", label: "Romanian" },
  { code: "sw", label: "Swahili" },
  { code: "he", label: "Hebrew" },
  { code: "fil", label: "Filipino" },
] as const;

const whatsappLanguageCodes = WHATSAPP_LANGUAGES.map((l) => l.code) as [
  (typeof WHATSAPP_LANGUAGES)[number]["code"],
  ...(typeof WHATSAPP_LANGUAGES)[number]["code"][],
];

export const buttonSchema = z.object({
  type: z.enum(["QUICK_REPLY", "URL", "PHONE_NUMBER", "COPY_CODE"]),
  text: z.string().min(1, "Button text is required").max(25, "Button text must be 25 characters or fewer"),
  url: z.string().max(2000, "URL must be 2000 characters or fewer").optional(),
  phoneNumber: z.string().max(20, "Phone number must be 20 characters or fewer").optional(),
  example: z.string().optional(),
  dynamicUrl: z.boolean().optional(),
});

export const defaultBuilderSchema = z.object({
  name: z
    .string()
    .min(1, "Template name is required")
    .max(512, "Template name must be 512 characters or fewer")
    .regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers, and underscores allowed"),
  language: z.enum(whatsappLanguageCodes),
  parameterFormat: z.enum(["POSITIONAL", "NAMED"]).default("POSITIONAL"),
  headerType: z.enum(["none", "text", "image", "video", "document"]).default("none"),
  headerText: z.string().max(60, "Header text must be 60 characters or fewer").optional(),
  headerMediaUrl: z.string().url("Must be a valid URL").optional(),
  body: z.string().min(1, "Body text is required").max(1024, "Body must be 1024 characters or fewer"),
  footer: z.string().max(60, "Footer must be 60 characters or fewer").optional(),
  buttons: z.array(buttonSchema).max(10, "Maximum 10 buttons allowed").optional(),
  headerExamples: z.array(z.string()).optional(),
  bodyExamples: z.record(z.string(), z.string()).optional(),
});

export type DefaultBuilderForm = z.input<typeof defaultBuilderSchema>;

export const authBuilderSchema = z.object({
  name: z
    .string()
    .min(1, "Template name is required")
    .max(512, "Template name must be 512 characters or fewer")
    .regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers, and underscores allowed"),
  language: z.enum(whatsappLanguageCodes),
  addSecurityRecommendation: z.boolean().default(true),
  codeExpirationMinutes: z
    .number()
    .int()
    .min(1, "Minimum 1 minute")
    .max(90, "Maximum 90 minutes")
    .optional(),
  otpButtonText: z.string().max(25, "Button text must be 25 characters or fewer").default("Copy Code"),
});

export type AuthBuilderForm = z.input<typeof authBuilderSchema>;
