// Self-contained HTML document for the "Customer Onboarding Flow" internal doc.
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
<title>Customer Onboarding Flow</title>
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
      <p class="eyebrow">Integrations · Onboarding</p>
      <h1>Customer Onboarding Flow</h1>
      <p>Design a seamless onboarding experience that takes a customer from signup to sending their first WhatsApp message.</p>
    </div>
  </header>

  <main class="wrap">
    <p class="callout"><strong>Audience:</strong> Engineers building a multi-tenant WhatsApp SaaS.</p>

    <h2>Table of Contents</h2>
    <ol>
      <li>Introduction</li>
      <li>Onboarding Goals</li>
      <li>High-Level Flow</li>
      <li>Step-by-Step Journey</li>
      <li>Backend Responsibilities</li>
      <li>Database Design</li>
      <li>Onboarding State Machine</li>
      <li>Failure &amp; Recovery</li>
      <li>Production Best Practices</li>
      <li>Key Takeaways</li>
    </ol>

    <h2>1. Introduction</h2>
    <p>Customer onboarding is the bridge between user registration and becoming an active WhatsApp sender.</p>
    <p>A good onboarding flow should:</p>
    <ul>
      <li>Minimize manual work</li>
      <li>Complete within minutes</li>
      <li>Handle failures gracefully</li>
      <li>Persist progress</li>
      <li>Automatically provision customer assets</li>
    </ul>

    <h2>2. Onboarding Goals</h2>
    <p>By the end of onboarding, every tenant should have:</p>
    <ul>
      <li>Tenant Account</li>
      <li>Business Profile</li>
      <li>Connected Meta Business</li>
      <li>WABA</li>
      <li>Verified Phone Number</li>
      <li>Webhook Subscription</li>
      <li>Initial Templates</li>
      <li>Ready-to-use Dashboard</li>
    </ul>

    <h2>3. High-Level Flow</h2>
    <pre>Customer Registers

↓

Create Tenant

↓

Verify Email

↓

Create Workspace

↓

Connect WhatsApp

↓

Embedded Signup

↓

Receive Meta Assets

↓

Store Credentials

↓

Verify Webhook

↓

Create Default Settings

↓

Ready to Send Messages</pre>

    <h2>4. Step-by-Step Journey</h2>

    <h3>Step 1 — Register</h3>
    <p>Customer creates an account.</p>
    <p>Store:</p>
    <ul>
      <li>User</li>
      <li>Tenant</li>
      <li>Workspace</li>
    </ul>

    <h3>Step 2 — Workspace Setup</h3>
    <p>Collect:</p>
    <ul>
      <li>Company Name</li>
      <li>Timezone</li>
      <li>Country</li>
      <li>Industry</li>
    </ul>

    <h3>Step 3 — Connect WhatsApp</h3>
    <p>Customer clicks:</p>
    <pre>Connect WhatsApp</pre>
    <p>Launch Meta Embedded Signup using your Configuration ID.</p>

    <h3>Step 4 — Meta Authentication</h3>
    <p>Customer:</p>
    <ul>
      <li>Logs into Facebook</li>
      <li>Selects Business Manager</li>
      <li>Creates or selects a WABA</li>
      <li>Adds a phone number</li>
      <li>Grants permissions</li>
    </ul>

    <h3>Step 5 — Exchange Authorization Code</h3>
    <p>Backend exchanges the authorization code using:</p>
    <ul>
      <li>App ID</li>
      <li>App Secret</li>
    </ul>
    <p>Retrieve:</p>
    <ul>
      <li>Business ID</li>
      <li>WABA ID</li>
      <li>Phone Number ID</li>
    </ul>

    <h3>Step 6 — Persist Tenant Assets</h3>
    <p>Store:</p>
    <pre>tenant_id

business_id

waba_id

phone_number_id

display_name

display_phone_number</pre>

    <h3>Step 7 — Verify Webhooks</h3>
    <p>Ensure:</p>
    <ul>
      <li>Callback URL configured</li>
      <li>Verification successful</li>
      <li>Required webhook fields subscribed</li>
    </ul>

    <h3>Step 8 — Default Configuration</h3>
    <p>Automatically create:</p>
    <ul>
      <li>Default team</li>
      <li>Admin role</li>
      <li>Default labels</li>
      <li>Inbox settings</li>
      <li>Notification preferences</li>
    </ul>

    <h3>Step 9 — First Message</h3>
    <p>Guide the customer to:</p>
    <ul>
      <li>Create a template</li>
      <li>Import contacts</li>
      <li>Send a test message</li>
    </ul>
    <p>This is the "aha!" moment.</p>

    <h2>5. Backend Responsibilities</h2>
    <p>Your backend should:</p>
    <ul>
      <li>Persist onboarding state</li>
      <li>Handle OAuth exchange</li>
      <li>Store Meta identifiers</li>
      <li>Verify webhooks</li>
      <li>Retry failed provisioning</li>
      <li>Log every onboarding step</li>
    </ul>

    <h2>6. Database Design</h2>
    <p>Suggested tables:</p>
    <pre>Tenant

Workspace

User

MetaConnection

WABA

PhoneNumber

OnboardingProgress

WebhookConfiguration</pre>

    <h2>7. Onboarding State Machine</h2>
    <pre>REGISTERED

↓

WORKSPACE_CREATED

↓

META_CONNECTED

↓

WABA_CONNECTED

↓

PHONE_VERIFIED

↓

WEBHOOK_VERIFIED

↓

READY</pre>
    <p>Never rely on boolean flags alone; store an explicit onboarding status.</p>

    <h2>8. Failure &amp; Recovery</h2>
    <p>Common failures:</p>
    <ul>
      <li>User closes Embedded Signup</li>
      <li>Phone verification fails</li>
      <li>Business verification pending</li>
      <li>Webhook verification fails</li>
      <li>Duplicate phone number</li>
    </ul>
    <p>Recovery strategy:</p>
    <ul>
      <li>Save progress after every successful step.</li>
      <li>Allow users to resume onboarding instead of starting over.</li>
    </ul>

    <h2>9. Production Best Practices</h2>
    <ul>
      <li>Make onboarding resumable.</li>
      <li>Keep every provisioning step idempotent.</li>
      <li>Validate webhook subscriptions immediately.</li>
      <li>Never expose App Secrets.</li>
      <li>Audit all onboarding events.</li>
      <li>Surface clear progress indicators to users.</li>
    </ul>

    <h2>10. Key Takeaways</h2>
    <ul>
      <li>Onboarding is more than Embedded Signup.</li>
      <li>It combines account creation, Meta authorization, provisioning, and platform configuration.</li>
      <li>Persist onboarding state so users can safely resume.</li>
      <li>Automate as much setup as possible.</li>
      <li>Optimize for getting customers to their first successful message quickly.</li>
    </ul>

    <h3>End-to-End Diagram</h3>
    <pre>Register
   │
   ▼
Workspace
   │
   ▼
Embedded Signup
   │
   ▼
Business Manager
   │
   ▼
WABA
   │
   ▼
Phone Number
   │
   ▼
Store IDs
   │
   ▼
Webhook Verification
   │
   ▼
Default Workspace Setup
   │
   ▼
Ready to Send Messages</pre>
  </main>
</body>
</html>`;
