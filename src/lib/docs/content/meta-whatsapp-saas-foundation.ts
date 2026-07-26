// Self-contained HTML document for the "Meta WhatsApp SaaS Foundation" internal doc.
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
<title>Meta WhatsApp SaaS Foundation</title>
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
</style>
</head>
<body>
  <header class="hero">
    <div class="wrap">
      <p class="eyebrow">Foundation · Architecture</p>
      <h1>Meta WhatsApp SaaS Foundation</h1>
      <p>The core Meta concepts required to build a multi-tenant WhatsApp SaaS platform — from developer account to per-tenant asset ownership.</p>
    </div>
  </header>

  <main class="wrap">
    <h2>High-Level Architecture</h2>
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
        ├── Embedded Signup Configuration
        │
        ├── App ID
        ├── App Secret
        └── Configuration ID</pre>

    <h2>1. Meta Developer Account</h2>
    <p>This is <strong>your personal developer identity</strong>. Think of it as your account that is allowed to build applications on Meta's platform.</p>
    <pre>Harshit (Developer Account)</pre>
    <p>Its only responsibility is to create and manage Meta Apps.</p>

    <h2>2. Meta Business Manager</h2>
    <p>This represents <strong>your company</strong>. Everything important belongs here.</p>
    <pre>Business Manager

├── Apps
├── WhatsApp Business Accounts (WABAs)
├── Facebook Pages
├── Instagram Accounts
├── Employees
└── System Users</pre>
    <p class="callout">Think of it like an AWS Organization where all business assets live.</p>

    <h2>3. Meta App</h2>
    <p>Your Meta App represents <strong>your software</strong>. If you're building a WhatsApp SaaS, this app is your integration with Meta.</p>
    <p>The app belongs to your Business Manager.</p>

    <h2>4. Add the WhatsApp Product</h2>
    <p>A newly created app has no capabilities. Adding the WhatsApp product enables your app to use the WhatsApp Business Platform APIs.</p>
    <p>Without this, your application cannot send or receive WhatsApp messages.</p>

    <h2>5. Facebook Login for Business</h2>
    <p>To allow customers to connect their own WhatsApp Business Accounts, add <strong>Facebook Login for Business</strong>. This enables <strong>Embedded Signup</strong>.</p>
    <p>Inside this configuration, Meta generates a:</p>
    <ul><li>Configuration ID</li></ul>
    <p>This ID is required by your frontend to launch the Embedded Signup flow.</p>

    <h2>6. Business Manager and App Relationship</h2>
    <p>The Business Manager is not manually connected to the app. Instead:</p>
    <ul>
      <li>The app is created under the Business Manager.</li>
      <li>The Business Manager owns the assets.</li>
      <li>The app is granted permission to access those assets.</li>
    </ul>
    <pre>Business Manager

├── App
└── WABA

↓

Grant App access to WABA</pre>

    <h2>7. Credentials You Receive</h2>
    <p>After configuring the app, you will have:</p>
    <ul>
      <li>Meta App ID</li>
      <li>Meta App Secret</li>
      <li>Embedded Signup Configuration ID</li>
    </ul>
    <p>These are used by your application during onboarding.</p>

    <h2>Access Tokens Explained</h2>
    <p>There are three important token stages.</p>

    <h3>1. Short-lived User Token</h3>
    <p>Generated during Embedded Signup.</p>
    <pre>Customer

↓

Facebook Login

↓

Authorization Code

↓

Short-lived Token</pre>
    <p>Used only during onboarding.</p>

    <h3>2. Customer Assets</h3>
    <p>After onboarding completes, Meta provides:</p>
    <ul>
      <li>Business ID</li>
      <li>WABA ID</li>
      <li>Phone Number ID</li>
    </ul>
    <p>These identify the customer's WhatsApp resources.</p>

    <h3>3. System User Token</h3>
    <p>For day-to-day server communication, create a <strong>System User</strong> inside your Business Manager.</p>
    <pre>Business Manager

↓

System User

↓

Assign App

↓

Assign WABA

↓

Generate Permanent Token</pre>
    <p>This token is used by your backend to:</p>
    <ul>
      <li>Send messages</li>
      <li>Manage templates</li>
      <li>Manage phone numbers</li>
      <li>Receive webhooks</li>
      <li>Call the Graph API</li>
    </ul>
    <p>It is the token your backend uses every day.</p>

    <h2>Customer Onboarding Flow</h2>
    <pre>Customer

↓

Clicks "Connect WhatsApp"

↓

Embedded Signup

↓

Logs into Facebook

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

Backend stores them

↓

Customer is onboarded</pre>

    <h2>Multi-Tenant Architecture</h2>
    <p>Every customer owns their own WhatsApp assets.</p>
    <pre>Your SaaS

Tenant A
    ├── WABA
    ├── Phone Number
    ├── Templates
    ├── Campaigns
    └── Conversations

Tenant B
    ├── WABA
    ├── Phone Number
    ├── Templates
    ├── Campaigns
    └── Conversations</pre>
    <p>Your platform stores references to each tenant's Meta assets and communicates with Meta on their behalf.</p>

    <h2>Key Takeaways</h2>
    <ol>
      <li>Developer Account creates Meta Apps.</li>
      <li>Business Manager owns all business assets.</li>
      <li>Meta App represents your software.</li>
      <li>WhatsApp Product enables WhatsApp APIs.</li>
      <li>Facebook Login for Business enables Embedded Signup.</li>
      <li>Embedded Signup generates the Configuration ID.</li>
      <li>Business Manager creates System Users.</li>
      <li>System Users generate permanent access tokens.</li>
      <li>Every customer owns their own WABA and phone number.</li>
      <li>Your SaaS stores the IDs and communicates with Meta using authorized access.</li>
    </ol>
  </main>
</body>
</html>`;
