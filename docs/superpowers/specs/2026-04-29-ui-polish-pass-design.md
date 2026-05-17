# UI Polish Pass — Design Spec

- **Date:** 2026-04-29
- **Scope:** Phase A polish pass (Phases B and C deferred)
- **Repo:** `website` (frontend only)
- **Reference aesthetic:** Hybrid — Attio chassis, Linear tables
- **Brand color:** Locked — Squalto green `#16A34A`
- **Dark mode:** Light-only with dark-ready tokens (toggle deferred to Phase B)

---

## 1. Goals

- Replace the stock shadcn/Aceternity admin-template feel with a coherent brand-driven product surface.
- Unify design tokens (color, type, spacing, radius, elevation, motion) so the in-app product matches the marketing-site brand.
- Upgrade 11 shared component primitives so every page inherits visual lift automatically.
- Apply bespoke polish to 7 high-leverage screens.
- Light-only, with all tokens dark-ready so a future dark-mode toggle is a one-day flip rather than a re-audit.

## 2. Non-Goals

Explicitly deferred:

- **Phase B — visual identity overhaul:** dark mode shipped, custom illustrations, advanced motion language, sidebar paradigm rethink.
- **Phase C — product-defining redesign:** signature visual elements, distinctive navigation patterns, "wow" first-message flows.
- New features. No functional changes. Pure UI polish on existing surfaces.
- Custom illustrations or non-Lucide iconography.
- Marketing site redesign (current landing is solid).
- RCS pages bespoke polish (they inherit atom upgrades for free; per-screen work happens in a follow-up).

---

## 3. Design tokens

### 3.1 Color

**Primary ramp** — `#16A34A` is the locked brand green, matching the marketing site. Full Tailwind `green-*` ramp adopted as `--primary-*` tokens so any shade reference resolves cleanly:

| Token | Value | Use |
|---|---|---|
| `--primary-50` | `#F0FDF4` | Hover row tint, callout washes, hero-card wash, "selected" state |
| `--primary-100` | `#DCFCE7` | Soft pill backgrounds, `active` badge, sidebar active item |
| `--primary-200` | `#BBF7D0` | `highlight` Card border, hero StatsCard border |
| `--primary-300` | `#86EFAC` | Subtle accents, hover ring lightening |
| `--primary-400` | `#4ADE80` | (Reserved — not used in this pass) |
| `--primary-500` | `#22C55E` | Charts, accents, brighter highlights |
| `--primary-600` | `#16A34A` | **Canonical brand.** Buttons, focus rings (at 30% opacity), funnel-bar fill, sidebar active border |
| `--primary-700` | `#15803D` | Active/pressed states |
| `--primary-800` | `#166534` | Text on `primary-100` backgrounds (e.g., `active` badge text, trend pill text) |
| `--primary-900` | `#14532D` | High-contrast text on light primary washes |
| `--primary-950` | `#052E16` | Text on `primary-50` backgrounds, dark wash |

**Semantic colors:**
- `success` = `--primary-600` (intentional collapse: send/deliver = brand moment)
- `warning` = `--amber-600`
- `danger` = `--red-600`
- `info` = `--blue-600`

**Channel colors** (only used when channel identity is the point — service tiles, channel-tagged items):
- WhatsApp: `#25D366`
- RCS: `--indigo-600`
- SMS: `--gray-600`

**Neutrals:** Switch from shadcn `oklch` grays to Tailwind `slate` ramp. Update `--background`, `--foreground`, `--muted`, `--muted-foreground`, `--border`, `--input` to slate equivalents. Both light and dark variants declared in `globals.css`; only light is shipped.

### 3.2 Typography

Geist Sans + Geist Mono (already configured). Define a strict scale:

