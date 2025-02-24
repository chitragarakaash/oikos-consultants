'use client'

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import AccessibilityProvider from "./components/AccessibilityProvider";
import BackToTop from "@/components/BackToTop";
import { usePathname } from 'next/navigation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isAuthOrAdmin = pathname?.startsWith('/auth') || pathname?.startsWith('/admin');

  return (
    <AccessibilityProvider>
      <div className="min-h-screen flex flex-col">
        {!isAuthOrAdmin && <Navbar />}
        <main id="main-content" className="flex-grow" tabIndex={-1}>
          {children}
        </main>
        {!isAuthOrAdmin && <Footer />}
      </div>
      {!isAuthOrAdmin && <BackToTop />}
      <Toaster />
    </AccessibilityProvider>
  );
} 