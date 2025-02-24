import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Oikos Consultants",
    template: "%s | Oikos Consultants"
  },
  description: "Leading environmental consulting firm specializing in BRSR compliance, sustainability solutions, biodiversity conservation, and ecological services across India.",
  keywords: "environmental consulting, sustainability, BRSR compliance, biodiversity conservation, ecological services",
  authors: [{ name: "Oikos Consultants" }],
  creator: "Oikos Consultants",
  publisher: "Oikos Consultants",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: {
      default: "Oikos Consultants",
      template: "%s | Oikos Consultants"
    },
    description: "Leading environmental consulting firm specializing in BRSR compliance, sustainability solutions, biodiversity conservation, and ecological services across India.",
    siteName: "Oikos Consultants",
    images: [{
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "Oikos Consultants"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "Oikos Consultants",
      template: "%s | Oikos Consultants"
    },
    description: "Leading environmental consulting firm specializing in BRSR compliance, sustainability solutions, biodiversity conservation, and ecological services across India.",
    images: ["/og-image.jpg"],
    creator: "@OikosConsultants",
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
}

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
        {children}
        <Toaster />
      </body>
    </html>
  )
}
