import type { Metadata } from "next";

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