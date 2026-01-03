import { z } from "zod"

export const createTemplateSchema = z.object({
  templateName: z.string().min(1, "Template name is required"),
  templateType: z.enum(["standalone", "carousel", "text"]),
  agentID: z.string().min(1, "Agent is required"),
  agentCategory: z.string().optional(),
  cardTitle: z.string().min(1).max(100),
  cardDescription: z.string().min(1).max(300),
  mediaFile: z.any().optional(),
  suggestions: z.array(
    z.object({
      actionType: z.string(),
      suggestionText: z.string().optional(),
      postbackText: z.string().optional(),
    })
  ),
})

export type CreateTemplateForm = z.infer<typeof createTemplateSchema>
