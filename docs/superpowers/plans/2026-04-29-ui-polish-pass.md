# UI Polish Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lift the in-app surface from "stock shadcn/Aceternity admin template" to "coherent brand-driven product" via a 6-phase polish pass — design tokens, 11 component atoms upgraded, 7 high-leverage screens repolished, 12 named animations, and a brand-asset migration.

**Architecture:** Tokens-first cascade. (1) Update `globals.css` so every primitive that already uses semantic colors gets the brand for free. (2) Upgrade 11 shared atoms in dependency order so screens inherit ~60% of the visual lift automatically. (3) Apply bespoke per-screen polish to 7 named pages. (4) Sweep motion + final migration audits. Each phase ends in a commit-able, demoable state — never a half-upgraded codebase.

**Tech Stack:** Next.js 15 (App Router, Turbopack), TypeScript 5, Tailwind CSS v4, Radix UI primitives, Framer Motion (already in deps), Lucide React icons, TanStack Query/Table.

**Spec:** [`website/docs/superpowers/specs/2026-04-29-ui-polish-pass-design.md`](../specs/2026-04-29-ui-polish-pass-design.md). Read it before starting — every task assumes spec context.

**Scope:** Phase A polish pass only. Phase B (visual identity overhaul, dark mode toggle, illustrations) and Phase C (product-defining redesign) are explicitly deferred. RCS pages get atom-upgrades for free but no bespoke screen-level work in this plan.

**Reference aesthetic:** Hybrid — Attio chassis (generous whitespace, warm density), Linear tables (tight, scannable, hover-reveal actions).

---

## Conventions for this plan

- **Working directory** for all commands: `/Users/harshitsingh/code/personal-code/website` (the website repo). Always run `cd` to that path or use absolute paths.
- **Dev server:** `npm run dev` → http://localhost:3000
- **Type/lint check:** `npm run lint`
- **Build check:** `npm run build`
- **Visual verification:** Each task has a manual smoke-check step. UI polish does not lend itself to automated unit tests; we verify visually + via grep + via type-check.
- **Commits:** Every task ends in one commit. Follow existing message style: `<type>(<scope>): <subject>` (e.g., `feat(ui): add Card primitive`, `chore(tokens): adopt slate neutrals`).
- **No code-comments in JSX/TS** unless absolutely needed (per repo CLAUDE.md). Prefer well-named identifiers.

---

## Phase 1 — Foundation

### Task 1: Design tokens — rewrite `globals.css`

**Files:**
- Modify: `src/app/globals.css`

**Goal:** Lock the brand color ramp, semantic colors, slate neutrals, type scale, radius scale, elevation, motion tokens, and focus-ring style. Both light and dark variables are declared (dark unused but kept ready for Phase B).

- [ ] **Step 1: Replace `globals.css` contents with the new token system**

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  --color-primary-50: var(--primary-50);
  --color-primary-100: var(--primary-100);
  --color-primary-200: var(--primary-200);
  --color-primary-300: var(--primary-300);
  --color-primary-400: var(--primary-400);
  --color-primary-500: var(--primary-500);
  --color-primary-600: var(--primary-600);
  --color-primary-700: var(--primary-700);
  --color-primary-800: var(--primary-800);
  --color-primary-900: var(--primary-900);
  --color-primary-950: var(--primary-950);

  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-info: var(--info);

  --color-channel-whatsapp: var(--channel-whatsapp);
  --color-channel-rcs: var(--channel-rcs);
  --color-channel-sms: var(--channel-sms);

  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);

  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
}

::placeholder { color: var(--muted-foreground); opacity: 1; }

:root {
  /* Primary ramp — Squalto green */
  --primary-50:  #F0FDF4;
  --primary-100: #DCFCE7;
  --primary-200: #BBF7D0;
  --primary-300: #86EFAC;
  --primary-400: #4ADE80;
  --primary-500: #22C55E;
  --primary-600: #16A34A;
  --primary-700: #15803D;
  --primary-800: #166534;
  --primary-900: #14532D;
  --primary-950: #052E16;

  /* Canonical primary */
  --primary: var(--primary-600);
  --primary-foreground: #FFFFFF;

  /* Semantic */
  --success: var(--primary-600);
  --warning: #D97706;       /* amber-600 */
  --info:    #2563EB;       /* blue-600 */
  --destructive: #DC2626;   /* red-600 */
  --destructive-foreground: #FFFFFF;

  /* Channel colors (use only when channel identity is the point) */
  --channel-whatsapp: #25D366;
  --channel-rcs:      #4F46E5; /* indigo-600 */
  --channel-sms:      #4B5563; /* gray-600 */

  /* Slate neutrals */
  --background: #FFFFFF;
  --foreground: #0F172A;       /* slate-900 */
  --card: #FFFFFF;
  --card-foreground: #0F172A;
  --popover: #FFFFFF;
  --popover-foreground: #0F172A;
  --secondary: #F1F5F9;        /* slate-100 */
  --secondary-foreground: #0F172A;
  --muted: #F8FAFC;            /* slate-50 */
  --muted-foreground: #64748B; /* slate-500 */
  --accent: #F1F5F9;
  --accent-foreground: #0F172A;
  --border: #E2E8F0;           /* slate-200 */
  --input: #E2E8F0;
  --ring: var(--primary-600);

  --radius: 0.5rem;

  /* Motion */
  --motion-fast: 120ms;
  --motion-base: 180ms;
  --motion-slow: 240ms;
  --ease-out-default: cubic-bezier(0.16, 1, 0.3, 1);
}

.dark {
  /* Dark-ready: kept for Phase B, unused in Phase A */
  --background: #0B0F19;
  --foreground: #F8FAFC;
  --card: #111827;
  --card-foreground: #F8FAFC;
  --popover: #111827;
  --popover-foreground: #F8FAFC;
  --secondary: #1F2937;
  --secondary-foreground: #F8FAFC;
  --muted: #1F2937;
  --muted-foreground: #94A3B8;
  --accent: #1F2937;
  --accent-foreground: #F8FAFC;
  --border: #1F2937;
  --input: #1F2937;
  --ring: var(--primary-500);
  --primary-foreground: #052E16;
}

