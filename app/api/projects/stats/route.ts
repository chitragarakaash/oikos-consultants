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
    // Get all projects
    const result = await ddb.scan({
      TableName: process.env.PROJECTS_TABLE_NAME || 'OikosProjects'
    })

    const total = result.Items?.length || 0
    const ongoing = result.Items?.filter(item => item.status === 'ongoing').length || 0

    return NextResponse.json({
      total,
      ongoing
    })
  } catch (error) {
    if (error instanceof ResourceNotFoundException) {
      logger.info('Projects table not found, returning zero counts')
      return NextResponse.json({
        total: 0,
        ongoing: 0
      })
    }
    
    logger.error('Failed to fetch project stats', error)
    return NextResponse.json({ error: 'Failed to fetch project stats' }, { status: 500 })
  }
} 