| Token | Size | Weight | Tracking | Line height | Use |
|---|---|---|---|---|---|
| `text-display` | 36px | 700 | -0.02em | 1.2 | Hero page titles only |
| `text-h1` | 24px | 600 | -0.01em | 1.2 | Standard page headings |
| `text-h2` | 18px | 600 | 0 | 1.3 | Section headings inside a page |
| `text-h3` | 16px | 600 | 0 | 1.4 | Card titles |
| `text-body` | 14px | 400 | 0 | 1.5 | Default body |
| `text-small` | 13px | 400 | 0 | 1.5 | Table rows, secondary copy |
| `text-caption` | 12px | 500 | 0.04em | 1.4 | Uppercase eyebrow labels, table headers |

**Numerics:** stat values use `font-variant-numeric: tabular-nums`. Phone numbers, IDs, codes render in Geist Mono.

### 3.3 Radius

| Token | Value | Use |
|---|---|---|
| `rounded-sm` | 6px | Badges, small chips |
| `rounded-md` | 8px | Buttons, inputs |
| `rounded-lg` | 12px | Cards, modals, panels |
| `rounded-xl` | 16px | Hero cards only |

`rounded-2xl` and `rounded-3xl` are removed from the in-app surface (marketing landing is exempt).

### 3.4 Spacing

Lock to 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64. Audit existing usage; remove `gap-5`, `gap-7`, `gap-9` and similar off-scale values.

### 3.5 Elevation

| Token | Value | Use |
|---|---|---|
| `e0` | none | Default |
| `e1` | 1px ring shadow | Cards at rest |
| `e2` | 4px shadow | Hover, popovers |
| `e3` | 8px shadow | Modals |
| `e4` | 16px shadow | Full-screen overlays |

**Primary-action elements** get `--primary` tinted shadows on hover (not gray):
```
shadow-[0_8px_24px_-8px_rgba(22,163,74,0.45)]
```

### 3.6 Focus rings

`:focus-visible` only. 2px ring + 2px offset. Color `--primary-600` at 30% opacity.

### 3.7 Motion

| Token | Duration | Use |
|---|---|---|
| `--motion-fast` | 120ms | Color, focus rings, button hover, link underline |
| `--motion-base` | 180ms | Card lift, modal scale-in, dropdown open, accordion expand |
| `--motion-slow` | 240ms | Sheet/drawer open, page-level reveals |

- Easing default: `cubic-bezier(0.16, 1, 0.3, 1)` (fast launch, soft settle)
- Easing emphasis: framer-motion spring `{stiffness: 400, damping: 30}` (modal pop, send celebration, bulk-action bar entrance)

---

## 4. Component atoms

11 primitives in `website/src/components/ui/` change. Migration includes replacing all ad-hoc usages with the upgraded atoms.

### 4.1 Button (`Button.tsx`)
- Default variant uses `--primary` (was shadcn black).
- Add `size: xs` (h-7) for in-table actions.
- Add `loading` boolean prop with built-in spinner.
- Hover state on default variant: primary-tinted shadow.
- Migrate all `bg-green-500 hover:bg-green-600` ad-hoc usages.

### 4.2 Input (`Input.tsx`)
- Add `:focus-visible:ring-2 ring-primary/30` ring (currently no focus indication).
- Add error state via `aria-invalid` (red ring + red border).
- Add `leadingIcon` prop and `trailingSlot` prop.
- Migrate ~6 absolute-positioned-icon hacks (services dashboard, contacts toolbar, sendMessage, etc.) to `leadingIcon`.

### 4.3 Card (new — `Card.tsx`)
```
<Card variant="default | interactive | highlight">
  <CardHeader>
    <CardTitle/>
    <CardDescription/>
  </CardHeader>
  <CardContent>...</CardContent>
  <CardFooter>...</CardFooter>
</Card>
```
- `interactive`: cursor-pointer + hover lift to `e2`.
- `highlight`: `primary-200` border + `primary-50` wash.
- Migrate ~15 raw `<div className="bg-white border rounded-lg p-5">` usages.

