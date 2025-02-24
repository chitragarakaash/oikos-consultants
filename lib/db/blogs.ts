import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand, PutCommand, GetCommand, QueryCommand, DeleteCommand, ScanCommandInput, QueryCommandInput } from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

const TableName = 'OikosBlogs'

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  tags: string[]
  slug: string
  coverImage?: string
  status: 'draft' | 'published'
  publishedAt?: string | null
  createdAt: string
  updatedAt: string
}

interface BlogStats {
  total: number
  published: number
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
  if (options?.status) {
    const params: QueryCommandInput = {
      TableName,
      IndexName: 'status-index',
      KeyConditionExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': options.status,
      },
      Limit: options?.limit || 10,
    }

    if (options?.nextToken) {
      params.ExclusiveStartKey = JSON.parse(decodeURIComponent(options.nextToken));
    }

    const result = await docClient.send(new QueryCommand(params));
    
    return {
      items: result.Items as BlogPost[],
      metadata: {
        hasNextPage: !!result.LastEvaluatedKey,
        nextToken: result.LastEvaluatedKey 
          ? encodeURIComponent(JSON.stringify(result.LastEvaluatedKey))
          : undefined,
        total: result.Count || 0,
      },
    };
  }

  // If no status filter, use ScanCommand
  const params: ScanCommandInput = {
    TableName,
    Limit: options?.limit || 10,
  }

  if (options?.nextToken) {
    params.ExclusiveStartKey = JSON.parse(decodeURIComponent(options.nextToken));
  }

  const result = await docClient.send(new ScanCommand(params));
  
  return {
    items: result.Items as BlogPost[],
    metadata: {
      hasNextPage: !!result.LastEvaluatedKey,
      nextToken: result.LastEvaluatedKey 
        ? encodeURIComponent(JSON.stringify(result.LastEvaluatedKey))
        : undefined,
      total: result.Count || 0,
    },
  };
}

export async function getBlogStats(): Promise<BlogStats> {
  try {
    const command = new ScanCommand({
      TableName: process.env.BLOGS_TABLE_NAME!,
    })
    const result = await docClient.send(command)
    const items = result.Items as BlogPost[] || []

    return {
      total: items.length,
      published: items.filter(item => item.status === 'published').length
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    throw new Error(`Failed to get blog stats: ${errorMessage}`)
  }
}

export async function updateBlog(id: string, data: Partial<BlogPost>): Promise<void> {
  try {
    const updateExpression = Object.keys(data)
      .map((key) => `#${key} = :${key}`)
      .join(', ')

    const expressionAttributeNames = Object.keys(data).reduce<Record<string, string>>((acc, key) => ({
      ...acc,
      [`#${key}`]: key
    }), {})

    const expressionAttributeValues = Object.entries(data).reduce<Record<string, unknown>>((acc, [key, value]) => ({
      ...acc,
      [`:${key}`]: value
    }), {})

    const command = new UpdateCommand({
      TableName: process.env.BLOGS_TABLE_NAME!,
      Key: { id },
      UpdateExpression: `SET ${updateExpression}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
    })

    await docClient.send(command)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    throw new Error(`Failed to update blog: ${errorMessage}`)
  }
}

export async function deleteBlog(id: string) {
  await docClient.send(new DeleteCommand({
    TableName,
    Key: { id },
  }))
} 