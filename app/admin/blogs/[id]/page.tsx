'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BlogPost } from '@/lib/db/blogs'
import ImageUpload from '@/components/ImageUpload'
import RichTextEditor from '@/components/RichTextEditor'
import { use } from 'react'

export default function EditBlogPost({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<BlogPost | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blogs/${resolvedParams.id}`)
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Blog post not found')
          }
          throw new Error('Failed to fetch blog post')
        }
        const data = await response.json()
        setFormData(data)
      } catch (err) {
        console.error('Error fetching blog post:', err)
        setError(err instanceof Error ? err.message : 'Failed to load blog post')
      }
    }

    fetchPost()
  }, [resolvedParams.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setIsLoading(true)

    try {
      const response = await fetch(`/api/blogs/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          publishedAt: formData.status === 'published' 
            ? formData.publishedAt || new Date().toISOString()
            : null,
        }),
      })

      if (!response.ok) throw new Error('Failed to update blog post')
      
      router.push('/admin/blogs')
      router.refresh()
    } catch (error) {
      console.error('Error updating blog post:', error)
      alert('Failed to update blog post')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!formData) return
    const { name, value } = e.target
    setFormData(prev => prev ? ({ ...prev, [name]: value }) : null)
  }

  const handleStatusChange = (value: string) => {
    if (!formData) return
    setFormData(prev => prev ? ({
      ...prev,
      status: value as 'draft' | 'published',
      publishedAt: value === 'published' ? prev.publishedAt || new Date().toISOString() : null
    }) : null)
  }

  const handleTagsChange = (value: string) => {
    if (!formData) return
    const tags = value.split(',').map(tag => tag.trim()).filter(Boolean)
    setFormData(prev => prev ? ({ ...prev, tags }) : null)
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <div className="mt-4 space-x-4">
          <Button onClick={() => router.push('/admin/blogs')}>
            Back to Blog Posts
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!formData) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/blogs">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Blog Post</h1>
          <p className="text-sm text-muted-foreground">
            Edit an existing blog post
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter post title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              placeholder="Enter a brief excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData(prev => prev ? ({ ...prev, content }) : null)}
              placeholder="Write your blog post content..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              name="author"
              placeholder="Enter author name"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              name="tags"
              placeholder="Enter tags (comma separated)"
              value={formData.tags.join(', ')}
              onChange={(e) => handleTagsChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Cover Image</Label>
            <ImageUpload
              value={formData.coverImage}
              onChange={(url) => setFormData(prev => prev ? ({ ...prev, coverImage: url }) : null)}
              onRemove={() => setFormData(prev => prev ? ({ ...prev, coverImage: '' }) : null)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
          <Link href="/admin/blogs">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  )
} 