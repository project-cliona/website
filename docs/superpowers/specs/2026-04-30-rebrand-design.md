# Squalto Rebrand — Design Spec

- **Date:** 2026-04-30
- **Scope:** Full UI rebrand and redesign of the in-app product, auth pages, and marketing landing
- **Repo:** `website` (frontend only)
- **Functional scope:** UI/UX only — no flow changes, no feature additions, no API changes
- **Brand pivot:** Squalto green → indigo. Green is demoted to a single semantic role (`--success`).
- **Status of existing work:** The 9 commits already on `design/ui-polish-pass` (token system, brand assets, PhoneFrame, Button, Input, Badge, PageHeading, Card + 15 raw-div migrations) **stay**. Phase R1 re-tokens them indigo-primary. Nothing is reverted.

This spec supersedes [`2026-04-29-ui-polish-pass-design.md`](./2026-04-29-ui-polish-pass-design.md) for everything not yet implemented. Any decisions in the prior polish-pass spec that conflict with this rebrand spec are overridden here.

---

## 1. Goals

- Replace Squalto's green-led visual identity with an indigo-led identity that feels like a modern AI-era SaaS product, not a WhatsApp clone.
- Apply the rebrand across every user-facing surface: in-app product, auth pages, and marketing landing.
- Introduce a coherent component system: shared chrome (sidebar, top bar, page heading), four card types, refined tables, a chart system.
- Preserve every existing flow, feature, and data shape. Backend is untouched. Component prop APIs stay backward-compatible where existing call sites depend on them.

## 2. Non-Goals

- New product features. No new functionality, no new pages, no API changes.
- Custom illustrations. Promo cards use Lucide icons in tinted circles (designer follow-up later if desired).
- Internationalization, i18n, or copy redesign beyond what the visual treatment requires.
- Mobile app surfaces. Web only.
- Dark mode. Tokens are dark-ready (counterparts declared) but the toggle and per-screen dark audit are deferred to a future phase.
- A11y rework beyond `prefers-reduced-motion`, focus rings, and aria-invalid (which we already ship). A formal accessibility audit is a separate concern.

## 3. Design tokens

### 3.1 Color — primary ramp (indigo)

Replaces the green ramp in `globals.css`.

| Token | Value | Use |
|---|---|---|
| `--primary-50` | `#EEF2FF` | Hover row tint, sidebar active item background, hero card wash |
| `--primary-100` | `#E0E7FF` | Soft pill backgrounds, `active` badge, AI button mid-stop |
| `--primary-200` | `#C7D2FE` | `highlight` Card border, hero StatsCard border |
| `--primary-300` | `#A5B4FC` | Subtle accents |
| `--primary-400` | `#818CF8` | Chart secondary data points |
| `--primary-500` | `#6366F1` | Charts, accents, brighter highlights |
| `--primary-600` | `#4F46E5` | **Canonical brand.** Buttons, focus rings (at 30% opacity), funnel-bar fill, sidebar active border |
| `--primary-700` | `#4338CA` | Active/pressed states, text on `primary-100` backgrounds |
| `--primary-800` | `#3730A3` | High-contrast text on light primary washes |
| `--primary-900` | `#312E81` | Display headings on white when extra weight is needed |
| `--primary-950` | `#1E1B4B` | Dark wash, text on primary-50 |

### 3.2 Color — semantic

- `--success` = `#16A34A` (the former Squalto green, now used **only** for trend chips, the success-check on form footers, completed-state status pills, and the send-celebration moment)
- `--warning` = `#D97706` (amber-600)
- `--info` = `#2563EB` (blue-600)
- `--destructive` = `#DC2626` (red-600)
- `--destructive-foreground` = `#FFFFFF`

### 3.3 Color — channel

- WhatsApp: `#25D366` (only for WhatsApp-specific UI like the WhatsApp message preview chrome — never in product chrome)
- RCS: `#7C3AED` (violet-600 — bumped from indigo to avoid colliding with `--primary`)
- SMS: `#4B5563` (gray-600)

### 3.4 AI gradient

A new utility for premium AI surfaces. Used by the "Get AI Insight" button in the top bar and any future AI-marker buttons (e.g., "Open AI Assistant").

```css
--gradient-ai: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%);
```

Utility: `.bg-ai-gradient { background: var(--gradient-ai); }`. Pair with `text-white` and `shadow-e2`.

### 3.5 Neutrals

Slate ramp, unchanged from prior spec.

```
--background: #FFFFFF
--foreground: #0F172A   /* slate-900 */
--card: #FFFFFF
--popover: #FFFFFF
--secondary: #F1F5F9    /* slate-100 */
--muted: #F8FAFC        /* slate-50 */
--muted-foreground: #64748B /* slate-500 */
--border: #E2E8F0       /* slate-200 */
--input: #E2E8F0
--ring: var(--primary-600)
```

