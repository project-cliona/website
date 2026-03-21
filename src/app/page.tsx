"use client";

import { useState } from "react";
import {
  MessageSquare,
  Zap,
  Bot,
  Inbox,
  BarChart2,
  Link2,
  CheckCircle2,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  darkBg: "#0F1117",
  darkCard: "#161B22",
  darkBorder: "#21262D",
  accent: "#16A34A",
  accentHover: "#15803D",
  accentLight: "#DCFCE7",
};

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/squalto.jpg"
            alt="Squalto"
            width={32}
            height={32}
            className="rounded-md"
          />
          <span className="text-xl font-semibold text-[#0F1117]">
            Squalto
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-gray-600 hover:text-[#0F1117] transition-colors">Features</a>
          <a href="#pricing" className="text-sm text-gray-600 hover:text-[#0F1117] transition-colors">Pricing</a>
          <a href="#about" className="text-sm text-gray-600 hover:text-[#0F1117] transition-colors">About</a>
          <a href="#contact" className="text-sm text-gray-600 hover:text-[#0F1117] transition-colors">Contact</a>
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/auth/login"
            className="text-sm font-medium text-gray-600 hover:text-[#0F1117] transition-colors px-4 py-2"
          >
            Sign In
          </a>
          <a
            href="/auth/signup"
            className="text-sm font-medium text-white px-5 py-2 rounded-full transition-colors"
            style={{ backgroundColor: C.accent }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.accentHover)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.accent)}
          >
            Get Started
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          <a href="#features" className="text-sm text-gray-600" onClick={() => setOpen(false)}>Features</a>
          <a href="#pricing" className="text-sm text-gray-600" onClick={() => setOpen(false)}>Pricing</a>
          <a href="#about" className="text-sm text-gray-600" onClick={() => setOpen(false)}>About</a>
          <a href="#contact" className="text-sm text-gray-600" onClick={() => setOpen(false)}>Contact</a>
          <hr className="border-gray-100" />
          <a href="/auth/login" className="text-sm font-medium text-gray-600">Sign In</a>
          <a
            href="/auth/signup"
            className="text-sm font-medium text-white text-center px-5 py-2 rounded-full"
            style={{ backgroundColor: C.accent }}
          >
            Get Started
          </a>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="bg-white px-6 py-16 md:py-24">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div className="flex flex-col gap-6">
          <span
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full w-fit"
            style={{ backgroundColor: C.accentLight, color: C.accent }}
          >
            <CheckCircle2 size={12} />
            Official WhatsApp Business API Partner
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-[#0F1117] leading-tight">
            The Future of Customer Engagement
          </h1>

          <p className="text-base text-gray-600 max-w-md leading-relaxed">
            Automate conversations, recover carts, and convert leads with
            AI-powered WhatsApp &amp; RCS messaging.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="/auth/signup"
              className="flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-full transition-colors"
              style={{ backgroundColor: C.accent }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.accentHover)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.accent)}
            >
              Get Started Free
              <ChevronRight size={14} />
            </a>
            <a
              href="/auth/login"
              className="flex items-center gap-2 text-sm font-semibold text-[#0F1117] px-6 py-3 rounded-full border border-gray-300 hover:border-gray-400 transition-colors"
            >
              Sign In
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 pt-2">
            {[
              { value: "500K+", label: "Messages/day" },
              { value: "10K+", label: "Businesses" },
              { value: "98%", label: "Delivery Rate" },
            ].map(s => (
              <div key={s.label}>
                <p className="text-xl font-bold text-[#0F1117]">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — WhatsApp chat mockup */}
        <div className="flex justify-center md:justify-end">
          <div className="relative">
            {/* Phone frame */}
            <div className="w-64 bg-[#0F1117] rounded-3xl p-3 shadow-2xl ring-1 ring-white/10">
              {/* Status bar */}
              <div className="flex items-center justify-between px-2 py-1 mb-1">
                <span className="text-white text-xs font-medium">9:41</span>
                <div className="flex gap-1">
                  <div className="w-3 h-1.5 bg-white/60 rounded-sm" />
                  <div className="w-3 h-1.5 bg-white/60 rounded-sm" />
                  <div className="w-3 h-1.5 bg-white/60 rounded-sm" />
                </div>
              </div>

              {/* Chat header */}
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-t-xl"
                style={{ backgroundColor: C.accent }}
              >
                <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageSquare size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">Squalto AI</p>
                  <p className="text-white/70 text-[10px]">Online</p>
                </div>
              </div>

              {/* Chat body */}
              <div className="bg-[#ECE5DD] rounded-b-xl px-3 py-3 flex flex-col gap-2 min-h-[220px]">
                {/* Incoming */}
                <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 max-w-[80%] shadow-sm">
                  <p className="text-[11px] text-gray-800">Hi! I left something in my cart.</p>
                  <p className="text-[9px] text-gray-400 text-right mt-1">10:02</p>
                </div>

                {/* Outgoing */}
                <div
                  className="self-end rounded-lg rounded-tr-none px-3 py-2 max-w-[80%] shadow-sm"
                  style={{ backgroundColor: "#DCF8C6" }}
                >
                  <p className="text-[11px] text-gray-800">Hey! Here&apos;s your cart — 20% off if you complete now.</p>
                  <p className="text-[9px] text-gray-400 text-right mt-1">10:02</p>
                </div>

                {/* Incoming */}
                <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 max-w-[80%] shadow-sm">
                  <p className="text-[11px] text-gray-800">That&apos;s perfect, buying now!</p>
                  <p className="text-[9px] text-gray-400 text-right mt-1">10:03</p>
                </div>

                {/* Outgoing */}
                <div
                  className="self-end rounded-lg rounded-tr-none px-3 py-2 max-w-[80%] shadow-sm"
                  style={{ backgroundColor: "#DCF8C6" }}
                >
                  <p className="text-[11px] text-gray-800">Order confirmed! Track it here.</p>
                  <p className="text-[9px] text-gray-400 text-right mt-1">10:03</p>
                </div>
              </div>
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-4 -right-6 bg-white border border-gray-100 shadow-lg rounded-xl px-4 py-3 flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: C.accentLight }}
              >
                <Bot size={16} style={{ color: C.accent }} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0F1117]">94%</p>
                <p className="text-[10px] text-gray-500">AI Response Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
