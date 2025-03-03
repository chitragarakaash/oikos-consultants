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

export async function GET() {
  try {
    // Get all blog posts
    const result = await ddb.scan({
      TableName: process.env.BLOGS_TABLE_NAME || 'BlogPosts'
    })

    const total = result.Items?.length || 0
    const published = result.Items?.filter(item => item.status === 'published').length || 0

    return NextResponse.json({
      total,
      published
    })
  } catch (error) {
    if (error instanceof ResourceNotFoundException) {
      logger.info('BlogPosts table not found, returning zero counts')
      return NextResponse.json({
        total: 0,
        published: 0
      })
    }
    
    logger.error('Failed to fetch blog stats', error)
    return NextResponse.json({ error: 'Failed to fetch blog stats' }, { status: 500 })
  }
} 