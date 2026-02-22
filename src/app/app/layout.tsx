"use client";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { appLinks, rcsLinks } from "@/lib/sidebarLinks";
import ProtectedRoute from "@/components/ProtectedRoute";
import LogoutButton from "@/components/LogoutButton";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const isRcsRoute = pathname.startsWith("/app/rcs");

    const links = isRcsRoute ? rcsLinks : appLinks;

    return (
        <ProtectedRoute>
            <Sidebar open={open} setOpen={setOpen}>
                <div className="flex">
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

                        <LogoutButton className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:text-red-600 dark:hover:text-red-400 transition-colors py-2 cursor-pointer w-full" />
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
