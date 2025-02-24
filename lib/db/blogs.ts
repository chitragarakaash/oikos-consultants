import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, DeleteCommand, UpdateCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const docClient = DynamoDBDocumentClient.from(client)

const TableName = 'OikosBlogs'

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  coverImage: string
  author: string
  tags: string[]
  publishedAt: string | null
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}

export interface PaginatedResult<T> {
  items: T[]
  metadata: {
    hasNextPage: boolean
    nextToken?: string
    total: number
  }
}

export async function createBlog(blog: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) {
  const now = new Date().toISOString()
  const id = `blog_${Date.now()}`
  const slug = blog.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  const item: BlogPost = {
    ...blog,
    id,
    slug,
    createdAt: now,
    updatedAt: now,
  }

  await docClient.send(new PutCommand({
    TableName,
    Item: item,
  }))

  return item
}

export async function getBlog(id: string) {
  const result = await docClient.send(new GetCommand({
    TableName,
    Key: { id },
  }))

  return result.Item as BlogPost | undefined
}

export async function getBlogBySlug(slug: string) {
  const result = await docClient.send(new QueryCommand({
    TableName,
    IndexName: 'SlugIndex',
    KeyConditionExpression: 'slug = :slug',
    ExpressionAttributeValues: {
      ':slug': slug,
    },
  }))

  return result.Items?.[0] as BlogPost | undefined
}

export async function listBlogs(options?: {
  status?: 'draft' | 'published'
  limit?: number
  nextToken?: string
}): Promise<PaginatedResult<BlogPost>> {
  let params: any = {
    TableName,
    Limit: options?.limit || 10, // Default to 10 items per page
  }

  if (options?.status) {
    params = {
      ...params,
      IndexName: 'status-index',
      KeyConditionExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': options.status,
      },
    }
  }

  if (options?.nextToken) {
    params.ExclusiveStartKey = JSON.parse(
      Buffer.from(options.nextToken, 'base64').toString()
    )
  }

  // Get total count
  const countParams = { ...params }
  delete countParams.Limit
  delete countParams.ExclusiveStartKey
  const countResult = await docClient.send(
    options?.status ? new QueryCommand(countParams) : new ScanCommand(countParams)
  )

  // Get paginated results
  const result = await docClient.send(
    options?.status ? new QueryCommand(params) : new ScanCommand(params)
  )

  return {
    items: result.Items as BlogPost[],
    metadata: {
      hasNextPage: !!result.LastEvaluatedKey,
      nextToken: result.LastEvaluatedKey
        ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
        : undefined,
      total: countResult.Count || 0,
    }
  }
}

export async function updateBlog(
  id: string,
  updates: Partial<Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>>
) {
  const updateExpressions: string[] = []
  const expressionAttributeNames: Record<string, string> = {}
  const expressionAttributeValues: Record<string, any> = {}

  Object.entries(updates).forEach(([key, value]) => {
    updateExpressions.push(`#${key} = :${key}`)
    expressionAttributeNames[`#${key}`] = key
    expressionAttributeValues[`:${key}`] = value
  })

  // Always update the updatedAt timestamp
  updateExpressions.push('#updatedAt = :updatedAt')
  expressionAttributeNames['#updatedAt'] = 'updatedAt'
  expressionAttributeValues[':updatedAt'] = new Date().toISOString()

  const result = await docClient.send(new UpdateCommand({
    TableName,
    Key: { id },
    UpdateExpression: `SET ${updateExpressions.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  }))

  return result.Attributes as BlogPost
}

export async function deleteBlog(id: string) {
  await docClient.send(new DeleteCommand({
    TableName,
    Key: { id },
  }))
} 