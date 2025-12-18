import { z } from "zod";

export const createAgentSchema = z.object({
  userName: z.string().min(1, "User is required"),
  agentname: z.string().min(2, "Agent name is required"),
  brandName: z.string().min(2, "Brand name is required"),
  agentdescription: z.string().min(10, "Description is too short"),
  billingcategory: z.enum(["OTP", "Transactional", "Promotional"]),
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
