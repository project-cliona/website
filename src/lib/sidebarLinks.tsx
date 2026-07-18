// sidebarLinks.ts
import {
  LayoutDashboard,
  Send,
  Book,
  UserRoundCog,
  ChartBar,
  ChartNoAxesColumnDecreasing,
  Plug,
  CreditCard,
  BarChart,
  BarChart3,
  User,
  Boxes,
  Users,
  Workflow,
  MessagesSquare,
  BookOpen,
} from "lucide-react";

export const appLinks = [
  { label: "Services", href: "/app", icon: <Boxes /> },
  { label: "Integrations", href: "/app/integrations", icon: <Plug /> },
  { label: "Billing", href: "/app/billing", icon: <CreditCard /> },
  { label: "Usage", href: "/app/usage", icon: <BarChart /> },
  { label: "Profile", href: "/app/profile", icon: <User /> },
];

export const rcsLinks = [
  { label: "Dashboard", href: "/app/rcs", icon: <LayoutDashboard /> },
  { label: "Send Message", href: "/app/rcs/sendMessage", icon: <Send /> },
  { label: "Templates", href: "/app/rcs/templates", icon: <Book /> },
  { label: "Agents", href: "/app/rcs/agents", icon: <UserRoundCog /> },
  { label: "Delivery Reports", href: "/app/rcs/deliveryReport", icon: <ChartBar /> },
  { label: "Campaign Reports", href: "/app/rcs/campaignReport", icon: <ChartNoAxesColumnDecreasing /> },
];

export const whatsappLinks = [
  { label: "Dashboard", href: "/app", icon: <LayoutDashboard /> },
  { label: "Send Message", href: "/app/whatsapp/sendMessage", icon: <Send /> },
  { label: "Conversations", href: "/app/whatsapp/conversations", icon: <MessagesSquare /> },
  { label: "Flow Builder", href: "/app/whatsapp/flows", icon: <Workflow /> },
  { label: "Analytics", href: "/app/whatsapp/analytics", icon: <BarChart3 /> },
  { label: "Templates", href: "/app/whatsapp/templates", icon: <Book /> },
  { label: "Contacts", href: "/app/whatsapp/contacts", icon: <Users /> },
  { label: "Delivery Reports", href: "/app/whatsapp/deliveryReport", icon: <ChartBar /> },
  { label: "Campaign Reports", href: "/app/whatsapp/campaignReport", icon: <ChartNoAxesColumnDecreasing /> },
];

// Admin-only links — rendered behind a RoleGate (ROLE_ADMIN) in the sidebar.
export const adminLinks = [
  { label: "Documentation", href: "/app/documentation", icon: <BookOpen /> },
];
