import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react'
import { getBlogBySlug } from '@/lib/db/blogs'
import { generateBlogMetadata } from '@/lib/seo'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const post = await getBlogBySlug(resolvedParams.slug)
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }

  return generateBlogMetadata({
    title: post.title,
    description: post.excerpt,
    image: post.coverImage,
    publishedTime: post.publishedAt || undefined,
    modifiedTime: post.updatedAt,
    tags: post.tags,
    author: post.author,
  })
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params
  const post = await getBlogBySlug(resolvedParams.slug)

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Blog post not found</p>
          <Link href="/blog" className="text-[#2E7D32] hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px]">
        {/* Cover Image */}
        <div className="absolute inset-0">
          <Image
            src={post.coverImage || '/images/placeholder.jpg'}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            {/* Back Button */}
            <Link href="/blog">
              <button className="mb-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Blog</span>
              </button>
            </Link>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(post.publishedAt || post.createdAt), 'MMMM d, yyyy')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Excerpt */}
            <div className="text-xl text-[#2C302E] mb-8 pb-8 border-b">
              {post.excerpt}
            </div>

            {/* Content */}
            <article className="prose prose-lg max-w-none prose-headings:text-[#1A1C1B] prose-p:text-[#2C302E] prose-a:text-[#2E7D32] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#1A1C1B]">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t flex items-center gap-4">
              <Tag className="w-5 h-5 text-[#2E7D32]" />
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#2E7D32]/5 text-[#2E7D32] rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 