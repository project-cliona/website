import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { UserProvider } from "@/providers/userProvider";
import { Toaster } from "@/components/ui/Toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Squalto - AI-First WhatsApp & RCS Engagement Platform",
  description: "Automate conversations, grow sales, and support customers with AI across WhatsApp & RCS. Official WhatsApp Business API partner with enterprise-grade messaging capabilities.",
  metadataBase: new URL("https://squalto.com"),
  icons: {
    icon: [
      { url: "/logo-mark.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Squalto",
    description: "AI-First WhatsApp & RCS Engagement Platform",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Squalto",
    description: "AI-First WhatsApp & RCS Engagement Platform",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#4F46E5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <QueryProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
