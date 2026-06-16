interface BreadcrumbSegment {
  label: string;
  href?: string;
}

const STATIC_MAP: Record<string, string> = {
  "/app": "Dashboard",
  "/app/services": "Services",
  "/app/whatsapp": "WhatsApp",
  "/app/whatsapp/contacts": "Audience",
  "/app/whatsapp/sendMessage": "Send Message",
  "/app/whatsapp/templates": "Templates",
  "/app/whatsapp/templates/create": "Create Template",
  "/app/whatsapp/campaignReport": "Campaigns",
  "/app/whatsapp/deliveryReport": "Delivery Report",
  "/app/whatsapp/automations": "Automations",
  "/app/whatsapp/analytics": "Analytics",
  "/app/rcs": "RCS",
  "/app/rcs/sendMessage": "Send Message",
  "/app/rcs/templates": "Templates",
  "/app/rcs/templates/create": "Create Template",
  "/app/rcs/agents": "Agents",
  "/app/rcs/agents/create": "Create Agent",
  "/app/rcs/campaignReport": "Campaigns",
  "/app/rcs/deliveryReport": "Delivery Report",
};

export function buildBreadcrumb(pathname: string): BreadcrumbSegment[] {
  const exact = STATIC_MAP[pathname];
  if (exact) {
    return [{ label: "Dashboard", href: "/app" }, { label: exact }];
  }

  const segments = pathname.split("/").filter(Boolean);
  const acc: BreadcrumbSegment[] = [];
  let path = "";

  for (let i = 0; i < segments.length; i++) {
    path += `/${segments[i]}`;
    const label = STATIC_MAP[path];
    if (label) {
      acc.push({ label, href: i === segments.length - 1 ? undefined : path });
    } else if (i === segments.length - 1) {
      acc.push({ label: prettyFromSegment(segments[i]) });
    }
  }

  if (acc.length === 0) acc.push({ label: "Dashboard" });
  return acc;
}

function prettyFromSegment(segment: string): string {
  if (/^\d+$/.test(segment)) return `#${segment}`;
  return segment
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
