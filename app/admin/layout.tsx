'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LogOut, LayoutDashboard, FolderKanban, FileText } from 'lucide-react'
import { isAuthenticated, signOut } from '@/lib/auth'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/auth/sign-in')
    }
  }, [router])

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#2E7D32] border-r-2"></div>
      </div>
    )
  }

  const handleSignOut = () => {
    signOut()
    router.replace('/auth/sign-in')
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A1F14] text-white fixed h-full">
        <div className="p-6">
          <Link href="/admin" className="block mb-8">
            <div className="relative w-40 h-12">
              <Image
                src="/main-white.png"
                alt="Oikos Consultants Logo"
                fill
                sizes="160px"
                priority
                style={{ objectFit: 'contain' }}
              />
            </div>
          </Link>
          <nav className="space-y-2">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-2.5 text-neutral-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/admin/projects"
              className="flex items-center gap-3 px-4 py-2.5 text-neutral-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <FolderKanban size={18} />
              <span>Projects</span>
            </Link>
            <Link
              href="/admin/blogs"
              className="flex items-center gap-3 px-4 py-2.5 text-neutral-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <FileText size={18} />
              <span>Blogs</span>
            </Link>
          </nav>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-2.5 text-neutral-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors w-full"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen bg-gray-50">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
} 