@layer utilities {
  .text-display { font-size: 36px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.2; }
  .text-h1      { font-size: 24px; font-weight: 600; letter-spacing: -0.01em; line-height: 1.2; }
  .text-h2      { font-size: 18px; font-weight: 600; line-height: 1.3; }
  .text-h3      { font-size: 16px; font-weight: 600; line-height: 1.4; }
  .text-body    { font-size: 14px; font-weight: 400; line-height: 1.5; }
  .text-small   { font-size: 13px; font-weight: 400; line-height: 1.5; }
  .text-caption { font-size: 12px; font-weight: 500; letter-spacing: 0.04em; line-height: 1.4; text-transform: uppercase; }

  .shadow-e1 { box-shadow: 0 0 0 1px rgb(15 23 42 / 0.06); }
  .shadow-e2 { box-shadow: 0 1px 2px rgb(15 23 42 / 0.04), 0 4px 12px -2px rgb(15 23 42 / 0.06); }
  .shadow-e3 { box-shadow: 0 8px 24px -4px rgb(15 23 42 / 0.12); }
  .shadow-e4 { box-shadow: 0 16px 48px -8px rgb(15 23 42 / 0.18); }
  .shadow-primary-glow { box-shadow: 0 8px 24px -8px rgb(22 163 74 / 0.45); }

  .focus-ring { outline: none; }
  .focus-ring:focus-visible { box-shadow: 0 0 0 2px var(--background), 0 0 0 4px rgb(22 163 74 / 0.30); }

  @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
  .animate-shimmer { background: linear-gradient(90deg, var(--secondary) 0px, var(--accent) 200px, var(--secondary) 400px); background-size: 800px 100%; animation: shimmer 1.5s infinite linear; }

  @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  .animate-pulse-dot { animation: pulse-dot 1.5s infinite ease-in-out; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .animate-shimmer { animation: none; background: var(--secondary); }
  .animate-pulse-dot { animation: none; opacity: 1; }
}

@layer base {
  * { border-color: var(--border); }
  body { background: var(--background); color: var(--foreground); font-family: var(--font-geist-sans); }
}
```

- [ ] **Step 2: Type-check / build**

Run: `npm run build`
Expected: build succeeds. If TypeScript complains about removed shadcn tokens (e.g., `chart-1`), grep for usage and replace with concrete colors or remove. Tokens that no longer exist in this rewrite: `chart-1..5`, `sidebar-*`. None of these are referenced by app code based on inventory but verify with `grep -rn "chart-\|sidebar-primary\|sidebar-foreground\|sidebar-accent\|sidebar-border\|sidebar-ring" src`.

- [ ] **Step 3: Visual smoke**

Run: `npm run dev` → open `http://localhost:3000` and `http://localhost:3000/auth/login`.
Expected: marketing site looks unchanged (it uses inline `#16A34A` literal), in-app surfaces look slightly different in spacing/colors but not broken. Buttons that used `bg-primary` now render Squalto green instead of black.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "chore(tokens): adopt brand-driven design token system"
```

---

### Task 2: Brand assets — SVG logo, favicons, OG image, JPG migration

**Files:**
- Create: `public/logo-mark.svg`, `public/logo-wordmark.svg`, `public/og-image.png`, `public/apple-touch-icon.png`, `public/icon-512.png`, `public/manifest.json`
- Replace: `public/favicon.ico` (regenerate from `logo-mark.svg`)
- Modify: `src/app/page.tsx`, `src/app/app/layout.tsx`, `src/app/layout.tsx`

- [ ] **Step 1: Create the SVG logo files**

If a designer-provided SVG is not available, hand-author a minimal mark using the canonical green. Save `public/logo-mark.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="8" fill="#16A34A"/>
  <path d="M9 12c0-1.6 1.3-3 3-3h6c2.8 0 5 2.2 5 5v6c0 1.6-1.3 3-3 3h-6c-2.8 0-5-2.2-5-5v-6z" fill="#fff"/>
  <path d="M14 16h6" stroke="#16A34A" stroke-width="2" stroke-linecap="round"/>
  <path d="M14 19h4" stroke="#16A34A" stroke-width="2" stroke-linecap="round"/>
</svg>
```

Save `public/logo-wordmark.svg` (mark + wordmark "Squalto"):

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 32" fill="none">
  <rect width="32" height="32" rx="8" fill="#16A34A"/>
  <path d="M9 12c0-1.6 1.3-3 3-3h6c2.8 0 5 2.2 5 5v6c0 1.6-1.3 3-3 3h-6c-2.8 0-5-2.2-5-5v-6z" fill="#fff"/>
  <text x="42" y="22" font-family="Geist, sans-serif" font-size="18" font-weight="600" fill="#0F172A">Squalto</text>
</svg>
```

> **Note:** If a designer-provided SVG is delivered later, replace these placeholders. The file paths and references stay the same.

- [ ] **Step 2: Generate favicons**

Use any tool (e.g., realfavicongenerator.net, or manual export from Figma). Generate from `public/logo-mark.svg`:
- `public/favicon.ico` — 16/32/48 multi-res
- `public/apple-touch-icon.png` — 180×180 with ~10% safe padding
- `public/icon-512.png` — 512×512

If tooling is unavailable in the dev environment, create placeholder PNGs at the right dimensions and flag for designer follow-up.

- [ ] **Step 3: Create `public/manifest.json`**

```json
{
  "name": "Squalto",
  "short_name": "Squalto",
  "icons": [
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "theme_color": "#16A34A",
  "background_color": "#FFFFFF",
  "display": "standalone"
}
```

- [ ] **Step 4: Create `public/og-image.png`**

1200×630 PNG. Wordmark + tagline "AI-First WhatsApp & RCS Engagement Platform" + soft WhatsApp message thumb as background detail. If tooling unavailable, create a placeholder for designer hand-off (commit a 1200×630 solid-green PNG with the wordmark centered as a fallback).

- [ ] **Step 5: Wire OG image + favicons in root layout**

Modify `src/app/layout.tsx` — add `metadata`:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Squalto — AI-First WhatsApp & RCS Engagement Platform",
  description: "Automate conversations, recover carts, and convert leads with AI-powered WhatsApp & RCS messaging.",
  metadataBase: new URL("https://squalto.com"),
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  themeColor: "#16A34A",
  openGraph: {
    title: "Squalto",
    description: "AI-First WhatsApp & RCS Engagement Platform",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Squalto",
    description: "AI-First WhatsApp & RCS Engagement Platform",
    images: ["/og-image.png"],
  },
};
```

(If `metadata` already exists, merge fields; do not overwrite.)

- [ ] **Step 6: Migrate `/squalto.jpg` references (4 hits)**

```bash
grep -rn "/squalto.jpg" src
```
Expected: 4 hits (verified during planning):
1. `src/app/page.tsx:39` — marketing nav logo
2. `src/app/page.tsx:657` — marketing footer logo
3. `src/app/app/layout.tsx:56` — sidebar expanded logo
4. `src/app/app/layout.tsx:71` — sidebar collapsed icon

Replace per usage:
- Marketing nav (`page.tsx:39`): `/squalto.jpg` → `/logo-wordmark.svg`, drop `width={32} height={32}`, replace with `width={120} height={28}`. Remove the inline `<span>Squalto</span>` if present (the wordmark SVG already includes the text).
- Marketing footer (`page.tsx:657`): same as above.
- Sidebar expanded (`layout.tsx:56`): `/squalto.jpg` → `/logo-wordmark.svg`, dimensions `120×28`.
- Sidebar collapsed (`layout.tsx:71`): `/squalto.jpg` → `/logo-mark.svg`, keep `32×32`.

After replacement, re-verify:
```bash
grep -rn "/squalto.jpg" src public
```
Expected: 0 hits.

- [ ] **Step 7: Visual smoke**

Run `npm run dev`. Visit `/`, `/auth/login`, `/app`. Confirm:
- Browser tab shows green favicon, not the JPG (hard-refresh: ⌘⇧R).
- Logo renders as SVG everywhere; no broken images.
- View page source on `/`, find `<meta property="og:image">` pointing to `/og-image.png`.

- [ ] **Step 8: Commit**

```bash
git add public/logo-mark.svg public/logo-wordmark.svg public/favicon.ico public/apple-touch-icon.png public/icon-512.png public/manifest.json public/og-image.png src/app/layout.tsx src/app/page.tsx src/app/app/layout.tsx
git commit -m "chore(brand): swap squalto.jpg for SVG logos, add favicons and OG"
```

---

### Task 3: Extract `<PhoneFrame>` shared component

**Files:**
- Create: `src/components/ui/PhoneFrame.tsx`
- Modify: `src/app/page.tsx` (extract the inline phone frame from Hero), `src/components/ui/WhatsappPreview.tsx` (use the shared frame)

**Goal:** A single phone-frame component used by both the marketing-site hero and the in-app `WhatsappPreview` so the visual language is shared.

- [ ] **Step 1: Create `src/components/ui/PhoneFrame.tsx`**

```tsx
"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
  showStatusBar?: boolean;
}