### 3.6 Typography, spacing, radius, elevation, motion

Unchanged from the prior polish-pass spec — type scale (display/h1/h2/h3/body/small/caption), spacing rhythm (4/8/12/16/24/32/48/64), radius (sm 6 / md 8 / lg 12 / xl 16), elevation (`e0`–`e4` plus `shadow-primary-glow`), motion durations (fast 120 / base 180 / slow 240).

`shadow-primary-glow` retokens automatically to indigo because it references `--primary-600` via opacity. The hover glow on default Buttons becomes indigo without code changes.

### 3.7 Brand mark color shift

The placeholder `public/logo-mark.svg` and `public/logo-wordmark.svg` (shipped in earlier work) currently use `#16A34A`. Re-render with `#4F46E5`. The wordmark text stays slate-900.

### 3.8 What re-tokens automatically

The 9 commits already shipped use semantic tokens, so they pick up the indigo system without code changes:

- Button default variant (indigo with indigo glow on hover)
- Card `highlight` variant (indigo-50 wash, indigo-200 border)
- Badge `active` variant (indigo-100/800 — confirmed in brainstorm: Active uses brand color, not green)
- Input focus ring (indigo at 30%)
- StatsCard `accent` variant (indigo-tinted)
- Sidebar active state (when sidebar ships, uses indigo-50 / indigo-700)
- The `:focus-visible` ring across primitives

The only manual edits needed in R1 are: `globals.css` token values, the two SVG mark files, and a verification sweep that no surface is hard-coded to green.

---

## 4. Component atoms

### 4.1 Existing atoms (already shipped, no rebuild needed)

These re-token automatically from R1's color shift. Their APIs are stable; consumers continue to work.

- **Button** (default = indigo, xs/sm/default/lg/icon sizes, loading prop, indigo glow on hover, focus-ring utility)
- **Input** (focus ring, leadingIcon, trailingSlot, invalid prop)
- **Badge** (variants default/secondary/destructive/outline/active/pending/inactive/rejected/info, sm/md sizes, optional dot indicator)
- **PageHeading** (eyebrow, title, subtitle, actions slots)
- **Card** + **CardHeader** + **CardTitle** + **CardDescription** + **CardContent** + **CardFooter** (variants default/interactive/highlight)
- **PhoneFrame** (status bar slot, dark device chrome — used by marketing hero now, will be reused on auth panel)

### 4.2 Atoms still pending from the prior plan

These ship as part of R3 (cards) or R6 (per-screen) rather than as standalone tasks:

- **EmptyState** (used by every page with potential empty data)
- **Skeleton** + named primitives (SkeletonText, SkeletonCircle, SkeletonStat, SkeletonRow)
- **Modal** (backdrop blur, spring motion, ModalHeader/ModalBody/ModalFooter)
- **Table** (Linear-style density, hover-reveal actions, status pills, integrated pagination — see §6)
- **Sidebar** (full rebuild — see §5.1)

### 4.3 New atoms introduced by the rebrand

- **TopBar** — global chrome at the top of every in-app screen (§5.2)
- **Breadcrumb** — small chain in muted caption text, used in the TopBar
- **SearchInput** — rounded-full variant of Input with leading magnifier icon, ~400px max width on lg+
- **AIInsightButton** — gradient button with sparkle icon and "Get AI Insight" label, fixed shape
- **ContentCard** — see §6.2
- **PromoCard** — see §6.3
- **SegmentCard** — see §6.4
- **StatusPill** — soft-pastel rounded-full variant of Badge for table status columns (extends Badge with a denser size and pre-set color mappings for common status values: Subscribed/Active = indigo, Scheduled = violet, Completed/Sent = green, Unsubscribed/Failed = red, Draft/Pending = slate)
- **UserDock** — sidebar bottom block: avatar + name + plan caption + chevron dropdown menu (replaces bare LogoutButton)
- **Pagination** — already exists; rebuild visual treatment to match the rebrand (numbered + prev/next, current page in dark fill, "Page X of Y" label on the left)

---

## 5. Application chrome

### 5.1 Sidebar

**Default state: open at 240px.** Hover-to-expand pattern is removed entirely. Manual collapse only, persisted to `localStorage` under `squalto:sidebar:collapsed`.

**Layout (top to bottom):**

1. **Brand row** (~56px tall): `<Image src="/logo-wordmark.svg" />` (or `/logo-mark.svg` when collapsed) on the left, a small chevron-left icon button on the right that toggles collapse.
2. **Nav section:** vertical list of `SidebarLink` items. Each item is `~40px` tall, `pl-2.5 pr-3`, `gap-2.5`. Icon (16px) + label.
3. **Spacer:** `flex-1` to push the user dock to the bottom.
4. **User dock** (~64px tall): a `<UserDock>` component — 32px round avatar, name (text-small, semibold), plan caption (text-caption, muted), chevron-down icon. Click → DropdownMenu with Profile, Settings, Switch service, Logout.

