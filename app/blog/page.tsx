'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Book, Search, Tag, ArrowRight } from 'lucide-react'
import BlogCard from '@/components/blog/BlogCard'

// Temporary mock data - will be replaced with DynamoDB data
const mockPosts = [
  {
    title: 'Understanding BRSR: A Comprehensive Guide for Indian Companies',
    excerpt: 'Learn about the key components of Business Responsibility and Sustainability Reporting (BRSR) and how it impacts Indian businesses.',
    coverImage: '/images/blog/brsr-guide.jpg',
    author: 'Dr. Rajesh Kumar',
    publishedAt: '2024-03-15',
    slug: 'understanding-brsr-guide',
    tags: ['BRSR', 'Sustainability', 'Compliance']
  },
  {
    title: 'Biodiversity Conservation: Best Practices for Corporate India',
    excerpt: 'Discover how Indian corporations can contribute to biodiversity conservation while maintaining business growth.',
    coverImage: '/images/blog/biodiversity-conservation.jpg',
    author: 'Dr. Priya Sharma',
    publishedAt: '2024-03-10',
    slug: 'biodiversity-conservation-best-practices',
    tags: ['Biodiversity', 'Conservation', 'Corporate']
  },
  {
    title: 'The Impact of GHG Inventorisation on Climate Change Mitigation',
    excerpt: 'An in-depth look at how GHG inventorisation helps organizations reduce their carbon footprint.',
    coverImage: '/images/blog/ghg-impact.jpg',
    author: 'Dr. Arun Patel',
    publishedAt: '2024-03-05',
    slug: 'ghg-inventorisation-impact',
    tags: ['GHG', 'Climate Change', 'Sustainability']
  }
]

// Get unique tags from posts
const allTags = Array.from(new Set(mockPosts.flatMap(post => post.tags)))

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Filter posts based on search query and selected tag
  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true
    return matchesSearch && matchesTag
  })

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <BlogCard key={post.slug} {...post} />
              ))}
            </div>
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