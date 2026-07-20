// Self-contained HTML document for the "Embedded Signup" internal doc.
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
<title>Embedded Signup</title>
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
      <h1>Embedded Signup</h1>
      <p>Understand exactly what happens when a customer clicks Connect WhatsApp — and how your platform gains permission to manage the customer's WhatsApp Business Account.</p>
    </div>
  </header>

  <main class="wrap">
    <p class="callout"><strong>Audience:</strong> Engineers building a multi-tenant WhatsApp SaaS.<br><br><strong>Goal:</strong> Understand exactly what happens when a customer clicks <strong>Connect WhatsApp</strong> and how your platform gains permission to manage the customer's WhatsApp Business Account.</p>

    <h2>Table of Contents</h2>
    <ol>
      <li>What is Embedded Signup?</li>
      <li>Why Meta Created It</li>
      <li>Prerequisites</li>
      <li>Components Involved</li>
      <li>Complete Flow</li>
      <li>OAuth Flow</li>
      <li>Asset Provisioning</li>
      <li>What Your Backend Stores</li>
      <li>Sequence Diagram</li>
      <li>Failure Scenarios</li>
      <li>Best Practices</li>
      <li>Key Takeaways</li>
    </ol>

    <h2>1. What is Embedded Signup?</h2>
    <p>Embedded Signup is Meta's onboarding flow that allows a business to connect its WhatsApp Business Account (WABA) to your SaaS without leaving your application.</p>
    <p>Instead of asking customers to manually create WABAs, exchange tokens, or configure permissions, Meta guides them through a secure flow.</p>

    <h2>2. Why Meta Created It</h2>
    <p>Before Embedded Signup, onboarding required many manual steps:</p>
    <ul>
      <li>Create Business Manager</li>
      <li>Create WABA</li>
      <li>Add a phone number</li>
      <li>Grant permissions</li>
      <li>Share IDs and tokens</li>
    </ul>
    <p>Embedded Signup automates these steps while ensuring the customer remains the owner of their assets.</p>

    <h2>3. Prerequisites</h2>
    <p>Before using Embedded Signup, your platform must have:</p>
    <ul>
      <li>Meta Developer Account</li>
      <li>Meta Business Manager</li>
      <li>Meta App</li>
      <li>WhatsApp Product enabled</li>
      <li>Facebook Login for Business enabled</li>
      <li>Embedded Signup Configuration</li>
      <li>App ID</li>
      <li>App Secret</li>
      <li>Configuration ID</li>
      <li>Webhook endpoint</li>
    </ul>

    <h2>4. Components Involved</h2>
    <pre>Customer

↓

Your Frontend

↓

Meta Login

↓

Meta App

↓

Business Manager

↓

Customer WABA

↓

Your Backend

↓

Database</pre>
    <p>Each component has a distinct responsibility.</p>

    <h2>5. Complete Flow</h2>

    <h3>Step 1</h3>
    <p>Customer clicks:</p>
    <pre>Connect WhatsApp</pre>
    <p>Your frontend opens Meta's Embedded Signup using the Configuration ID.</p>

    <h3>Step 2</h3>
    <p>Customer logs into Facebook.</p>
    <p>Meta authenticates the user.</p>

    <h3>Step 3</h3>
    <p>Customer selects or creates a Business Manager.</p>

    <h3>Step 4</h3>
    <p>Customer creates or selects a WhatsApp Business Account (WABA).</p>

    <h3>Step 5</h3>
    <p>Customer adds or verifies a phone number.</p>
    <p>Meta verifies ownership (typically through an OTP).</p>

    <h3>Step 6</h3>
    <p>Customer grants permissions to your Meta App.</p>
    <p>These permissions allow your platform to manage the customer's WhatsApp assets.</p>

    <h3>Step 7</h3>
    <p>Meta redirects back to your application with an authorization code.</p>

    <h3>Step 8</h3>
    <p>Your backend exchanges the authorization code for an access token.</p>
    <p>This requires:</p>
    <ul>
      <li>App ID</li>
      <li>App Secret</li>
    </ul>

    <h3>Step 9</h3>
    <p>Using the returned credentials, your backend retrieves information such as:</p>
    <ul>
      <li>Business ID</li>
      <li>WABA ID</li>
      <li>Phone Number ID</li>
      <li>Display Name</li>
      <li>Granted permissions</li>
    </ul>

    <h3>Step 10</h3>
    <p>Your backend stores these identifiers.</p>
    <p>The customer is now onboarded.</p>

    <h2>6. OAuth Flow</h2>
    <pre>Customer

