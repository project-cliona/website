"use client";

import {
  Sidebar,
  SidebarBody,
  SidebarBrand,
  SidebarLink,
  SidebarSection,
  useSidebar,
} from "@/components/ui/sidebar";
import { whatsappLinks } from "@/lib/sidebarLinks";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { UserDock } from "@/components/ui/UserDock";
import { TopBar } from "@/components/ui/TopBar";
import { SearchProvider } from "@/providers/searchProvider";

function SidebarInner() {
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <div className="flex flex-col h-full">
      <SidebarBrand collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
      <SidebarSection>
        {whatsappLinks.map((link) => (
          <SidebarLink key={link.href} link={link} />
        ))}
      </SidebarSection>
      <div className="flex-1" />
      <div className="pt-3 border-t border-border mt-3">
        <UserDock collapsed={collapsed} />
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <SearchProvider>
        <Sidebar>
          <div className="md:flex">
            <SidebarBody>
              <SidebarInner />
            </SidebarBody>
            <div className="flex-1 min-w-0 flex flex-col">
              <TopBar />
              <main className="flex-1 w-full px-6 py-6">{children}</main>
            </div>
          </div>
        </Sidebar>
      </SearchProvider>
    </ProtectedRoute>
  );
}
