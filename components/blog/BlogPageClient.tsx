'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Book, Search, Tag, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import BlogCard from '@/components/blog/BlogCard'
import { Button } from '@/components/ui/button'
import { BlogPost, PaginatedResult } from '@/lib/db/blogs'

interface BlogPageClientProps {
  initialPosts: BlogPost[]
  initialMetadata: PaginatedResult<BlogPost>['metadata']
}

export default function BlogPageClient({ initialPosts, initialMetadata }: BlogPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [allTags, setAllTags] = useState<string[]>(
    Array.from(new Set(initialPosts.flatMap(post => post.tags)))
  )
  const [nextToken, setNextToken] = useState<string | undefined>(initialMetadata.nextToken)
  const [prevTokens, setPrevTokens] = useState<string[]>([])
  const [totalPosts, setTotalPosts] = useState(initialMetadata.total)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchPosts = async (token?: string) => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      params.append('status', 'published')
      if (token) params.append('nextToken', token)
      params.append('limit', '9')

      const response = await fetch(`/api/blogs?${params}`)
      if (!response.ok) throw new Error('Failed to fetch blog posts')
      const data = await response.json()
      setPosts(data.items)
      setNextToken(data.metadata.nextToken)
      setTotalPosts(data.metadata.total)

      // Extract unique tags from all posts
      const tags = Array.from(new Set(
        data.items.flatMap((post: BlogPost) => post.tags)
      )) as string[]
      setAllTags(tags)
    } catch (err) {
      console.error('Error fetching blog posts:', err)
      setError('Failed to load blog posts')
    } finally {
      setIsLoading(false)
    }
  }

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

  // Filter posts based on search query and selected tag
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true
    
    return matchesSearch && matchesTag
  })

  const totalPages = Math.ceil(totalPosts / 9)

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-[#2E7D32] hover:underline"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-[#2E7D32]/10 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div 
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="inline-block"
            >
              <div className="px-4 py-1 bg-[#2E7D32]/5 backdrop-blur-sm border border-[#2E7D32]/20 rounded-full shadow-sm hover:shadow transition-all duration-300">
                <div className="inline-flex items-center gap-2">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Book className="w-4 h-4 text-[#2E7D32]" />
                  </motion.div>
                  <span className="text-[#2E7D32] text-sm font-medium">Our Blog</span>
                </div>
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1A1C1B] mt-6 mb-4">
              Insights & <span className="text-[#2E7D32]">Knowledge</span>
            </h1>
            <p className="text-xl text-[#2C302E] max-w-2xl mx-auto">
              Stay updated with the latest trends, insights, and best practices in environmental consulting and sustainability.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 border-b border-neutral-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full md:w-96 group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2E7D32] opacity-50 group-hover:opacity-100 transition-opacity duration-200">
                <Search className="w-full h-full" />
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#2E7D32]/5 border border-[#2E7D32]/20 rounded-xl 
                  placeholder:text-[#2E7D32]/50 text-[#2C302E] 
                  focus:bg-white focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32]/20 
                  outline-none transition-all duration-200
                  hover:border-[#2E7D32]/30 hover:bg-[#2E7D32]/10"
              />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 items-center">
              <div className="text-[#2E7D32]/70">
                <Tag className="w-4 h-4" />
              </div>
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                  ${!selectedTag 
                    ? 'bg-[#2E7D32] text-white shadow-sm shadow-[#2E7D32]/20' 
                    : 'bg-[#2E7D32]/5 text-[#2E7D32] hover:bg-[#2E7D32]/10 border border-[#2E7D32]/20'
                  }`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                    ${selectedTag === tag 
                      ? 'bg-[#2E7D32] text-white shadow-sm shadow-[#2E7D32]/20' 
                      : 'bg-[#2E7D32]/5 text-[#2E7D32] hover:bg-[#2E7D32]/10 border border-[#2E7D32]/20'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <BlogCard
                    key={post.id}
                    title={post.title}
                    excerpt={post.excerpt}
                    coverImage={post.coverImage}
                    author={post.author}
                    publishedAt={post.publishedAt || new Date().toISOString()}
                    slug={post.slug}
                    tags={post.tags}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="mt-12 flex items-center justify-between">
                <div className="text-sm text-[#2C302E]">
                  Showing {(currentPage - 1) * 9 + 1} to {Math.min(currentPage * 9, totalPosts)} of {totalPosts} articles
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32]/5"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!nextToken}
                    className="border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32]/5"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-neutral-600 text-lg">No articles found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedTag(null)
                }}
                className="mt-4 inline-flex items-center gap-2 text-[#2E7D32] hover:underline"
              >
                Clear filters
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
} 