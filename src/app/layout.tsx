import type { Metadata } from "next";
import '../styles/globals.css';
import '../styles/solarSystem.css';
import { siteConfig } from "@/config/site";
import { Press_Start_2P } from 'next/font/google';
import GlobalShootingStars from "@/components/GlobalShootingStars";
import StructuredData from "@/components/StructuredData";
import GlobalAudio from '@/components/GlobalAudio';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.profile.name}`
  },
  description: siteConfig.profile.summary,
  keywords: [
    "Dinesh",
    "AI Enthusiast",
    "Machine Learning",
    "Data Science",
    "Portfolio",
    "Developer",
    "AI Engineer",
    "Data Scientist",
    "B.Tech AI & Data Science",
    "DMI College",
    "Free Fire Gamer",
    "AI in Healthcare",
    "AI in Education",
    "AI in Gaming"
  ],
  authors: [{ name: siteConfig.profile.name }],
  creator: siteConfig.profile.name,
  publisher: siteConfig.profile.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://your-portfolio-domain.com'), // Replace with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-portfolio-domain.com', // Replace with your actual domain
    title: siteConfig.name,
    description: siteConfig.profile.summary,
    siteName: siteConfig.name,
    images: [
      {
        url: '/og-image.jpg', // You'll need to create this image
        width: 1200,
        height: 630,
        alt: `${siteConfig.profile.name} - AI Enthusiast & Data Science Portfolio`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.profile.summary,
    images: ['/og-image.jpg'], // You'll need to create this image
    creator: '@your_twitter_handle', // Replace with your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code', // Replace with your Google verification code
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [{ url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' }],
    shortcut: ['/favicon.ico'],
  },
};

const pressStart2P = Press_Start_2P({
  subsets: ['latin'], // This font only supports latin
  weight: '400', // This is the only available weight
  display: 'swap',
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={pressStart2P.className}>
      <head>
        <StructuredData />
      </head>
      <body
        className="minecraft-world bg-green-200 font-pixel min-h-screen text-gray-800"
      >
        <GlobalShootingStars />
        <GlobalAudio />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
