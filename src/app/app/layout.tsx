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
                <div className="md:flex">
                    <SidebarBody className="space-y-4 justify-between">
                        <div className="flex flex-col space-y-4">
                            <div>{open ? <Logo /> : <LogoIcon />}</div>

                            {links.map((link) => (
                                <SidebarLink
                                    key={link.href}
                                    link={link}
                                    className="font-medium"
                                />
                            ))}
                        </div>

                        {open ? <div className="flex gap-3 justify-center items-center"><LogOut/><LogoutButton className="flex items-center gap-2 text-sm font-medium dark:text-neutral-200 text-red-600 hover:text-red-400 transition-colors py-2 cursor-pointer w-full" /></div> : <LogOut/>}
                    </SidebarBody>

                    <main className="flex-1 w-full p-4">{children}</main>
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
                className="font-medium text-black dark:text-white whitespace-pre"
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
