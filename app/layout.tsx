import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import AccessibilityProvider from "./components/AccessibilityProvider";
import BackToTop from "@/components/BackToTop";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Oikos Consultants - Environmental Consulting & Sustainability Solutions",
  description: "Leading environmental consulting firm specializing in BRSR compliance, sustainability solutions, biodiversity conservation, and ecological services across India.",
  keywords: "environmental consulting, sustainability, BRSR compliance, biodiversity conservation, ecological services, GHG inventory, wildlife conservation",
  authors: [{ name: "Akash Chitragar", url: "mailto:akash@webart4u.com" }],
  creator: "Oikos Consultants",
  publisher: "Oikos Consultants",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://oikosconsultants.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Oikos Consultants - Environmental Consulting & Sustainability Solutions',
    description: 'Leading environmental consulting firm specializing in BRSR compliance, sustainability solutions, biodiversity conservation, and ecological services across India.',
    url: 'https://oikosconsultants.com',
    siteName: 'Oikos Consultants',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Oikos Consultants - Environmental Solutions',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oikos Consultants - Environmental Consulting & Sustainability Solutions',
    description: 'Leading environmental consulting firm specializing in BRSR compliance, sustainability solutions, and ecological services.',
    images: ['/images/twitter-image.jpg'],
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
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2E7D32" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={inter.className}>
        <AccessibilityProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main id="main-content" className="flex-grow" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </div>
          <BackToTop />
          <Toaster />
        </AccessibilityProvider>
      </body>
    </html>
  );
}
