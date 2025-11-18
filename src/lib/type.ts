import { LucideProps } from "lucide-react"

export interface StatsCardProps {
  title: string
  value: string
  icon: React.ReactElement<LucideProps>
  trend?: string
  trendUp?: boolean
  tooltip?: string
}