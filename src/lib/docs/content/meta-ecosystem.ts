// Self-contained HTML document for the "Meta Ecosystem" internal doc.
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
<title>Meta Ecosystem</title>
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
      <p class="eyebrow">Integrations · Meta Ecosystem</p>
      <h1>Meta Ecosystem</h1>
      <p>For engineers building a multi-tenant WhatsApp SaaS — understand every Meta component, why it exists, how they relate, and where your SaaS fits.</p>
    </div>
  </header>

  <main class="wrap">
    <p class="callout"><strong>Audience:</strong> Engineers building a multi-tenant WhatsApp SaaS.<br><strong>Goal:</strong> Understand every Meta component, why it exists, how they relate, and where your SaaS fits.</p>

    <h2>Table of Contents</h2>
    <ol>
      <li>Introduction</li>
      <li>The Meta Ecosystem</li>
      <li>Meta Developer Account</li>
      <li>Meta Business Manager</li>
      <li>Meta App</li>
      <li>WhatsApp Business Platform</li>
      <li>WhatsApp Business Account (WABA)</li>
      <li>Phone Numbers</li>
      <li>System Users</li>
      <li>Access Tokens (Overview)</li>
      <li>Ownership Hierarchy</li>
      <li>Customer Onboarding</li>
      <li>Common Misconceptions</li>
      <li>End-to-End Architecture</li>
      <li>Key Takeaways</li>
    </ol>

    <h2>1. Introduction</h2>
    <p>When developers first start working with the WhatsApp Business Platform, Meta introduces many concepts:</p>
    <ul>
      <li>Developer Account</li>
      <li>Business Manager</li>
      <li>Meta App</li>
      <li>WABA</li>
      <li>Phone Number</li>
      <li>System User</li>
      <li>Access Tokens</li>
      <li>Embedded Signup</li>
    </ul>
    <p>At first these appear unrelated, but they are actually part of one hierarchy.</p>
    <p>The purpose of this chapter is to understand that hierarchy before learning APIs or implementation details.</p>

    <h2>2. The Meta Ecosystem</h2>
    <p>The entire platform can be visualized as:</p>
    <pre>Developer Account
        │
        ▼
Business Manager
        │
        ├─────────────┐
        ▼             ▼
   Meta App      System User
        │             │
        │             └── Permanent Access Token
        │
        ├── WhatsApp Product
        ├── Facebook Login for Business
        └── Embedded Signup</pre>
    <p>Think of each block as having a single responsibility.</p>

    <h2>3. Meta Developer Account</h2>
    <h3>What is it?</h3>
    <p>Your personal identity as a developer on Meta.</p>
    <p>Example:</p>
    <pre>Harshit (Developer Account)</pre>
    <h3>Responsibilities</h3>
    <ul>
      <li>Create Meta Apps</li>
      <li>Access the Developer Dashboard</li>
      <li>Manage app settings</li>
    </ul>
    <p>It <strong>does not</strong> own business assets like WABAs or phone numbers.</p>

    <h2>4. Meta Business Manager</h2>
    <h3>What is it?</h3>
    <p>The identity of your company.</p>
    <p>Everything important belongs here.</p>
    <pre>Business Manager

├── Apps
├── WABAs
├── Facebook Pages
├── Instagram Accounts
├── Employees
└── System Users</pre>
    <p>Analogy:</p>
    <ul>
      <li>AWS Organization</li>
      <li>Google Cloud Organization</li>
      <li>Azure Tenant</li>
    </ul>
    <p>The Business Manager owns your business assets.</p>

    <h2>5. Meta App</h2>
    <p>A Meta App represents your software.</p>
    <p>If you're building a WhatsApp SaaS, this app is how Meta identifies your platform.</p>
    <p>Typical capabilities added to the app:</p>
    <ul>
      <li>WhatsApp Product</li>
      <li>Facebook Login for Business</li>
      <li>Webhooks</li>
      <li>Permissions</li>
    </ul>
    <p>Credentials generated:</p>
    <ul>
      <li>App ID</li>
      <li>App Secret</li>
    </ul>

    <h2>6. WhatsApp Business Platform</h2>
    <p>Adding the WhatsApp product enables your Meta App to interact with the WhatsApp Business Platform.</p>
    <p>Without this product your app cannot:</p>
    <ul>
      <li>Send messages</li>
      <li>Receive messages</li>
      <li>Manage templates</li>
      <li>Subscribe to webhooks</li>
    </ul>

    <h2>7. WhatsApp Business Account (WABA)</h2>
    <p>A WABA represents a business on the WhatsApp platform.</p>
    <p>A WABA is <strong>not</strong> a phone number.</p>
    <p>Instead:</p>
    <pre>Nike WABA

