'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderKanban, FileText } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome to your admin dashboard. Manage your projects and blog posts.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/admin/projects">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-[#2E7D32]" />
                Projects
              </CardTitle>
              <CardDescription>
                Manage your projects and their locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Add, edit, or remove projects. Update project status and details.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/blogs">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#2E7D32]" />
                Blog Posts
              </CardTitle>
              <CardDescription>
                Manage your blog content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Create, edit, or delete blog posts. Manage blog media and categories.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
} 