const features = [
  {
    icon: MessageSquare,
    title: "WhatsApp Business API",
    desc: "Send verified, high-deliverability messages via official Meta-approved channels with green badge support.",
  },
  {
    icon: Zap,
    title: "RCS Rich Messaging",
    desc: "Deliver interactive rich cards, image carousels, and quick-reply buttons over RCS.",
  },
  {
    icon: Bot,
    title: "AI Chatbot Builder",
    desc: "Build no-code automation flows that handle FAQs, bookings, and support around the clock.",
  },
  {
    icon: Inbox,
    title: "Multi-Channel Inbox",
    desc: "Manage WhatsApp, RCS, and SMS conversations from a single unified agent workspace.",
  },
  {
    icon: BarChart2,
    title: "Smart Analytics",
    desc: "Track delivery, read rates, conversion funnels, and agent performance with real-time dashboards.",
  },
  {
    icon: Link2,
    title: "CRM Integration",
    desc: "Sync contacts and conversation history with your existing CRM, ERP, or e-commerce platform.",
  },
];

function Features() {
  return (
    <section id="features" className="px-6 py-20" style={{ backgroundColor: C.darkBg }}>
      <div className="max-w-7xl mx-auto">
        <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: C.accent }}>
          Platform
        </p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white max-w-md leading-snug">
            Efficient and Integrated Messaging Platform
          </h2>
          <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
            Everything you need to engage customers at scale — from first touch to loyalty.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(f => (
            <div
              key={f.title}
              className="flex flex-col gap-4 p-6 rounded-xl border transition-all hover:border-[#16A34A]/40"
              style={{ backgroundColor: C.darkCard, borderColor: C.darkBorder }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#16A34A20" }}
              >
                <f.icon size={18} style={{ color: C.accent }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Benefits ─────────────────────────────────────────────────────────────────
const benefits = [
  "Boost delivery rates with verified sender IDs",
  "Automate 80% of customer queries with AI",
  "Recover abandoned carts via WhatsApp nudges",
  "Scale campaigns to millions without extra headcount",
];

const metrics = [
  { label: "Delivery Rate", value: 98, suffix: "%" },
  { label: "Queries Automated", value: 80, suffix: "%" },
  { label: "Cart Recovery", value: 35, suffix: "%" },
  { label: "Response Time", value: 2, suffix: "s avg" },
];

function Benefits() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left — metrics visual */}
        <div className="flex flex-col gap-5">
          {metrics.map(m => (
            <div key={m.label} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{m.label}</span>
                <span className="text-sm font-bold text-[#0F1117]">
                  {m.value}{m.suffix}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: m.suffix === "s avg" ? "20%" : `${m.value}%`,
                    backgroundColor: C.accent,
                  }}
                />
              </div>
            </div>
          ))}

          {/* Big number callout */}
          <div
            className="mt-4 p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-6 items-center"
          >
            <div>
              <p className="text-5xl font-extrabold" style={{ color: C.accent }}>3×</p>
              <p className="text-sm text-gray-600 mt-1">higher conversion vs email</p>
            </div>
            <div className="w-px h-14 bg-gray-100" />
            <div>
              <p className="text-5xl font-extrabold text-[#0F1117]">98%</p>
              <p className="text-sm text-gray-600 mt-1">message open rate</p>
            </div>
          </div>
        </div>

        {/* Right — copy */}
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F1117] leading-snug">
            Key Benefits for Your Business Efficiency
          </h2>
          <ul className="flex flex-col gap-4">
            {benefits.map(b => (
              <li key={b} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" style={{ color: C.accent }} />
                <span className="text-sm text-gray-600 leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
          <div className="pt-2">
            <a
              href="/auth/signup"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-full transition-colors"
              style={{ backgroundColor: C.accent }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.accentHover)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.accent)}
            >
              Start for Free
              <ChevronRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
const plans = [
  {
    name: "Starter",
    price: "₹2,999",
    period: "/mo",
    description: "Perfect for small businesses getting started with WhatsApp.",
    highlight: false,
    features: [
      "Up to 10,000 messages/month",
      "1 agent seat",
      "Basic analytics dashboard",
      "WhatsApp Business API",
      "Email support",
    ],
    cta: "Get Started",
    ctaHref: "/auth/signup",
  },
  {
    name: "Growth",
    price: "₹7,999",
    period: "/mo",
    description: "For growing teams that need automation and deeper insights.",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Up to 100,000 messages/month",
      "5 agent seats",
      "AI Chatbot Builder",
      "Advanced analytics",
      "CRM integrations",
      "Priority support",
    ],
    cta: "Get Started",
    ctaHref: "/auth/signup",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Unlimited scale with dedicated infrastructure and support.",
    highlight: false,
    features: [
      "Unlimited messages",
      "Unlimited agent seats",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "24/7 phone support",
    ],
    cta: "Contact Sales",
    ctaHref: "#contact",
  },
];