export function PhoneFrame({ children, className, showStatusBar = true }: PhoneFrameProps) {
  return (
    <div className={cn("w-64 bg-[#0F1117] rounded-3xl p-3 shadow-e3 ring-1 ring-white/10", className)}>
      {showStatusBar && (
        <div className="flex items-center justify-between px-2 py-1 mb-1">
          <span className="text-white text-xs font-medium">9:41</span>
          <div className="flex gap-1">
            <div className="w-3 h-1.5 bg-white/60 rounded-sm" />
            <div className="w-3 h-1.5 bg-white/60 rounded-sm" />
            <div className="w-3 h-1.5 bg-white/60 rounded-sm" />
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Refactor marketing hero to use `<PhoneFrame>`**

In `src/app/page.tsx`, find the Hero's inline phone-frame markup (around the WhatsApp chat mockup). Replace the outer `<div className="w-64 bg-[#0F1117] rounded-3xl p-3 shadow-2xl ring-1 ring-white/10">` and its status bar with `<PhoneFrame>...</PhoneFrame>`. Leave the chat header, body, and floating stat card as-is — those are content, not chrome.

- [ ] **Step 3: Refactor `WhatsappPreview` to use `<PhoneFrame>`**

Read `src/components/ui/WhatsappPreview.tsx`. If it has its own phone-frame chrome, extract the chrome into `<PhoneFrame>` usage. The phone *content* (chat bubbles, header) stays inside the `PhoneFrame` children.

- [ ] **Step 4: Visual smoke**

Run `npm run dev`. Compare marketing hero phone vs in-app WhatsApp preview (e.g., on `/app/whatsapp/sendMessage`). Both should now have identical chrome dimensions, status bar, and shadow. Content inside differs.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/PhoneFrame.tsx src/app/page.tsx src/components/ui/WhatsappPreview.tsx
git commit -m "refactor(ui): extract shared PhoneFrame for marketing + product"
```

---

## Phase 2 — Atom upgrades

Order matters — later atoms reference earlier ones.

### Task 4: Button — primary green, `xs` size, `loading` prop, primary-tinted shadow

**Files:**
- Modify: `src/components/ui/Button.tsx`
- Migrate ad-hoc usages: ~6 `bg-green-500/600` button sites (see grep below)

- [ ] **Step 1: Replace `Button.tsx`**

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium transition-[background-color,color,box-shadow,opacity] duration-[var(--motion-fast)] focus-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-700 hover:shadow-primary-glow",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-7 px-2.5 text-xs",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

- [ ] **Step 2: Find ad-hoc `bg-green-*` *button* usages**

```bash
grep -rn "bg-green-[56]00.*hover:bg-green" src
```
Replace each with `<Button>` default variant. Specifically:
- `src/app/app/page.tsx:66` — `<Button onClick={...} className="bg-green-500 hover:bg-green-600 text-white">` → `<Button onClick={...}>`
- `src/app/app/page.tsx:102` — `<Button ... className="bg-green-500 text-white">` → `<Button ...>`
- `src/app/app/rcs/deliveryReport/page.tsx:101` — raw `<button className="bg-green-600 ... rounded-lg ...">` → migrate to `<Button>`.
- `src/app/app/rcs/campaignReport/page.tsx:165` — same pattern, migrate.

Drop the now-redundant `text-white`, `bg-green-*`, `hover:bg-green-*`, `rounded-lg`, `transition-colors` from those button calls.

- [ ] **Step 3: Verify type + build**

```bash
npm run lint && npm run build
```
Expected: passes.

- [ ] **Step 4: Visual smoke**

Run `npm run dev`. Open `/app` services dashboard. Verify "New Service" button is Squalto green and has a primary-tinted shadow on hover. Click "Add Service" inside the empty state — same.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/Button.tsx src/app/app/page.tsx src/app/app/rcs/deliveryReport/page.tsx src/app/app/rcs/campaignReport/page.tsx
git commit -m "feat(ui): upgrade Button — primary green, xs size, loading, glow"
```

---

### Task 5: Input — focus ring, error state, `leadingIcon`, `trailingSlot`

**Files:**
- Modify: `src/components/ui/Input.tsx`
- Migrate ~6 absolute-positioned-icon hacks (services dashboard, contacts toolbar, sendMessage, etc.)

- [ ] **Step 1: Replace `Input.tsx`**

```tsx
import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: LucideIcon
  trailingSlot?: React.ReactNode
  invalid?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leadingIcon: Leading, trailingSlot, invalid, ...props }, ref) => {
    const ringStyles = invalid
      ? "border-destructive focus-visible:ring-2 focus-visible:ring-destructive/30"
      : "border-input focus-visible:ring-2 focus-visible:ring-primary/30";

    if (!Leading && !trailingSlot) {
      return (
        <input
          type={type}
          aria-invalid={invalid}
          className={cn(
            "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-[box-shadow,border-color] duration-[var(--motion-fast)]",
            ringStyles,
            className,
          )}
          ref={ref}
          {...props}
        />
      );
    }

    return (
      <div className="relative w-full">
        {Leading && (
          <Leading className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
        <input
          type={type}
          aria-invalid={invalid}
          className={cn(
            "flex h-10 w-full rounded-md border bg-background py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-[box-shadow,border-color] duration-[var(--motion-fast)]",
            Leading ? "pl-9" : "pl-3",
            trailingSlot ? "pr-10" : "pr-3",
            ringStyles,
            className,
          )}
          ref={ref}
          {...props}
        />
        {trailingSlot && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">{trailingSlot}</div>
        )}
      </div>
    );
  }
)

Input.displayName = "Input"

export { Input }
```

- [ ] **Step 2: Find absolute-positioned-search-icon patterns**

```bash
grep -rn 'Search.*absolute\|absolute.*Search' src
```
Expected: hits in `src/app/app/page.tsx`, `src/app/app/whatsapp/contacts/page.tsx`, `src/app/app/whatsapp/sendMessage/page.tsx`, and similar.

- [ ] **Step 3: Migrate each**

Pattern to replace:
```tsx
<div className="relative w-full">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
  <Input placeholder="Search for X" className="pl-9" />
</div>
```
becomes:
```tsx
<Input leadingIcon={Search} placeholder="Search for X" />
```

Confirm sites: `/app` dashboard, `/app/whatsapp/contacts`, any other matched files.

- [ ] **Step 4: Build**

```bash
npm run build
```

- [ ] **Step 5: Visual smoke**

Run `npm run dev`. Open `/app/whatsapp/contacts`. Click into the search input → verify the focus ring appears (subtle green ring at 30% opacity, no offset overlap). The leading search icon is muted-gray.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/Input.tsx src/app/app/page.tsx src/app/app/whatsapp/contacts/page.tsx src/app/app/whatsapp/sendMessage/page.tsx
git commit -m "feat(ui): Input gets focus ring, error state, leadingIcon slot"
```

---

### Task 6: Badge — dot indicator, sizes, primary-100 active

**Files:**
- Modify: `src/components/ui/badge.tsx`

- [ ] **Step 1: Replace `badge.tsx`**

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus-ring",
  {
    variants: {
      variant: {
        default:     "border-transparent bg-primary text-primary-foreground",
        secondary:   "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline:     "text-foreground",
        active:      "border-transparent bg-primary-100 text-primary-800",
        pending:     "border-transparent bg-yellow-50 text-yellow-700",
        inactive:    "border-transparent bg-slate-100 text-slate-600",
        rejected:    "border-transparent bg-red-50 text-red-700",
        info:        "border-transparent bg-blue-50 text-blue-700",
      },
      size: {
        sm: "text-[11px] px-2 py-0.5",
        md: "text-xs px-2.5 py-0.5",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
)

const dotColors: Record<string, string> = {
  active:   "bg-primary-600",
  pending:  "bg-yellow-500",
  inactive: "bg-slate-400",
  rejected: "bg-red-500",
  info:     "bg-blue-500",
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
  const showDot = dot && variant && variant in dotColors;
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {showDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full", dotColors[variant as string])} />
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
```

- [ ] **Step 2: Build**

```bash
npm run build
```

- [ ] **Step 3: Visual smoke**

Open `/app` services dashboard. Confirm the status badges (Active / Inactive / etc.) render with the new green-tinted active state. Open `/app/whatsapp/contacts` and verify tag chips (without `dot`) still render fine.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/badge.tsx
git commit -m "feat(ui): Badge gets dot indicator, size variants, primary-100 active"
```

---

### Task 7: PageHeading — eyebrow + actions slots, locked typography

**Files:**
- Modify: `src/components/ui/PageHeading.tsx`

- [ ] **Step 1: Read current `PageHeading.tsx`**

Run `cat src/components/ui/PageHeading.tsx` (or use Read tool). Note current props (`title`, `subtitle`).

- [ ] **Step 2: Rewrite with eyebrow + actions slots**

```tsx
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeadingProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeading({ title, subtitle, eyebrow, actions, className }: PageHeadingProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <div className="text-caption text-muted-foreground mb-1">{eyebrow}</div>
        )}
        <h1 className="text-h1 text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-small text-muted-foreground mt-1.5 max-w-2xl">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
```

- [ ] **Step 3: Build + smoke**

```bash
npm run build
```
Visit `/app/whatsapp/contacts`. Confirm "Contacts" heading uses the new typography (24/600 with subtle letter-spacing).

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/PageHeading.tsx
git commit -m "feat(ui): PageHeading gets eyebrow + actions slots, locked H1 type"
```

---

### Task 8: Card primitive (new) + migrate raw-div cards

**Files:**
- Create: `src/components/ui/Card.tsx`
- Migrate: ~16 raw-div card sites (see grep below)

- [ ] **Step 1: Create `src/components/ui/Card.tsx`**

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "bg-card text-card-foreground rounded-lg border transition-[box-shadow,transform] duration-[var(--motion-base)]",
  {
    variants: {
      variant: {
        default:     "border-border shadow-e1",
        interactive: "border-border shadow-e1 hover:shadow-e2 hover:-translate-y-px cursor-pointer",
        highlight:   "border-primary-200 bg-primary-50/40 shadow-e1",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant }), className)} {...props} />
  ),
);
Card.displayName = "Card";

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1 p-6 pb-4", className)} {...props} />
);
export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-h3 text-foreground", className)} {...props} />
);
export const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-small text-muted-foreground", className)} {...props} />
);
export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);
export const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center justify-end gap-2 p-6 pt-0 border-t border-border bg-muted/40", className)} {...props} />
);
```

- [ ] **Step 2: Find raw-div card sites**

```bash
grep -rn 'className="[^"]*bg-white border[^"]*rounded-' src | grep -v node_modules
```
Expected ~16 hits (verified during planning):
- `src/app/app/rcs/page.tsx:65, 117`
- `src/app/app/rcs/sendMessage/page.tsx:72, 152`
- `src/app/app/whatsapp/page.tsx:108, 132, 202, 251`
- `src/app/app/whatsapp/sendMessage/page.tsx:237, 306`
- `src/app/app/whatsapp/deliveryReport/page.tsx:132`
- `src/components/ui/StatsCard.tsx:14` (StatsCard is upgraded separately in Task 10)
- `src/components/whatsapp/RecipientPicker.tsx:98`
- `src/app/page.tsx:231, 600` (marketing — leave as-is, marketing is exempt)

- [ ] **Step 3: Migrate each in-app site**

Pattern:
```tsx
<div className="bg-white border border-gray-100 rounded-xl p-6">
  ...
</div>
```
becomes:
```tsx
<Card className="p-6">
  ...
</Card>
```

For sites with header/content structure:
```tsx
<Card>
  <CardHeader>
    <CardTitle>...</CardTitle>
    <CardDescription>...</CardDescription>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```
**Skip** `src/components/ui/StatsCard.tsx` — handled in Task 10. **Skip** `src/app/page.tsx` (marketing exempt).

- [ ] **Step 4: Verify migration complete**

```bash
grep -rn 'className="[^"]*bg-white border[^"]*rounded-' src | grep -v "src/app/page.tsx"
```
Expected: 0 hits (StatsCard counts after Task 10).

- [ ] **Step 5: Build + smoke**

```bash
npm run build
```
Visit `/app/whatsapp` (RCS dashboard preview), `/app/whatsapp/sendMessage`. All cards render identically or slightly more polished (border + shadow-e1 lift).

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/Card.tsx src/app/app/whatsapp/page.tsx src/app/app/whatsapp/sendMessage/page.tsx src/app/app/whatsapp/deliveryReport/page.tsx src/components/whatsapp/RecipientPicker.tsx src/app/app/rcs/page.tsx src/app/app/rcs/sendMessage/page.tsx
git commit -m "feat(ui): add Card primitive, migrate raw-div cards"
```

---

### Task 9: EmptyState primitive (new) + migrate ad-hoc empty boxes

**Files:**
- Create: `src/components/ui/EmptyState.tsx`
- Migrate: ~6 ad-hoc empty states

- [ ] **Step 1: Create `src/components/ui/EmptyState.tsx`**

```tsx
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: LucideIcon;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  variant?: "default" | "hero";
  className?: string;
  children?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = "default",
  className,
  children,
}: EmptyStateProps) {
  const isHero = variant === "hero";
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center rounded-lg border",
        isHero
          ? "py-20 px-8 border-primary-100 bg-[radial-gradient(ellipse_at_top,_var(--primary-50),_transparent_60%)]"
          : "py-12 px-6 border-border bg-muted/30",
        className,
      )}
    >
      <div className={cn(
        "rounded-full flex items-center justify-center mb-4",
        isHero ? "w-16 h-16 bg-primary-100" : "w-12 h-12 bg-secondary",
      )}>
        <Icon className={cn(isHero ? "w-7 h-7 text-primary-700" : "w-5 h-5 text-muted-foreground")} />
      </div>
      <h3 className={cn(isHero ? "text-h1" : "text-h2", "text-foreground")}>{title}</h3>
      {description && (
        <p className="text-small text-muted-foreground mt-2 max-w-sm">{description}</p>
      )}
      {(primaryAction || secondaryAction) && (
        <div className="flex items-center gap-2 mt-6">
          {primaryAction && (
            <Button onClick={primaryAction.onClick} asChild={!!primaryAction.href}>
              {primaryAction.href ? (
                <a href={primaryAction.href}>
                  {primaryAction.icon && <primaryAction.icon className="h-4 w-4" />}
                  {primaryAction.label}
                </a>
              ) : (
                <>
                  {primaryAction.icon && <primaryAction.icon className="h-4 w-4" />}
                  {primaryAction.label}
                </>
              )}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick} asChild={!!secondaryAction.href}>
              {secondaryAction.href ? (
                <a href={secondaryAction.href}>
                  {secondaryAction.icon && <secondaryAction.icon className="h-4 w-4" />}
                  {secondaryAction.label}
                </a>
              ) : (
                <>
                  {secondaryAction.icon && <secondaryAction.icon className="h-4 w-4" />}
                  {secondaryAction.label}
                </>
              )}
            </Button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Find ad-hoc empty states**

```bash
grep -rn 'No .* yet\|No .* added\|coming soon\|Empty state' src | grep -v node_modules
```
Expected sites include `src/app/app/page.tsx:94-107` (services empty), `src/app/app/whatsapp/contacts/page.tsx` (when contacts list is empty), and similar. Also check `src/components/whatsapp/ContactsTable.tsx` for inline empty rendering.

- [ ] **Step 3: Migrate each**

Example — `src/app/app/page.tsx` services empty state:

```tsx
import { EmptyState } from "@/components/ui/EmptyState";
import { Plus, Layers } from "lucide-react";