↓

Facebook Login

↓

Authorization Code

↓

Backend

↓

App ID + App Secret

↓

Access Token

↓

Graph API

↓

Business Assets</pre>
    <p>Notice that the App Secret is only used on the backend.</p>

    <h2>7. Asset Provisioning</h2>
    <p>After onboarding, ownership looks like this:</p>
    <pre>Customer Business Manager

↓

Customer WABA

↓

Customer Phone Number

↓

Authorized

↓

Your Meta App</pre>
    <p>The customer owns the assets.</p>
    <p>Your app is simply authorized to use them.</p>

    <h2>8. What Your Backend Stores</h2>
    <p>A typical tenant record contains:</p>
    <pre>tenant_id

business_id

waba_id

phone_number_id

display_phone_number

display_name

access_information

status</pre>
    <p>These values let your backend communicate with Meta on behalf of the tenant.</p>

    <h2>9. Sequence Diagram</h2>
    <pre>Customer          Frontend         Meta           Backend

Click Connect
     │
     ├────────────►
                  │ Launch Signup
                  ├────────────►
                                 Login
                                 Create WABA
                                 Verify Number
                                 Grant Permissions
                  ◄────────────┤
Authorization Code
                  │
                  ├────────────► Exchange Code
                                                │
                                                ├────► Graph API
                                                ◄────┤
                                                Store IDs</pre>

    <h2>10. Failure Scenarios</h2>

    <h3>Phone Number Verification Fails</h3>
    <p>The customer must complete verification before onboarding finishes.</p>

    <h3>Business Verification Pending</h3>
    <p>Some features remain unavailable until Meta verifies the business.</p>

    <h3>Customer Rejects Permissions</h3>
    <p>Your platform cannot manage the customer's WhatsApp account.</p>

    <h3>Duplicate Phone Number</h3>
    <p>A phone number can belong to only one WABA at a time.</p>

    <h2>11. Best Practices</h2>
    <ul>
      <li>Keep the onboarding flow inside your application.</li>
      <li>Handle cancellation gracefully.</li>
      <li>Persist onboarding progress.</li>
      <li>Validate webhook subscriptions before production.</li>
      <li>Store only the identifiers you need.</li>
      <li>Encrypt sensitive credentials.</li>
      <li>Log onboarding failures for debugging.</li>
    </ul>

    <h2>12. Key Takeaways</h2>
    <ul>
      <li>Embedded Signup is the recommended onboarding flow for WhatsApp SaaS platforms.</li>
      <li>Customers remain the owners of their Business Manager, WABA, and phone numbers.</li>
      <li>Your Meta App receives permission to manage those assets.</li>
      <li>The frontend launches the flow using the Configuration ID.</li>
      <li>The backend exchanges the authorization code using the App ID and App Secret.</li>
      <li>Your backend stores the Business ID, WABA ID, Phone Number ID, and related metadata for each tenant.</li>
    </ul>

    <h2>What's Next</h2>
    <p>The next logical chapter is <strong>WhatsApp Cloud API</strong>, where you'll learn how to use the stored tenant information to:</p>
    <ul>
      <li>Send template messages</li>
      <li>Send session messages</li>
      <li>Upload media</li>
      <li>Manage templates</li>
      <li>Read conversations</li>
      <li>Handle delivery receipts</li>
      <li>Process incoming webhooks</li>
    </ul>
  </main>
</body>
</html>`;