### 4.4 Table (`table.tsx`)
- Row height 40px (currently inconsistent).
- Zebra: `even:bg-slate-50/40`.
- Row hover: `bg-primary-50/60`.
- Hover-reveal action column on the right (`opacity-0 group-hover:opacity-100`).
- Header cells: caption type token (uppercase 12 / 500 / tracked).
- Built-in `<TableEmpty />` and `<TableLoading />` slots.
- Sticky header on scroll.

### 4.5 Badge (`badge.tsx`)
- Add 6px dot indicator: `● Active`, `● Pending`, `● Failed`.
- `active` variant updates to `bg-primary-100 text-primary-800` (was `bg-green-50 text-green-700` ad-hoc Tailwind).
- Add `size: sm | md`.
- Add `dot` prop (default `true` for status badges, `false` for tag chips on contacts page).

### 4.6 Modal (`Modal.tsx`)
- Backdrop blur: `backdrop-blur-sm bg-black/40` (was opaque).
- Framer Motion scale-in (0.96 → 1.0, 180ms spring).
- `e3` shadow.
- Standard `<ModalHeader>` and `<ModalFooter>` so AddContactModal / EditContactModal / CsvImportModal / ServiceModal stop diverging.
- Sizes: `sm | md | lg | xl` mapped to maxWidth (400 / 500 / 640 / 800).

### 4.7 EmptyState (new — `EmptyState.tsx`)
```
<EmptyState
  icon={Users}
  title="..."
  description="..."
  primaryAction={{ label, onClick }}
  secondaryAction={{ label, onClick }}
  variant="default | hero"
/>
```
- `default`: in-page block (subtle).
- `hero`: full-screen with `primary-50` radial gradient wash, larger icon in primary-100 circle.
- Migrate ~6 ad-hoc empty states (services dashboard, contacts, lists, campaigns, templates, etc.).

### 4.8 StatsCard (`StatsCard.tsx`)
- Title: 12px caption uppercase tracked (was 14px medium).
- Value: 32px tabular-nums weight-700 (was 24px).
- Trend: colored pill (`+12.5%` in `bg-primary-100 text-primary-800` or `bg-red-50 text-red-700`) — was inline arrow.
- Optional `sparkline` slot (right side).
- Optional `accent` variant: full primary-50 wash + primary-200 border. Used for *one* hero stat per dashboard.

### 4.9 Skeleton (`skeleton.tsx`)
- Replace `animate-pulse` with shimmer sweep (linear gradient moving left-to-right, 1.5s loop).
- Export named primitives: `SkeletonText`, `SkeletonCircle`, `SkeletonStat`, `SkeletonRow`.

### 4.10 PageHeading (`PageHeading.tsx`)
- Add `eyebrow` slot (12px caption uppercase, "WhatsApp / Contacts" breadcrumb-style).
- Add `actions` slot (right-aligned).
- H1 typography: 24 / 600 / -0.01em — enforces page-heading consistency for free.

### 4.11 Sidebar (`sidebar.tsx`)
- Kill the Aceternity hover-to-expand pattern.
- Default: open at 240px. Manual collapse toggle in bottom-left, persisted to localStorage (`squalto:sidebar:collapsed`).
- Active item: `bg-primary-50` + 2px `border-l-primary-600` + `text-primary-700`.
- Section dividers (Phonebook, Templates, Reports) get 11px caption uppercase headers.
- JPG logo replaced with SVG (mark + wordmark variants).
- Bottom block: avatar + email + ⚙︎ menu (Logout, Profile, Switch service) — currently a bare LogOut icon.

---

## 5. Per-screen polish

Each screen below assumes Section 3 (tokens) and Section 4 (atoms) have landed. Only **bespoke** per-screen work is listed.