// inside the component, when filteredServices.length === 0:
<EmptyState
  variant="hero"
  icon={Layers}
  title="No services yet"
  description="Connect your first channel to start sending messages."
  primaryAction={{
    label: "Add Service",
    icon: Plus,
    onClick: () => setIsModalOpen(true),
  }}
/>
```

Apply the same pattern to remaining sites. Use `variant="hero"` for full-page-ish empties (dashboard, contacts when total=0). Use default for in-context empties (e.g., a list with no members shown inside the contacts table area).

- [ ] **Step 4: Build + smoke**

```bash
npm run build
```
Verify at `/app` (when services list is empty for a fresh user) — primary-50 radial gradient wash visible, primary-100 icon circle, large heading, primary CTA below.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/EmptyState.tsx src/app/app/page.tsx src/app/app/whatsapp/contacts/page.tsx
git commit -m "feat(ui): add EmptyState primitive, migrate ad-hoc empties"
```

---

### Task 10: StatsCard — new typography hierarchy, trend pill, accent variant

**Files:**
- Modify: `src/components/ui/StatsCard.tsx`
- Modify: `src/lib/type.ts` if `StatsCardProps` lives there (add new optional props)

- [ ] **Step 1: Read `src/lib/type.ts` for `StatsCardProps`**

Look up the interface. Current props per `StatsCard.tsx`: `title`, `value`, `icon`, `trend`, `trendUp`, `tooltip`. Plan adds `sparkline?: ReactNode`, `accent?: boolean`.

- [ ] **Step 2: Update `StatsCardProps` in `src/lib/type.ts`**

Add:
```ts
import { ReactNode } from "react";

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;          // e.g. "+12.5%"
  trendUp?: boolean;
  tooltip?: string;
  sparkline?: ReactNode;
  accent?: boolean;
}
```
(Keep existing fields; add only new ones.)

- [ ] **Step 3: Rewrite `src/components/ui/StatsCard.tsx`**

```tsx
import { StatsCardProps } from "@/lib/type";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { Card } from "./Card";
import { cn } from "@/lib/utils";

export function StatsCard({
  title,
  value,
  icon,
  trend,
  trendUp,
  tooltip,
  sparkline,
  accent,
}: StatsCardProps) {
  return (
    <Card className={cn("p-6", accent && "border-primary-200 bg-primary-50/40")}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex gap-1.5 items-center text-muted-foreground">
            {icon}
            <span className="text-caption">{title}</span>
            {tooltip && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="text-muted-foreground/70 h-3 w-3" />
                </TooltipTrigger>
                <TooltipContent sideOffset={8}>{tooltip}</TooltipContent>
              </Tooltip>
            )}
          </div>
          <div className="flex items-baseline justify-between mt-2 gap-3">
            <p className="text-[32px] leading-none font-bold text-foreground tabular-nums">
              {value}
            </p>
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
                  trendUp ? "bg-primary-100 text-primary-800" : "bg-red-50 text-red-700",
                )}
              >
                {trendUp ? "↑" : "↓"} {trend}
              </span>
            )}
          </div>
        </div>
        {sparkline && <div className="ml-4 shrink-0">{sparkline}</div>}
      </div>
    </Card>
  );
}
```

- [ ] **Step 4: Build + smoke**

```bash
npm run build
```
Visit any page with StatsCards (e.g., `/app/whatsapp` if it has stats, or `/app/whatsapp/deliveryReport`). Confirm value typography is now 32px tabular-nums, title is uppercase caption, trend is a colored pill rather than an inline arrow.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/StatsCard.tsx src/lib/type.ts
git commit -m "feat(ui): StatsCard gets new hierarchy, trend pill, accent variant"
```

---

### Task 11: Skeleton — shimmer + named primitives

**Files:**
- Modify: `src/components/ui/skeleton.tsx`

- [ ] **Step 1: Replace `skeleton.tsx`**

```tsx
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-shimmer rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export function SkeletonText({ width = "100%", className }: { width?: string; className?: string }) {
  return <Skeleton className={cn("h-4", className)} style={{ width }} />;
}

export function SkeletonCircle({ size = 32, className }: { size?: number; className?: string }) {
  return <Skeleton className={cn("rounded-full", className)} style={{ width: size, height: size }} />;
}

export function SkeletonStat({ className }: { className?: string }) {
  return (
    <div className={cn("p-6 rounded-lg border border-border bg-card", className)}>
      <Skeleton className="h-3 w-24 mb-3" />
      <Skeleton className="h-8 w-32" />
    </div>
  );
}

export function SkeletonRow({ columns = 4, className }: { columns?: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-4 px-3 py-3 border-b border-border", className)}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
  );
}
```

> The `animate-shimmer` keyframes are declared in `globals.css` (Task 1). No additional CSS needed here.

- [ ] **Step 2: Build + smoke**

```bash
npm run build
```
Visit any list page during loading (briefly) — skeleton rows now shimmer left-to-right instead of pulse.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/skeleton.tsx
git commit -m "feat(ui): Skeleton shimmer + named primitives (Text, Circle, Stat, Row)"
```

---

### Task 12: Modal — backdrop blur + Framer Motion + standard Header/Footer

**Files:**
- Modify: `src/components/ui/Modal.tsx`

- [ ] **Step 1: Read existing `Modal.tsx`** to understand current API (likely raw Radix Dialog + a children pattern). Preserve the public `<Modal isOpen onClose>` API so existing call sites don't break.

- [ ] **Step 2: Rewrite `Modal.tsx`**

```tsx
"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const sizeClass: Record<string, string> = {
  sm: "max-w-[400px]",
  md: "max-w-[500px]",
  lg: "max-w-[640px]",
  xl: "max-w-[800px]",
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: keyof typeof sizeClass;
  children: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, size = "md", children, className }: ModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={cn(
                  "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] rounded-lg bg-card text-card-foreground shadow-e3 border border-border",
                  sizeClass[size],
                  className,
                )}
              >
                {children}
                <Dialog.Close
                  className="absolute right-4 top-4 rounded-md text-muted-foreground hover:text-foreground focus-ring p-1"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

export function ModalHeader({ title, description, className }: { title: string; description?: string; className?: string }) {
  return (
    <div className={cn("px-6 pt-6 pb-4 border-b border-border", className)}>
      <Dialog.Title className="text-h2 text-foreground">{title}</Dialog.Title>
      {description && (
        <Dialog.Description className="text-small text-muted-foreground mt-1">
          {description}
        </Dialog.Description>
      )}
    </div>
  );
}

export function ModalBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("px-6 py-4", className)}>{children}</div>;
}

export function ModalFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-muted/40 rounded-b-lg", className)}>
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Migrate existing modal call sites to use `ModalHeader/Body/Footer`**

Find existing modals:
```bash
grep -rn "<Modal " src
```
For each (`AddContactModal`, `EditContactModal`, `CsvImportModal`, `ServiceModalContent`, etc.), replace bespoke header/footer markup with `<ModalHeader title="..." description="..." />` and `<ModalFooter>...</ModalFooter>`. Wrap body content in `<ModalBody>`.

- [ ] **Step 4: Build + smoke**

```bash
npm run build
```
Open `/app/whatsapp/contacts`, click "Add contact" → modal animates in with spring (scale 0.96→1 + opacity), backdrop is blurred, close X is in the top-right.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/Modal.tsx src/components/whatsapp/AddContactModal.tsx src/components/whatsapp/EditContactModal.tsx src/components/whatsapp/CsvImportModal.tsx src/app/app/addService.tsx
git commit -m "feat(ui): Modal gets backdrop blur, spring motion, standard sections"
```

---

### Task 13: Table — Linear-style polish

**Files:**
- Modify: `src/components/ui/table.tsx`

- [ ] **Step 1: Read existing `table.tsx`** (probably shadcn-default).

- [ ] **Step 2: Rewrite with Linear-style densification**

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn("w-full caption-bottom text-small", className)} {...props} />
    </div>
  ),
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("sticky top-0 z-10 bg-card border-b border-border", className)} {...props} />
  ),
);
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("", className)} {...props} />
  ),
);
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "group border-b border-border transition-colors duration-[var(--motion-fast)]",
        "even:bg-slate-50/40 hover:bg-primary-50/60 data-[state=selected]:bg-primary-50",
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-9 px-3 text-left align-middle text-caption text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),
);
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn("h-10 px-3 align-middle", className)} {...props} />
  ),
);
TableCell.displayName = "TableCell";

interface TableEmptyProps {
  colSpan: number;
  children: React.ReactNode;
}
export function TableEmpty({ colSpan, children }: TableEmptyProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-12">
        <div className="flex flex-col items-center justify-center text-center">
          {children}
        </div>
      </td>
    </tr>
  );
}

export function TableLoading({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-b border-border">
          {Array.from({ length: columns }).map((_, c) => (
            <td key={c} className="h-10 px-3">
              <div className="animate-shimmer h-4 rounded bg-muted" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function TableActions({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--motion-fast)]", className)}>
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Build + smoke**

```bash
npm run build
```
Visit `/app/whatsapp/contacts`. Verify rows are 40px tall, header is uppercase caption, hover row tints primary-50, even rows have a subtle slate stripe. Place an action icon inside `<TableActions>` in `ContactsTable` (e.g., the Edit pencil) — confirm it appears only on row hover.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/table.tsx src/components/whatsapp/ContactsTable.tsx
git commit -m "feat(ui): Table gets Linear-style density, hover-reveal actions"
```

---

### Task 14: Sidebar — kill hover-expand, ship pin-toggle, polished active state

**Files:**
- Modify: `src/components/ui/sidebar.tsx`
- Modify: `src/app/app/layout.tsx` (use new pin-toggle pattern)

- [ ] **Step 1: Rewrite `sidebar.tsx` — open-by-default, manual pin toggle, persisted**

```tsx
"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { createContext, useContext, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronsLeft, ChevronsRight } from "lucide-react";

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarContextProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);
export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
};

const STORAGE_KEY = "squalto:sidebar:collapsed";

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsedState] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (stored === "1") setCollapsedState(true);
  }, []);

  const setCollapsed = (v: boolean) => {
    setCollapsedState(v);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, v ? "1" : "0");
  };

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar({ children }: { children: React.ReactNode }) {
  return <SidebarProvider>{children}</SidebarProvider>;
}

