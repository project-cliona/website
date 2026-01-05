import { z } from "zod"

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
      suggestionText: z.string(),
      postbackText: z.string(),
    })
  ),
})

export type CreateTemplateForm = z.infer<typeof createTemplateSchema>
