// Self-contained HTML document for the "Authentication & Access Tokens" internal doc.
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
<title>Authentication &amp; Access Tokens</title>
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
      <p class="eyebrow">Integrations · Auth</p>
      <h1>Authentication &amp; Access Tokens</h1>
      <p>Every token in the WhatsApp SaaS stack — who issues it, who owns it, when it is used, and how your backend authenticates with Meta.</p>
    </div>
  </header>

  <main class="wrap">
    <p class="callout"><strong>Audience:</strong> Engineers building a WhatsApp SaaS.<br><strong>Goal:</strong> Understand every token, who issues it, who owns it, when it is used, and how your backend authenticates with Meta.</p>

    <h2>Table of Contents</h2>
    <ol>
      <li>Why Authentication Exists</li>
      <li>Identity vs Authentication vs Authorization</li>
      <li>The Different Actors</li>
      <li>OAuth Flow</li>
      <li>Token Types</li>
      <li>App ID &amp; App Secret</li>
      <li>User Access Token</li>
      <li>Long-lived User Token</li>
      <li>System Users</li>
      <li>System User Access Token</li>
      <li>Permissions (Scopes)</li>
      <li>Which Token is Used Where?</li>
      <li>Token Lifecycle</li>
      <li>Production Architecture</li>
      <li>Security Best Practices</li>
      <li>Common Mistakes</li>
      <li>Key Takeaways</li>
    </ol>

    <h2>1. Why Authentication Exists</h2>
    <p>Every request to Meta must answer two questions:</p>
    <ol>
      <li><strong>Who is calling me?</strong></li>
      <li><strong>Are they allowed to perform this action?</strong></li>
    </ol>
    <p>Authentication answers the first question.</p>
    <p>Authorization answers the second.</p>

    <h2>2. Identity vs Authentication vs Authorization</h2>
    <p>These terms are often confused.</p>
    <table>
      <thead>
        <tr><th>Concept</th><th>Meaning</th></tr>
      </thead>
      <tbody>
        <tr><td>Identity</td><td>Who you are</td></tr>
        <tr><td>Authentication</td><td>How you prove who you are</td></tr>
        <tr><td>Authorization</td><td>What you're allowed to do</td></tr>
      </tbody>
    </table>
    <p>Example:</p>
    <pre>Harshit

↓

Logs into Facebook

↓

Meta verifies identity

↓

Receives Access Token

↓

Uses token to call APIs

↓

Meta checks permissions</pre>

    <h2>3. The Different Actors</h2>
    <p>Several identities exist in the Meta ecosystem.</p>
    <pre>Developer

Business Manager

Meta App

Customer

System User

Backend Server</pre>
    <p>Each has a different purpose.</p>

    <h2>4. OAuth Flow</h2>
    <p>During Embedded Signup your customer authenticates using Facebook Login.</p>
    <pre>Customer

↓

Facebook Login

↓

Authorization Code

↓

Exchange Code

↓

Short-lived User Access Token</pre>
    <p>This token exists only to complete onboarding.</p>

    <h2>5. Token Types</h2>
    <p>There are four identities you'll commonly encounter.</p>
    <table>
      <thead>
        <tr><th>Token</th><th>Purpose</th></tr>
      </thead>
      <tbody>
        <tr><td>App Credentials</td><td>Identify your application</td></tr>
        <tr><td>User Access Token</td><td>Authenticate a logged-in user</td></tr>
        <tr><td>Long-lived User Token</td><td>Extended user authentication</td></tr>
        <tr><td>System User Token</td><td>Server-to-server authentication</td></tr>
      </tbody>
    </table>

    <h2>6. App ID &amp; App Secret</h2>
    <p>Every Meta App has two credentials.</p>
    <pre>App ID

App Secret</pre>
    <p>Think of them like:</p>
    <pre>Username

Password</pre>
    <p>They identify your application.</p>
    <p>The App Secret must never be exposed to browsers or mobile applications.</p>

    <h2>7. User Access Token</h2>
    <p>Generated after a successful Facebook Login.</p>
    <p>Purpose:</p>
    <ul>
      <li>Complete Embedded Signup</li>
      <li>Read resources the user has granted access to</li>
    </ul>
    <p>Characteristics:</p>
    <ul>
      <li>Short lived</li>
      <li>User specific</li>
      <li>Not suitable for backend production services</li>
    </ul>

    <h2>8. Long-lived User Token</h2>
    <p>A long-lived version of the user token.</p>
    <p>Useful when user interaction is still required.</p>
    <p>Typically valid for around 60 days.</p>
    <p>Still tied to the user.</p>

    <h2>9. System Users</h2>
    <p>A System User represents software instead of a human.</p>
    <p>Created inside the Business Manager.</p>
    <pre>Business Manager

