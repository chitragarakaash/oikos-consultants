import { Metadata } from 'next'
import { listBlogs } from '@/lib/db/blogs'
import BlogPageClient from '@/components/blog/BlogPageClient'

export const metadata: Metadata = {
  title: 'Blog | Oikos Consultants',
  description: 'Stay updated with the latest trends, insights, and best practices in environmental consulting and sustainability.',
  openGraph: {
    title: 'Blog | Oikos Consultants',
    description: 'Stay updated with the latest trends, insights, and best practices in environmental consulting and sustainability.',
    type: 'website',
    url: 'https://oikos-consultants.com/blog',
    siteName: 'Oikos Consultants',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Oikos Consultants',
    description: 'Stay updated with the latest trends, insights, and best practices in environmental consulting and sustainability.',
  }
}

export default async function BlogPage() {
  const { items: initialPosts, metadata: initialMetadata } = await listBlogs({
    status: 'published',
    limit: 9
  })

  // Generate structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Oikos Consultants Blog',
    description: 'Stay updated with the latest trends, insights, and best practices in environmental consulting and sustainability.',
    url: 'https://oikos-consultants.com/blog',
    publisher: {
      '@type': 'Organization',
      name: 'Oikos Consultants',
      logo: {
        '@type': 'ImageObject',
        url: 'https://oikos-consultants.com/logo.png'
      }
    },
    blogPost: initialPosts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      author: {
        '@type': 'Person',
        name: post.author
      },
      datePublished: post.publishedAt,
      image: post.coverImage,
      url: `https://oikos-consultants.com/blog/${post.slug}`
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BlogPageClient initialPosts={initialPosts} initialMetadata={initialMetadata} />
    </>
  )
} 