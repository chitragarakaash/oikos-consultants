import { NextRequest, NextResponse } from 'next/server'
import { createBlog, listBlogs } from '@/lib/db/blogs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as 'draft' | 'published' | undefined
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const nextToken = searchParams.get('nextToken') || undefined

    const result = await listBlogs({ status, limit, nextToken })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error listing blogs:', error)
    return NextResponse.json(
      { error: 'Failed to list blogs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const blog = await createBlog(body)

    return NextResponse.json(blog)
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    )
  }
} 