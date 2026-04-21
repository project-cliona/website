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

export type WhatsappCampaignStatus =
  | "draft"
  | "queued"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "failed";

export interface WhatsappCampaign {
  id: number;
  userId: number;
  wabaId: string;
  campaignName: string;
  templateName: string;
  templateLanguage: string;
  totalRecipients: number;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  status: WhatsappCampaignStatus;
  scheduledAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsappCampaignCreateResult {
  id: number;
  totalRecipients: number;
  skippedInvalid: number;
  status: WhatsappCampaignStatus;
  scheduledAt: string | null;
}

export interface WhatsappCampaignCancelResult {
  cancelledPending: number;
}

export interface WhatsappCampaignListResponse {
  campaigns: WhatsappCampaign[];
  total: number;
  page: number;
  limit: number;
}

// whatsappMessages row scoped to a campaign. Per-recipient drill-down row.
export interface WhatsappCampaignMessage {
  id: number;
  userId: number;
  campaignId: number | null;
  wabaId: string;
  wamid: string | null;
  direction: "outbound" | "inbound";
  recipientPhone: string;
  type: string;
  templateName: string | null;
  templateLanguage: string | null;
  content: Record<string, unknown> | null;
  variables: Record<string, string> | string[] | null;
  status:
    | "pending"
    | "accepted"
    | "sent"
    | "delivered"
    | "read"
    | "failed"
    | "cancelled";
  failureReason: string | null;
  pricing: Record<string, unknown> | null;
  sentAt: string | null;
  deliveredAt: string | null;
  readAt: string | null;
  failedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsappCampaignMessagesResponse {
  messages: WhatsappCampaignMessage[];
  total: number;
  page: number;
  limit: number;
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

// --- WhatsApp Messaging & DLR Types ---

export interface WhatsappMessage {
  id: number;
  userId: number;
  wabaId: string;
  wamid: string;
  direction: "outbound" | "inbound";
  recipientPhone: string;
  type: string; // template | text | image | video | document | interactive
  templateName: string | null;
  templateLanguage: string | null;
  content: Record<string, unknown> | null;
  status: "accepted" | "sent" | "delivered" | "read" | "failed";
  failureReason: string | null;
  pricing: Record<string, unknown> | null;
  sentAt: string | null;
  deliveredAt: string | null;
  readAt: string | null;
  failedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsappMessagesResponse {
  messages: WhatsappMessage[];
  total: number;
  page: number;
  limit: number;
}

export interface WhatsappSendTemplatePayload {
  to: string;
  templateName: string;
  language: string;
  components?: Record<string, unknown>[];
}

export interface WhatsappSendTextPayload {
  to: string;
  text: string;
  previewUrl?: boolean;
}
