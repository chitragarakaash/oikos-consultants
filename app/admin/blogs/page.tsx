'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Search, FileText, Trash2, Edit, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { BlogPost } from '@/lib/db/blogs'

const ITEMS_PER_PAGE = 10

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nextToken, setNextToken] = useState<string | undefined>()
  const [prevTokens, setPrevTokens] = useState<string[]>([])
  const [totalPosts, setTotalPosts] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchPosts = async (token?: string) => {
    try {
      const params = new URLSearchParams()
      if (token) params.append('nextToken', token)
      params.append('limit', ITEMS_PER_PAGE.toString())

      const response = await fetch(`/api/blogs?${params}`)
      if (!response.ok) throw new Error('Failed to fetch blog posts')
      const data = await response.json()
      setPosts(data.items)
      setNextToken(data.metadata.nextToken)
      setTotalPosts(data.metadata.total)
    } catch (err) {
      console.error('Error fetching blog posts:', err)
      setError('Failed to load blog posts')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleNextPage = () => {
    if (nextToken) {
      setPrevTokens([...prevTokens, nextToken])
      setCurrentPage(currentPage + 1)
      fetchPosts(nextToken)
    }
  }

  const handlePrevPage = () => {
    if (prevTokens.length > 0) {
      const newPrevTokens = [...prevTokens]
      const prevToken = newPrevTokens.pop()
      setPrevTokens(newPrevTokens)
      setCurrentPage(currentPage - 1)
      fetchPosts(prevToken)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete blog post')

      // Refresh the current page
      fetchPosts(prevTokens[prevTokens.length - 1])
    } catch (err) {
      console.error('Error deleting blog post:', err)
      alert('Failed to delete blog post')
    }
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(totalPosts / ITEMS_PER_PAGE)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage your blog content
          </p>
        </div>
        <Link href="/admin/blogs/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Search and Pagination Info */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalPosts)} of {totalPosts} posts
        </div>
      </div>

      {/* Blog Posts Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  {searchQuery ? 'No posts found matching your search' : 'No blog posts yet'}
                </TableCell>
              </TableRow>
            ) : (
              filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      {post.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status}
                    </div>
                  </TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>{format(new Date(post.createdAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    {post.publishedAt 
                      ? format(new Date(post.publishedAt), 'MMM d, yyyy')
                      : '—'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/blogs/${post.id}`}>
                        <Button variant="ghost" size="icon" title="Edit">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        <Button variant="ghost" size="icon" title="View">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!nextToken}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
} 