**Item states:**

- Default: `text-muted-foreground` with `text-foreground` icon. Hover: `bg-secondary` + `text-foreground`.
- Active: `bg-primary-50 text-primary-700` with a 2px `border-l-primary-600` accent on the left edge (negative left margin to extend slightly past the sidebar's content padding for a clean rail effect). Active state is computed from `usePathname()` matching the link's `href` exactly or starting with `href + "/"`.

**Collapsed state (64px width):** brand mark (no wordmark), icon-only nav links (label hidden), avatar-only user dock (name/plan/chevron hidden). Collapse toggle stays visible at top.

**Mobile:** drawer slides in from the left when the hamburger is tapped. Drawer matches the desktop expanded layout.

### 5.2 TopBar

A new `<TopBar>` component, mounted in `src/app/app/layout.tsx` above the page content area. Contents from left to right:

1. **Breadcrumb** — chain of segments separated by `/`. Final segment is in `text-foreground`; preceding segments are in `text-muted-foreground`. Built from the route path with sensible mappings (`/app/whatsapp/contacts` → "Audience", `/app/whatsapp/sendMessage` → "Send Message", etc.). Mapping table lives in `src/lib/breadcrumbMap.ts`.
2. **Spacer** (`flex-1`).
3. **SearchInput** — rounded-full, leading magnifier icon, ~400px max width on `lg+`. Placeholder text is **page-specific** (see §5.4 below). The search is client-side filter wired into the page's existing query state — no backend change.
4. **Notification bell** — icon-only ghost button, with a small `bg-primary-600` 6px dot in the top-right corner when there are unread notifications. Click currently does nothing; placeholder for future notifications surface (out of scope for this spec).
5. **AIInsightButton** — gradient pill button (`bg-ai-gradient text-white shadow-e2`) with a Sparkles icon (Lucide) and "Get AI Insight" label. Click currently opens a placeholder modal: "AI insights coming soon". Confirmed by user: ship as a fake/placeholder.

### 5.3 PageHeading restructured

`PageHeading` keeps its API but its visual emphasis shifts:

- **Eyebrow slot** removed from the page-level heading because the breadcrumb (in TopBar) now handles location context. `PageHeading` callers stop passing `eyebrow`.
- **Title** becomes `text-display` (32–36px bold) on screens that lead with a heading (Dashboard "Welcome back, John!", Audience "Audience"). On secondary screens (Send Message, Template Builder), `text-h1` is fine.
- **Subtitle** stays the same.
- **Actions** slot stays (right-aligned button row).

### 5.4 Page-specific search behavior

The TopBar search is wired into the active page's existing filter state. The page provides the placeholder and onChange handler via React context — `<SearchProvider>` mounted in `app/layout.tsx`, with `useSearch()` hook for consumers.

Examples:

- `/app/whatsapp/contacts` → placeholder "Search phone, name, email", filters the contacts table
- `/app/whatsapp/campaignReport` → placeholder "Search campaigns", filters the campaigns table
- `/app/whatsapp/templates` → placeholder "Search templates", filters the template grid
- `/app/whatsapp/sendMessage` → placeholder "Search recipients", filters the recipient picker
- Pages without a primary list (e.g., `/app` Dashboard, `/app/whatsapp/sendMessage` template selection) → placeholder "Search here…" with no-op handler (search renders but is inert)

The page sets its search context on mount via `useSearch().setConfig({ placeholder, onSearch })` in a `useEffect`. On unmount, the config resets.

---

## 6. Card system

### 6.1 StatsCard rebuild

Existing `StatsCard` exists at `src/components/ui/StatsCard.tsx`. Rebuild:

- **Top row:** small icon in a `bg-primary-50 rounded-md` 32px square + label (`text-caption text-muted-foreground`) + kebab `MoreVertical` icon button on the right (opens a placeholder DropdownMenu — for now just "View details" / "Hide" no-op items).
- **Value row:** `text-[32px] leading-none font-bold tabular-nums` + a colored trend pill on the right (rounded-full, `bg-success/15 text-success` for positive trends with `↑` arrow icon, or `bg-destructive/15 text-destructive` for negative trends with `↓`).
- **Optional sparkline slot** (right-side, ~80px wide) — defer; not used in v1.
- **Variant `accent`** — full primary-50 wash + primary-200 border, used for the *one* hero stat per screen.

Props:
```ts
interface StatsCardProps {
  icon?: ReactNode;
  iconBg?: string;        // optional override (default primary-50)
  label: string;
  value: string | number;
  trend?: { value: string; positive: boolean };
  accent?: boolean;
  onMenuOpen?: () => void;
}
```

### 6.2 ContentCard (new)

Generic rich-content card. Used for Templates list, Dashboard "AI Insights" panel, and similar feature-promotion areas.

**Structure (top to bottom):**

1. **Header row:** icon (40px in a `bg-primary-50` rounded square) on the left, category pill on the right. Category pill: rounded-full, soft-pastel background, leading 6px colored dot + category label (e.g., "Onboarding", "Marketing", "Content").
2. **Title:** `text-h3` semibold.
3. **Rating row** (optional): yellow star icon + numeric rating + "{n} reviews" in muted caption.
4. **Description:** `text-small text-muted-foreground` (1-2 lines, line-clamp).
5. **Meta row:** small `text-caption` row showing usage stats (e.g., "Used by 234 teams" + "Join 10,000+ users") with a Users icon.
6. **CTA:** full-width primary button (indigo). Includes trailing arrow icon.
7. **Footer note:** `text-caption text-muted-foreground` row with a small green check + "Takes 2 mins to customize" or similar.

Props:
```ts
interface ContentCardProps {
  icon: LucideIcon;
  category: { label: string; tone?: "indigo" | "violet" | "amber" | "rose" | "slate" };
  title: string;
  rating?: { value: number; reviews: number };
  description: string;
  meta?: { primary: string; secondary?: string };
  cta: { label: string; href?: string; onClick?: () => void };
  footerNote?: string;
}
```

### 6.3 PromoCard (new)

Larger card meant to advertise a feature or guide users toward an action.

**Structure:**

1. **Visual area:** `bg-primary-50` rounded square (~120×120px) containing a Lucide icon (40px) in `text-primary-600`. Decision from brainstorm: Lucide icon in tinted circle, no custom illustrations.
2. **Title:** `text-h2` semibold.
3. **Description:** `text-small text-muted-foreground` (1-2 sentences).
4. **CTA:** dark-fill button (`bg-foreground text-background`) — distinct from the regular indigo primary button. The dark CTA marks this as a "premium" or "discovery" action, not a routine one.

Props:
```ts
interface PromoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  cta: { label: string; href?: string; onClick?: () => void };
}
```

Used on:

- Automations list page (right sidebar): "Visual Automation Builder" promotion
- Future empty states for Campaigns, Templates when no items exist

### 6.4 SegmentCard (new)

Small stat-like card for sidebar info panels (the "Segments" panel on Audience).

**Structure:**

1. **Label:** `text-caption text-muted-foreground` ("All Subscribers", "Active Customers", "VIP Members", "Inactive Users").
2. **Value:** `text-[24px] font-bold tabular-nums` ("8,429").
3. **Trend pill:** small colored pill (same treatment as StatsCard's trend).

Compact (`p-4`), `Card variant="default"`, no kebab.

Props:
```ts
interface SegmentCardProps {
  label: string;
  value: string | number;
  trend?: { value: string; positive: boolean };
  onClick?: () => void;
}
```

---

## 7. Table system

A standalone `Table` primitive (already partially planned in the prior spec) ships as part of R4 with these refinements:

### 7.1 Row design

- Row height `48px` (more breathing room than the previous 40px).
- First column often shows a stacked pattern: 32px round avatar (or 32px Lucide icon in a tinted square) + primary text + secondary text below in `text-caption text-muted-foreground`. Helper component: `<TableSubject avatar={...} primary="..." secondary="..." />`.
- Row hover: `bg-secondary` (slate-100 at low opacity).
- Even-row zebra: dropped (was in prior spec) — too noisy for the rebrand's cleaner feel.

### 7.2 StatusPill

In the status column, use `<StatusPill status="subscribed">` or pass a label directly: `<StatusPill tone="indigo">Subscribed</StatusPill>`. Pre-set tone-mappings:

| Status string | Tone | Resulting color |
|---|---|---|
| `subscribed`, `active`, `automated` | indigo | `bg-primary-100 text-primary-800` |
| `scheduled` | violet | `bg-violet-100 text-violet-800` |
| `completed`, `sent` | green | `bg-success/15 text-success` |
| `unsubscribed`, `failed` | red | `bg-destructive/15 text-destructive` |
| `draft`, `pending` | slate | `bg-slate-100 text-slate-700` |

All have rounded-full shape, `px-2.5 py-0.5`, `text-xs font-medium`.

### 7.3 Actions column

Right-aligned `<TableActions>` slot. Contains a kebab icon button (`MoreHorizontal`) by default. Click opens a DropdownMenu with View / Edit / Delete (or page-specific actions). Per-row hover-reveal isn't used here — kebab is always visible because the kebab itself signals "this row has actions" without needing hover discovery.

### 7.4 Pagination footer

Below the table, a flex row:

- **Left:** `text-caption text-muted-foreground` showing "Page X of Y".
- **Right:** `<PaginationControls>` — Prev button (chevron-left + "Previous") + numbered page buttons (showing 1, 2, 3, …, current ± 1, …, last) + Next button. Current page in `bg-foreground text-background`. Other pages in `text-muted-foreground hover:bg-secondary`.

### 7.5 Header

Header cells in `text-caption text-muted-foreground` (uppercase 12/500/tracked-04em). Border-bottom on the header row only. No sticky header in v1 (defer until tables exceed viewport height in real usage).

---

## 8. Chart system

### 8.1 Library

Add `recharts` if not already present (`npm install recharts`). It's lightweight, themeable via CSS variables, and works with our token system. Confirm with `grep "recharts" package.json` first.

### 8.2 Color rules

- Primary data series: `--primary-600` (indigo-600)
- Secondary data series: `--primary-300` (indigo-300, faded)
- Tertiary / supporting data: `#94A3B8` (slate-400)
- Quaternary (rare 4-series charts): `#FB923C` (orange-400) or `#F472B6` (pink-400)

The non-active / "context" series in donut and bar charts uses `#E2E8F0` (slate-200).

### 8.3 Chart types

- **LineChart** / **AreaChart** — for time-based data (Hourly Engagement, Campaign Performance, Subscriber Growth). Indigo line with optional `bg-primary-500/10` area fill. Dotted grid in slate-200.
- **DonutChart** — for breakdowns (Campaign Types, Device Breakdown). One main slice in `--primary-600`, others in light slate. Inner radius 60% of outer for donut effect.
- **BarChart** — for monthly comparisons (Audience Growth). Currently-highlighted bar in `--primary-600`, others in `#E2E8F0`.
- **HorizontalBar** — for ranked breakdowns (Geographic Performance, Top Automations). `--primary-600` fills.

### 8.4 Tooltips

Custom tooltip component:

```tsx
function ChartTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card shadow-e3 px-3 py-2 text-small">
      <div className="text-muted-foreground mb-1">{label}</div>
      {payload.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
          <span className="text-foreground">{item.name}: {item.value}</span>
        </div>
      ))}
    </div>
  );
}
```

Wire into all Recharts surfaces via `<Tooltip content={<ChartTooltip />} />`.

---

## 9. Per-screen redesign

Each screen below assumes phases R1–R5 have landed (tokens, atoms, chrome, cards, tables, charts).

### 9.1 Dashboard — `/app`

**Currently:** services list (RCS / WhatsApp / SMS tiles).

**New:**

- TopBar shows breadcrumb "Dashboard". Search placeholder "Search here…" (no-op).
- PageHeading: title "Welcome back, {firstName}!", subtitle "Welcome back! Here's what's happening today.", actions = `[New Campaign, Create Automation]` (Create Automation is the gradient AI button equivalent of "Get Started").
- **Stats row** (4 StatsCards): Total Campaigns, Active Contacts, Avg. Open Rate, Revenue (MTD). One in `accent` variant.
- **Charts row** (3 cards):
  - Campaign Performance — line chart (Opens / Clicks / Conversions over 30 days)
  - Campaign Types — donut chart (newsletter / promotion / etc. breakdown)
  - Top Automations — list with progress bars (best performers, indigo fill)
- **Bottom row** (3 cards):
  - Audience Growth — bar chart by month (current month highlighted)
  - Recent Campaigns — mini table (campaign name, status pill, sent count, opens count, kebab)
  - AI Insights — 3 small ContentCards in a vertical stack ("Best Send Time", "Subject Line Tip", "Open AI Assistant" gradient CTA at the bottom)

The previous services-tile dashboard moves to `/app/services` as a separate, secondary screen.

### 9.2 Campaigns list — `/app/whatsapp/campaignReport`

**Currently:** basic table.

**New:**

- TopBar breadcrumb "Dashboard / Campaigns". Search wired to filter the campaign table.
- PageHeading: title "Campaigns", subtitle "Track your sent and scheduled campaigns", actions = `[New Campaign]`.
- **Stats row** (4 StatsCards): Sent today, Delivery rate, Open rate, This month total.
- **Filters bar**: filter chips (status, channel, date range) + sort dropdown.
- **Table** (with rebrand row design): name, status pill (`Active`/`Scheduled`/`Completed`/`Failed`), sent count, delivered count + delta, created (relative time), kebab.
- **Pagination footer.**

### 9.3 Campaign detail — `/app/whatsapp/campaignReport/[id]`

**Currently:** status page.

**New:**

- TopBar breadcrumb "Dashboard / Campaigns / {Campaign Name}". Search no-op.
- PageHeading: title `{Campaign Name}`, subtitle = meta strip (sent by · sent at · recipient count).
- **Header cluster** (right of heading): status pill, "● Updating live" indicator (animated pulse dot in `--primary-600` while status === sending), Cancel button (destructive variant, only when status === sending).
- **Funnel viz card**: Sent → Delivered → Read → Replied as horizontal bars in `--primary-600`. Animates from 0 to final width on first paint (motion #11).
- **Per-recipient table** below: phone (in mono font), status pill, sent at, delivered at, kebab. Failed rows show a "View error" tooltip on the kebab.

### 9.4 Audience — `/app/whatsapp/contacts`

**Currently:** contacts table + Gmail-style lists sidebar.

**New:**

- TopBar breadcrumb "Dashboard / Audience". Search wired to filter contacts.
- PageHeading: title "Audience", subtitle "Manage your contacts and segments", actions = `[Export, + Add Contact]`.
- **Stats row** (4 StatsCards): Total Contacts, Subscribed, Unsubscribed, Engagement Rate.
- **Two-column main area** (lg+ breakpoint):
  - Left (8 cols): "All Contacts" panel with search + filters + table. Table rows: avatar (32px) + name (primary text) + email (secondary), status pill, last active (relative time), engagement % with color-graded text (high = primary, low = muted), kebab.
  - Right (4 cols): "Segments" panel with header "Segments" + "Create New" link, then 4 SegmentCards stacked (All Subscribers, Active Customers, VIP Members, Inactive Users). The existing left-rail "Lists" sidebar moves into this Segments panel — Lists become user-curated segments.
- Tag multi-select chip filter from prior spec stays.

### 9.5 Automations list — `/app/whatsapp/automations` (new route)

**Currently:** doesn't exist. Add new route. The Automations dashboard surfaces existing campaign-automation data (or stub data initially).

**New:**

- TopBar breadcrumb "Dashboard / Automations". Search wired to filter automation table.
- PageHeading: title "Automations", subtitle "Welcome back! Here's what's happening today.", actions = `[+ New Automation]` (gradient AI button — automations are positioned as an AI feature).
- **Two-column main area:**
  - Left (8 cols): "All Automations" panel with search + filter chips + table. Rows: icon + automation name with subtitle, type pill (Automated/Scheduled), launched (relative time), performance %, kebab. Pagination footer.
  - Right (4 cols): PromoCard "Visual Automation Builder — Build awesome automations easily with our drag-and-drop editor!" with workflow Lucide icon and dark "Build Automation" CTA.

### 9.6 Templates — `/app/whatsapp/templates`

**Currently:** basic list.

**New:**

- TopBar breadcrumb "Dashboard / Templates". Search wired to filter template grid.
- PageHeading: title "Templates", actions = `[+ Create Template]`.
- **Stats row** (4 StatsCards): Total Templates, Email Templates, Automations, Most Popular.
- **Email Templates section** with "View All" link: 3-column grid of ContentCards.
- **Automation Templates section** with "View All" link: 3-column grid of ContentCards.

Each ContentCard shows: icon, category pill ("Onboarding"/"Marketing"/"Content"/"User Engagement"/etc.), title, rating, description, "Used by N teams · Join N+ users", indigo "Use Template" CTA, footer note "Takes N mins to customize".

### 9.7 Send Message — `/app/whatsapp/sendMessage`

**Currently:** three-column layout (Recipients / Settings + Variables / WhatsApp preview).

**New:** Layout structure stays. Visual treatment shifts:

- TopBar breadcrumb "Dashboard / Send Message". Search wired to filter recipients within the picker.
- PageHeading: title "Send Message" (or "Compose Campaign"), subtitle "Reach your audience with WhatsApp messaging", actions = none (Send button is in the sticky footer).
- **Recipients column** (left, narrow): RecipientPicker in a Card, with the new tab underline-slide motion.
- **Settings + Variables** (middle): two Cards stacked.
- **WhatsApp preview** (right, sticky): Card variant `highlight` (indigo-50 wash, indigo-200 border) wrapping the existing WhatsappPreview component (kept as bespoke chrome since it doesn't fit PhoneFrame — decision from earlier conversation).
- **Sticky footer**: recipient count pill (`bg-primary-100 text-primary-800`) + cost estimate + Send button (default primary, oversized, with indigo glow).
- **Send celebration**: animated green checkmark stamps in (motion #9 from prior spec). Green is intentional here — this is the success-accent moment.

### 9.8 Analytics — `/app/whatsapp/analytics` (new route or rename)

**Currently:** doesn't exist as standalone (delivery + campaign reports serve this role).

**New:**

- TopBar breadcrumb "Dashboard / Analytics". Search no-op.
- PageHeading: title "Analytics", actions = none.
- **Stats row** (4 StatsCards): Emails Sent, Total Opens, Total Clicks, Revenue.
- **Top Performing Campaigns** card (8 cols on lg) with a mini table: campaign name, opens, clicks, open rate %, kebab.
- **Device Breakdown** donut chart (4 cols on lg).
- **Bottom row** (3 cols):
  - Hourly Engagement — line chart with custom tooltip
  - Geographic Performance — horizontal bar chart by country
  - Subscriber Growth — bar chart by month (current month highlighted)

Existing `deliveryReport` and `campaignReport` pages remain; the new Analytics screen is the unified high-level view.

---

## 10. Auth + marketing

### 10.1 Auth — `/auth/login`, `/auth/signup`

- **Layout:** two-column split. Form left (480px), brand panel right.
- **Form column:** logo wordmark at top + heading ("Welcome back" / "Create your account") + subtitle + email-first form (single primary CTA "Continue with email" → password reveals after) + Google OAuth as bordered secondary + magic-link as text link + cross-link to signup/login at the bottom.
- **Brand panel:** `bg-primary-50` wash + a static three-message WhatsApp conversation rendered in `<PhoneFrame>` as decorative art (not interactive).
- **Mount animation:** form column fades and slides 6px from below over 240ms.

### 10.2 Marketing landing — `/`

The marketing site keeps its current section structure (Nav / Hero / Features / Benefits / Pricing / Integrations / Final CTA / Footer). Visual treatment shifts:

- **Nav:** logo wordmark left, nav links (Features / Pricing / About / Contact), Sign in (text link) + Get Started (indigo gradient button) right.
- **Hero:**
  - Eyebrow trust pill ("Trusted by 10,000+ teams")
  - Bold display headline (currently "The Future of Customer Engagement" — keep wording, restyle)
  - Body copy
  - Primary indigo button "Get Started" with trailing arrow + secondary outline button "Watch Demo" with play icon
  - Phone-frame mockup on the right (already extracted to `<PhoneFrame>` in earlier work)
- **Features:** dark-background section with grid of feature cards. Indigo-tinted icons in tinted squares + title + description. Was green; now indigo.
- **Benefits:** light-background section with progress-bar metrics on the left + checkmark feature list on the right. Bars in indigo. The big-number callout shifts from green to indigo.
- **Pricing:** dark-background, 3 plan cards. The "Growth" plan (highlighted) shifts from green fill to indigo fill. Other plans stay dark with indigo-accent buttons.
- **Integrations:** light-background, grid of integration logos with indigo-accent hover state.
- **Final CTA:** dark-background section with display headline + indigo button.
- **Footer:** dark, indigo-accent links.

The hero stat numbers and section eyebrows ("Platform" / "Pricing") shift from green to indigo.

### 10.3 Auth callback / verify / KYC

Match the new colors — no structural change.

- `/auth/verify` — OTP input layout stays; primary CTA becomes indigo.
- `/auth/callback` — redirect-only, no visual content.
- `/kyc` — form layout stays; primary CTA becomes indigo, success-step indicators stay green.

---

## 11. Motion language

Reuses the 12 named animations from the prior polish-pass spec, with token shifts. Indigo replaces green where the brand color is involved.

| # | Where | Animation | Token shift |
|---|---|---|---|
| 1 | Button (default) | Color + shadow lift on hover, 120ms | indigo glow |
| 2 | Card (interactive) | Shadow `e1→e2` + `translateY(-1px)`, 180ms | — |
| 3 | Modal | Scale 0.96→1.0 + opacity, 180ms spring | — |
| 4 | Dropdown / popover | Scale-from-origin + opacity, 150ms | — |
| 5 | Sidebar active item | Background-color crossfade, 120ms | indigo-50 |
| 6 | Tabs (RecipientPicker, etc.) | Underline `layoutId` slide | indigo |
| 7 | Bulk action bar (contacts) | Spring from `y:60, opacity:0` | indigo border |
| 8 | Skeleton | Shimmer sweep, 1.5s loop, linear | — |
| 9 | Send celebration | Green check stamps in, headline fades + slides | green stays (intentional success accent) |
| 10 | Live polling indicator | Opacity 0.5↔1 pulse, 1.5s loop | indigo dot |
| 11 | Funnel bars | Width 0→final on first paint, staggered 80ms | indigo fill |
| 12 | Toast notifications | Spring in from top-right, 4s auto-dismiss | — |

`prefers-reduced-motion` fallbacks unchanged.

---

## 12. Phase order

Each phase ends in a commit-able, demoable state. Estimates assume one dev focused.

| # | Phase | Estimate | Ship-stop after |
|---|---|---|---|
| **R1** | Foundation rebrand — token system shift, brand mark color flip, verification sweep | 1 day | Token-cascade visual change demoable; brand mark indigo |
| **R2** | Application chrome — Sidebar rebuild + TopBar + breadcrumb + PageHeading restructure + UserDock + page-specific search wiring | 2 days | Every screen feels like the new product visually |
| **R3** | Card system — StatsCard rebuild + ContentCard new + PromoCard new + SegmentCard new | 2 days | Templates page and dashboard feel substantially new |
| **R4** | Table system — Table primitive rebuild + StatusPill + Pagination + TableSubject helper | 1.5 days | Audience and Campaign list feel new |
| **R5** | Chart system — Recharts integration + ChartTooltip + chart helpers (Line/Area/Donut/Bar/HorizontalBar) | 1 day | Dashboard charts visible; Analytics charts visible |
| **R6** | Per-screen redesign — Dashboard, Campaigns list, Campaign detail, Audience, Automations list, Templates, Send Message, Analytics | 5 days | All 8 named screens shipped |
| **R7** | Auth + marketing rebrand — Login + signup split layout + marketing landing color shift across 8 sections | 2 days | Public-facing surfaces match the new identity |
| **R8** | Motion + final cleanup — re-implement 12 animations with new tokens + reduced-motion fallbacks + cleanup audit (rogue green Tailwind, off-scale spacing, residual JPGs, hard-coded `bg-green-*`) | 1 day | Full rebrand complete |
| **Total** | | **~14.5 days** | (~17–20 with iteration) |

---

## 13. Risks

- **Sidebar pattern change is opinionated.** Hover-to-expand was an existing UX pattern; pinning open by default may surprise existing power users (small audience right now). Pin-toggle should be discoverable; default-to-open mitigates discovery friction.
- **Page-specific search via context** introduces a small architectural commitment. Pages must remember to set/clear their search config in `useEffect`. Poorly-cleared config can leak filter state across navigations. Mitigation: add a TopBar guard that defaults the placeholder to "Search here…" + no-op handler when `useSearch().config` is null.
- **AI button is fake.** Users who click "Get AI Insight" hit a "coming soon" modal. Risk: looks unfinished. Mitigation: copy on the modal explains AI features are in active development with a follow-up email signup.
- **Marketing landing coordinates with the existing copy.** The current landing has hand-tuned section structure; rebrand should not re-tune the copy in this pass. Mitigation: explicit non-goal — copy stays as-is, only visual treatment changes.
- **Recharts adds bundle weight.** ~50–80kb gzipped. Acceptable for a dashboard product but worth noting. Mitigation: dynamic-import chart components on routes that use them.
- **Color migration regressions.** The 9 existing commits use semantic tokens, so they re-token cleanly. But page-level pages (RCS report pages, Campaign pages) still have hard-coded `bg-green-500`/`text-green-600` in many places. R8's cleanup audit catches these; until then, those surfaces will look mixed (some indigo via tokens, some still green via hard-coding).

---

## 14. Acceptance criteria

- [ ] `--primary-600` resolves to `#4F46E5` (indigo) across the app.
- [ ] `logo-mark.svg` and `logo-wordmark.svg` use `#4F46E5`, not `#16A34A`.
- [ ] Zero `/squalto.jpg` references in `src` or `public` (already shipped — should still hold).
- [ ] Zero raw `bg-green-[5-9]00` / `text-green-[5-9]00` in app code outside of WhatsApp-specific UI (the WhatsappPreview component) and the `--success` chip surfaces.
- [ ] `Sidebar` defaults to open at 240px on first load; collapse persists via `localStorage` under `squalto:sidebar:collapsed`.
- [ ] `TopBar` is mounted in `app/app/layout.tsx` and renders breadcrumb, search, bell, AI button on every in-app screen.
- [ ] All 8 named screens (Dashboard, Campaigns list, Campaign detail, Audience, Automations list, Templates, Send Message, Analytics) match this spec visually.
- [ ] All 12 named animations implemented and respect `prefers-reduced-motion`.
- [ ] Marketing landing uses indigo across all 8 sections (Nav / Hero / Features / Benefits / Pricing / Integrations / Final CTA / Footer).
- [ ] Auth pages use the two-column split layout with brand panel.
- [ ] Bundle size with Recharts under 250kb gzipped on the Dashboard route (informal target).

---

## 15. Future work (parked)

- **Dark mode** — tokens are dark-ready; ship the toggle and per-screen audit in a future phase.
- **Custom illustrations** — replace Lucide icons in PromoCards with brand-specific illustrations when a designer ships a system.
- **Real AI features** — when AI capabilities are real, the "Get AI Insight" button + AI Insights panel + automation gradient buttons get wired to real flows. Until then, they're brand moments only.
- **Real-time notification stream** — the bell icon currently has a placeholder dot. Wire to a real notifications backend later.
- **Global command palette / search backend** — the TopBar search is currently per-page client filter. Future: keyboard-shortcut command palette with global search across campaigns / contacts / templates.
- **Mobile optimization** — current scope is desktop-first. Mobile breakpoints work but aren't optimized; a separate mobile pass is warranted before any campaign push.