export function SidebarBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <>
      <DesktopSidebar className={className}>{children}</DesktopSidebar>
      <MobileSidebar className={className}>{children}</MobileSidebar>
    </>
  );
}

function DesktopSidebar({ children, className }: { children: React.ReactNode; className?: string }) {
  const { collapsed, setCollapsed } = useSidebar();
  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "h-screen sticky top-0 hidden md:flex md:flex-col bg-card border-r border-border px-3 py-4 shrink-0",
        className,
      )}
    >
      {children}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="mt-auto flex items-center gap-2 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground px-2 py-1.5 text-xs focus-ring"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        {!collapsed && <span>Collapse</span>}
      </button>
    </motion.aside>
  );
}

function MobileSidebar({ children, className }: { children: React.ReactNode; className?: string }) {
  const { mobileOpen, setMobileOpen } = useSidebar();
  return (
    <>
      <div className="h-12 px-4 flex md:hidden items-center justify-between bg-card border-b border-border">
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu className="text-foreground" /></button>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className={cn("fixed inset-0 z-50 bg-card p-6 flex flex-col", className)}
          >
            <button onClick={() => setMobileOpen(false)} className="self-end mb-6" aria-label="Close menu">
              <X className="text-foreground" />
            </button>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function SidebarLink({ link }: { link: SidebarLink }) {
  const { collapsed, setMobileOpen } = useSidebar();
  const pathname = usePathname();
  const active = pathname === link.href || pathname.startsWith(link.href + "/");

  return (
    <Link
      href={link.href}
      onClick={() => setMobileOpen(false)}
      className={cn(
        "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors duration-[var(--motion-fast)]",
        active
          ? "bg-primary-50 text-primary-700 border-l-2 border-primary-600 -ml-[2px] pl-[10px]"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      <span className="shrink-0">{link.icon}</span>
      {!collapsed && <span className="truncate">{link.label}</span>}
    </Link>
  );
}

export function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <div className="mt-4 first:mt-0">
      {!collapsed && <div className="text-caption text-muted-foreground px-2.5 mb-1">{title}</div>}
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Update `src/app/app/layout.tsx` to drop `open` state and use new sidebar context**

```tsx
"use client";

import { Sidebar, SidebarBody, SidebarLink, SidebarSection, useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { appLinks, rcsLinks, whatsappLinks } from "@/lib/sidebarLinks";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LogoutButton from "@/components/auth/LogoutButton";

function SidebarInner() {
  const { collapsed } = useSidebar();
  const pathname = usePathname();
  const isRcsRoute = pathname.startsWith("/app/rcs");
  const isWhatsappRoute = pathname.startsWith("/app/whatsapp");
  const links = isRcsRoute ? rcsLinks : isWhatsappRoute ? whatsappLinks : appLinks;

  return (
    <>
      <Link href="/app" className="flex items-center gap-2 px-2 py-2 mb-4">
        {collapsed ? (
          <Image src="/logo-mark.svg" alt="Squalto" width={28} height={28} />
        ) : (
          <Image src="/logo-wordmark.svg" alt="Squalto" width={120} height={28} />
        )}
      </Link>

      <SidebarSection title="Navigate">
        {links.map((link) => (
          <SidebarLink key={link.href} link={link} />
        ))}
      </SidebarSection>

      <div className="mt-auto pt-4 border-t border-border">
        <LogoutButton className="w-full text-left text-sm text-muted-foreground hover:text-foreground px-2.5 py-2 rounded-md hover:bg-accent" />
      </div>
    </>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Sidebar>
        <div className="md:flex">
          <SidebarBody>
            <SidebarInner />
          </SidebarBody>
          <main className="flex-1 w-full p-4 md:p-6 min-w-0">{children}</main>
        </div>
      </Sidebar>
    </ProtectedRoute>
  );
}
```

> Existing `Logo` and `LogoIcon` exported from this file are no longer needed; delete them.

- [ ] **Step 3: Update `src/lib/sidebarLinks.tsx` if it groups by section**

If the existing file just exports flat arrays, leave them as-is — the layout calls `<SidebarSection title="Navigate">` once. (Future polish: split into Phonebook / Templates / Reports sections — defer to Task 18 contacts polish if time.)

- [ ] **Step 4: Build + smoke**

```bash
npm run build
```
Open `/app`. Sidebar is open at 240px by default, labels visible, no hover-to-expand. Click "Collapse" at the bottom — it snaps to 64px (icons only). Reload page — collapsed state persisted via localStorage. Click an active route — see the primary-50 background + 2px primary-600 left border + primary-700 text on the active item.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/sidebar.tsx src/app/app/layout.tsx
git commit -m "feat(ui): Sidebar pin-toggle pattern, primary active state, SVG logos"
```

---

## Phase 3 — Tier 1 screens (bespoke polish)

After Phase 2, every screen already looks meaningfully better. Phase 3 is the bespoke polish on top.

### Task 15: Auth pages — split layout, email-first, ambient brand panel

**Files:**
- Modify: `src/app/auth/login/page.tsx`, `src/app/auth/signup/page.tsx`
- Possibly create: `src/components/auth/AuthLayout.tsx` if extraction makes sense

- [ ] **Step 1: Read both pages** to understand current form structure, validation, OAuth wiring.

- [ ] **Step 2: Create `src/components/auth/AuthLayout.tsx`**

```tsx
"use client";

import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { PhoneFrame } from "@/components/ui/PhoneFrame";

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 md:px-16">
        <Link href="/" className="inline-flex items-center gap-2 mb-12">
          <Image src="/logo-wordmark.svg" alt="Squalto" width={120} height={28} />
        </Link>
        <div className="max-w-[400px] w-full">
          <h1 className="text-h1 text-foreground">{title}</h1>
          <p className="text-small text-muted-foreground mt-2">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
      <aside className="hidden md:flex relative items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--primary-50),_transparent_70%)] overflow-hidden">
        <div className="absolute inset-0 bg-primary-50/30" aria-hidden />
        <PhoneFrame className="relative">
          <div className="bg-primary-600 rounded-t-xl px-3 py-2 flex items-center gap-2">
            <div className="w-7 h-7 bg-white/20 rounded-full" />
            <div>
              <p className="text-white text-xs font-semibold">Squalto AI</p>
              <p className="text-white/70 text-[10px]">Online</p>
            </div>
          </div>
          <div className="bg-[#ECE5DD] rounded-b-xl px-3 py-3 flex flex-col gap-2 min-h-[220px]">
            <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 max-w-[80%] shadow-sm">
              <p className="text-[11px] text-gray-800">Your order is confirmed.</p>
            </div>
            <div className="self-end bg-[#DCF8C6] rounded-lg rounded-tr-none px-3 py-2 max-w-[80%] shadow-sm">
              <p className="text-[11px] text-gray-800">Track your order</p>
            </div>
            <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 max-w-[80%] shadow-sm">
              <p className="text-[11px] text-gray-800">Out for delivery 🚚</p>
            </div>
          </div>
        </PhoneFrame>
      </aside>
    </div>
  );
}
```

- [ ] **Step 3: Refactor `src/app/auth/login/page.tsx`**

Wrap the page content in `<AuthLayout title="Welcome back" subtitle="Sign in to continue.">`. Replace the existing kitchen-sink layout with email-first flow:

```tsx
// Page structure (sketch — adapt to existing form/RHF wiring):
<AuthLayout title="Welcome back" subtitle="Sign in to your Squalto account.">
  <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
    <div>
      <label className="text-caption text-muted-foreground">Email</label>
      <Input
        type="email"
        leadingIcon={Mail}
        placeholder="you@company.com"
        {...register("email")}
        invalid={!!errors.email}
      />
    </div>
    {showPassword && (
      <div>
        <label className="text-caption text-muted-foreground">Password</label>
        <Input type="password" {...register("password")} invalid={!!errors.password} />
      </div>
    )}
    <Button type="submit" loading={isSubmitting}>Continue with email</Button>
  </form>
  <div className="my-6 flex items-center gap-3">
    <div className="h-px flex-1 bg-border" />
    <span className="text-caption text-muted-foreground">or</span>
    <div className="h-px flex-1 bg-border" />
  </div>
  <Button variant="outline" onClick={handleGoogle} className="w-full">
    <GoogleIcon className="h-4 w-4" /> Continue with Google
  </Button>
  <Button variant="link" onClick={() => setMagicLinkMode(true)} className="mt-4 w-full">
    Email me a sign-in link
  </Button>
  <p className="text-small text-muted-foreground mt-8 text-center">
    No account? <Link href="/auth/signup" className="text-primary-700 hover:underline">Sign up</Link>
  </p>
</AuthLayout>
```

> Preserve existing form wiring (react-hook-form, zod schemas, `apiClient` calls). The change is structural: split layout, single primary CTA, OAuth as secondary, magic-link as tertiary link.

- [ ] **Step 4: Apply same pattern to `signup/page.tsx`**

Use `<AuthLayout title="Create your account" subtitle="Start sending in minutes — no card required.">`.

- [ ] **Step 5: Add motion #15-style mount entrance**

Wrap the form column's inner div with framer-motion:
```tsx
<motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
  ...
</motion.div>
```

- [ ] **Step 6: Build + smoke**

```bash
npm run build
```
Visit `/auth/login`. Confirm two-column layout (form left, brand panel right with phone frame ambient art at md+ breakpoints), single primary CTA, Google as outline, magic-link as text link, sign-up cross-link at bottom.

- [ ] **Step 7: Commit**

```bash
git add src/components/auth/AuthLayout.tsx src/app/auth/login/page.tsx src/app/auth/signup/page.tsx
git commit -m "feat(auth): split layout, email-first CTA, ambient brand panel"
```

---

### Task 16: Services dashboard — rich service tiles, hero empty, segmented view toggle

**Files:**
- Modify: `src/app/app/page.tsx`

- [ ] **Step 1: Add a `SegmentedControl` helper** (inline at top of file, or add to `components/ui/SegmentedControl.tsx`)

```tsx
function SegmentedControl<T extends string>({
  value, onChange, options,
}: { value: T; onChange: (v: T) => void; options: { value: T; icon: React.ReactNode; label: string }[] }) {
  return (
    <div className="inline-flex items-center rounded-md border border-border bg-card p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
          aria-label={opt.label}
          className={cn(
            "h-8 w-8 inline-flex items-center justify-center rounded-[6px] transition-colors duration-[var(--motion-fast)]",
            value === opt.value ? "bg-primary-50 text-primary-700" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Rewrite the page header to use `PageHeading` with eyebrow + actions**

```tsx
<PageHeading
  eyebrow="Workspace"
  title="Services"
  subtitle="Select a service to manage your assigned resources."
  actions={
    <>
      <SegmentedControl
        value={view}
        onChange={setView}
        options={[
          { value: "grid", icon: <LayoutGrid className="h-4 w-4" />, label: "Grid" },
          { value: "list", icon: <List className="h-4 w-4" />, label: "List" },
        ]}
      />
      <Button onClick={() => setIsModalOpen(true)}>
        <Plus className="h-4 w-4" />
        New Service
      </Button>
    </>
  }
/>
```

- [ ] **Step 3: Rewrite service tiles**

Channel color and icon based on `service.serviceName`:
```tsx
const channelStyles: Record<string, { bg: string; iconColor: string; Icon: LucideIcon; tagline: string }> = {
  whatsapp: { bg: "bg-primary-50", iconColor: "text-primary-700", Icon: MessageSquare, tagline: "Meta Cloud API" },
  rcs:      { bg: "bg-indigo-50",  iconColor: "text-indigo-700",  Icon: Sparkles, tagline: "AWS · ap-south-1" },
  sms:      { bg: "bg-slate-100",  iconColor: "text-slate-700",   Icon: Phone, tagline: "Carrier-routed" },
};

// inside the map:
const ch = channelStyles[service.serviceName] ?? channelStyles.sms;
const Icon = ch.Icon;

<Card variant={isSuspended ? "default" : "interactive"} className={cn("p-5", isSuspended && "opacity-60 cursor-not-allowed")}>
  <div className="flex items-start gap-4">
    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", ch.bg)}>
      <Icon className={cn("h-5 w-5", ch.iconColor)} />
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-h3 capitalize">{service.serviceName}</h3>
      <p className="text-small text-muted-foreground mt-0.5">{ch.tagline}</p>
      <div className="mt-3 flex items-center justify-between">
        <Badge dot variant={getBadgeVariant(service.mappedStatus)} size="sm">
          {service.mappedStatus.charAt(0).toUpperCase() + service.mappedStatus.slice(1)}
        </Badge>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  </div>
</Card>
```

- [ ] **Step 4: Wire empty state to the new EmptyState `hero` variant** (if not already done in Task 9)

- [ ] **Step 5: Build + smoke**

```bash
npm run build
```
Visit `/app`. Tiles render with channel-tinted icons (WhatsApp tile: primary-50 wash, RCS: indigo-50, SMS: slate-100). Status badges have dots. Hovering an interactive tile lifts it to e2 with a 1px translate. Segmented control replaces the two ghost icon buttons.

- [ ] **Step 6: Commit**

```bash
git add src/app/app/page.tsx
git commit -m "feat(app): services dashboard — rich tiles, segmented toggle, hero empty"
```

---

### Task 17: WhatsApp Contacts — sticky toolbar, multi-tag chips, floating bulk bar

**Files:**
- Modify: `src/app/app/whatsapp/contacts/page.tsx`
- Modify: `src/components/whatsapp/ContactsSidebar.tsx`
- Modify: `src/components/whatsapp/ContactsTable.tsx` (to surface a `selectedIds` state up to the page if not already)

- [ ] **Step 1: Sidebar — add section headers**

In `ContactsSidebar.tsx`, group items under two captions: "QUICK VIEWS" (All contacts) and "YOUR LISTS" (custom lists). Use `text-caption text-muted-foreground` headers between sections.

- [ ] **Step 2: Toolbar — make sticky with shadow on scroll**

In `contacts/page.tsx`, wrap the toolbar div:

```tsx
<div className="sticky top-0 z-20 px-6 py-3 border-b bg-card/80 backdrop-blur-sm flex items-center gap-3 flex-wrap">
  <Input leadingIcon={Search} placeholder="Search phone, name, email" value={q} onChange={(e) => setQ(e.target.value)} className="flex-1 min-w-64" />
  <TagMultiSelect tags={tags} value={tagFilter} onChange={setTagFilter} />
  <div className="flex-1" />
  <Button variant="outline" onClick={() => setImportOpen(true)}>
    <Upload className="h-4 w-4" /> Import CSV
  </Button>
  <Button onClick={() => setAddOpen(true)}>
    <Plus className="h-4 w-4" /> Add contact
  </Button>
</div>
```

- [ ] **Step 3: Build `TagMultiSelect` chip component (inline or in `components/whatsapp/`)**

```tsx
import { X } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";

function TagMultiSelect({
  tags, value, onChange,
}: { tags: { tag: string; contactCount: number }[]; value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (t: string) => onChange(value.includes(t) ? value.filter(x => x !== t) : [...value, t]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-1.5">
          Tags{value.length ? `: ${value.length}` : ""}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="flex flex-wrap gap-1">
          {tags.map((t) => {
            const active = value.includes(t.tag);
            return (
              <button
                key={t.tag}
                type="button"
                onClick={() => toggle(t.tag)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors",
                  active ? "bg-primary-100 border-primary-200 text-primary-800" : "bg-card border-border text-muted-foreground hover:bg-accent",
                )}
              >
                {t.tag} <span className="text-muted-foreground/70">{t.contactCount}</span>
                {active && <X className="h-3 w-3" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

The page already passes `tags: string[]` to the API via `tagFilter`; this just changes the input from single-select dropdown to multi-select chips. Backend already accepts comma-separated tags per the API spec — no backend change needed.

- [ ] **Step 4: Floating bulk action bar**

Add to `contacts/page.tsx`. Lift `selectedIds` state from `ContactsTable` to the page if it isn't already:

```tsx
import { motion, AnimatePresence } from "framer-motion";

// inside the page:
{selectedIds.length > 0 && (
  <AnimatePresence>
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 60, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 rounded-full border border-primary-200 bg-card shadow-e3 px-4 py-2"
    >
      <span className="text-small text-foreground">{selectedIds.length} selected</span>
      <div className="h-4 w-px bg-border" />
      <Button size="sm" variant="ghost" onClick={() => exportCsv(selectedIds)}>Export</Button>
      <Button size="sm" variant="ghost" onClick={() => /* open add-to-list submenu */}>Add to list</Button>
      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => bulkDeleteMut.mutate(selectedIds)}>Delete</Button>
      <button onClick={() => setSelectedIds([])} aria-label="Clear" className="text-muted-foreground hover:text-foreground">
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  </AnimatePresence>
)}
```

> The previous "bulk action bar at top of table" surface in `ContactsTable.tsx` should be removed when this floating one is wired up — keep one source of truth.

- [ ] **Step 5: Build + smoke**

```bash
npm run build
```
Open `/app/whatsapp/contacts`. Toolbar sticks at top with backdrop blur on scroll. Open tags filter — multi-select chip popover. Select a row checkbox — floating bar springs in from the bottom of the screen.

- [ ] **Step 6: Commit**

```bash
git add src/app/app/whatsapp/contacts/page.tsx src/components/whatsapp/ContactsSidebar.tsx src/components/whatsapp/ContactsTable.tsx
git commit -m "feat(contacts): sticky toolbar, multi-tag chips, floating bulk bar"
```

---

### Task 18: Send Message — three-column, hero phone preview, send celebration

**Files:**
- Modify: `src/app/app/whatsapp/sendMessage/page.tsx`

- [ ] **Step 1: Restructure layout to 3 columns**

```tsx
<div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6 min-h-[calc(100vh-8rem)]">
  <aside className="lg:sticky lg:top-6 self-start">
    <Card className="p-4">
      <h2 className="text-h3 mb-3">Recipients</h2>
      <RecipientPicker ... />
    </Card>
  </aside>

  <section className="flex flex-col gap-6 min-w-0">
    <Card className="p-6">
      <h2 className="text-h3 mb-4">Campaign settings</h2>
      {/* template, name, schedule */}
    </Card>
    <Card className="p-6">
      <h2 className="text-h3 mb-4">Variables</h2>
      {/* template variables */}
    </Card>
  </section>

  <aside className="lg:sticky lg:top-6 self-start">
    <Card variant="highlight" className="p-6 flex flex-col items-center">
      <div className="text-caption text-muted-foreground mb-3">Live preview</div>
      <PhoneFrame>
        <WhatsappPreview ... />
      </PhoneFrame>
    </Card>
  </aside>
</div>
```

- [ ] **Step 2: Sticky footer — recipient count + cost + Send button**

```tsx
<div className="sticky bottom-0 -mx-4 md:-mx-6 mt-6 px-4 md:px-6 py-3 border-t border-border bg-card/90 backdrop-blur-sm flex items-center justify-between">
  <div className="flex items-center gap-3">
    <Badge variant="active" dot>{recipientCount} recipients</Badge>
    <span className="text-small text-muted-foreground">Estimated cost: ₹{estimatedCost.toFixed(2)}</span>
  </div>
  <Button size="lg" loading={sending} onClick={handleSend} className="shadow-primary-glow">
    <Send className="h-4 w-4" />
    Send campaign
  </Button>
</div>
```

- [ ] **Step 3: Send celebration micro-state**

After `handleSend` resolves successfully, set `sentResult` state and render:

```tsx
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

{sentResult && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
      className="rounded-xl bg-card border border-border shadow-e4 p-10 text-center max-w-sm"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.1, 1] }}
        transition={{ duration: 0.4, times: [0, 0.6, 1] }}
        className="mx-auto w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4"
      >
        <CheckCircle2 className="w-8 h-8 text-primary-700" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.2 }}
        className="text-h1"
      >
        Sent to {sentResult.count} recipients
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.2 }}
        className="text-small text-muted-foreground mt-2"
      >
        Track delivery in real time on the campaign report.
      </motion.p>
      <div className="mt-6 flex items-center justify-center gap-2">
        <Button asChild>
          <Link href={`/app/whatsapp/campaignReport/${sentResult.campaignId}`}>
            View live report
          </Link>
        </Button>
        <Button variant="outline" onClick={() => setSentResult(null)}>Send another</Button>
      </div>
    </motion.div>
  </motion.div>
)}
```

- [ ] **Step 4: Build + smoke**

```bash
npm run build
```
Open `/app/whatsapp/sendMessage`. Layout is 3-column on lg+. Preview is in the shared `<PhoneFrame>` with a primary-tinted highlight Card. Send a test campaign — celebration overlay springs in with check + headline + CTAs.

- [ ] **Step 5: Commit**

```bash
git add src/app/app/whatsapp/sendMessage/page.tsx
git commit -m "feat(send): 3-col layout, hero phone preview, send celebration"
```

---

## Phase 4 — Tier 2 screens (bespoke polish)

### Task 19: Campaigns list — hero stats row, status dots, delta pills

**Files:**
- Modify: `src/app/app/whatsapp/campaignReport/page.tsx`

- [ ] **Step 1: Add hero stats row above the table**

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  <StatsCard accent title="Sent today" value={stats.sentToday.toLocaleString()} trend={stats.sentTrend} trendUp />
  <StatsCard title="Delivery rate" value={`${stats.deliveryRate}%`} trend={stats.deliveryTrend} trendUp />
  <StatsCard title="Campaigns this month" value={stats.monthlyCount} />
</div>
```