### 5.1 Auth — `/auth/login`, `/auth/signup`
- Two-column split: form left (white, 480px), brand panel right (`primary-50` wash + a static three-message WhatsApp conversation rendered in the shared `<PhoneFrame>` as decorative art — not interactive, not live).
- Single primary CTA: "Continue with email". Email-first; password-or-magic-link reveals after.
- Google OAuth: bordered secondary, not equal-weight with primary.
- SVG wordmark at top.
- Form slides in 6px on mount.

### 5.2 Services dashboard — `/app`
- Eyebrow "WORKSPACE" + H1 "Services".
- Service tiles: 40px channel-colored icon (WhatsApp green-50 wash, RCS indigo-50, SMS slate-50), service name (H2), status badge with dot, live stat (e.g., "12,433 sent today" or "Inactive"), chevron right.
- Empty state: `hero` variant with `primary-50` radial gradient wash, "Connect your first channel" CTA.
- Grid/list toggle: segmented control (was two ghost icon buttons).

### 5.3 WhatsApp Contacts — `/app/whatsapp/contacts`
- Sidebar two sections: "QUICK VIEWS" (All contacts) and "YOUR LISTS" (with member counts in muted caption).
- Toolbar sticky with soft shadow on scroll.
- Tag filter: multi-select chip row (was single-select dropdown — current pattern caps users at one tag).
- Bulk action bar: floating primary-tinted island at the bottom of the screen when selection > 0 (was inline at top of table).

