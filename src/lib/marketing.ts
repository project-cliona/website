// ─── Marketing site shared data ─────────────────────────────────────────────
// Design tokens + feature definitions used by the public /features pages and the
// shared marketing Navbar/Footer. Mirrors the inline design language of the
// landing page (src/app/page.tsx).

import {
  Rocket,
  Sparkles,
  Megaphone,
  Inbox,
  Users,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

// ─── Design tokens ───────────────────────────────────────────────────────────
export const C = {
  darkBg: "#0F1117",
  darkCard: "#161B22",
  darkBorder: "#21262D",
  accent: "#4F46E5",
  accentHover: "#4338CA",
  accentLight: "#E0E7FF",
};

// ─── Types ─────────────────────────────────────────────────────────────────--
export interface FeatureDetailCard {
  title: string;
  desc: string;
}

export interface FeatureStep {
  title: string;
  desc: string;
}

export interface FeatureFaq {
  q: string;
  a: string;
}

export interface Feature {
  /** URL slug → /features/<slug> */
  slug: string;
  /** lucide icon component */
  icon: LucideIcon;
  /** short label for cards & nav */
  navTitle: string;
  /** one-line description for the features grid */
  shortDesc: string;
  /** hero heading on the detail page */
  title: string;
  /** hero subheading on the detail page */
  tagline: string;
  /** 3 value-prop bullets shown in the hero */
  heroBullets: string[];
  /** floating stat shown over the hero mockup */
  heroStat: { value: string; label: string };
  /** heading for the detail/benefits section */
  sectionTitle: string;
  /** 3 detail cards */
  detailCards: FeatureDetailCard[];
  /** "How it works" sequential steps */
  steps: FeatureStep[];
  /** optional FAQ entries */
  faqs?: FeatureFaq[];
}

// ─── Feature catalog (order as requested) ────────────────────────────────────
export const FEATURES: Feature[] = [
  {
    slug: "whatsapp-onboarding",
    icon: Rocket,
    navTitle: "WhatsApp Onboarding",
    shortDesc:
      "Connect your WhatsApp Business number through Meta's official Embedded Signup — no developer needed.",
    title: "Go Live on the WhatsApp Business API in Minutes",
    tagline:
      "Connect your WhatsApp Business number through Meta's official Embedded Signup. We handle token exchange, phone registration, and webhooks for you.",
    heroBullets: [
      "Self-serve Embedded Signup powered directly by Meta",
      "Automatic phone-number registration & verification",
      "Webhooks wired up and green-tick ready from day one",
    ],
    heroStat: { value: "< 5 min", label: "To Go Live" },
    sectionTitle: "Connect Your Number Without the Headache",
    detailCards: [
      {
        title: "Official Meta Embedded Signup",
        desc: "Approve and connect your WhatsApp Business Account inside a guided Meta flow — no copy-pasting tokens or IDs.",
      },
      {
        title: "Done-for-you Registration",
        desc: "We exchange your authorization code, register your phone number, and subscribe your account to webhooks automatically.",
      },
      {
        title: "Connect & Disconnect Anytime",
        desc: "See your onboarding status at a glance and disconnect or reconnect a number whenever you need to.",
      },
    ],
    steps: [
      { title: "Create your Squalto account", desc: "Sign up for free — no credit card required." },
      { title: "Click ‘Connect WhatsApp’", desc: "Launch the official Meta Embedded Signup right from your dashboard." },
      { title: "Select your Business & number", desc: "Pick the WhatsApp Business Account and phone number you want to use." },
      { title: "We register it for you", desc: "Squalto exchanges tokens, registers your number, and subscribes webhooks behind the scenes." },
      { title: "Start messaging", desc: "Your number is live — create templates and send your first campaign." },
    ],
    faqs: [
      { q: "Do I need a Meta developer account?", a: "No. The Embedded Signup runs inside your Squalto dashboard and handles the Meta setup for you." },
      { q: "Can I connect more than one number?", a: "Yes — connect, disconnect, and manage your WhatsApp Business numbers from a single place." },
    ],
  },
  {
    slug: "ai-template-management",
    icon: Sparkles,
    navTitle: "AI Template Management",
    shortDesc:
      "Draft approval-ready WhatsApp templates with AI and sync Meta approval status in real time.",
    title: "Create Approval-Ready Templates with AI",
    tagline:
      "Draft, refine, and manage your WhatsApp message templates with AI assistance — then watch Meta's approval status sync back automatically.",
    heroBullets: [
      "AI-assisted copy that fits WhatsApp's template policy",
      "Two-way approval-status sync straight from Meta",
      "Categories, languages, variables & rich media headers",
    ],
    heroStat: { value: "Auto", label: "Approval Sync" },
    sectionTitle: "Smarter Templates, Faster Approvals",
    detailCards: [
      {
        title: "AI-Assisted Drafting",
        desc: "Describe your message and let AI suggest compliant, on-brand template copy across marketing, utility, and authentication categories.",
      },
      {
        title: "Live Meta Approval Status",
        desc: "Submitted templates sync their status — approved, pending, or rejected with reasons — directly from Meta via webhooks.",
      },
      {
        title: "Variables & Rich Headers",
        desc: "Add dynamic variables, buttons, and image, video, or document headers, then preview exactly how each message will look.",
      },
    ],
    steps: [
      { title: "Describe your message", desc: "Tell the AI the goal — a promo, an order update, an OTP — and your tone." },
      { title: "Refine the draft", desc: "Edit the AI-generated copy, add variables, buttons, and a media header." },
      { title: "Preview the template", desc: "See a true-to-WhatsApp preview before you submit for approval." },
      { title: "Submit to Meta", desc: "Send the template to Meta with one click, straight from Squalto." },
      { title: "Track approval", desc: "Watch the status update automatically and reuse approved templates in campaigns." },
    ],
    faqs: [
      { q: "Will AI templates get approved?", a: "AI drafts follow WhatsApp's template guidelines to maximize approval odds, but final approval is always decided by Meta." },
      { q: "Can I edit a template after creating it?", a: "Yes — edit your templates and the changes sync back to Meta." },
    ],
  },
  {
    slug: "bulk-campaigns",
    icon: Megaphone,
    navTitle: "Bulk Campaigns",
    shortDesc:
      "Broadcast template messages to segmented audiences with retries and live delivery tracking.",
    title: "Broadcast to Thousands in a Few Clicks",
    tagline:
      "Send template campaigns to segmented audiences with built-in rate-limit handling, automatic retries, and live per-recipient delivery tracking.",
    heroBullets: [
      "Send to lists, tags, or pasted numbers in one flow",
      "Built-in concurrency, retries & rate-limit handling",
      "Live delivery status and one-click campaign cancel",
    ],
    heroStat: { value: "98%", label: "Delivery Rate" },
    sectionTitle: "Campaigns That Just Deliver",
    detailCards: [
      {
        title: "Audience in One Place",
        desc: "Target a saved list, a tag-based segment, or a quick paste of numbers — and preview exactly who will receive the message.",
      },
      {
        title: "Reliable at Scale",
        desc: "Messages dispatch with smart concurrency and automatic retries on rate limits, so large sends complete without manual babysitting.",
      },
      {
        title: "Live Tracking & Control",
        desc: "Watch sent, delivered, read, and failed counts update in real time — and cancel a campaign mid-send whenever you need to.",
      },
    ],
    steps: [
      { title: "Pick an approved template", desc: "Choose any Meta-approved template for your broadcast." },
      { title: "Choose your audience", desc: "Select a list, a tag segment, or paste numbers — then preview the recipients." },
      { title: "Map your variables", desc: "Fill in template variables so each message is personalized." },
      { title: "Launch the campaign", desc: "Squalto queues and dispatches messages with retries and rate-limit handling." },
      { title: "Track delivery live", desc: "Monitor delivery and read rates in real time, and cancel anytime." },
    ],
    faqs: [
      { q: "How large can a campaign be?", a: "Campaigns dispatch in chunks with concurrency control, so they scale to large audiences while respecting WhatsApp's limits." },
      { q: "Can I stop a campaign after sending?", a: "Yes — cancel a running campaign and any unsent messages are stopped immediately." },
    ],
  },
  {
    slug: "team-inbox",
    icon: Inbox,
    navTitle: "Team Inbox",
    shortDesc:
      "Reply to inbound WhatsApp messages in real time with threaded conversations and read receipts.",
    title: "Every Customer Conversation in One Shared Inbox",
    tagline:
      "Capture inbound WhatsApp messages, reply in real time, and keep every thread organized — updated live across your team.",
    heroBullets: [
      "Inbound messages captured instantly via webhooks",
      "Threaded conversations grouped by customer",
      "Real-time updates and mark-as-read across your team",
    ],
    heroStat: { value: "Live", label: "Realtime Sync" },
    sectionTitle: "Talk to Customers Where They Already Are",
    detailCards: [
      {
        title: "Unified Conversations",
        desc: "Every inbound and outbound message is threaded by customer, so your team always has the full context of a chat.",
      },
      {
        title: "Real-Time Updates",
        desc: "New messages appear instantly over a live connection — no refreshing — and read state stays in sync for everyone.",
      },
      {
        title: "Reply in a Click",
        desc: "Respond to customers directly from the inbox and mark conversations as read to keep your queue tidy.",
      },
    ],
    steps: [
      { title: "Customer messages you", desc: "An inbound WhatsApp message arrives and is captured via webhook." },
      { title: "It lands in the inbox", desc: "The message is threaded under that customer in your shared inbox." },
      { title: "Your team sees it live", desc: "The conversation updates in real time for every agent online." },
      { title: "Reply and resolve", desc: "Respond from the inbox and mark the conversation as read." },
    ],
    faqs: [
      { q: "Do multiple agents see the same inbox?", a: "Yes — conversations and read state sync in real time across your team." },
      { q: "Are inbound messages stored?", a: "Yes, every message is persisted and threaded so you keep full conversation history." },
    ],
  },
  {
    slug: "contacts-audience",
    icon: Users,
    navTitle: "Contacts & Audience",
    shortDesc:
      "Import contacts in bulk, tag and segment them into lists, and preview your audience before every send.",
    title: "Organize Contacts and Target the Right Audience",
    tagline:
      "Import contacts in bulk, tag and segment them into lists, and preview your exact audience before every campaign.",
    heroBullets: [
      "Bulk CSV import & export with phone validation",
      "Tags and lists for flexible segmentation",
      "Audience preview before you hit send",
    ],
    heroStat: { value: "10K+", label: "Contacts / Import" },
    sectionTitle: "Build Audiences You Can Trust",
    detailCards: [
      {
        title: "Bulk Import & Export",
        desc: "Upload thousands of contacts from a CSV with automatic phone-number validation, and export any segment whenever you need it.",
      },
      {
        title: "Tags & Lists",
        desc: "Group contacts into lists and apply tags, then build precise segments with bulk add, remove, and delete operations.",
      },
      {
        title: "Audience Preview",
        desc: "Before launching a campaign, preview the exact match count and a sample of recipients so you never send to the wrong people.",
      },
    ],
    steps: [
      { title: "Import your contacts", desc: "Upload a CSV — phone numbers are validated and normalized automatically." },
      { title: "Tag and organize", desc: "Apply tags and group contacts into lists for easy targeting." },
      { title: "Build a segment", desc: "Combine lists and tags to define exactly who you want to reach." },
      { title: "Preview the audience", desc: "Confirm the match count and sample recipients before you send." },
    ],
    faqs: [
      { q: "How many contacts can I import at once?", a: "You can import large CSV files — thousands of contacts per upload — with validation applied automatically." },
      { q: "Can I export my contacts?", a: "Yes, export any list or segment to CSV at any time." },
    ],
  },
  {
    slug: "analytics",
    icon: BarChart3,
    navTitle: "Analytics & Reporting",
    shortDesc:
      "Track delivery, read rates, and campaign performance with dashboards and per-message reports.",
    title: "Measure What Matters Across Every Campaign",
    tagline:
      "Track delivery, read rates, and campaign performance with clear dashboards and detailed per-message delivery reports.",
    heroBullets: [
      "Delivery, read & failure rates at a glance",
      "Per-campaign and per-message reporting",
      "Filterable delivery reports for full visibility",
    ],
    heroStat: { value: "Real-time", label: "Delivery Insights" },
    sectionTitle: "Turn Messaging Data Into Decisions",
    detailCards: [
      {
        title: "Campaign Dashboards",
        desc: "See sent, delivered, read, and failed counts for every campaign, with trends that help you understand what's working.",
      },
      {
        title: "Delivery Reports",
        desc: "Drill down to individual messages with filterable, paginated delivery reports covering status and timing.",
      },
      {
        title: "Status You Can Rely On",
        desc: "Delivery receipts flow in from Meta in real time and update campaign metrics accurately, even at high volume.",
      },
    ],
    steps: [
      { title: "Send a campaign", desc: "Launch a broadcast or send individual messages." },
      { title: "Receipts flow in", desc: "Delivery and read receipts arrive from Meta via webhooks." },
      { title: "Metrics update live", desc: "Campaign counters and delivery rates update in real time." },
      { title: "Analyze & refine", desc: "Review reports, spot what works, and improve your next campaign." },
    ],
    faqs: [
      { q: "Can I see delivery status per message?", a: "Yes — detailed delivery reports let you filter and inspect individual message status." },
      { q: "Is the data real time?", a: "Delivery and read receipts are ingested from Meta as they happen and reflected in your metrics." },
    ],
  },
];

export const getFeature = (slug: string): Feature | undefined =>
  FEATURES.find((f) => f.slug === slug);
