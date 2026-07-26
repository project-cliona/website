// Self-contained HTML document for the "WhatsApp Integration" internal doc.
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
<title>How WhatsApp Plugs Into Squalto</title>
<style>
  :root {
    --paper:    #F4F7F4;
    --surface:  #FFFFFF;
    --ink:      #15211B;
    --muted:    #586860;
    --faint:    #7E8C84;
    --border:   #DBE5DD;
    --border-2: #C9D6CD;
    --accent:   #0E7C5A;
    --accent-d: #0A5C43;
    --accent-w: #E7F2EC;
    --shared:   #3667A6;   --shared-bg:  #E9F0F9;
    --tenant:   #B0641C;   --tenant-bg:  #FaF0E3;
    --public:   #2F7D4F;   --public-bg:  #E8F3EC;
    --secret:   #B23A3A;   --secret-bg:  #FBEAEA;
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
  .narrow { max-width: 720px; }
  .hero {
    background:
      radial-gradient(120% 90% at 85% -10%, #14946b22, transparent 60%),
      linear-gradient(180deg, #0c3a2c, #0e503a);
    color: #EAF4EE;
    padding: 64px 0 56px;
    border-bottom: 1px solid #0a2a20;
  }
  .eyebrow {
    font-family: var(--mono);
    font-size: 12.5px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #7FD9B4;
    margin: 0 0 18px;
  }
  .hero h1 {
    font-size: clamp(32px, 6vw, 50px);
    line-height: 1.04;
    letter-spacing: -0.02em;
    font-weight: 800;
    margin: 0 0 20px;
    text-wrap: balance;
  }
  .hero p {
    font-size: 19px;
    line-height: 1.55;
    color: #C5DDD0;
    max-width: 600px;
    margin: 0;
  }
  .hero .tag {
    display: inline-block;
    margin-top: 24px;
    font-family: var(--mono);
    font-size: 12px;
    color: #9ED1BB;
    border: 1px solid #2c6650;
    border-radius: 999px;
    padding: 5px 13px;
  }
  section { padding: 52px 0; border-bottom: 1px solid var(--border); }
  section.alt { background: var(--surface); }
  .kicker {
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent);
    margin: 0 0 10px;
    font-weight: 600;
  }
  h2 {
    font-size: clamp(24px, 4vw, 31px);
    line-height: 1.12;
    letter-spacing: -0.015em;
    font-weight: 750;
    margin: 0 0 14px;
    text-wrap: balance;
  }
  .lead { color: var(--muted); font-size: 17.5px; margin: 0 0 8px; }
  p { margin: 0 0 16px; }
  strong { font-weight: 650; }
  code, .mono { font-family: var(--mono); font-size: 0.88em; }
  p code, li code, td code {
    background: var(--accent-w);
    color: var(--accent-d);
    padding: 1px 6px;
    border-radius: 5px;
    border: 1px solid #cfe6da;
    white-space: nowrap;
  }
  .triad {
    display: grid;
    grid-template-columns: 1fr auto 1fr auto 1fr;
    align-items: center;
    gap: 10px;
    margin: 28px 0 8px;
  }
  .node {
    background: var(--surface);
    border: 1px solid var(--border-2);
    border-radius: 14px;
    padding: 18px 16px;
    text-align: center;
  }
  .node .role { font-family: var(--mono); font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--faint); margin-bottom: 6px; }
  .node .name { font-weight: 700; font-size: 17px; }
  .node .sub { font-size: 13px; color: var(--muted); margin-top: 4px; line-height: 1.4; }
  .node.mid { border-color: var(--accent); box-shadow: 0 4px 18px -10px var(--accent); }
  .arrow { color: var(--accent); font-size: 22px; text-align: center; font-weight: 700; }
  @media (max-width: 640px) {
    .triad { grid-template-columns: 1fr; }
    .arrow { transform: rotate(90deg); padding: 2px 0; }
  }
  .grouphead {
    display: flex; align-items: baseline; gap: 12px;
    margin: 34px 0 16px; flex-wrap: wrap;
  }
  .grouphead h3 { font-size: 19px; margin: 0; font-weight: 700; }
  .grouphead .where { font-family: var(--mono); font-size: 12px; color: var(--faint); }
  .cards { display: grid; gap: 12px; }
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px 18px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 6px 14px;
    align-items: start;
  }
  .card .cname { font-family: var(--mono); font-size: 13.5px; font-weight: 600; color: var(--ink); word-break: break-word; }
  .card .cdesc { grid-column: 1 / -1; color: var(--muted); font-size: 14.5px; line-height: 1.5; margin: 0; }
  .chip {
    font-family: var(--mono);
    font-size: 10.5px;
    letter-spacing: .04em;
    text-transform: uppercase;
    padding: 3px 9px;
    border-radius: 999px;
    white-space: nowrap;
    font-weight: 600;
    align-self: start;
  }
  .chip.shared { background: var(--shared-bg); color: var(--shared); }
  .chip.tenant { background: var(--tenant-bg); color: var(--tenant); }
  .chip.public { background: var(--public-bg); color: var(--public); }
  .chip.secret { background: var(--secret-bg); color: var(--secret); }
  .chiprow { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
  .legend { display: flex; gap: 16px; flex-wrap: wrap; margin: 8px 0 4px; font-size: 13px; color: var(--muted); }
  .legend span { display: inline-flex; align-items: center; gap: 7px; }
  .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
  .steps { display: grid; gap: 0; margin: 24px 0 4px; counter-reset: s; }
  .step {
    display: grid;
    grid-template-columns: 44px 1fr;
    gap: 18px;
    padding: 18px 0;
    border-top: 1px solid var(--border);
  }
  .step:last-child { border-bottom: 1px solid var(--border); }
  .step .num {
    counter-increment: s;
    font-family: var(--mono);
    font-weight: 700;
    font-size: 15px;
    color: var(--accent-d);
    background: var(--accent-w);
    border: 1px solid #cfe6da;
    border-radius: 9px;
    width: 44px; height: 44px;
    display: grid; place-items: center;
  }
  .step .num::before { content: counter(s, decimal-leading-zero); }
  .step h4 { margin: 4px 0 5px; font-size: 17px; font-weight: 700; }
  .step p { margin: 0; color: var(--muted); font-size: 15px; line-height: 1.55; }
  .step .who { font-family: var(--mono); font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: var(--faint); display: block; margin-top: 6px; }
  .tablewrap { overflow-x: auto; border: 1px solid var(--border); border-radius: 12px; margin: 22px 0 4px; background: var(--surface); }
  table { border-collapse: collapse; width: 100%; min-width: 540px; font-size: 14.5px; }
  th, td { text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--border); vertical-align: top; }
  th { font-family: var(--mono); font-size: 11.5px; letter-spacing: .06em; text-transform: uppercase; color: var(--faint); font-weight: 600; background: #fafcfb; }
  tr:last-child td { border-bottom: none; }
  td .t { font-weight: 650; }
  td.tok { font-family: var(--mono); font-size: 12.5px; }
  .note {
    background: var(--accent-w);
    border: 1px solid #cfe6da;
    border-left: 3px solid var(--accent);
    border-radius: 10px;
    padding: 15px 18px;
    margin: 22px 0 4px;
    font-size: 15px;
    color: #234a3c;
  }
  .note b { color: var(--accent-d); }
  .warn {
    background: #FBF2EC;
    border: 1px solid #efd9c6;
    border-left: 3px solid var(--tenant);
    border-radius: 10px;
    padding: 15px 18px;
    margin: 22px 0 4px;
    font-size: 15px;
    color: #6b441f;
  }
  .warn b { color: #8a4f17; }
  ul.clean { margin: 14px 0 4px; padding: 0; list-style: none; display: grid; gap: 10px; }
  ul.clean li { padding-left: 26px; position: relative; color: var(--muted); font-size: 15.5px; }
  ul.clean li::before { content: "\\2192"; position: absolute; left: 0; color: var(--accent); font-weight: 700; }
  ul.clean li b { color: var(--ink); font-weight: 650; }
  footer { padding: 40px 0 56px; color: var(--faint); font-size: 13.5px; }
  footer .mono { font-size: 12px; }
</style>
</head>
<body>

<div class="hero">
  <div class="wrap">
    <p class="eyebrow">Squalto &middot; WhatsApp Integration</p>
    <h1>How WhatsApp plugs into your platform</h1>
    <p>A plain-language tour of the keys you hold, how a client's WhatsApp number gets connected, how every call is authenticated, and what Meta requires of you to stay live.</p>
    <span class="tag">Codebase name: Cliona &middot; Scope: WhatsApp only</span>
  </div>
</div>

<section>
  <div class="wrap narrow">
    <p class="kicker">The big picture</p>
    <h2>Three players, one pipe</h2>
    <p class="lead">Everything below is just these three talking to each other. Your platform sits in the middle and never lets the client touch Meta directly.</p>
    <div class="triad">
      <div class="node">
        <div class="role">Your client</div>
        <div class="name">The business</div>
        <div class="sub">Owns a WhatsApp Business Account &amp; phone number</div>
      </div>
      <div class="arrow">&#8646;</div>
      <div class="node mid">
        <div class="role">Squalto</div>
        <div class="name">Your platform</div>
        <div class="sub">Holds the keys, stores tokens, sends &amp; receives</div>
      </div>
      <div class="arrow">&#8646;</div>
      <div class="node">
        <div class="role">Meta</div>
        <div class="name">Cloud API</div>
        <div class="sub">graph.facebook.com &mdash; the actual WhatsApp network</div>
      </div>
    </div>
    <p style="margin-top:24px">Two kinds of credentials make this work. <strong>Platform keys</strong> are yours, one set for the whole product. <strong>Per-client identifiers</strong> are issued by Meta when each business connects, and are stored against that one client. Keep these two buckets separate in your head &mdash; it's the key to understanding the whole system.</p>
  </div>
</section>

<section class="alt">
  <div class="wrap">
    <p class="kicker">Credentials &amp; identifiers</p>
    <h2>Which keys your repo uses</h2>
    <p class="lead narrow">Every value below is real and in your code today. Names are shown; secret <em>values</em> live only in your backend <code>.env</code> files and are never sent to the browser.</p>
    <div class="legend">
      <span><i class="dot" style="background:var(--shared)"></i> Platform-wide</span>
      <span><i class="dot" style="background:var(--tenant)"></i> Per-client</span>
      <span><i class="dot" style="background:var(--public)"></i> Public (safe to expose)</span>
      <span><i class="dot" style="background:var(--secret)"></i> Secret (never expose)</span>
    </div>
    <div class="grouphead">
      <h3>1 &middot; Platform keys &mdash; one set for everyone</h3>
      <span class="where">backend .env &rarr; src/utils/env.ts</span>
    </div>
    <div class="cards">
      <div class="card">
        <span class="cname">META_APP_ID</span>
        <span class="chiprow"><span class="chip shared">shared</span><span class="chip public">public</span></span>
        <p class="cdesc">Your Meta app's public ID &mdash; like a username for your whole application. Identifies Squalto to Meta during the signup popup and OAuth. Also exposed to the browser as <code>NEXT_PUBLIC_META_APP_ID</code> to boot the Facebook SDK.</p>
      </div>
      <div class="card">
        <span class="cname">META_APP_SECRET</span>
        <span class="chiprow"><span class="chip shared">shared</span><span class="chip secret">secret</span></span>
        <p class="cdesc">Your app's private password. Does two jobs: (1) trades login codes for access tokens during onboarding, and (2) verifies that incoming webhooks genuinely came from Meta (the HMAC signature check). Treat like a password.</p>
      </div>
      <div class="card">
        <span class="cname">META_SYSTEM_USER_TOKEN</span>
        <span class="chiprow"><span class="chip shared">shared</span><span class="chip secret">secret</span></span>
        <p class="cdesc">A long-lived token tied to a "system user" in your Meta Business. This is your platform's own admin key &mdash; used for the setup calls during onboarding (exchange tokens, look up phone details, subscribe webhooks, register a number).</p>
      </div>
      <div class="card">
        <span class="cname">EMBEDDED_SIGNUP_CONFIG_ID</span>
        <span class="chiprow"><span class="chip shared">shared</span><span class="chip public">public</span></span>
        <p class="cdesc">The ID of the signup flow you designed in Meta's dashboard. It tells the popup which permissions and screens to show the client. Exposed to the browser as <code>NEXT_PUBLIC_EMBEDDED_SIGNUP_CONFIG_ID</code>.</p>
      </div>
      <div class="card">
        <span class="cname">VERIFY_TOKEN</span>
        <span class="chiprow"><span class="chip shared">shared</span><span class="chip secret">secret</span></span>
        <p class="cdesc">A password <em>you</em> invent. When you register your webhook URL, Meta echoes this back once to prove it's really talking to you. A simple shared-secret handshake.</p>
      </div>
      <div class="card">
        <span class="cname">WHATSAPP_API_DOMAIN &middot; WHATSAPP_API_VERSION</span>
        <span class="chiprow"><span class="chip shared">shared</span><span class="chip public">public</span></span>
        <p class="cdesc">Just the address you call: <code>graph.facebook.com</code> and a version like <code>v25.0</code>. Stitched together into the base URL in <code>utils/whatsapp/axios.ts</code>. Not secret &mdash; plain configuration.</p>
      </div>
    </div>
    <div class="grouphead">
      <h3>2 &middot; Per-client identifiers &mdash; one set per connected number</h3>
      <span class="where">DB table &rarr; whatsappBusinessAccounts</span>
    </div>
    <div class="cards">
      <div class="card">
        <span class="cname">wabaId</span>
        <span class="chiprow"><span class="chip tenant">per-client</span></span>
        <p class="cdesc">The client's <b>WhatsApp Business Account ID</b> &mdash; the top-level container for their messaging, templates, and phone numbers. Issued by Meta during signup.</p>
      </div>
      <div class="card">
        <span class="cname">phoneNumberId</span>
        <span class="chiprow"><span class="chip tenant">per-client</span></span>
        <p class="cdesc">The ID of the specific phone number used to send. Every message and campaign is addressed through this. Inbound webhooks are routed back to the right client using it.</p>
      </div>
      <div class="card">
        <span class="cname">accessToken</span>
        <span class="chiprow"><span class="chip tenant">per-client</span><span class="chip secret">secret</span></span>
        <p class="cdesc">The client's <b>own</b> long-lived token (~60 days). This is what actually sends <em>their</em> messages &mdash; not your system token. Stored in the DB and stripped out before any response reaches the browser.</p>
      </div>
      <div class="card">
        <span class="cname">displayPhoneNumber &middot; qualityRating &middot; tokenExpiresAt &middot; status</span>
        <span class="chiprow"><span class="chip tenant">per-client</span></span>
        <p class="cdesc">Supporting details: the human-readable number, Meta's quality grade for the line, when the token expires, and whether the connection is <code>active</code> / <code>expired</code> / <code>disconnected</code>.</p>
      </div>
    </div>
    <div class="warn" style="margin-top:18px"><b>Heads up:</b> <code>metaBusinessId</code> and <code>businessName</code> columns exist but are saved empty today &mdash; the onboarding flow doesn't fetch them yet. Worth filling in if you ever need them.</div>
  </div>
</section>

<section>
  <div class="wrap narrow">
    <p class="kicker">Connecting a number</p>
    <h2>How a client's WhatsApp account gets registered</h2>
    <p class="lead">This is a real, ordered sequence &mdash; the "Embedded Signup" flow. The client clicks one button; these eight things happen behind it.</p>
    <div class="steps">
      <div class="step"><div class="num"></div><div>
        <h4>Client clicks "Connect WhatsApp"</h4>
        <p>The dashboard loads Meta's Facebook SDK using your <code>META_APP_ID</code> and opens the signup popup configured by your <code>EMBEDDED_SIGNUP_CONFIG_ID</code>.</p>
        <span class="who">Browser &middot; facebook-sdk.ts</span>
      </div></div>
      <div class="step"><div class="num"></div><div>
        <h4>Client logs into Facebook &amp; picks their account</h4>
        <p>Inside Meta's own popup, the business signs in, then selects (or creates) their WhatsApp Business Account and the phone number they want to use. You never see their Facebook password &mdash; Meta handles it.</p>
        <span class="who">Meta popup</span>
      </div></div>
      <div class="step"><div class="num"></div><div>
        <h4>Popup hands back a one-time code</h4>
        <p>On finish, Meta returns a short-lived <code>code</code> plus the new <code>waba_id</code> and <code>phone_number_id</code>. The browser forwards these to your backend.</p>
        <span class="who">Browser &rarr; backend</span>
      </div></div>
      <div class="step"><div class="num"></div><div>
        <h4>Backend trades the code for a token</h4>
        <p>Using <code>META_APP_ID</code> + <code>META_APP_SECRET</code>, your server swaps the code for a short-lived token, then immediately upgrades it to a <b>long-lived ~60-day token</b>.</p>
        <span class="who">Backend &middot; onboarding.ts</span>
      </div></div>
      <div class="step"><div class="num"></div><div>
        <h4>Looks up the phone's details</h4>
        <p>Fetches the display number and quality rating from Meta so you can show the client which line is connected.</p>
        <span class="who">Backend &rarr; Meta</span>
      </div></div>
      <div class="step"><div class="num"></div><div>
        <h4>Subscribes your app to their webhooks</h4>
        <p>Registers Squalto as a "subscribed app" on their WABA. From now on Meta will push inbound messages, delivery updates, and template approvals to your webhook.</p>
        <span class="who">Backend &rarr; Meta</span>
      </div></div>
      <div class="step"><div class="num"></div><div>
        <h4>Registers the phone for the Cloud API</h4>
        <p>Activates the number for sending via the Cloud API (with a 6-digit PIN). After this the line can actually send.</p>
        <span class="who">Backend &rarr; Meta</span>
      </div></div>
      <div class="step"><div class="num"></div><div>
        <h4>Saves everything against the client</h4>
        <p>All identifiers + the client's token land in <code>whatsappBusinessAccounts</code>, linked to their <code>userId</code>, marked <code>active</code>. The connection is now live and the dashboard updates.</p>
        <span class="who">Backend &middot; DB</span>
      </div></div>
    </div>
  </div>
</section>

<section class="alt">
  <div class="wrap">
    <p class="kicker">Authentication</p>
    <h2>How each call proves who it is</h2>
    <p class="lead narrow">The golden rule: <strong>your token does the setup, the client's token does the sending.</strong> Webhooks use neither &mdash; they're verified by signature.</p>
    <div class="tablewrap">
      <table>
        <thead><tr><th>What's happening</th><th>Which key</th><th>How</th></tr></thead>
        <tbody>
          <tr><td><span class="t">Onboarding setup calls</span><br><span style="color:var(--muted);font-size:13.5px">exchange token, fetch phone, subscribe, register</span></td><td class="tok">Your system user token</td><td>Default <code>Bearer</code> header on the shared API client</td></tr>
          <tr><td><span class="t">Sending messages &amp; campaigns</span><br><span style="color:var(--muted);font-size:13.5px">one client at a time</span></td><td class="tok">That client's accessToken</td><td>Header is overridden per request with the token from the DB</td></tr>
          <tr><td><span class="t">Receiving webhooks</span><br><span style="color:var(--muted);font-size:13.5px">inbound + delivery + template status</span></td><td class="tok">No token</td><td><code>X-Hub-Signature-256</code> HMAC checked with <code>META_APP_SECRET</code></td></tr>
        </tbody>
      </table>
    </div>
    <div class="note"><b>Why two tokens?</b> Your system token can do admin work but shouldn't send a client's messages on their behalf &mdash; that would mix tenants and break Meta's rate/quality accounting. So each client's own token is stored and used only for their traffic. This is also why a client's messages stop if their token expires (your code checks <code>tokenExpiresAt</code> before every send).</div>
  </div>
</section>

<section>
  <div class="wrap narrow">
    <p class="kicker">Onboarding clients</p>
    <h2>From sign-up to sending</h2>
    <p class="lead">Connecting a WhatsApp number (above) is the last step. First the client has to become a verified user on your platform.</p>
    <ul class="clean">
      <li><b>Sign up</b> &mdash; name, email, password. Your backend creates a <code>user</code> record and a <code>profile</code> with role <em>Client</em>. Profile status starts as <code>incomplete</code>.</li>
      <li><b>Gated at the door</b> &mdash; when they log in, your <code>UserProvider</code> checks profile status. <code>incomplete</code> &rarr; forced to <code>/kyc</code>; <code>active</code> &rarr; allowed into the dashboard.</li>
      <li><b>KYC</b> &mdash; they fill in business details (name, mobile, address, company). On submit the profile flips to <code>active</code> and the dashboard unlocks.</li>
      <li><b>Connect WhatsApp</b> &mdash; now they run the 8-step Embedded Signup flow and start messaging.</li>
    </ul>
    <div class="note" style="margin-top:22px"><b>Roles, briefly.</b> Your platform has three tiers &mdash; <code>Admin</code>, <code>Reseller</code>, and <code>Client</code>. A reseller can have child clients under it. Each new signup is created as a Client under the admin by default. Access is scoped to what a user owns (or, for resellers, what their children own).</div>
  </div>
</section>

<section class="alt">
  <div class="wrap narrow">
    <p class="kicker">The return path</p>
    <h2>How Meta talks back to you</h2>
    <p class="lead">Sending is you &rarr; Meta. Everything coming the other way &mdash; replies, "delivered/read" ticks, template approvals &mdash; arrives as a webhook.</p>
    <ul class="clean">
      <li><b>One-time verification</b> &mdash; when you set the webhook URL, Meta calls it with your <code>VERIFY_TOKEN</code>. Your server echoes the challenge back to prove ownership.</li>
      <li><b>Every event after that is signed</b> &mdash; Meta attaches an <code>X-Hub-Signature-256</code> header. Your middleware recomputes the HMAC with <code>META_APP_SECRET</code> and rejects anything that doesn't match (timing-safe), so nobody can fake events.</li>
      <li><b>Routing</b> &mdash; incoming events carry the <code>phoneNumberId</code>, which your code uses to find the owning client and file the message/status against them.</li>
    </ul>
  </div>
</section>

<section>
  <div class="wrap">
    <p class="kicker">Meta's side</p>
    <h2>Getting the API access &mdash; keys, permissions, compliance</h2>
    <p class="lead narrow">The credentials above don't appear by magic. Here's where they come from on Meta's side and what Meta requires before they'll let you send at scale.</p>
    <div class="grouphead"><h3>The three kinds of "API key"</h3></div>
    <div class="tablewrap">
      <table>
        <thead><tr><th>Type</th><th>What it is</th><th>Where it ends up</th></tr></thead>
        <tbody>
          <tr><td class="tok">App credentials</td><td>App ID + App Secret, created when you make a Meta app (type <em>Business</em>) at developers.facebook.com and add the WhatsApp product.</td><td class="tok">META_APP_ID<br>META_APP_SECRET</td></tr>
          <tr><td class="tok">System user token</td><td>A long-lived token generated for a system user in your Meta Business Settings, granted to your app with the right permissions.</td><td class="tok">META_SYSTEM_USER_TOKEN</td></tr>
          <tr><td class="tok">Client OAuth tokens</td><td>Generated automatically per client by the Embedded Signup flow &mdash; the ~60-day tokens you store and refresh.</td><td class="tok">whatsappBusinessAccounts.accessToken</td></tr>
        </tbody>
      </table>
    </div>
    <div class="grouphead" style="margin-top:36px"><h3>Permissions Meta must approve</h3></div>
    <p class="narrow" style="color:var(--muted)">These are the scopes your app requests. They go through <strong>App Review</strong> and need <strong>Advanced Access</strong> to work for businesses other than your own test account:</p>
    <ul class="clean">
      <li><code>whatsapp_business_messaging</code> &mdash; <b>send and receive</b> messages.</li>
      <li><code>whatsapp_business_management</code> &mdash; <b>manage</b> the WABA: templates, phone numbers, settings.</li>
      <li><code>business_management</code> &mdash; manage business assets, needed for the Embedded Signup connection.</li>
    </ul>
    <div class="grouphead" style="margin-top:36px"><h3>The compliance checklist</h3></div>
    <ul class="clean">
      <li><b>Business Verification</b> &mdash; Meta verifies <em>your</em> company (legal name, address, documents) before you can offer this to others. This is the big gate.</li>
      <li><b>Tech Provider / Solution Partner setup</b> &mdash; to onboard other businesses via Embedded Signup, your app must be configured as a provider and pass App Review for the permissions above.</li>
      <li><b>App Review + Advanced Access</b> &mdash; until granted, your keys only work on your own test numbers. Advanced Access is what makes it work for real clients.</li>
      <li><b>Per-client requirements</b> &mdash; each connecting business needs their own verified business, an approved <b>display name</b>, and a verified phone number. Their <b>quality rating</b> then governs how many messages per day they can send.</li>
      <li><b>Message templates</b> &mdash; any business-initiated message must use a template that Meta has individually approved. Free-form replies are only allowed inside the 24-hour customer service window.</li>
      <li><b>Opt-in &amp; policy</b> &mdash; you must collect user opt-in and follow Meta's Commerce &amp; Business policies; violations hurt quality rating or get numbers blocked.</li>
      <li><b>Pricing</b> &mdash; since <b>1 July 2025</b>, Meta bills <b>per message</b> (by category), not per 24-hour conversation. Worth keeping in mind for billing.</li>
    </ul>
    <div class="note" style="margin-top:24px"><b>In short:</b> you build one Meta app + one verified business + one system token. App Review unlocks the three permissions. After that, every client self-connects through Embedded Signup, and Meta issues them their own tokens &mdash; you just store and use them.</div>
  </div>
</section>

<footer>
  <div class="wrap narrow">
    <p>Generated from a live read of the codebase &mdash; <span class="mono">cliona-backend</span> (onboarding, messaging, webhook, axios, env) and <span class="mono">website</span> (facebook-sdk, dashboard, KYC). Plain-language summary; Meta-side steps reflect Meta's current Cloud API requirements.</p>
  </div>
</footer>

</body>
</html>`;
