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
  profileId: number;
  userId: number;
  fullName: string;
  mobile: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  companyName: string | null;
  companyUrl: string | null;
  parentId: number | null;
  salesPersonId: number | null;
  expiry: string | null;
  roleId: number;
  currency: string;
  profileStatus: string;
  createdAt: string;
  updatedAt: string;
  userService?: {
    services: UserService[];
  };
}

export type serviceStatus = "active" | "inactive" | "suspended" | "deleted";

export interface UserService {
  serviceId: number;
  serviceName: string;
  mappedStatus: serviceStatus;
}
// --- WhatsApp Types ---

export interface WhatsappTemplate {
  id: number;
  name: string;
  language: string;
  category: "utility" | "marketing" | "authentication";
  wabaId: string;
  parameterFormat: string | null;
  status: string | null;
  components: Record<string, unknown>;
  headerMediaUrl: string | null;
  metaTemplateId: string | null;
  rejectionReason: string | null;
  modifiedBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsappContact {
  id: number;
  name: string;
  phoneNumber: string;
  countryCode: string;
  createdAt: string;
}

export interface WhatsappCampaign {
  id: string;
  campaignName: string;
  templateName: string;
  scheduledTime: string;
  messageCount: number;
  deliveryRate: number;
  readRate: number;
  status: "Completed" | "Scheduled" | "Sending" | "Failed";
}

export interface WhatsappDeliveryRecord {
  id: string;
  campaignName: string;
  templateName: string;
  submissionTime: string;
  totalNumbers: number;
  sent: number;
  delivered: number;
  undelivered: number;
  read: number;
  uploadSource: string;
}

export interface WhatsappDeliveryReportResponse {
  summary: {
    totalSubmitted: number;
    sent: number;
    delivered: number;
    undelivered: number;
    read: number;
  };
  records: WhatsappDeliveryRecord[];
}

export interface WhatsappBusinessAccount {
  id: number;
  userId: number;
  metaBusinessId: string;
  wabaId: string;
  phoneNumberId: string;
  displayPhoneNumber: string;
  businessName: string | null;
  qualityRating: string | null;
  status: "active" | "disconnected" | "suspended";
  tokenExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsappConnectionStatus {
  connected: boolean;
  account: WhatsappBusinessAccount | null;
}