- [ ] **Step 2: Replace existing table cell rendering with status badges + dots + delta pills**

```tsx
// status column
<TableCell>
  <Badge variant={statusVariant(c.status)} dot size="sm">{c.status}</Badge>
</TableCell>
// delivered column with delta pill
<TableCell>
  <span className="tabular-nums">{c.delivered.toLocaleString()}</span>
  {c.deliveryDelta != null && (
    <span className={cn(
      "ml-2 inline-flex items-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
      c.deliveryDelta >= 0 ? "bg-primary-100 text-primary-800" : "bg-red-50 text-red-700",
    )}>
      {c.deliveryDelta >= 0 ? "+" : ""}{c.deliveryDelta}%
    </span>
  )}
</TableCell>
// created column — relative time
<TableCell className="text-muted-foreground">{formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}</TableCell>
// actions column
<TableCell className="text-right">
  <TableActions>
    <Button asChild variant="ghost" size="xs">
      <Link href={`/app/whatsapp/campaignReport/${c.id}`}>View</Link>
    </Button>
  </TableActions>
</TableCell>
```

`statusVariant` helper:
```ts
const statusVariant = (s: string) =>
  s === "sent" ? "active" :
  s === "sending" ? "info" :
  s === "scheduled" ? "info" :
  s === "draft" ? "inactive" :
  s === "failed" ? "rejected" : "inactive";
```

