// Self-contained HTML document for the "Billing & Pricing" internal doc.
// Rendered inside an isolated <iframe srcDoc> on /app/admin/documentation/[slug],
// so its styles never collide with the app's Tailwind theme.
//
// To add a new doc: create a sibling file here exporting `html`, then register
// it in ../registry.ts. Keep the document fully self-contained (inline <style>,
// embedded data: URIs) — the iframe has no network access. The viewer runs this
// in a script-sandboxed iframe with an OPAQUE origin and injects its own height
// bridge, so any <script> you add here cannot reach the parent app, its DOM, or
// its tokens — it's isolated by design.

export const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Billing &amp; Pricing</title>
<style>
  :root {
    --paper:    #F4F7F4;
    --surface:  #FFFFFF;
    --ink:      #15211B;
    --muted:    #586860;
    --faint:    #7E8C84;
    --border:   #DBE5DD;
    --accent:   #0E7C5A;
    --accent-d: #0A5C43;
    --accent-w: #E7F2EC;
    --sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    --mono: ui-monospace, "SF Mono", "JetBrains Mono", "Cascadia Code", Menlo, Consolas, monospace;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; }
  body {
    background: var(--paper);
    color: var(--ink);
    font-family: var(--sans);
    font-size: 17px;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
  }
  .wrap { max-width: 820px; margin: 0 auto; padding: 0 24px; }
  .hero {
    background:
      radial-gradient(120% 90% at 85% -10%, #14946b22, transparent 60%),
      linear-gradient(180deg, #0c3a2c, #0e503a);
    color: #EAF4EE;
    padding: 56px 0 48px;
    border-bottom: 1px solid #0a2a20;
  }
  .eyebrow {
    font-family: var(--mono);
    font-size: 12.5px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #7FD9B4;
    margin: 0 0 16px;
  }
  .hero h1 {
    font-size: clamp(30px, 6vw, 46px);
    line-height: 1.05;
    letter-spacing: -0.02em;
    font-weight: 800;
    margin: 0 0 16px;
  }
  .hero p { font-size: 18px; color: #CFE6D9; margin: 0; max-width: 660px; }
  main { padding: 44px 0 72px; }
  h2 {
    font-size: 24px;
    letter-spacing: -0.01em;
    font-weight: 700;
    margin: 44px 0 14px;
    padding-top: 22px;
    border-top: 1px solid var(--border);
  }
  main h2:first-of-type { border-top: 0; padding-top: 0; margin-top: 4px; }
  h3 { font-size: 18px; font-weight: 700; margin: 26px 0 10px; color: var(--accent-d); }
  p { margin: 0 0 16px; }
  strong { font-weight: 700; }
  em { color: var(--muted); }
  ul, ol { margin: 0 0 18px; padding-left: 24px; }
  li { margin: 6px 0; }
  a { color: var(--accent-d); }
  pre {
    background: #0d2b21;
    color: #dcefe5;
    font-family: var(--mono);
    font-size: 13.5px;
    line-height: 1.55;
    padding: 18px 20px;
    border-radius: 10px;
    overflow-x: auto;
    margin: 0 0 20px;
    border: 1px solid #0a2a20;
    white-space: pre;
  }
  .callout {
    background: var(--accent-w);
    border: 1px solid #cfe6d9;
    border-left: 3px solid var(--accent);
    border-radius: 8px;
    padding: 14px 18px;
    margin: 0 0 20px;
    color: var(--accent-d);
  }
  code { font-family: var(--mono); font-size: 0.88em; background: #eef3ef; border: 1px solid var(--border); border-radius: 5px; padding: 1px 5px; color: var(--accent-d); }
  pre code { background: none; border: 0; padding: 0; color: inherit; font-size: inherit; }
  table { border-collapse: collapse; width: 100%; margin: 0 0 20px; font-size: 15px; }
  th, td { border: 1px solid var(--border); padding: 8px 12px; text-align: left; vertical-align: top; }
  th { background: var(--accent-w); color: var(--accent-d); font-weight: 700; }
</style>
</head>
<body>
  <header class="hero">
    <div class="wrap">
      <p class="eyebrow">Operations · Billing</p>
      <h1>Billing &amp; Pricing</h1>
      <p>How to monetize a multi-tenant WhatsApp SaaS — the costs you pay, the revenue your customers pay, and how to design a scalable billing architecture. For engineers and product owners.</p>
    </div>
  </header>

  <main class="wrap">
    <p class="callout"><strong>Audience:</strong> Engineers and Product Owners building a multi-tenant WhatsApp SaaS.<br><strong>Goal:</strong> Understand how to monetize a WhatsApp platform, what costs exist, and how to design a scalable billing architecture.</p>

    <h2>Table of Contents</h2>
    <ol>
      <li>Introduction</li>
      <li>Revenue Model</li>
      <li>Meta Pricing</li>
      <li>BSP Pricing</li>
      <li>SaaS Pricing Models</li>
      <li>Cost Components</li>
      <li>Billing Architecture</li>
      <li>Usage Tracking</li>
      <li>Subscription Plans</li>
      <li>Add-ons</li>
      <li>Invoicing</li>
      <li>Database Design</li>
      <li>Production Considerations</li>
      <li>Key Takeaways</li>
    </ol>

    <h2>1. Introduction</h2>
    <p>A WhatsApp SaaS has two different financial layers:</p>
    <ol>
      <li>Costs you pay.</li>
      <li>Revenue your customers pay.</li>
    </ol>
    <p>Your profit is the difference.</p>
    <pre>Customer

↓

Pays Your SaaS

↓

Your SaaS

↓

Pays Meta / BSP

↓

WhatsApp Platform</pre>

    <h2>2. Revenue Model</h2>
    <p>Most platforms combine multiple revenue streams.</p>
    <ul>
      <li>Monthly subscription</li>
      <li>Markup on WhatsApp conversations/messages</li>
      <li>AI usage</li>
      <li>Team seat pricing</li>
      <li>Premium automation features</li>
      <li>Setup or onboarding services (optional)</li>
    </ul>
    <p>Recurring subscriptions generally provide the most predictable revenue.</p>

    <h2>3. Meta Pricing</h2>
    <p>Meta charges for WhatsApp usage according to its current commercial model.</p>
    <p>Typical billable events include business-initiated conversations or template messaging, depending on Meta's current pricing model and region.</p>
    <p>Your platform should <strong>not hardcode pricing</strong> because Meta's pricing can change over time.</p>
    <p>Instead, design a configurable pricing engine.</p>

    <h2>4. BSP Pricing</h2>
    <p>If you use a Business Solution Provider (BSP), additional costs may apply.</p>
    <p>Examples:</p>
    <ul>
      <li>Platform fee</li>
      <li>Per-message markup</li>
      <li>Number hosting</li>
      <li>Premium support</li>
    </ul>
    <p>These costs become part of your operating expenses.</p>

    <h2>5. SaaS Pricing Models</h2>
    <p>Common pricing strategies include:</p>
    <h3>Flat Subscription</h3>
    <pre>Starter

₹999 / month</pre>
    <h3>Usage Based</h3>
    <pre>₹0.10 per template message</pre>
    <h3>Hybrid</h3>
    <pre>₹1999 / month

+

Usage charges</pre>
    <p>This is the most common approach.</p>

    <h2>6. Cost Components</h2>
    <p>A tenant may generate costs from:</p>
    <ul>
      <li>WhatsApp messaging</li>
      <li>AI tokens</li>
      <li>File storage</li>
      <li>Media bandwidth</li>
      <li>CRM seats</li>
      <li>Campaign execution</li>
      <li>Integrations</li>
      <li>Premium support</li>
    </ul>
    <p>Track each independently.</p>

    <h2>7. Billing Architecture</h2>
    <pre>Customer

↓

Campaign

↓

Messaging Service

↓

Usage Event

↓

Billing Service

↓

Invoice

↓

Payment Gateway</pre>
    <p>Every billable action should emit a usage event.</p>

    <h2>8. Usage Tracking</h2>
    <p>Track usage as immutable events.</p>
    <p>Example:</p>
    <pre>Tenant A

Campaign Sent

↓

10,000 Messages

↓

Billing Event

↓

Monthly Invoice</pre>
    <p>Avoid calculating invoices directly from live operational tables.</p>

    <h2>9. Subscription Plans</h2>
    <p>Example plans:</p>
    <table>
      <thead>
        <tr><th>Feature</th><th>Starter</th><th>Growth</th><th>Enterprise</th></tr>
      </thead>
      <tbody>
        <tr><td>Users</td><td>2</td><td>10</td><td>Unlimited</td></tr>
        <tr><td>Campaigns</td><td>✓</td><td>✓</td><td>✓</td></tr>
        <tr><td>AI Agent</td><td>-</td><td>Optional</td><td>Included</td></tr>
        <tr><td>API Access</td><td>-</td><td>✓</td><td>✓</td></tr>
        <tr><td>Priority Support</td><td>-</td><td>-</td><td>✓</td></tr>
      </tbody>
    </table>
    <p>Feature flags work well for enabling plan-specific capabilities.</p>

    <h2>10. Add-ons</h2>
    <p>Examples:</p>
    <ul>
      <li>Additional team members</li>
      <li>AI credits</li>
      <li>Extra phone numbers</li>
      <li>Premium analytics</li>
      <li>Dedicated IPs (if applicable)</li>
      <li>White labeling</li>
    </ul>
    <p>These increase average revenue per customer.</p>

    <h2>11. Invoicing</h2>
    <p>A monthly billing cycle generally consists of:</p>
    <pre>Collect Usage

↓

Calculate Charges

↓

Generate Invoice

↓

Collect Payment

↓

Enable Next Cycle</pre>
    <p>Support downloadable invoices and payment history.</p>

    <h2>12. Database Design</h2>
    <p>Example entities:</p>
    <pre>Tenant

Subscription

Plan

UsageEvent

Invoice

InvoiceItem

Payment

CreditBalance</pre>
    <p>Usage events should never be modified after creation.</p>
    <p>Invoices should reference aggregated usage.</p>

    <h2>13. Production Considerations</h2>
    <ul>
      <li>Keep pricing configurable.</li>
      <li>Separate operational data from billing data.</li>
      <li>Record every billable event.</li>
      <li>Make invoice generation idempotent.</li>
      <li>Support retries for failed payments.</li>
      <li>Store pricing history so past invoices remain accurate even if plans change.</li>
    </ul>

    <h2>14. Key Takeaways</h2>
    <ul>
      <li>Treat billing as a separate domain from messaging.</li>
      <li>Record immutable usage events.</li>
      <li>Build a configurable pricing engine.</li>
      <li>Combine subscriptions with usage-based billing when appropriate.</li>
      <li>Keep billing auditable and reproducible.</li>
      <li>Design for future products such as AI, CRM, and commerce without changing the billing foundation.</li>
    </ul>

    <h3>Future Expansion</h3>
    <p>As your platform grows, the billing engine can also support:</p>
    <ul>
      <li>Reseller pricing</li>
      <li>Partner commissions</li>
      <li>Coupon codes</li>
      <li>Free trials</li>
      <li>Metered AI usage</li>
      <li>Revenue analytics</li>
      <li>Multi-currency billing</li>
      <li>Tax calculation (GST/VAT)</li>
    </ul>
  </main>
</body>
</html>`;
