"use client";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { appLinks, rcsLinks } from "@/lib/sidebarLinks";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const isRcsRoute = pathname.startsWith("/app/rcs");

    const links = isRcsRoute ? rcsLinks : appLinks;

    return (
        <ProtectedRoute>
            <Sidebar open={open} setOpen={setOpen}>
                <div className="flex">
                    <SidebarBody className="space-y-4">
                        <div>{open ? <Logo /> : <LogoIcon />}</div>

                        {links.map((link) => (
                            <SidebarLink
                                key={link.href}
                                link={link}
                                className="font-medium"
                            />
                        ))}
                    </SidebarBody>

                    <main className="flex-1 p-4">{children}</main>
                </div>
            </Sidebar>
        </ProtectedRoute>
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
