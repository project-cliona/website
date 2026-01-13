"use client";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { Book, UserRoundCog , LayoutDashboard, Send, ChartBar, ChartNoAxesColumnDecreasing } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
const links = [
  { label: "Dashboard", href: "/app/rcs/", icon: <LayoutDashboard  /> },
  { label: "Send Message", href: "/app/rcs/sendMessage", icon: <Send /> },
  { label: "Templates", href: "/app/rcs/templates", icon: <Book /> },
  { label: "Agents", href: "/app/rcs/agents", icon: <UserRoundCog  /> },
  { label: "Delivery Reports", href: "/app/rcs/deliveryReport", icon: <ChartBar /> },
  { label: "Campaign Reports", href: "/app/rcs/campaignReport", icon: <ChartNoAxesColumnDecreasing /> },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Sidebar open={open} setOpen={setOpen}>
        <div className="flex">
          <SidebarBody className="space-y-4">
            <div>{open ? <Logo /> : <LogoIcon />}</div>
            {links.map((link) => (
              <SidebarLink className="font-medium" key={link.href} link={link} />
            ))}
          </SidebarBody>
          <main className="flex-1 p-4">{children}</main>
        </div>
      </Sidebar>
    </>
  );
}

export const Logo = () => {
  return (
    <Link
      href="#"
      className=" space-x-2 items-center flex"
    >
        <Image src="/220630895.png" alt="Logo" width={32} height={32} />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Cliona
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <div>
      <Image src="/220630895.png" alt="Logo" width={32} height={32} />
    </div>
  );
};
