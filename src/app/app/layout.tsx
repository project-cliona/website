"use client";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { appLinks, rcsLinks, whatsappLinks } from "@/lib/sidebarLinks";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LogoutButton from "@/components/auth/LogoutButton";
import { LogOut } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const isRcsRoute = pathname.startsWith("/app/rcs");
    const isWhatsappRoute = pathname.startsWith("/app/whatsapp");

    const links = isRcsRoute ? rcsLinks : isWhatsappRoute ? whatsappLinks : appLinks;

    return (
        <ProtectedRoute>
            <Sidebar open={open} setOpen={setOpen}>
                <div className="min-h-screen bg-background md:flex">
                    <SidebarBody className="space-y-4 justify-between">
                        <div className="flex flex-col space-y-4">
                            <div className="pb-5 mb-1 border-b border-sidebar-border">
                                {open ? <Logo /> : <LogoIcon />}
                            </div>

                            {links.map((link) => (
                                <SidebarLink
                                    key={link.href}
                                    link={link}
                                    isActive={
                                        link.href === "/app"
                                            ? pathname === "/app"
                                            : pathname.startsWith(link.href)
                                    }
                                    className="font-medium"
                                />
                            ))}
                        </div>

                        {open ? (
                            <div className="flex gap-3 justify-center items-center">
                                <LogOut className="text-muted-foreground" />
                                <LogoutButton className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors py-2 cursor-pointer w-full" />
                            </div>
                        ) : (
                            <LogOut className="text-muted-foreground mx-auto" />
                        )}
                    </SidebarBody>

                    <main className="flex-1 w-full min-h-screen p-8 bg-background">{children}</main>
                </div>
            </Sidebar>
        </ProtectedRoute>
    );
}

export const Logo = () => {
    return (
        <Link
            href="/app"
            className=" space-x-2 items-center flex"
        >
            <Image src="/squalto.jpg" alt="Logo" width={32} height={32} />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium text-foreground whitespace-pre"
            >
                Squalto
            </motion.span>
        </Link>
    );
};

export const LogoIcon = () => {
    return (
        <div>
            <Image src="/squalto.jpg" alt="Logo" width={32} height={32} />
        </div>
    );
};
