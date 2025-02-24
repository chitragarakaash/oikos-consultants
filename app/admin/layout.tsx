'use client'

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Settings, Home, FolderKanban, FileText, Loader2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [saving, setSaving] = useState(false)
  const pathname = usePathname()

  // Password state
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      toast({
        title: "Error",
        description: "All password fields are required.",
        variant: "destructive"
      })
      return
    }

    if (passwords.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "New password must be at least 8 characters long.",
        variant: "destructive"
      })
      return
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      })
      return
    }

    try {
      setSaving(true)
      
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update password")
      }

      // Clear the form
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })

      toast({
        title: "Success",
        description: "Password updated successfully. Please sign in with your new password.",
      })

      // Sign out the user and redirect to login
      await fetch("/api/auth/sign-out", { method: "POST" })
      window.location.href = "/auth/sign-in"

    } catch (error) {
      console.error("Error updating password:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update password. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  if (!mounted) {
    return null
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/projects", label: "Projects", icon: FolderKanban },
    { href: "/admin/blogs", label: "Blog Posts", icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white z-30 border-b border-gray-200">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/admin" className="flex items-center">
              <div className="relative w-[120px] h-8">
                <Image
                  src="/main-logo.png"
                  alt="Oikos Consultants Logo"
                  fill
                  sizes="120px"
                  priority
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </Link>
            <nav className="flex items-center gap-1 ml-8">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "text-[#2E7D32]"
                        : "text-gray-600 hover:text-[#2E7D32]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:text-red-600"
              onClick={async () => {
                try {
                  await fetch("/api/auth/sign-out", { method: "POST" })
                  window.location.href = "/auth/sign-in"
                } catch (error) {
                  toast({
                    title: "Error",
                    description: "Failed to sign out. Please try again.",
                    variant: "destructive"
                  })
                }
              }}
            >
              <LogOut className="h-5 w-5" />
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:text-[#2E7D32]"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Security Settings</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwords.currentPassword}
                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                        required
                        minLength={8}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                        required
                        minLength={8}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                        required
                        minLength={8}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={saving}
                    >
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Update password
                    </Button>
                  </form>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-16 min-h-screen">
        <div className="max-w-[1400px] mx-auto p-6">
          {children}
        </div>
      </main>

      {/* Background Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          opacity: 0.5
        }}
      />
    </div>
  )
} 