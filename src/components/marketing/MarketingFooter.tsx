import Image from "next/image";
import Link from "next/link";
import { C, FEATURES } from "@/lib/marketing";

const footerLinks: Record<string, { label: string; href: string }[]> = {
  Features: FEATURES.map((f) => ({ label: f.navTitle, href: `/features/${f.slug}` })),
  Company: [
    { label: "About", href: "/#about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/#contact" },
  ],
  Resources: [
    { label: "Blog", href: "/blog" },
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Status", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export function MarketingFooter() {
  return (
    <footer id="contact" style={{ backgroundColor: C.darkBg }}>
      <div
        className="max-w-7xl mx-auto px-6 py-14 border-t"
        style={{ borderColor: C.darkBorder }}
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Image src="/logo-wordmark.svg" alt="Squalto" width={120} height={28} />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-[180px]">
              AI-powered WhatsApp &amp; RCS messaging for modern businesses.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
                {section}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t text-xs text-gray-500"
          style={{ borderColor: C.darkBorder }}
        >
          <p>&copy; {new Date().getFullYear()} Squalto. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
