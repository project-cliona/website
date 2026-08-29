import type { ReactNode } from "react";
import type { Role } from "@/lib/rbac";

export interface StatsCardProps {
  icon?: ReactNode;
  iconBg?: string;
  label: string;
  value: string | number;
  trend?: { value: string; positive: boolean };
  accent?: boolean;
  onMenuOpen?: () => void;
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
  role: Role;
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
  status: "accepted" | "sent" | "delivered" | "read" | "failed" | "received";
  isRead: boolean;
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

// --- WhatsApp Conversations / Inbox ---

export interface ConversationSummary {
  contactPhone: string;
  contactName: string | null;
  lastMessageAt: string | null;
  lastMessagePreview: string;
  lastMessageType: string;
  lastMessageDirection: "inbound" | "outbound";
  unreadCount: number;
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

// Phonebook v1 types — see CLAUDE.md § Phonebook for scope.
// Opt-in / opted_out UI is deferred; shapes here carry only the fields v1 reads.

export interface WhatsappContact {
  id: number;
  userId: number;
  phone: string;
  name: string | null;
  email: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WhatsappContactList {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsappContactTag {
  tag: string;
  contactCount: number;
}

export type AudienceMode = "list" | "tags" | "paste";

export interface AudiencePreview {
  matched: number;
  sampleRecipients: Array<{
    phone: string;
    name: string | null;
  }>;
}

export interface CsvImportResult {
  added: number;
  updated: number;
  skipped: number;
  columnsIgnored: string[];
  errors: Array<{ row: number; phone: string | null; reason: string }>;
  listId: number | null;
}

export interface AdminUserRow {
  userId: number;
  email: string;
  fullName: string | null;
  roleId: Role;
  parentId: number | null;
  profileStatus: "active" | "incomplete" | "suspended" | "inactive";
  createdAt: string;
}

/* ------------------------------------------------------------------ *
 * Notifications
 * ------------------------------------------------------------------ */

export type NotificationSeverity = "critical" | "warning" | "info";

export interface AppNotification {
  id: number;
  userId: number;
  type: string;
  severity: NotificationSeverity;
  title: string;
  body: string;
  link: string | null;
  metadata: Record<string, unknown> | null;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationListResponse {
  items: AppNotification[];
  total: number;
  page: number;
  limit: number;
}

/* ------------------------------------------------------------------ *
 * WhatsApp accounts health (account_update webhook analytics)
 * ------------------------------------------------------------------ */

export interface WabaRestriction {
  restriction_type: string;
  expiration?: number;
  remediation?: string;
}

export interface NameValue {
  name: string;
  value: number;
}

export interface AccountsHealthAtRiskRow {
  wabaId: string;
  businessName: string | null;
  displayPhoneNumber: string;
  connectionState: string;
  banState: string | null;
  restrictions: WabaRestriction[] | null;
  violationType: string | null;
  lastAccountEventAt: string | null;
  ownerId: number;
  ownerEmail: string;
  ownerName: string | null;
  ownerCompany: string | null;
}

export interface AccountsHealthOverview {
  summary: {
    totalAccounts: number;
    accountsTrend: string;
    healthy: number;
    healthyPercent: string;
    banned: number;
    restricted: number;
    disconnected: number;
    atRiskTrend: string;
  };
  connectionBreakdown: NameValue[];
  restrictionBreakdown: NameValue[];
  violationBreakdown: NameValue[];
  verificationFunnel: NameValue[];
  rejectionReasons: NameValue[];
  pricingTiers: Array<{
    category: string | null;
    tier: string | null;
    region: string | null;
    value: number;
  }>;
  authIntl: { eligible: number; withExceptions: number };
  eventSeries: Array<{
    day: string;
    critical: number;
    warning: number;
    info: number;
  }>;
  eventMix: NameValue[];
  atRisk: AccountsHealthAtRiskRow[];
}

export interface AccountHealthEvent {
  id: number;
  event: string;
  severity: NotificationSeverity;
  payload: Record<string, unknown>;
  webhookTimestamp: string;
  createdAt: string;
}

export interface AccountHealthDetail {
  account: {
    wabaId: string;
    userId: number;
    businessName: string | null;
    displayPhoneNumber: string;
    status: string;
    qualityRating: string | null;
    connectionState: string;
    banState: string | null;
    banDate: string | null;
    restrictions: WabaRestriction[] | null;
    violationType: string | null;
    pricingTier: Record<string, string> | null;
    authIntlEligibility: Record<string, unknown> | null;
    primaryLocationCountry: string | null;
    partnerVerificationStatus: string | null;
    partnerVerificationRejectionReasons: string[] | null;
    disconnectionReason: string | null;
    disconnectionInitiatedBy: string | null;
    lastAccountEventAt: string | null;
    createdAt: string;
    ownerEmail: string;
    ownerName: string | null;
    ownerCompany: string | null;
  };
  timeline: AccountHealthEvent[];
}

// --- WhatsApp analytics ----------------------------------------------------

export type AnalyticsGranularity = "half_hour" | "day" | "month";

/** Shared filter state for the Analytics page. Mirrors the backend query params. */
export interface AnalyticsFilters {
  from: Date;
  to: Date;
  granularity: AnalyticsGranularity;
  wabaIds: string[];
  categories: string[];
  compare: boolean;
}

export interface AnalyticsFilterOptions {
  accounts: Array<{
    wabaId: string;
    businessName: string | null;
    displayPhoneNumber: string;
  }>;
  categories: string[];
}

export interface AnalyticsFunnelStage {
  stage: string;
  value: number;
  pctOfTotal: number;
  dropOff: number;
}

export interface AnalyticsNameValue {
  name: string;
  value: number;
}

export interface AnalyticsAccountRow {
  wabaId: string;
  businessName: string | null;
  displayPhoneNumber: string;
  qualityRating: string | null;
  banState: string | null;
  connectionState: string;
  restrictionCount: number;
}

export interface AnalyticsOverview {
  range: { from: string; to: string; granularity: AnalyticsGranularity };
  tiles: {
    sent: number;
    sentTrend: string;
    delivered: number;
    deliveredTrend: string;
    read: number;
    readTrend: string;
    failed: number;
    failedTrend: string;
    deliveryRate: string;
    deliveryRateTrend: string;
    readRate: string;
    readRateTrend: string;
  };
  series: Array<Record<string, string | number>>;
  funnel: AnalyticsFunnelStage[];
  failureReasons: AnalyticsNameValue[];
  categoryMix: AnalyticsNameValue[];
  accounts: AnalyticsAccountRow[];
}
