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
  id: number;
  agentKey: string | null;
  userId: number;
  agentname: string;
  agentdescription: string;
  agentheroimageURL: string;
  agentlogo: string;
  brandcolor: string;
  agentusecase: string | null;
  billingcategory: string;
  phoneno: string;
  labelphoneno: string;
  website: string;
  labelwebsite: string;
  email: string;
  labelemail: string;
  agentopt: string | null;
  privacypolicyURL: string;
  termconditonURL: string;
  agentbrand: string | null;
  agentlegalbrand: string | null;
  spocname: string;
  spocemail: string;
  spocdesignation: string | null;
  spocphonenumber: string;
  status: "Active" | "Inactive" | "Pending" | "Rejected";
  createdAt: string;
  modifiedAt: string;
  createdby: string | null;
  modifiedby: string | null;
  disapproveReason: string | null;
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

export interface User {
  userId: number;
  email: string;
  userName: string;
  isSocialLogin: boolean;
  status: string;
  isEmailConfirmed: boolean;
  isPhoneConfirmed: boolean;
  createdOn: string;
}

export interface UserProfile {
  userId: string;
  profileId: string;
  fullName: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  companyName: string;
  companyUrl: string;
  parentId: string;
  salesPersonId: string;
  expiry: string;
  roleId: number;
  currency: string;
  profileStatus: string;
  createdAt: string;
}
