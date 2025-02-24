'use client'

import { usePathname } from 'next/navigation'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isSignInPage = pathname === '/auth/sign-in'

  if (isSignInPage) {
    return children
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 mt-24">
        {children}
      </main>
    </div>
  )
} 