'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { ArrowUpRight } from 'lucide-react'

interface BlogCardProps {
  title: string
  excerpt: string
  coverImage: string
  author: string
  publishedAt: string
  slug: string
  tags: string[]
}

export default function BlogCard({
  title,
  excerpt,
  coverImage,
  author,
  publishedAt,
  slug,
  tags
}: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Link href={`/blog/${slug}`}>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#2E7D32]/20 hover:border-[#2E7D32]/40 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
          {/* Image */}
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-medium text-[#2E7D32] bg-[#2E7D32]/10 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-[#1A1C1B] group-hover:text-[#2E7D32] transition-colors line-clamp-2">
              {title}
            </h3>

            {/* Excerpt */}
            <p className="text-[#2C302E] text-sm line-clamp-2">
              {excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-[#2C302E]">
                <span className="font-medium">{author}</span>
                <span className="mx-2">•</span>
                <span>{format(new Date(publishedAt), 'MMM d, yyyy')}</span>
              </div>
              <div className="text-[#2E7D32]">
                <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
} 