### 5.4 Send Message — `/app/whatsapp/sendMessage`
**The conversion moment. Highest-priority screen.**
- Three-column layout: Recipients (narrow left) + Settings/Variables (middle) + WhatsApp preview (right, sticky, in phone frame).
- Preview is the visual hero — give it room and weight.
- Send button: primary-tinted shadow + Send icon, oversized.
- Post-send celebration micro-state: animated green check (motion #9), "Sent to 1,234 recipients" headline, link to live campaign report.
- Live "X recipients selected" count: `primary-100` pill in sticky footer with cost estimate.

### 5.5 Campaigns list — `/app/whatsapp/campaigns`
- Hero stats row (3 StatsCards) at top: Total sent today, delivery rate, this-month total. Most relevant uses `accent` variant.
- Table: name | status (badge + dot) | sent | delivered (with delta pill) | created (relative time, e.g., "2h ago") | hover-reveal actions.
- Status dots: Draft (gray), Scheduled (blue), Sending (pulsing primary, motion #10), Sent (solid primary), Failed (red).
- Empty state: `hero` "Send your first campaign", CTA → `/sendMessage`.

### 5.6 Campaign detail — `/app/whatsapp/campaigns/[id]`
- Header: name + status badge + meta strip (sent by · sent at · recipient count, all in caption muted).
- Funnel viz: Sent → Delivered → Read → Replied as horizontal `primary-600` filled bars with absolute counts and percentages (motion #11 on first paint).
- "● Updating live" indicator (pulsing primary dot, motion #10) shown while polling.
- Per-recipient table with hover-reveal "View error" for failed rows.
- Cancel button: `danger` variant, only visible while `status === sending`.

### 5.7 Templates list — `/app/whatsapp/templates`
- Switch from table to grid of template cards (templates are visual artifacts; a row of text doesn't represent them).
- Each card: status badge top-right, name, category eyebrow, mini-preview (first 60 chars of body, header image thumbnail if present), updated-at timestamp.
- Hover lifts to `e2`, reveals edit/delete icons in top-right.
- Empty state: `hero` variant.

### 5.8 Template builder — `/app/whatsapp/templates/create`
- Two-column: form sections left, sticky WhatsApp preview right.
- Each component (header / body / footer / buttons): collapsible Accordion item (primitive already exists in `components/ui/Accordion.tsx`).
- Preview phone frame: `primary-50` wash background — visual continuity with marketing-site WhatsApp mockup.
- Sticky footer: "Save as draft" (secondary) + "Submit for approval" (primary).

---

## 6. Motion specifications

12 named animations. Use Framer Motion (already in stack) where spring physics are required; CSS transitions for the rest.

| # | Where | Animation |
|---|---|---|
| 1 | Button (default) | Color + shadow lift on hover, 120ms |
| 2 | Card (interactive) | Shadow `e1→e2` + `translateY(-1px)`, 180ms |
| 3 | Modal | Scale 0.96→1.0 + opacity 0→1, 180ms spring |
| 4 | Dropdown / popover | Scale-from-origin + opacity, 150ms |
| 5 | Sidebar active item | Background-color crossfade only (no layout jump), 120ms |
| 6 | Tabs (RecipientPicker etc.) | Underline slides between tabs via framer-motion `layoutId` |
| 7 | Bulk action bar (contacts) | Spring from `y:60, opacity:0` when selection > 0 |
| 8 | Skeleton | Shimmer sweep, 1.5s loop, linear |
| 9 | Send-message celebration | Green check stamps in (scale 0→1.1→1, 400ms) + headline fades + slides 8px from below (200ms, 100ms delay). **Signature moment.** |
| 10 | Live polling indicator | Opacity 0.5↔1 pulse, 1.5s loop, only when `status=sending` |
| 11 | Campaign funnel bars | Width 0→final on first paint, 600ms total, staggered 80ms per bar |
| 12 | Toast notifications | Spring in from top-right, auto-dismiss 4s with fade |

**`prefers-reduced-motion` fallbacks:**
- Shimmer becomes a static gradient.
- Springs become opacity-only crossfades.
- Pulses freeze.
- Send-celebration check appears without scale/translate.

**Anti-list — do NOT animate:**
- Page-to-page transitions (let Next.js handle).
- Scroll-tied parallax.
- Constantly-pulsing dashboards.
- Sidebar hover-expand (the pattern is being killed).
- Theme-color crossfades.
- Decorative ambient loops.

---

## 7. Brand assets

### 7.1 Logo
- `/public/logo-mark.svg` — icon only, square. Used: collapsed sidebar, favicon source, mobile nav.
- `/public/logo-wordmark.svg` — mark + "Squalto" text. Used: expanded sidebar, marketing nav, auth pages, footer.
- Mark fill: `--primary`. Wordmark text: `--foreground` (inverts cleanly for future dark mode).
- **Replace every `/squalto.jpg` reference** in the codebase.

### 7.2 Favicon set
- `favicon.ico` — 16/32/48 multi-res from `logo-mark`.
- `apple-touch-icon.png` — 180×180 with safe padding (iOS hard-crops corners).
- `icon-512.png` — Android PWA.
- `manifest.json` — `theme_color: #16A34A`.

### 7.3 OG / link preview image
- `/public/og-image.png` — 1200×630. Wordmark + tagline + soft WhatsApp message thumb as background detail.
- Apply via root `metadata.openGraph.images` in `app/layout.tsx`.
- Same image works for marketing and product pages.

### 7.4 Phone frame component
- Extract `<PhoneFrame>` shared component used by both marketing-site hero and in-app `WhatsappPreview`.
- Same chrome, status bar, chat-tail rendering on both surfaces.

### 7.5 Out of scope
- Custom empty-state illustrations (deferred to Phase B).
- Non-Lucide iconography (deferred to Phase B).

---

## 8. Build order

Sequenced so each step makes the next cheaper.

| # | Step | Estimate |
|---|---|---|
| 1 | Design tokens — `globals.css` rewrite (color ramp, semantic, neutrals, type scale, radius, elevation, motion) | 0.5 day |
| 2 | Brand assets — SVG logo variants, favicon set, OG image, manifest, `<PhoneFrame>` extraction, JPG migration | 0.5 day |
| 3 | Atom upgrades — Button → Input → Badge → PageHeading → Card → EmptyState → StatsCard → Skeleton → Modal → Table → Sidebar (in dependency order) + ad-hoc usage migration | 4 days |
| 4 | Tier 1 screens — Auth, Services dashboard, Contacts, Send Message — bespoke polish | 3 days |
| 5 | Tier 2 screens — Campaigns list, Campaign detail, Templates list, Template builder — bespoke polish | 2 days |
| 6 | Motion polish sweep — remaining named animations + reduced-motion fallbacks | 1 day |
| **Total** | | **~11 dev days** |

Realistic with review + iteration: **~14–16 days**.

**Ship-stops (each a commit-able state):**
- After step 1 — non-shippable on its own (no visual change yet).
- After step 2 — shippable; logo + favicon + OG visible everywhere.
- After step 3 — shippable; ~60% of total visual lift is in. **If timeline slips, ship here and put steps 4–6 in a follow-up branch.**
- After step 4 — tier-1 surfaces fully polished.
- After step 5 — all 7 named screens polished.
- After step 6 — motion polish complete.

---

## 9. Risks

- **Atom migration is the biggest line item.** Card and EmptyState introductions require migrating ~15 + ~6 ad-hoc usages. Partial migration leaves two patterns coexisting. Acceptance criterion: zero raw `<div className="bg-white border rounded-lg p-5">` and zero inline empty-state divs at the end of step 3.
- **Sidebar pattern change is opinionated.** Killing the Aceternity hover-expand may surprise existing power users (small audience right now, so low blast radius). Pin-toggle must be discoverable; default-to-open mitigates discovery friction.
- **Send-message celebration (motion #9)** is the single most visible animation. Worth iterating on with the user before shipping — easy to overshoot or undershoot.
- **Tag multi-select on contacts page** is technically a UX/functionality change as well as visual (current single-tag dropdown is a hard limit). Confirm acceptable for a polish-pass scope, or revert to single-select with better visual.
- **Token migration regressions.** Existing pages that reach for raw Tailwind colors (`bg-green-500`, `text-gray-700`) will not auto-pick-up new tokens. Migration must be explicit; a grep-and-replace in step 3 is the simplest enforcement.

---

## 10. Acceptance criteria

- [ ] All `--primary` references in app code resolve to `#16A34A`.
- [ ] Zero `/squalto.jpg` references anywhere in `website/src` or `website/public`.
- [ ] Zero raw `bg-green-500` / `bg-green-600` / `bg-green-700` / `text-green-*` Tailwind colors in app code (channel-color WhatsApp `#25D366` is permitted only in WhatsApp-specific UI like the chat preview).
- [ ] Zero `rounded-2xl` or `rounded-3xl` in in-app surface code (marketing landing exempt).
- [ ] `Card` and `EmptyState` atoms exist and are used by every relevant page.
- [ ] All 12 named animations have a verified `prefers-reduced-motion` fallback.
- [ ] All 7 named screens visually pass a side-by-side comparison vs. before-state screenshots.
- [ ] Light-mode tokens have a documented dark-mode counterpart in `globals.css`.
- [ ] `<PhoneFrame>` is a single shared component used by both the marketing site and the in-app `WhatsappPreview`.
- [ ] Sidebar collapse state persists across reloads via localStorage.

---

## 11. Future work (parked)

Not part of this spec; named here so they don't get lost.

**Phase B — visual identity overhaul:**
- Ship dark mode toggle (tokens already wired).
- Custom empty-state illustrations.
- Advanced motion language (page transitions, more emphasis-driven motion).
- Sidebar paradigm rethink (potentially a kbd-shortcut-driven command palette on top of nav).

**Phase C — product-defining redesign:**
- Signature visual element (e.g., live WhatsApp preview becomes the centerpiece across the product, not a side-panel).
- Distinctive navigation pattern.
- "Wow" first-message wizard / activation flow (Bier-grade onboarding).

**RCS pages bespoke polish** — RCS templates / agents / campaigns / reports inherit atom upgrades automatically but don't get screen-level work in this pass.
