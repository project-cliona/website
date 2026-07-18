"use client";

import { CheckCircle2 } from "lucide-react";
import { C } from "@/lib/marketing";

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
    ctaHref: "/#contact",
  },
];

export function PricingPlans() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {plans.map((plan) => (
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
            <h3 className="text-lg font-bold mb-1 text-white">{plan.name}</h3>
            <p className={`text-sm mb-4 ${plan.highlight ? "text-white/80" : "text-gray-400"}`}>
              {plan.description}
            </p>
            <div className="flex items-end gap-1">
              <span className="text-4xl font-extrabold text-white">{plan.price}</span>
              {plan.period && (
                <span className={`text-sm mb-1.5 ${plan.highlight ? "text-white/70" : "text-gray-400"}`}>
                  {plan.period}
                </span>
              )}
            </div>
          </div>

          <ul className="flex flex-col gap-3 mb-8 flex-1">
            {plan.features.map((feat) => (
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
            onMouseEnter={(e) => {
              if (!plan.highlight) e.currentTarget.style.backgroundColor = C.accentHover;
            }}
            onMouseLeave={(e) => {
              if (!plan.highlight) e.currentTarget.style.backgroundColor = C.accent;
            }}
          >
            {plan.cta}
          </a>
        </div>
      ))}
    </div>
  );
}
