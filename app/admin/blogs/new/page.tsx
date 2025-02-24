'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, AlertCircle, Clock, FileText, User, Tags, Image as ImageIcon, Eye } from 'lucide-react'
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
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import ImageUpload from '@/components/ImageUpload'
import RichTextEditor from '@/components/RichTextEditor'
import { cn } from '@/lib/utils'
import { Badge } from "@/components/ui/badge"

const AUTOSAVE_INTERVAL = 30000 // 30 seconds

interface BlogFormData {
  title: string
  excerpt: string
  content: string
  author: string
  tags: string
  coverImage: string
  status: 'draft' | 'published'
}

interface FormErrors {
  title?: string
  excerpt?: string
  content?: string
  author?: string
  coverImage?: string
}

export default function NewBlogPost() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [previewMode, setPreviewMode] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    tags: '',
    coverImage: '',
    status: 'draft' as 'draft' | 'published',
  })

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('blogDraft')
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft)
        setFormData(parsedDraft)
        toast({
          title: "Draft Restored",
          description: "Your previous draft has been restored.",
        })
      } catch (error) {
        console.error('Error loading draft:', error)
      }
    }
  }, [toast])

  // Autosave to localStorage
  const handleAutosave = useCallback(() => {
    if (formData.title || formData.content) {
      localStorage.setItem('blogDraft', JSON.stringify(formData))
      setLastSaved(new Date())
      setIsSaving(false)
      
      // Show toast notification for autosave
      toast({
        title: "Draft Saved",
        description: "Your draft has been automatically saved.",
        duration: 2000,
      })
    }
  }, [formData, toast])

  useEffect(() => {
    const interval = setInterval(handleAutosave, AUTOSAVE_INTERVAL)
    return () => clearInterval(interval)
  }, [handleAutosave])

  // Real-time validation
  const validateFields = useCallback(() => {
    const newErrors: FormErrors = {}
    
    // Only validate fields that have been touched
    if (formData.title) {
      if (formData.title.trim().length === 0) {
        newErrors.title = 'Title is required'
      } else if (formData.title.trim().length < 5) {
        newErrors.title = 'Title is too short'
      }
    }

    if (formData.excerpt) {
      if (formData.excerpt.trim().length === 0) {
        newErrors.excerpt = 'Excerpt is required'
      } else if (formData.excerpt.trim().length < 10) {
        newErrors.excerpt = 'Excerpt is too short'
      }
    }

    if (formData.content) {
      if (formData.content.trim().length === 0) {
        newErrors.content = 'Content is required'
      } else if (formData.content.trim().length < 50) {
        newErrors.content = 'Content is too short'
      }
    }

    if (formData.author) {
      if (formData.author.trim().length === 0) {
        newErrors.author = 'Author is required'
      }
    }

    setErrors(newErrors)
  }, [formData])

  useEffect(() => {
    // Debounce validation to avoid excessive checks
    const timer = setTimeout(validateFields, 500)
    return () => clearTimeout(timer)
  }, [validateFields, toast])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title is too short'
    }
    
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required'
    } else if (formData.excerpt.trim().length < 10) {
      newErrors.excerpt = 'Excerpt is too short'
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    } else if (formData.content.trim().length < 50) {
      newErrors.content = 'Content is too short'
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required'
    }
    
    if (formData.status === 'published' && !formData.coverImage) {
      newErrors.coverImage = 'Cover image is required for published posts'
    }

    setErrors(newErrors)
    
    if (Object.keys(newErrors).length > 0) {
      // Scroll to the first error
      const firstErrorField = Object.keys(newErrors)[0]
      const element = document.getElementById(firstErrorField)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.focus()
      }
      
      // Show toast with error summary
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: `Please fix the following: ${Object.values(newErrors).join(', ')}`,
      })
    }
    
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          publishedAt: formData.status === 'published' ? new Date().toISOString() : null,
        }),
      })

      if (!response.ok) throw new Error('Failed to create blog post')
      
      // Clear draft from localStorage
      localStorage.removeItem('blogDraft')
      
      toast({
        title: "Success!",
        description: "Blog post created successfully.",
      })
      
      router.push('/admin/blogs')
      router.refresh()
    } catch (error) {
      console.error('Error creating blog post:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create blog post. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setIsSaving(true)
    
    // Show saving indicator
    toast({
      title: "Saving...",
      description: "Your changes are being saved.",
      duration: 1000,
    })
  }

  const handleDiscard = () => {
    if (confirm('Are you sure you want to discard this draft? This action cannot be undone.')) {
      localStorage.removeItem('blogDraft')
      router.push('/admin/blogs')
    }
  }

  // Function to handle preview in new tab
  const handlePreviewInNewTab = useCallback(() => {
    // Create a new HTML document with the preview content
    const previewHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${formData.title || 'Blog Preview'}</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; }
          .prose { max-width: 65ch; margin: 0 auto; }
          .prose img { max-width: 100%; height: auto; }
          .prose h1 { font-size: 2.25rem; margin-top: 0; }
          .prose p { margin-bottom: 1.5em; }
        </style>
      </head>
      <body class="bg-gray-50">
        <div class="max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-8 my-8">
          ${formData.coverImage ? `<img src="${formData.coverImage}" alt="${formData.title}" class="w-full h-96 object-cover rounded-lg mb-8">` : ''}
          <div class="prose prose-green">
            <h1>${formData.title || 'Untitled Post'}</h1>
            ${formData.author ? `<div class="flex items-center text-sm text-gray-500 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>By ${formData.author}</span>
            </div>` : ''}
            ${formData.excerpt ? `<div class="bg-gray-50 p-4 rounded-lg mb-8 italic">${formData.excerpt}</div>` : ''}
            ${formData.content || '<p>No content yet</p>'}
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Open a new window with the preview
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(previewHTML);
      previewWindow.document.close();
    }
  }, [formData]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b w-full shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center space-x-3 md:space-x-4">
            <Link href="/admin/blogs">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="max-w-[200px] sm:max-w-none">
              <h1 className="text-lg md:text-xl font-bold leading-tight truncate">New Blog Post</h1>
              <p className="text-xs md:text-sm text-muted-foreground truncate">Create and publish your blog post</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            {isSaving ? (
              <div className="hidden sm:flex items-center gap-1 text-sm text-amber-600 px-3 py-1 bg-amber-50 rounded-full border border-amber-200">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Saving...</span>
              </div>
            ) : lastSaved ? (
              <div className="hidden sm:flex items-center gap-1 text-sm text-green-600 px-3 py-1 bg-green-50 rounded-full border border-green-200">
                <Clock className="w-3 h-3" />
                <span>Saved {lastSaved.toLocaleTimeString()}</span>
              </div>
            ) : null}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handlePreviewInNewTab}
                      className="hidden md:flex"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Preview in new tab</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      {/* Form validation summary */}
      {Object.keys(errors).length > 0 && (
        <div className="container mt-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Validation Errors</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field} className="mt-1">
                    <button 
                      className="underline focus:outline-none hover:text-destructive-foreground"
                      onClick={() => {
                        const element = document.getElementById(field)
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                          element.focus()
                        }
                      }}
                    >
                      {error}
                    </button>
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {previewMode ? (
        <div className="container py-8" ref={previewRef}>
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
            <div className="prose prose-green max-w-none">
              {formData.coverImage && (
                <img 
                  src={formData.coverImage} 
                  alt={formData.title} 
                  className="w-full h-[400px] object-cover rounded-lg mb-8"
                />
              )}
              <h1 className="text-3xl font-bold mb-4">{formData.title || 'Untitled Post'}</h1>
              {formData.author && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                  <User className="w-4 h-4" />
                  <span>By {formData.author}</span>
                </div>
              )}
              {formData.tags && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {formData.tags.split(',').map((tag, index) => (
                    tag.trim() && (
                      <Badge key={index} variant="outline" className="bg-green-50">
                        {tag.trim()}
                      </Badge>
                    )
                  ))}
                </div>
              )}
              {formData.excerpt && (
                <div className="bg-gray-50 p-4 rounded-lg mb-8 italic">
                  {formData.excerpt}
                </div>
              )}
              <div dangerouslySetInnerHTML={{ __html: formData.content || '<p>No content yet</p>' }} />
            </div>
            <div className="mt-8 flex justify-center">
              <Button onClick={() => setPreviewMode(false)}>
                Return to Editor
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="container py-6">
          {/* Quick Actions Bar */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-medium">Edit Your Blog Post</h2>
            <div className="flex gap-2">
              <Button 
                type="submit" 
                form="blog-form" 
                disabled={isLoading} 
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {formData.status === 'published' ? 'Publish Post' : 'Save Draft'}
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleDiscard}
              >
                Discard Draft
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Form */}
            <Card className="lg:col-span-2 order-2 lg:order-1">
              <CardHeader className="pb-3">
                <CardTitle>Blog Content</CardTitle>
                <CardDescription>Write and format your blog post content</CardDescription>
              </CardHeader>
              <CardContent>
                <form id="blog-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className={cn("text-base font-medium", errors.title && "text-destructive")}>
                      <FileText className="w-4 h-4 inline-block mr-2" />
                      Title {errors.title && <span className="text-[13px] ml-2 font-normal">({errors.title})</span>}
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter an engaging title"
                      value={formData.title}
                      onChange={handleChange}
                      className={cn("text-lg", errors.title && "border-destructive")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt" className={cn("text-base font-medium", errors.excerpt && "text-destructive")}>
                      <FileText className="w-4 h-4 inline-block mr-2" />
                      Excerpt {errors.excerpt && <span className="text-[13px] ml-2 font-normal">({errors.excerpt})</span>}
                    </Label>
                    <Textarea
                      id="excerpt"
                      name="excerpt"
                      placeholder="Write a compelling summary"
                      value={formData.excerpt}
                      onChange={handleChange}
                      className={cn(errors.excerpt && "border-destructive")}
                    />
                    <p className="text-xs text-muted-foreground">
                      A brief summary that appears in blog listings and search results
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content" className={cn("text-base font-medium", errors.content && "text-destructive")}>
                      <FileText className="w-4 h-4 inline-block mr-2" />
                      Content {errors.content && <span className="text-[13px] ml-2 font-normal">({errors.content})</span>}
                    </Label>
                    <div className={cn("rounded-lg border", errors.content && "border-destructive")}>
                      <RichTextEditor
                        content={formData.content}
                        onChange={(content) => {
                          setFormData(prev => ({ ...prev, content }))
                          setIsSaving(true)
                          if (errors.content) {
                            setErrors(prev => ({ ...prev, content: undefined }))
                          }
                        }}
                        placeholder="Write your blog post content..."
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Sidebar */}
            <div className="space-y-6 order-1 lg:order-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Publishing</CardTitle>
                  <CardDescription>Manage your post settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-base font-medium">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => {
                        setFormData(prev => ({ ...prev, status: value as 'draft' | 'published' }))
                        setIsSaving(true)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">
                          <span className="flex items-center gap-2">
                            <Badge variant="outline">Draft</Badge>
                            Save as a draft
                          </span>
                        </SelectItem>
                        <SelectItem value="published">
                          <span className="flex items-center gap-2">
                            <Badge variant="default">Published</Badge>
                            Publish immediately
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author" className={cn("text-base font-medium", errors.author && "text-destructive")}>
                      <User className="w-4 h-4 inline-block mr-2" />
                      Author {errors.author && <span className="text-[13px] ml-2 font-normal">({errors.author})</span>}
                    </Label>
                    <Input
                      id="author"
                      name="author"
                      placeholder="Enter author name"
                      value={formData.author}
                      onChange={handleChange}
                      className={cn(errors.author && "border-destructive")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-base font-medium">
                      <Tags className="w-4 h-4 inline-block mr-2" />
                      Tags
                    </Label>
                    <Input
                      id="tags"
                      name="tags"
                      placeholder="Environment, Sustainability..."
                      value={formData.tags}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Separate tags with commas
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className={cn("text-base font-medium", errors.coverImage && "text-destructive")}>
                      <ImageIcon className="w-4 h-4 inline-block mr-2" />
                      Cover Image {errors.coverImage && <span className="text-[13px] ml-2 font-normal">({errors.coverImage})</span>}
                    </Label>
                    <ImageUpload
                      value={formData.coverImage}
                      onChange={(url) => {
                        setFormData(prev => ({ ...prev, coverImage: url }))
                        setIsSaving(true)
                        if (errors.coverImage) {
                          setErrors(prev => ({ ...prev, coverImage: undefined }))
                        }
                      }}
                      onRemove={() => {
                        setFormData(prev => ({ ...prev, coverImage: '' }))
                        setIsSaving(true)
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Recommended size: 1200×630px
                    </p>
                  </div>

                  {formData.status === 'published' && !formData.coverImage && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Cover Image Required</AlertTitle>
                      <AlertDescription>
                        A cover image is required when publishing a blog post.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 