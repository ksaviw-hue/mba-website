import type { Metadata } from "next";
import { Press_Start_2P } from 'next/font/google';
import "./globals.css";
import Navigation from "@/components/Navigation";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

// Using Press Start 2P as Minecraft-style font
const minecraftFont = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-minecraft',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Minecraft Basketball Association",
  description: "Official website of the Minecraft Basketball Association - The Most Competitive Minecraft basketball league",
  icons: {
    icon: '/logo.png',
  },
  metadataBase: new URL('https://mbaassociation.com'),
  openGraph: {
    title: "Minecraft Basketball Association",
    description: "Official website of the Minecraft Basketball Association - The Most Competitive Minecraft basketball league",
    url: 'https://mbaassociation.com',
    siteName: 'Minecraft Basketball Association',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'MBA Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Minecraft Basketball Association",
    description: "Official website of the Minecraft Basketball Association - Premier Minecraft basketball league",
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
      <body className={minecraftFont.variable}>
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

