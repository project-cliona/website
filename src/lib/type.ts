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