- [ ] **Step 3: Empty state — hero variant**

```tsx
<EmptyState
  variant="hero"
  icon={Send}
  title="No campaigns yet"
  description="Send your first WhatsApp campaign in under a minute."
  primaryAction={{ label: "Create campaign", href: "/app/whatsapp/sendMessage", icon: Plus }}
/>
```

- [ ] **Step 4: Build + smoke**

```bash
npm run build
```
Visit `/app/whatsapp/campaignReport`. Hero StatsCards on top, status dots in the table, delivery deltas as pills, hover-reveal "View" action.

- [ ] **Step 5: Commit**

```bash
git add src/app/app/whatsapp/campaignReport/page.tsx
git commit -m "feat(campaigns): hero stats row, status dots, delta pills"
```

---

### Task 20: Campaign detail — funnel viz, live indicator, error hover-reveal

**Files:**
- Modify: `src/app/app/whatsapp/campaignReport/[id]/page.tsx`

- [ ] **Step 1: Header with name, status, meta strip**

```tsx
<div className="flex items-start justify-between gap-4 mb-6">
  <div>
    <div className="text-caption text-muted-foreground mb-1">Campaign</div>
    <h1 className="text-h1">{campaign.name}</h1>
    <div className="mt-2 flex items-center gap-3 text-caption text-muted-foreground">
      <span>Sent by {campaign.user}</span>
      <span>·</span>
      <span>{format(campaign.sentAt, "PP p")}</span>
      <span>·</span>
      <span>{campaign.recipientCount.toLocaleString()} recipients</span>
    </div>
  </div>
  <div className="flex items-center gap-2">
    <Badge variant={statusVariant(campaign.status)} dot>{campaign.status}</Badge>
    {campaign.status === "sending" && (
      <span className="inline-flex items-center gap-1.5 text-caption text-primary-700">
        <span className="h-1.5 w-1.5 rounded-full bg-primary-600 animate-pulse-dot" />
        Updating live
      </span>
    )}
    {campaign.status === "sending" && (
      <Button variant="destructive" size="sm" onClick={handleCancel}>Cancel</Button>
    )}
  </div>
</div>
```

- [ ] **Step 2: Funnel visualization**

```tsx
function Funnel({ steps }: { steps: { label: string; count: number; pct: number }[] }) {
  return (
    <Card className="p-6">
      <h2 className="text-h2 mb-4">Funnel</h2>
      <div className="flex flex-col gap-3">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center gap-3">
            <div className="w-24 text-small text-muted-foreground">{s.label}</div>
            <div className="flex-1 h-7 rounded-md bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${s.pct}%` }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-md bg-primary-600"
              />
            </div>
            <div className="w-32 text-right text-small tabular-nums">
              <span className="font-semibold">{s.count.toLocaleString()}</span>
              <span className="text-muted-foreground ml-1">({s.pct.toFixed(1)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// usage:
<Funnel steps={[
  { label: "Sent", count: data.sent, pct: 100 },
  { label: "Delivered", count: data.delivered, pct: (data.delivered / data.sent) * 100 },
  { label: "Read", count: data.read, pct: (data.read / data.sent) * 100 },
  { label: "Replied", count: data.replied, pct: (data.replied / data.sent) * 100 },
]} />
```

- [ ] **Step 3: Per-recipient table with hover-reveal "View error"**

```tsx
<TableRow>
  <TableCell className="font-mono text-small">{r.phone}</TableCell>
  <TableCell><Badge variant={statusVariant(r.status)} dot size="sm">{r.status}</Badge></TableCell>
  <TableCell className="text-muted-foreground">{format(r.sentAt, "p")}</TableCell>
  <TableCell className="text-muted-foreground">{r.deliveredAt ? format(r.deliveredAt, "p") : "—"}</TableCell>
  <TableCell>
    <TableActions>
      {r.status === "failed" && r.errorCode && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="xs">View error</Button>
          </TooltipTrigger>
          <TooltipContent>{r.errorCode}: {r.errorMessage}</TooltipContent>
        </Tooltip>
      )}
    </TableActions>
  </TableCell>
</TableRow>
```

- [ ] **Step 4: Build + smoke**

```bash
npm run build
```
Visit a campaign detail page. Confirm funnel bars animate from 0 to final width on first paint, "Updating live" pulse appears for sending campaigns, hover on a failed recipient row reveals the "View error" button with tooltip.

- [ ] **Step 5: Commit**

```bash
git add src/app/app/whatsapp/campaignReport/[id]/page.tsx
git commit -m "feat(campaign-detail): funnel viz, live indicator, error tooltip"
```

---

### Task 21: Templates list — switch from table to card grid

**Files:**
- Modify: `src/app/app/whatsapp/templates/page.tsx`

- [ ] **Step 1: Replace table with card grid**

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {templates.map((t) => (
    <Card key={t.id} variant="interactive" asChild className="p-5 group">
      <Link href={`/app/whatsapp/templates/${t.id}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="text-caption text-muted-foreground">{t.category}</div>
          <Badge variant={statusVariant(t.status)} dot size="sm">{t.status}</Badge>
        </div>
        <h3 className="text-h3 mt-2 truncate">{t.name}</h3>
        <div className="mt-3 rounded-md bg-muted/40 p-3 min-h-[80px]">
          {t.headerImage && (
            <Image src={t.headerImage} alt="" width={60} height={40} className="rounded mb-2" />
          )}
          <p className="text-small text-foreground/80 line-clamp-3">{t.bodyPreview}</p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-caption text-muted-foreground">Updated {formatDistanceToNow(new Date(t.updatedAt), { addSuffix: true })}</span>
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
            <Button variant="ghost" size="xs"><Pencil className="h-3 w-3" /></Button>
            <Button variant="ghost" size="xs" className="text-destructive"><Trash2 className="h-3 w-3" /></Button>
          </div>
        </div>
      </Link>
    </Card>
  ))}
</div>
```

> `Card` does not currently support `asChild`. Either:
> - Wrap with a Link instead: `<Link href={...} className="block"><Card variant="interactive">...</Card></Link>`, or
> - Add `asChild` to `Card` (use Radix Slot).
>
> Pick the wrap-Link approach to avoid scope creep on the Card primitive.

- [ ] **Step 2: Empty state**

```tsx
<EmptyState
  variant="hero"
  icon={MessageSquare}
  title="No templates yet"
  description="Create a WhatsApp template to send campaigns to your contacts."
  primaryAction={{ label: "Create template", href: "/app/whatsapp/templates/create", icon: Plus }}
/>
```

- [ ] **Step 3: Build + smoke**

Visit `/app/whatsapp/templates`. Cards show name, category eyebrow, body preview, status badge with dot, updated-relative-time. Hover reveals edit/delete icons.

- [ ] **Step 4: Commit**

```bash
git add src/app/app/whatsapp/templates/page.tsx
git commit -m "feat(templates): switch list to card grid with mini-previews"
```

---

### Task 22: Template builder — accordion sections, sticky preview

**Files:**
- Modify: `src/app/app/whatsapp/templates/create/page.tsx`
- Probably modify: `src/components/whatsapp/TemplateDefaultBuilder.tsx`, `TemplateAuthBuilder.tsx`, `TemplateCarouselBuilder.tsx`

- [ ] **Step 1: Two-column layout**

Wrap the page in a 2-column grid. Form on the left (8 cols on lg), preview on the right (4 cols, sticky).

```tsx
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-6rem)]">
  <div className="lg:col-span-8 flex flex-col gap-4">
    {/* Basics card */}
    <Card className="p-6">...</Card>
    {/* Components — accordion */}
    <Card className="p-2">
      <Accordion type="multiple" defaultValue={["header", "body"]}>
        <AccordionItem value="header">
          <AccordionTrigger>Header</AccordionTrigger>
          <AccordionContent>...form fields...</AccordionContent>
        </AccordionItem>
        <AccordionItem value="body">
          <AccordionTrigger>Body</AccordionTrigger>
          <AccordionContent>...form fields...</AccordionContent>
        </AccordionItem>
        <AccordionItem value="footer"><AccordionTrigger>Footer</AccordionTrigger><AccordionContent>...</AccordionContent></AccordionItem>
        <AccordionItem value="buttons"><AccordionTrigger>Buttons</AccordionTrigger><AccordionContent>...</AccordionContent></AccordionItem>
      </Accordion>
    </Card>
    {/* Variables */}
    <Card className="p-6">...</Card>
  </div>
  <aside className="lg:col-span-4 lg:sticky lg:top-6 self-start">
    <Card variant="highlight" className="p-6 flex flex-col items-center">
      <div className="text-caption text-muted-foreground mb-3">Live preview</div>
      <PhoneFrame><WhatsappPreview ... /></PhoneFrame>
    </Card>
  </aside>
