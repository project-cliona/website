import { LucideProps } from "lucide-react"

export interface StatsCardProps {
  title: string
  value: string
  icon: React.ReactElement<LucideProps>
  trend?: string
  trendUp?: boolean
  tooltip?: string
}

export type Agent = {
  id: string;
  name: string;
  agentdescription: string;
  billingcategory: string;
  status: "Active" | "Inactive" | "Pending" | "Rejected";
  email: string;
  phoneno: string;
};

export interface TemplateSuggestion {
  id?: number;
  cardId?: number;
  actionType: string;
  displayText: string;
  actionData: string | null;
}

export interface TemplateCard {
  id: number;
  templateId: number;
  cardTitle: string;
  cardDescription: string;
  mediaType: string;
  mediaHeight: string;
  fileUrl: string;
  filePath: string | null;
  cardOrder: number;
  suggestions: TemplateSuggestion[];
}

export interface RCSTemplate {
  id: number;
  userId: number;
  agentID: string;
  cardOrientation: string;
  templateType: string;
  templateTypeTxt: string;
  templateName: string;
  status: string;
  createdBy: number;
  createdOn: string;
  modifiedBy: number | null;
  modifiedOn: string | null;
  disapproveReason: string | null;
  cards: TemplateCard[];
}