↓

System User

↓

Assign Assets

↓

Generate Token</pre>

    <h2>10. System User Access Token</h2>
    <p>This is the most important token for a SaaS platform.</p>
    <p>Characteristics:</p>
    <ul>
      <li>Used by backend servers</li>
      <li>Permanent until revoked</li>
      <li>Independent of human logins</li>
      <li>Suitable for production workloads</li>
    </ul>
    <p>Typical usage:</p>
    <ul>
      <li>Send messages</li>
      <li>Create templates</li>
      <li>Manage phone numbers</li>
      <li>Read business assets</li>
      <li>Subscribe to webhooks</li>
    </ul>

    <h2>11. Permissions (Scopes)</h2>
    <p>A token is only useful if it has the required permissions.</p>
    <p>Common WhatsApp scopes:</p>
    <table>
      <thead>
        <tr><th>Scope</th><th>Purpose</th></tr>
      </thead>
      <tbody>
        <tr><td><code>whatsapp_business_messaging</code></td><td>Send and receive messages</td></tr>
        <tr><td><code>whatsapp_business_management</code></td><td>Manage WABAs, phone numbers and templates</td></tr>
        <tr><td><code>business_management</code></td><td>Access business assets</td></tr>
      </tbody>
    </table>
    <p>Think of scopes as permissions attached to the token.</p>

    <h2>12. Which Token is Used Where?</h2>
    <table>
      <thead>
        <tr><th>Operation</th><th>Token</th></tr>
      </thead>
      <tbody>
        <tr><td>Embedded Signup</td><td>User Access Token</td></tr>
        <tr><td>Exchange Authorization Code</td><td>App ID + App Secret</td></tr>
        <tr><td>Send WhatsApp Messages</td><td>System User Token</td></tr>
        <tr><td>Manage Templates</td><td>System User Token</td></tr>
        <tr><td>Add Phone Numbers</td><td>System User Token</td></tr>
        <tr><td>Subscribe Webhooks</td><td>System User Token</td></tr>
      </tbody>
    </table>
    <p>Rule of thumb:</p>
    <p><strong>Users authenticate once. Servers authenticate forever using System User tokens.</strong></p>

    <h2>13. Token Lifecycle</h2>
    <pre>Customer

↓

Facebook Login

↓

Authorization Code

↓

User Access Token

↓

Embedded Signup completes

↓

Business Manager

↓

System User

↓

Permanent System User Token

↓

Backend stores securely

↓

Daily API Calls</pre>

    <h2>14. Production Architecture</h2>
    <pre>Browser

↓

Embedded Signup

↓

Backend

↓

System User Token

↓

Graph API

↓

WhatsApp Business Platform</pre>
    <p>Notice that after onboarding, browsers no longer communicate directly with Meta for operational APIs.</p>
    <p>The backend becomes the trusted component.</p>

    <h2>15. Security Best Practices</h2>
    <ul>
      <li>Never expose the App Secret.</li>
      <li>Never store tokens in frontend code.</li>
      <li>Encrypt tokens at rest.</li>
      <li>Use HTTPS everywhere.</li>
      <li>Rotate credentials when required.</li>
      <li>Restrict Business Manager access to administrators.</li>
      <li>Store the minimum required permissions.</li>
    </ul>

    <h2>16. Common Mistakes</h2>
    <h3>Mistake 1</h3>
    <p>Using a User Access Token in production.</p>
    <p>Use a System User Token instead.</p>
    <h3>Mistake 2</h3>
    <p>Exposing the App Secret in frontend code.</p>
    <p>The App Secret belongs only on the backend.</p>
    <h3>Mistake 3</h3>
    <p>Requesting excessive permissions.</p>
    <p>Always request the minimum scopes necessary.</p>

    <h2>17. Key Takeaways</h2>
    <ul>
      <li>App ID and App Secret identify your application.</li>
      <li>User Access Tokens authenticate humans.</li>
      <li>System User Tokens authenticate servers.</li>
      <li>Scopes determine what a token can do.</li>
      <li>Your production backend should primarily communicate with Meta using a System User Token.</li>
      <li>Authentication proves identity. Authorization determines permissions.</li>
    </ul>

    <p><strong>Next Chapter:</strong> Embedded Signup — a deep dive into the onboarding flow, Graph API calls, sequence diagrams, and exactly what happens from the moment a customer clicks "Connect WhatsApp" until your platform stores their WABA credentials.</p>
  </main>
</body>
</html>`;
