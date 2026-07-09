// ─── Blog content model + posts ─────────────────────────────────────────────
// Drives the /blog listing and /blog/[slug] post pages. Covers use CSS gradients
// + an emoji glyph (no image assets needed); swap in real images later by adding
// a `coverImage` field and rendering it in the post/card components.

export interface BlogSection {
  heading?: string;
  paragraphs?: string[];
  list?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorRole: string;
  date: string; // ISO yyyy-mm-dd
  readTime: string; // e.g. "6 min read"
  glyph: string; // emoji shown on the cover
  gradient: [string, string]; // cover gradient [from, to]
  content: BlogSection[];
}

const CTA: BlogSection = {
  heading: "Get started with Squalto",
  paragraphs: [
    "Squalto gives you everything you need to grow on the WhatsApp Business API — onboarding in minutes, AI-assisted templates, bulk campaigns, a shared team inbox, audience segmentation, and delivery analytics. Connect your number for free and send your first message today.",
  ],
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "whatsapp-business-api-healthcare",
    title: "10 Ways to Use the WhatsApp Business API in Healthcare",
    excerpt:
      "From appointment reminders to post-treatment follow-ups, here's how clinics and hospitals use WhatsApp to engage patients on the channel they already check.",
    category: "Industry",
    author: "Aharsh Singh",
    authorRole: "Product, Squalto",
    date: "2026-06-20",
    readTime: "8 min read",
    glyph: "🏥",
    gradient: ["#4F46E5", "#06B6D4"],
    content: [
      {
        paragraphs: [
          "Healthcare runs on timely communication, yet email goes unread and phone lines stay busy. WhatsApp messages see roughly a 98% open rate and far higher engagement than email — making the WhatsApp Business API a natural fit for patient communication.",
          "Here are ten practical ways healthcare providers put it to work.",
        ],
      },
      { heading: "1. Appointment reminders", paragraphs: ["Cut no-shows with automated reminders 24 hours and 1 hour before an appointment, including the doctor, location, and a one-tap reschedule button."] },
      { heading: "2. Booking confirmations", paragraphs: ["Confirm new bookings instantly with a template message so patients have the details saved in a chat they can find again."] },
      { heading: "3. Test results & reports", paragraphs: ["Notify patients the moment reports are ready, with a secure link to view or download — no calling the front desk."] },
      { heading: "4. Satisfaction surveys", paragraphs: ["Send a short post-visit survey with quick-reply buttons to capture feedback while the experience is fresh."] },
      { heading: "5. Medication & care reminders", paragraphs: ["Schedule recurring reminders for medication, physiotherapy, or follow-up visits to improve adherence."] },
      { heading: "6. Virtual support", paragraphs: ["Run a shared inbox so support staff can answer questions about prescriptions, timings, and insurance in real time."] },
      { heading: "7. Health tips & campaigns", paragraphs: ["Segment patients and send relevant seasonal health campaigns — vaccination drives, check-up packages, wellness tips."] },
      { heading: "8. Verified brand identity", paragraphs: ["A verified green tick reassures patients that messages genuinely come from your hospital, reducing the risk of impersonation."] },
      { heading: "9. Targeted promotions", paragraphs: ["Promote health packages to the right segment — preventive screenings to over-40s, dental check-ups to families — using tags and lists."] },
      { heading: "10. Post-treatment follow-up", paragraphs: ["Check in after a procedure with recovery instructions and an easy way to flag concerns, improving outcomes and trust."] },
      CTA,
    ],
  },
  {
    slug: "whatsapp-business-api-vs-app",
    title: "WhatsApp Business API vs WhatsApp Business App: Which Do You Need?",
    excerpt:
      "They sound the same but solve very different problems. Here's a clear breakdown to help you pick the right one for your business size and goals.",
    category: "Guides",
    author: "Aharsh Singh",
    authorRole: "Product, Squalto",
    date: "2026-06-15",
    readTime: "6 min read",
    glyph: "⚖️",
    gradient: ["#7C3AED", "#4F46E5"],
    content: [
      { paragraphs: ["Meta offers two business products under the WhatsApp name, and choosing the wrong one costs you time. Let's clear it up."] },
      { heading: "The WhatsApp Business App", paragraphs: ["A free mobile app for solo owners and small shops. You message customers manually from a phone, with a catalog, quick replies, and labels. It's simple but capped at one device and no automation at scale."] },
      { heading: "The WhatsApp Business API", paragraphs: ["A programmatic platform for teams and growing businesses. It powers automated notifications, bulk campaigns, chatbots, a multi-agent shared inbox, and integrations with your CRM — all through a provider like Squalto."] },
      { heading: "Key differences", list: ["Scale: the app is one-person; the API serves whole teams.", "Automation: only the API supports templates, campaigns, and bots.", "Multi-agent: the API lets many agents share one number.", "Integrations: the API connects to your stack; the app does not."] },
      { heading: "Which should you choose?", paragraphs: ["If you're a solo operator sending a handful of messages a day, the app is fine. The moment you need automation, multiple agents, campaigns, or analytics, you've outgrown it — move to the API."] },
      CTA,
    ],
  },
  {
    slug: "whatsapp-green-tick-verification",
    title: "How to Get Your WhatsApp Green Tick (Verified Badge)",
    excerpt:
      "The green tick builds instant trust. Here's what it is, who qualifies, and exactly how to apply for official business verification.",
    category: "Guides",
    author: "Aharsh Singh",
    authorRole: "Product, Squalto",
    date: "2026-06-10",
    readTime: "5 min read",
    glyph: "✅",
    gradient: ["#16A34A", "#06B6D4"],
    content: [
      { paragraphs: ["The green verified badge tells customers your business is the real deal. It boosts open rates and protects your brand from impersonation."] },
      { heading: "What the green tick means", paragraphs: ["It's the Official Business Account badge granted by Meta. It appears next to your business name even before the customer saves your number."] },
      { heading: "Who qualifies", paragraphs: ["Verification is granted at Meta's discretion, typically to notable, authentic brands. A strong public presence and consistent branding help your case."] },
      { heading: "How to apply", list: ["Connect your number to the WhatsApp Business API.", "Complete Meta Business verification for your organization.", "Maintain a high-quality phone number rating.", "Submit the green-tick request through your provider or Business Manager."] },
      { heading: "Improve your odds", paragraphs: ["Keep your messaging quality high, avoid spammy templates, and ensure your brand is referenced across the web. Quality rating matters as much as the application itself."] },
      CTA,
    ],
  },
  {
    slug: "whatsapp-marketing-campaign-ideas",
    title: "7 WhatsApp Marketing Campaign Ideas That Actually Convert",
    excerpt:
      "Open rates near 98% are wasted on boring broadcasts. These seven campaign formats turn conversations into revenue.",
    category: "Marketing",
    author: "Aharsh Singh",
    authorRole: "Product, Squalto",
    date: "2026-06-05",
    readTime: "7 min read",
    glyph: "🚀",
    gradient: ["#F59E0B", "#EF4444"],
    content: [
      { paragraphs: ["WhatsApp gets opened. The hard part is giving people a reason to act. These campaign types consistently outperform a generic blast."] },
      { heading: "1. Abandoned-cart recovery", paragraphs: ["Nudge shoppers who left items behind with a friendly reminder and a small incentive. This single flow often pays for the whole platform."] },
      { heading: "2. Flash sales & drops", paragraphs: ["Announce limited-time offers to a segmented list with a clear deadline and a one-tap CTA button."] },
      { heading: "3. Back-in-stock alerts", paragraphs: ["Let customers opt in for restock notifications, then trigger an instant message the moment inventory returns."] },
      { heading: "4. Order & shipping updates", paragraphs: ["Transactional updates have huge engagement — and a perfect place to cross-sell a complementary product."] },
      { heading: "5. Loyalty & VIP offers", paragraphs: ["Tag your best customers and send them early access or exclusive perks to deepen retention."] },
      { heading: "6. Re-engagement win-backs", paragraphs: ["Reach lapsed customers with a personalized 'we miss you' offer based on their past purchases."] },
      { heading: "7. Event & webinar reminders", paragraphs: ["Drive attendance with confirmations and timely reminders that reduce drop-off."] },
      CTA,
    ],
  },
  {
    slug: "whatsapp-template-approval-guide",
    title: "WhatsApp Message Templates: A Complete Guide to Approval",
    excerpt:
      "Template rejections slow you down. Learn the categories, formatting rules, and common mistakes so yours get approved the first time.",
    category: "Guides",
    author: "Aharsh Singh",
    authorRole: "Product, Squalto",
    date: "2026-05-30",
    readTime: "7 min read",
    glyph: "📝",
    gradient: ["#4F46E5", "#7C3AED"],
    content: [
      { paragraphs: ["Templates are pre-approved messages you can send outside the 24-hour window. Get them right and you ship fast; get them wrong and you wait on rejections."] },
      { heading: "The three categories", list: ["Marketing — promotions, offers, announcements.", "Utility — order updates, reminders, account notifications.", "Authentication — one-time passcodes and verification."] },
      { heading: "Formatting rules", paragraphs: ["Use clear variable placeholders, avoid excessive emoji, and never include URLs that look like phishing. Marketing templates must give recipients a clear sense of who's messaging and why."] },
      { heading: "Common rejection reasons", list: ["Variable placeholders with no example content.", "Misleading or vague content.", "Wrong category (marketing copy filed as utility).", "Grammar or formatting issues."] },
      { heading: "Tips for first-time approval", paragraphs: ["Keep it specific, match the category to the intent, and preview the rendered message before submitting. With Squalto, AI-assisted drafting helps you write copy that fits the policy from the start."] },
      CTA,
    ],
  },
  {
    slug: "abandoned-cart-recovery-whatsapp",
    title: "Recover Abandoned Carts on WhatsApp: A Step-by-Step Playbook",
    excerpt:
      "Seven in ten carts are abandoned. This playbook shows the exact message sequence to win shoppers back over WhatsApp.",
    category: "Marketing",
    author: "Aharsh Singh",
    authorRole: "Product, Squalto",
    date: "2026-05-22",
    readTime: "6 min read",
    glyph: "🛒",
    gradient: ["#EC4899", "#8B5CF6"],
    content: [
      { paragraphs: ["The average cart abandonment rate hovers around 70%. WhatsApp's open rates make it the best channel to recover that lost revenue."] },
      { heading: "Why WhatsApp beats email here", paragraphs: ["Recovery emails are easy to ignore and often land in promotions. A WhatsApp message gets seen within minutes — exactly when intent is still warm."] },
      { heading: "The three-message sequence", list: ["Message 1 (1 hour later): a gentle reminder with the cart contents.", "Message 2 (24 hours later): add social proof or a small incentive.", "Message 3 (48 hours later): final nudge with urgency or a time-limited code."] },
      { heading: "Make it personal", paragraphs: ["Pull the customer's name and the actual products into template variables. A relevant message converts far better than a generic 'you left something behind'."] },
      { heading: "Measure and iterate", paragraphs: ["Track delivery, read, and conversion per step. Drop or tweak the steps that don't earn their place."] },
      CTA,
    ],
  },
  {
    slug: "whatsapp-customer-support-shared-inbox",
    title: "WhatsApp for Customer Support: Building a Shared Team Inbox",
    excerpt:
      "One number, many agents, zero chaos. Here's how a shared WhatsApp inbox transforms your support team's speed and quality.",
    category: "Automation",
    author: "Aharsh Singh",
    authorRole: "Product, Squalto",
    date: "2026-05-14",
    readTime: "6 min read",
    glyph: "💬",
    gradient: ["#0EA5E9", "#4F46E5"],
    content: [
      { paragraphs: ["Customers want to message your business the way they message friends. A shared WhatsApp inbox lets a whole team deliver that experience from a single number."] },
      { heading: "The problem with a phone", paragraphs: ["The WhatsApp Business App ties a number to one device. Only one person can reply, history is trapped, and nothing scales."] },
      { heading: "How a shared inbox works", paragraphs: ["With the API, inbound messages flow into a web inbox where every agent sees conversations threaded by customer, updated in real time, with read state synced across the team."] },
      { heading: "Features that matter", list: ["Real-time updates so two agents never collide.", "Conversation history for full context.", "Mark-as-read and assignment to keep the queue tidy.", "Templates for fast, consistent replies."] },
      { heading: "The payoff", paragraphs: ["Faster first responses, consistent answers, and happier customers — without juggling phones or losing history."] },
      CTA,
    ],
  },
  {
    slug: "whatsapp-pricing-explained",
    title: "Understanding WhatsApp Pricing: Conversation-Based Charges Explained",
    excerpt:
      "WhatsApp doesn't charge per message — it charges per conversation. Here's how the model works and how to keep costs down.",
    category: "Guides",
    author: "Aharsh Singh",
    authorRole: "Product, Squalto",
    date: "2026-05-06",
    readTime: "6 min read",
    glyph: "💰",
    gradient: ["#10B981", "#4F46E5"],
    content: [
      { paragraphs: ["WhatsApp Business API pricing confuses a lot of first-timers because it isn't per-message. Let's break down how you're actually billed."] },
      { heading: "Conversations, not messages", paragraphs: ["You're charged per 24-hour conversation window, not per individual message. Within that window, all messages between you and the customer are part of one conversation."] },
      { heading: "Conversation categories", list: ["Marketing — promotional outreach.", "Utility — transactional updates.", "Authentication — OTPs and verification.", "Service — customer-initiated support (often free within limits)."] },
      { heading: "The free entry points", paragraphs: ["Conversations that start from click-to-WhatsApp ads or Facebook Page CTAs can be free for a period, and customer-initiated service conversations have a free allowance."] },
      { heading: "How to control costs", paragraphs: ["Group messages within the 24-hour window, choose the right category, lean on free service windows, and segment so you only send to people who'll engage."] },
      CTA,
    ],
  },
  {
    slug: "bulk-whatsapp-best-practices",
    title: "Bulk WhatsApp Campaigns: Best Practices to Avoid Getting Blocked",
    excerpt:
      "Sending at scale is powerful — and risky if you ignore the rules. Follow these practices to protect your number's quality rating.",
    category: "Marketing",
    author: "Aharsh Singh",
    authorRole: "Product, Squalto",
    date: "2026-04-28",
    readTime: "7 min read",
    glyph: "📣",
    gradient: ["#F97316", "#EC4899"],
    content: [
      { paragraphs: ["Bulk campaigns drive real revenue, but careless sending tanks your quality rating and can get your number flagged. Here's how to scale safely."] },
      { heading: "Only message opted-in contacts", paragraphs: ["Permission is everything. Build your list from real opt-ins — never buy or scrape numbers. Unwanted messages lead to blocks and complaints."] },
      { heading: "Warm up your number", paragraphs: ["Ramp volume gradually rather than blasting tens of thousands on day one. A steady increase keeps your quality rating healthy."] },
      { heading: "Segment and personalize", paragraphs: ["Relevant messages get fewer blocks. Use tags and lists to send the right offer to the right people, with personalized variables."] },
      { heading: "Respect frequency", paragraphs: ["Don't overwhelm contacts. A predictable, useful cadence beats constant promotions that trigger opt-outs."] },
      { heading: "Watch your metrics", paragraphs: ["Monitor delivery, read, and block rates per campaign. A spike in blocks is your early-warning signal to slow down and reassess."] },
      CTA,
    ],
  },
  {
    slug: "rcs-vs-whatsapp",
    title: "RCS vs WhatsApp: Choosing the Right Channel for Business Messaging",
    excerpt:
      "Both deliver rich, interactive messages — but they reach different audiences. Here's how to decide where to invest.",
    category: "Industry",
    author: "Aharsh Singh",
    authorRole: "Product, Squalto",
    date: "2026-04-18",
    readTime: "6 min read",
    glyph: "📡",
    gradient: ["#8B5CF6", "#0EA5E9"],
    content: [
      { paragraphs: ["RCS and WhatsApp both upgrade business messaging beyond plain SMS, with cards, buttons, and media. But they aren't interchangeable."] },
      { heading: "What is RCS?", paragraphs: ["Rich Communication Services is the successor to SMS, built into the native messaging app on Android. No app install — it works in the default messages inbox."] },
      { heading: "What WhatsApp offers", paragraphs: ["A dedicated app with enormous global reach, end-to-end encryption, and a mature business platform of templates, campaigns, and inboxes."] },
      { heading: "How to choose", list: ["Reach: WhatsApp dominates in many regions; RCS depends on carrier and Android adoption.", "Audience: heavy Android, carrier-default users favor RCS.", "Features: WhatsApp's business ecosystem is more mature today."] },
      { heading: "Why not both?", paragraphs: ["The smartest strategy is often multi-channel — reach customers on WhatsApp and fall back to RCS or SMS where it performs better. Squalto supports WhatsApp and RCS from one platform."] },
      CTA,
    ],
  },
];

export const BLOG_CATEGORIES = [
  "All",
  ...Array.from(new Set(BLOG_POSTS.map((p) => p.category))),
];

export const getPost = (slug: string): BlogPost | undefined =>
  BLOG_POSTS.find((p) => p.slug === slug);

export const formatBlogDate = (iso: string): string =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
