import { Metadata } from 'next'

export function generateBlogMetadata({
  title,
  description,
  image,
  type = 'article',
  publishedTime,
  modifiedTime,
  tags,
  author,
}: {
  title: string
  description: string
  image?: string
  type?: 'article' | 'website'
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
  author?: string
}): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://oikosconsultants.com'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type,
      ...(image && { images: [{ url: image, width: 1200, height: 630, alt: title }] }),
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      url: baseUrl,
      siteName: 'Oikos Consultants',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image && { images: [image] }),
    },
    ...(tags?.length && {
      keywords: tags.join(', '),
    }),
    authors: author ? [{ name: author }] : undefined,
  }
} 