function Pricing() {
  return (
    <section id="pricing" className="px-6 py-20" style={{ backgroundColor: C.darkBg }}>
      <div className="max-w-7xl mx-auto">
        <p className="text-xs font-semibold tracking-widest uppercase mb-4 text-center" style={{ color: C.accent }}>
          Pricing
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-3">
          Tailored Plans for Your Business Scale
        </h2>
        <p className="text-gray-400 text-sm text-center mb-12 max-w-lg mx-auto">
          Start free, scale as you grow. No hidden fees.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div
              key={plan.name}
              className="relative flex flex-col rounded-2xl p-7 border transition-all"
              style={{
                backgroundColor: plan.highlight ? C.accent : C.darkCard,
                borderColor: plan.highlight ? C.accent : C.darkBorder,
              }}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-[#0F1117] text-xs font-bold px-3 py-1 rounded-full shadow">
                  {plan.badge}
                </span>
              )}

              <div className="mb-6">
                <h3 className={`text-lg font-bold mb-1 ${plan.highlight ? "text-white" : "text-white"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.highlight ? "text-white/80" : "text-gray-400"}`}>
                  {plan.description}
                </p>
                <div className="flex items-end gap-1">
                  <span className={`text-4xl font-extrabold ${plan.highlight ? "text-white" : "text-white"}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`text-sm mb-1.5 ${plan.highlight ? "text-white/70" : "text-gray-400"}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map(feat => (
                  <li key={feat} className="flex items-start gap-2.5">
                    <CheckCircle2
                      size={15}
                      className="mt-0.5 shrink-0"
                      style={{ color: plan.highlight ? "white" : C.accent }}
                    />
                    <span className={`text-sm ${plan.highlight ? "text-white/90" : "text-gray-300"}`}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.ctaHref}
                className="text-center text-sm font-semibold px-5 py-3 rounded-full transition-colors"
                style={
                  plan.highlight
                    ? { backgroundColor: "white", color: C.accent }
                    : { backgroundColor: C.accent, color: "white" }
                }
                onMouseEnter={e => {
                  if (!plan.highlight) e.currentTarget.style.backgroundColor = C.accentHover;
                }}
                onMouseLeave={e => {
                  if (!plan.highlight) e.currentTarget.style.backgroundColor = C.accent;
                }}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Integrations ─────────────────────────────────────────────────────────────
const integrations = [
  "Shopify",
  "Salesforce",
  "HubSpot",
  "Zapier",
  "WooCommerce",
  "Razorpay",
  "Zoho CRM",
  "Stripe",
];

function Integrations() {
  return (
    <section id="about" className="bg-[#F9FAFB] px-6 py-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F1117] leading-snug">
            Empowering Top Companies with Seamless Integrations
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-sm">
            Connect Squalto to the tools you already use. Our open API and pre-built connectors let you go live in hours, not weeks.
          </p>
          <div>
            <a
              href="/auth/signup"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-full transition-colors"
              style={{ backgroundColor: C.accent }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.accentHover)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.accent)}
            >
              Browse Integrations
              <ChevronRight size={14} />
            </a>
          </div>
        </div>

        {/* Right — integration badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {integrations.map(name => (
            <div
              key={name}
              className="flex items-center justify-center bg-white border border-gray-100 shadow-sm rounded-xl py-4 px-3 text-sm font-medium text-gray-700 hover:border-[#16A34A]/40 hover:shadow-md transition-all"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="px-6 py-24 text-center" style={{ backgroundColor: C.darkBg }}>
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug">
          From Sign-Up to First Message in Minutes
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          No contracts. No credit card required. Start sending with the official WhatsApp Business API today.
        </p>
        <a
          href="/auth/signup"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white px-8 py-3.5 rounded-full transition-colors mt-2"
          style={{ backgroundColor: C.accent }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.accentHover)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.accent)}
        >
          Get Started Free
          <ChevronRight size={14} />
        </a>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
const footerLinks = {
  Company: ["About", "Blog", "Careers", "Press"],
  Features: ["WhatsApp API", "RCS Messaging", "AI Chatbot", "Analytics"],
  Resources: ["Documentation", "API Reference", "Status", "Changelog"],
  "Get in Touch": ["info@Squalto.com", "Support", "Sales", "Partners"],
};

function Footer() {
  return (
    <footer id="contact" style={{ backgroundColor: C.darkBg }}>
      <div
        className="max-w-7xl mx-auto px-6 py-14 border-t"
        style={{ borderColor: C.darkBorder }}
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/squalto.jpg"
                alt="Squalto"
                width={28}
                height={28}
                className="rounded-md"
              />
              <span className="text-base font-semibold text-white">Squalto</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-[180px]">
              AI-powered WhatsApp &amp; RCS messaging for modern businesses.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
                {section}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t text-xs text-gray-500"
          style={{ borderColor: C.darkBorder }}
        >
          <p>&copy; {new Date().getFullYear()} Squalto. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Benefits />
        <Pricing />
        <Integrations />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
