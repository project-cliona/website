import { z } from "zod";

export const createAgentSchema = z.object({
  userId: z.number().min(1, "User is required"),
  agentname: z.string().min(2, "Agent name is required"),
  brandName: z.string().min(2, "Brand name is required"),
  agentdescription: z.string().min(10, "Description is too short"),
  billingcategory: z.enum(["otp", "transactional", "promotional"]),
  brandcolor: z.string(),
  country: z.string(),
  phoneno: z.string().min(10, "Phone is required"),
  labelphoneno: z.string(),
  email: z.string().email("Invalid email"),
  labelemail: z.string(),
  website: z.string().url("Invalid website URL"),
  labelwebsite: z.string(),
  spocname: z.string().min(1),
  spocemail: z.string().email(),
  spocphonenumber: z.string().min(10),
  optinUrl: z.string().url(),
  termconditonURL: z.string().url(),
  privacypolicyURL: z.string().url(),
  status: z.enum(["Pending", "Active", "Rejected"]),
});
export type CreateAgentForm = z.infer<typeof createAgentSchema>;


export const sendRCSSchema = z.object({
  agentID: z.string().min(1, "Agent is required"),
  templateID: z.string().min(1, "Template is required"),
  mobileNumbers: z.string().optional(),
  removeDuplicates: z.boolean(),
  uploadedFile: z.any().optional(),
})
export type SendRCSForm = z.infer<typeof sendRCSSchema>


export const createTemplateSchema = z.object({
  templateName: z.string().min(1, "Template name is required"),
  templateType: z.enum(["standalone", "carousel", "text"]),
  agentID: z.string().min(1, "Agent is required"),
  agentCategory: z.string(),
  cardTitle: z.string().min(1).max(100),
  cardDescription: z.string().min(1).max(300),
  mediaFile: z.any(),
  suggestions: z.array(
    z.object({
      actionType: z.string(),
      displayText: z.string(),
      actionData: z.string(),
    })
  ),
})
export type CreateTemplateForm = z.infer<typeof createTemplateSchema>