</div>
```

> The Accordion primitive already exists at `src/components/ui/Accordion.tsx`. Reuse it; do not reinvent.

- [ ] **Step 2: Sticky footer with Save / Submit**

```tsx
<div className="sticky bottom-0 -mx-4 md:-mx-6 mt-6 px-4 md:px-6 py-3 border-t border-border bg-card/90 backdrop-blur-sm flex items-center justify-end gap-2">
  <Button variant="outline" onClick={handleSaveDraft} loading={savingDraft}>Save as draft</Button>
  <Button onClick={handleSubmit} loading={submitting} className="shadow-primary-glow">Submit for approval</Button>
</div>
```

- [ ] **Step 3: Build + smoke**

```bash
npm run build
```
Visit `/app/whatsapp/templates/create`. Two-column layout, sticky preview on right inside `<PhoneFrame>` with primary-50 highlight wash. Header/Body/Footer/Buttons collapsible. Sticky footer at bottom.

- [ ] **Step 4: Commit**

```bash
git add src/app/app/whatsapp/templates/create/page.tsx src/components/whatsapp/TemplateDefaultBuilder.tsx src/components/whatsapp/TemplateAuthBuilder.tsx src/components/whatsapp/TemplateCarouselBuilder.tsx
git commit -m "feat(template-builder): accordion sections + sticky preview"
```

---

## Phase 5 — Motion polish + final cleanup

### Task 23: Motion sweep — remaining named animations + reduced-motion verification

**Files:**
- Various — only files that need touch-ups for the 12 named animations

- [ ] **Step 1: Audit animation coverage**

Walk through Section 6 of the spec and verify each animation is implemented. Map already-implemented to tasks above:

| # | Where | Implemented in |
|---|---|---|
| 1 | Button hover | Task 4 (CSS transition + glow) |
| 2 | Card interactive | Task 8 (CSS transition + lift) |
| 3 | Modal | Task 12 (Framer Motion spring) |
| 4 | Dropdown / popover | Already handled by Radix; verify duration aligns |
| 5 | Sidebar active item | Task 14 (CSS color transition) |
| 6 | Tabs underline (RecipientPicker) | **NEEDS TASK** |
| 7 | Bulk action bar | Task 17 (Framer spring) |
| 8 | Skeleton shimmer | Task 1 (CSS keyframe) + Task 11 |
| 9 | Send celebration | Task 18 (Framer spring + scale + delay) |
| 10 | Live polling pulse | Task 20 (CSS `animate-pulse-dot`) |
| 11 | Funnel bars | Task 20 (Framer width animation) |
| 12 | Toast | **NEEDS TASK** |

- [ ] **Step 2: Implement #6 — RecipientPicker tabs underline slide**

In `src/components/whatsapp/RecipientPicker.tsx`, find the tab buttons. Replace the active-tab indicator with a Framer `layoutId` animated underline:

```tsx
import { motion } from "framer-motion";

const tabs = ["from-contacts", "paste"] as const;

{tabs.map((id) => (
  <button key={id} onClick={() => setActiveTab(id)} className="relative px-4 py-2 text-sm">
    {labels[id]}
    {activeTab === id && (
      <motion.div
        layoutId="recipient-picker-underline"
        className="absolute left-0 right-0 -bottom-px h-0.5 bg-primary-600"
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    )}
  </button>
))}
```

- [ ] **Step 3: Implement #12 — Toast notification system**

Check whether a toast lib is already installed (`grep -rn "react-hot-toast\|sonner" package.json src`). If `sonner` is in the dep list, use it; otherwise add it:
```bash
npm install sonner
```
Then in `src/app/layout.tsx` (or `app/app/layout.tsx`), mount a `<Toaster>` once with custom theme:
```tsx
import { Toaster } from "sonner";

<Toaster
  position="top-right"
  toastOptions={{
    className: "rounded-lg border border-border bg-card text-foreground shadow-e3",
  }}
/>
```
Replace any ad-hoc alert/console-feedback with `toast.success(...)`, `toast.error(...)`, etc.

- [ ] **Step 4: Verify reduced-motion fallbacks**

In your OS, enable "Reduce motion" (System Preferences → Accessibility → Display on macOS). Reload the app and verify:
- Send celebration: check appears immediately, no scale/delay.
- Funnel bars: render at full width on paint, no animation.
- Pulse dot: stays static at full opacity.
- Skeleton: stays at solid muted background, no shimmer sweep.
- Modal: opens without scale-in, just opacity.
- Bulk action bar: appears without spring, just opacity.

The `globals.css` `@media (prefers-reduced-motion: reduce)` block from Task 1 zeroes out CSS animations and transitions. Framer Motion respects `useReducedMotion()` automatically for spring-based animations *only when the consumer opts in*. Patch where needed by reading from framer-motion:

```tsx
import { useReducedMotion } from "framer-motion";
const reduceMotion = useReducedMotion();
// Apply: transition={reduceMotion ? { duration: 0 } : { type: "spring", ... }}
```
Apply this to: send celebration (Task 18), bulk action bar (Task 17), funnel bars (Task 20), modal (Task 12), tab underline (Step 2 above).

- [ ] **Step 5: Build + smoke**

```bash
npm run build
```
Final visual sweep across all 7 named screens with reduce-motion ON, then OFF.

- [ ] **Step 6: Commit**

```bash
git add src/components/whatsapp/RecipientPicker.tsx src/app/layout.tsx package.json package-lock.json src/app/app/whatsapp/sendMessage/page.tsx src/app/app/whatsapp/contacts/page.tsx src/app/app/whatsapp/campaignReport/[id]/page.tsx src/components/ui/Modal.tsx
git commit -m "feat(motion): tab underline, toasts, reduced-motion fallbacks"
```

---

### Task 24: Final cleanup audit — rogue Tailwind, off-scale spacing, residual JPG refs

**Files:** Whatever the audits surface.

- [ ] **Step 1: Audit raw green Tailwind in app code (channel WhatsApp `#25D366` exempted)**

```bash
grep -rn "bg-green-[5-9]00\|text-green-[5-9]00\|border-green-[5-9]00\|hover:bg-green-[5-9]00" src \
  | grep -v "src/app/page.tsx" \
  | grep -v "src/components/ui/WhatsappPreview" \
  | grep -v "src/components/ui/PhoneFrame"
```
Replace each with `--primary-*` token (e.g., `bg-green-600` → `bg-primary-600`, `bg-green-50` → `bg-primary-50`).

- [ ] **Step 2: Audit `rounded-2xl` and `rounded-3xl` in app code**

```bash
grep -rn "rounded-2xl\|rounded-3xl" src \
  | grep -v "src/app/page.tsx" \
  | grep -v "src/components/ui/PhoneFrame.tsx"
```
Replace with `rounded-lg` (12px) or `rounded-xl` (16px) per scale. PhoneFrame keeps its `rounded-3xl` for the device chrome — physical devices have that radius.

- [ ] **Step 3: Audit off-scale gap classes**

```bash
grep -rn "gap-5\|gap-7\|gap-9\|gap-10\|gap-11\|p-5\|p-7" src
```
Replace `gap-5` → `gap-4` or `gap-6` (closer to 16/24 spacing rhythm). `p-5` → `p-4` or `p-6`. Use judgment per site.

- [ ] **Step 4: Final JPG sweep**

```bash
grep -rn "/squalto.jpg\|squalto.jpg" src public
```
Expected: 0 hits.

- [ ] **Step 5: Final lint + build + visual sweep**

```bash
npm run lint
npm run build
npm run dev
```
Click through every screen in the spec's Section 5 list (auth, dashboard, contacts, send, campaigns list, campaign detail, templates list, template builder). Confirm acceptance criteria from spec Section 10.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "chore(cleanup): migrate rogue Tailwind, off-scale spacing, residual JPGs"
```

---

## Acceptance criteria (spec §10 — verify before declaring done)

- [ ] All `--primary` references in app code resolve to `#16A34A`.
- [ ] Zero `/squalto.jpg` references in `src` or `public`.
- [ ] Zero raw `bg-green-[5-9]00` / `text-green-[5-9]00` in app code (channel WhatsApp `#25D366` permitted only in WhatsApp-specific UI).
- [ ] Zero `rounded-2xl` / `rounded-3xl` in in-app surface code (marketing landing exempt; PhoneFrame device chrome exempt).
- [ ] `Card` and `EmptyState` atoms exist and are used by every relevant page.
- [ ] All 12 named animations implemented; reduced-motion fallbacks verified.
- [ ] All 7 named screens visually pass a side-by-side review against the spec.
- [ ] Light-mode tokens have a documented dark-mode counterpart in `globals.css`.
- [ ] `<PhoneFrame>` is shared between marketing site hero and `WhatsappPreview`.
- [ ] Sidebar collapse state persists across reloads (localStorage `squalto:sidebar:collapsed`).

---

## Ship-stops (per spec §8)

After each phase, the codebase is commit-able and demoable:

- After **Task 2** — brand assets visible (favicon, OG, logos).
- After **Task 14** — ~60% of total visual lift in. **Stop here if timeline slips and ship Phase 3+ in a follow-up branch.**
- After **Task 18** — tier-1 surfaces fully polished.
- After **Task 22** — all 7 named screens polished.
- After **Task 24** — full polish pass complete.

---

## Estimated effort

~11 dev days focused. Realistic with review/iteration: ~14–16 days. Each task is roughly 0.3–0.7 day depending on complexity and unknown migration pain.
