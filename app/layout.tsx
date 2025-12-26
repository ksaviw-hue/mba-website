import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Elite Basketball Association",
  description: "Official website of the Elite Basketball Association - The Most Competitive Roblox basketball league",
  icons: {
    icon: '/logo.png',
  },
  metadataBase: new URL('https://ebassociation.com'),
  openGraph: {
    title: "Elite Basketball Association",
    description: "Official website of the Elite Basketball Association - The Most Competitive Roblox basketball league",
    url: 'https://ebassociation.com',
    siteName: 'Elite Basketball Association',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'EBA Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Elite Basketball Association",
    description: "Official website of the Elite Basketball Association - Premier Roblox basketball league",
    images: ['/logo.png'],
  },
  themeColor: '#3B82F6',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <Navigation />
            <main className="min-h-screen">
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
