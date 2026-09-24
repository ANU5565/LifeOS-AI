import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "LifeOS AI",
  description:
    "Privacy-first personal context intelligence that helps you understand your life and act on what matters.",
  applicationName: "LifeOS AI",
  keywords: ["personal context intelligence", "AI assistant", "privacy", "productivity"],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "LifeOS AI",
    description:
      "Privacy-first personal context intelligence that helps you understand your life and act on what matters.",
    siteName: "LifeOS AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "LifeOS AI",
    description:
      "Privacy-first personal context intelligence that helps you understand your life and act on what matters.",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#09090b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="dark">
      <body className="lifeos-app-shell">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