├── +91xxxxxxxx01
├── +91xxxxxxxx02
└── +91xxxxxxxx03</pre>
    <p>Each customer using your SaaS typically owns their own WABA.</p>

    <h2>8. Phone Numbers</h2>
    <p>The phone number is the actual sender identity visible to customers.</p>
    <p>Example:</p>
    <pre>Customer receives

From:

+91 9876543210</pre>
    <p>Every phone number belongs to exactly one WABA.</p>

    <h2>9. System Users</h2>
    <p>A System User is a non-human account created inside the Business Manager.</p>
    <p>Purpose:</p>
    <ul>
      <li>Server-to-server authentication</li>
      <li>Generate permanent access tokens</li>
      <li>Eliminate the need for interactive logins</li>
    </ul>

    <h2>10. Access Tokens (Overview)</h2>
    <p>Three token types exist.</p>
    <h3>User Token</h3>
    <p>Used during login.</p>
    <p>Short lived.</p>
    <h3>Long-lived User Token</h3>
    <p>Extended lifetime.</p>
    <p>Useful for user-centric flows.</p>
    <h3>System User Token</h3>
    <p>Permanent.</p>
    <p>Used by backend services.</p>
    <p>This is the token your production backend should normally use.</p>

    <h2>11. Ownership Hierarchy</h2>
    <p>One of the biggest sources of confusion is ownership.</p>
    <p>The hierarchy is:</p>
    <pre>Developer Account
        │ creates
        ▼
Business Manager
        │ owns
        ▼
Meta App
        │ manages
        ▼
Customer WABAs
        │ contain
        ▼
Phone Numbers</pre>
    <p>The Business Manager owns the assets.</p>
    <p>The Meta App is simply granted permission to use them.</p>

    <h2>12. Customer Onboarding</h2>
    <p>Using Embedded Signup:</p>
    <pre>Customer

↓

Clicks Connect WhatsApp

↓

Facebook Login

↓

Selects Business

↓

Creates or Selects WABA

↓

Adds Phone Number

↓

Grants Permissions

↓

Meta returns

Business ID
WABA ID
Phone Number ID

↓

Your backend stores these identifiers.</pre>

    <h2>13. Common Misconceptions</h2>
    <h3>"A WABA is a phone number."</h3>
    <p>False.</p>
    <p>A WABA owns one or more phone numbers.</p>
    <h3>"The Meta App owns the WABA."</h3>
    <p>False.</p>
    <p>The Business Manager owns the WABA.</p>
    <p>The app is authorized to manage it.</p>
    <h3>"The Developer Account owns everything."</h3>
    <p>False.</p>
    <p>The Developer Account only creates apps.</p>
    <p>Business assets belong to the Business Manager.</p>

    <h2>14. End-to-End Architecture</h2>
    <pre>Developer Account
        │
        ▼
Business Manager
        │
        ├─────────────┐
        ▼             ▼
   Meta App      System User
        │             │
        │             └── Permanent Token
        │
        ├── WhatsApp Product
        ├── Facebook Login for Business
        ├── Embedded Signup
        │
        ▼
Customer

↓

Embedded Signup

↓

Customer WABA

↓

Phone Number

↓

Messages

↓

Webhooks

↓

Your SaaS</pre>

    <h2>15. Key Takeaways</h2>
    <ul>
      <li>A Developer Account creates Meta Apps.</li>
      <li>A Business Manager represents your company.</li>
      <li>The Business Manager owns business assets.</li>
      <li>A Meta App represents your software.</li>
      <li>The WhatsApp product enables WhatsApp APIs.</li>
      <li>A WABA represents a business, not a phone number.</li>
      <li>Phone numbers belong to WABAs.</li>
      <li>System Users provide permanent server authentication.</li>
      <li>Your SaaS communicates with Meta through the Meta App using authorized access tokens.</li>
      <li>Embedded Signup allows customers to connect their own WhatsApp assets to your platform.</li>
    </ul>

    <p class="callout"><strong>Next Chapter:</strong> Authentication, Access Tokens, Permissions, OAuth, and how your backend securely communicates with Meta.</p>
  </main>
</body>
</html>`;
