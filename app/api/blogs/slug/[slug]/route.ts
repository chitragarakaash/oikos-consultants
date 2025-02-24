import { NextRequest, NextResponse } from 'next/server'
import { getBlogBySlug } from '@/lib/db/blogs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params
    const blog = await getBlogBySlug(resolvedParams.slug)
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error('Error getting blog by slug:', error)
    return NextResponse.json(
      { error: 'Failed to get blog post' },
      { status: 500 }
    )
  }
} 