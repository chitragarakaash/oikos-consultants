'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, FolderKanban, FileText, Plus, BarChart2, TrendingUp, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DashboardStats {
  totalProjects: number
  ongoingProjects: number
  totalPosts: number
  publishedPosts: number
}

interface RecentActivity {
  id: string
  type: 'project' | 'blog'
  action: string
  title: string
  timestamp: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    ongoingProjects: 0,
    totalPosts: 0,
    publishedPosts: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, postsRes] = await Promise.all([
          fetch('/api/projects/stats'),
          fetch('/api/blogs/stats')
        ])
        
        const projectsData = await projectsRes.json()
        const postsData = await postsRes.json()
        
        setStats({
          totalProjects: projectsData.total,
          ongoingProjects: projectsData.ongoing,
          totalPosts: postsData.total,
          publishedPosts: postsData.published
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    const fetchActivity = async () => {
      try {
        const res = await fetch('/api/activity')
        const data = await res.json()
        setRecentActivity(data)
      } catch (error) {
        console.error('Error fetching activity:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
    fetchActivity()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[#0A1F14]">Dashboard Overview</h1>
          <p className="mt-2 text-muted-foreground">
            Monitor your projects and content performance
          </p>
        </div>
        <div className="flex space-x-4">
          <Link href="/admin/projects/new">
            <Button className="bg-[#2E7D32] hover:bg-[#1B5E20]">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </Link>
          <Link href="/admin/blogs/new">
            <Button variant="outline" className="border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white">
              <FileText className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8 bg-[#E8F5E9] rounded-full" />
          <CardHeader>
            <CardTitle className="flex items-center text-sm font-medium">
              <BarChart2 className="w-4 h-4 mr-2 text-[#2E7D32]" />
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0A1F14]">{stats.totalProjects}</div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-1 text-[#2E7D32]" />
              <span className="text-[#2E7D32] font-medium">{stats.ongoingProjects} ongoing</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8 bg-[#E8F5E9] rounded-full" />
          <CardHeader>
            <CardTitle className="flex items-center text-sm font-medium">
              <FileText className="w-4 h-4 mr-2 text-[#2E7D32]" />
              Blog Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0A1F14]">{stats.totalPosts}</div>
            <div className="mt-2 flex items-center text-sm">
              <CheckCircle className="w-4 h-4 mr-1 text-[#2E7D32]" />
              <span className="text-[#2E7D32] font-medium">{stats.publishedPosts} published</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8 bg-[#E8F5E9] rounded-full" />
          <CardHeader>
            <CardTitle className="flex items-center text-sm font-medium">
              <Activity className="w-4 h-4 mr-2 text-[#2E7D32]" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0A1F14]">{recentActivity.length}</div>
            <div className="mt-2 flex items-center text-sm">
              <Clock className="w-4 h-4 mr-1 text-[#2E7D32]" />
              <span className="text-[#2E7D32] font-medium">Last 24 hours</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8 bg-[#E8F5E9] rounded-full" />
          <CardHeader>
            <CardTitle className="flex items-center text-sm font-medium">
              <AlertCircle className="w-4 h-4 mr-2 text-[#2E7D32]" />
              Pending Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0A1F14]">
              {stats.totalPosts - stats.publishedPosts}
            </div>
            <div className="mt-2 flex items-center text-sm">
              <FileText className="w-4 h-4 mr-1 text-[#2E7D32]" />
              <span className="text-[#2E7D32] font-medium">Draft posts</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Activity Section */}
      <div className="grid gap-6 md:grid-cols-6">
        {/* Quick Actions */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Frequently used actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/admin/projects" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <FolderKanban className="w-4 h-4 mr-2 text-[#2E7D32]" />
                  Manage Projects
                </Button>
              </Link>
              <Link href="/admin/blogs" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2 text-[#2E7D32]" />
                  Manage Blog Posts
                </Button>
              </Link>
              <Link href="/admin/projects/new" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2 text-[#2E7D32]" />
                  Create New Project
                </Button>
              </Link>
              <Link href="/admin/blogs/new" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2 text-[#2E7D32]" />
                  Write New Post
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Latest updates and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#2E7D32] border-r-2"></div>
                  </div>
                ) : recentActivity.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center">
                    <Activity className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No recent activity</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Activities will appear here as you make changes
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-2 rounded-full bg-[#E8F5E9]">
                            {activity.type === 'project' ? (
                              <FolderKanban className="w-4 h-4 text-[#2E7D32]" />
                            ) : (
                              <FileText className="w-4 h-4 text-[#2E7D32]" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">{activity.action}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <time className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleString()}
                          </time>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 