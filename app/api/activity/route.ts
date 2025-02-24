import { NextResponse } from 'next/server'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { ResourceNotFoundException } from '@aws-sdk/client-dynamodb'
import { logger } from '@/lib/logger'

const ddb = DynamoDBDocument.from(new DynamoDB({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
}))

async function safeTableScan(tableName: string, limit: number = 10) {
  try {
    const result = await ddb.scan({
      TableName: tableName,
      Limit: limit,
    })
    return result.Items || []
  } catch (error) {
    if (error instanceof ResourceNotFoundException) {
      logger.info(`Table ${tableName} not found, returning empty array`)
      return []
    }
    throw error
  }
}

export async function GET() {
  try {
    // Get recent activity from both projects and blog posts
    const [projects, posts] = await Promise.all([
      safeTableScan(process.env.PROJECTS_TABLE_NAME || 'OikosProjects'),
      safeTableScan(process.env.BLOGS_TABLE_NAME || 'OikosBlogs')
    ])

    // Combine and format activities
    const activities = [
      ...projects.map(project => ({
        id: `project-${project.id}`,
        type: 'project' as const,
        action: project.status === 'ongoing' ? 'Project started' : 'Project completed',
        title: project.title,
        timestamp: project.updatedAt || project.createdAt
      })),
      ...posts.map(post => ({
        id: `blog-${post.id}`,
        type: 'blog' as const,
        action: post.status === 'published' ? 'Post published' : 'Post drafted',
        title: post.title,
        timestamp: post.updatedAt || post.createdAt
      }))
    ]

    // Sort by timestamp, most recent first
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Return only the 20 most recent activities
    return NextResponse.json(activities.slice(0, 20))
  } catch (error) {
    logger.error('Failed to fetch activity', error)
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 })
  }
} 