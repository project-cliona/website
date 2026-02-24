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
  User,
  Boxes,
  Users,
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
  { label: "Dashboard", href: "/app/whatsapp", icon: <LayoutDashboard /> },
  { label: "Send Message", href: "/app/whatsapp/sendMessage", icon: <Send /> },
  { label: "Templates", href: "/app/whatsapp/templates", icon: <Book /> },
  { label: "Contacts", href: "/app/whatsapp/contacts", icon: <Users /> },
  { label: "Delivery Reports", href: "/app/whatsapp/deliveryReport", icon: <ChartBar /> },
  { label: "Campaign Reports", href: "/app/whatsapp/campaignReport", icon: <ChartNoAxesColumnDecreasing /> },
];
