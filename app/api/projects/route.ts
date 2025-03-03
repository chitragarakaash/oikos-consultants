import { NextResponse } from 'next/server'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { Project } from '@/types/project'

const ddbClient = new DynamoDB({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const ddbDocClient = DynamoDBDocument.from(ddbClient)
const TableName = process.env.PROJECTS_TABLE_NAME || 'OikosProjects'

interface ProjectData {
  id?: string
  title: string
  client: string
  status: string
  sector: string
  location: string
  startYear: number
  endYear?: number
  coordinates: [number, number]
  description?: string
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const sector = searchParams.get('sector')
    
    let filterExpression = ''
    const expressionAttributeValues: Record<string, string | number> = {}
    
    if (status) {
      filterExpression = 'status = :status'
      expressionAttributeValues[':status'] = status
      
      if (sector) {
        filterExpression += ' AND sector = :sector'
        expressionAttributeValues[':sector'] = sector
      }
    } else if (sector) {
      filterExpression = 'sector = :sector'
      expressionAttributeValues[':sector'] = sector
    }

    const params = {
      TableName,
      ...(filterExpression && {
        FilterExpression: filterExpression,
        ExpressionAttributeValues: expressionAttributeValues,
      }),
    }

    const { Items } = await ddbDocClient.scan(params)
    const projects = Items as Project[]

    // Sort projects by date
    const sortedProjects = projects.sort((a, b) => {
      // For completed projects, sort by completion date
      if (a.status === 'completed' && b.status === 'completed') {
        return parseInt(b.endYear || '0') - parseInt(a.endYear || '0')
      }
      // For ongoing projects, sort by start date
      if (a.status === 'ongoing' && b.status === 'ongoing') {
        return parseInt(b.startYear) - parseInt(a.startYear)
      }
      // Mixed status, completed projects come first
      return a.status === 'completed' ? -1 : 1
    })

    return NextResponse.json(sortedProjects || [])
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data: ProjectData = await request.json()
    const timestamp = new Date().toISOString()
    const id = crypto.randomUUID()

    // Validate required fields
    if (!data.title || !data.client || !data.coordinates || !data.status || !data.startYear) {
      return NextResponse.json(
        { error: 'Missing required fields: title, client, coordinates, status, startYear' },
        { status: 400 }
      )
    }

    // Validate status
    if (!['completed', 'ongoing'].includes(data.status)) {
      return NextResponse.json(
        { error: 'Status must be either "completed" or "ongoing"' },
        { status: 400 }
      )
    }

    // Validate coordinates
    if (!Array.isArray(data.coordinates) || data.coordinates.length !== 2 ||
        typeof data.coordinates[0] !== 'number' || typeof data.coordinates[1] !== 'number') {
      return NextResponse.json(
        { error: 'Coordinates must be an array of two numbers [longitude, latitude]' },
        { status: 400 }
      )
    }

    // Validate years
    const currentYear = new Date().getFullYear()
    const startYear = parseInt(data.startYear.toString())
    if (isNaN(startYear) || startYear < 2000 || startYear > currentYear + 5) {
      return NextResponse.json(
        { error: 'Start year must be between 2000 and ' + (currentYear + 5) },
        { status: 400 }
      )
    }

    if (data.status === 'completed') {
      if (!data.endYear) {
        return NextResponse.json(
          { error: 'End year is required for completed projects' },
          { status: 400 }
        )
      }
      const endYear = data.endYear
      if (endYear < startYear || endYear > currentYear) {
        return NextResponse.json(
          { error: 'End year must be between start year and current year' },
          { status: 400 }
        )
      }
    }

    await ddbDocClient.put({
      TableName,
      Item: {
        id,
        ...data,
        description: data.description || '',
        createdAt: timestamp,
        updatedAt: timestamp
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const project = await request.json()
    const timestamp = new Date().toISOString()

    // Validate required fields
    if (!project.id || !project.title || !project.client || !project.coordinates || !project.status || !project.startYear) {
      return NextResponse.json(
        { error: 'Missing required fields: id, title, client, coordinates, status, startYear' },
        { status: 400 }
      )
    }

    // Validate status
    if (!['completed', 'ongoing'].includes(project.status)) {
      return NextResponse.json(
        { error: 'Status must be either "completed" or "ongoing"' },
        { status: 400 }
      )
    }

    // Validate coordinates
    if (!Array.isArray(project.coordinates) || project.coordinates.length !== 2 ||
        typeof project.coordinates[0] !== 'number' || typeof project.coordinates[1] !== 'number') {
      return NextResponse.json(
        { error: 'Coordinates must be an array of two numbers [longitude, latitude]' },
        { status: 400 }
      )
    }

    // Validate years
    const currentYear = new Date().getFullYear()
    const startYear = parseInt(project.startYear)
    if (isNaN(startYear) || startYear < 2000 || startYear > currentYear + 5) {
      return NextResponse.json(
        { error: 'Start year must be between 2000 and ' + (currentYear + 5) },
        { status: 400 }
      )
    }

    if (project.status === 'completed') {
      if (!project.endYear) {
        return NextResponse.json(
          { error: 'End year is required for completed projects' },
          { status: 400 }
        )
      }
      const endYear = parseInt(project.endYear)
      if (isNaN(endYear) || endYear < startYear || endYear > currentYear) {
        return NextResponse.json(
          { error: 'End year must be between start year and current year' },
          { status: 400 }
        )
      }
    }

    const { Attributes } = await ddbDocClient.update({
      TableName,
      Key: { id: project.id },
      UpdateExpression: `
        SET title = :title,
            client = :client,
            status = :status,
            description = :description,
            coordinates = :coordinates,
            sector = :sector,
            startYear = :startYear,
            endYear = :endYear,
            duration = :duration,
            impact = :impact,
            images = :images,
            updatedAt = :updatedAt
      `,
      ExpressionAttributeValues: {
        ':title': project.title,
        ':client': project.client,
        ':status': project.status,
        ':description': project.description || '',
        ':coordinates': project.coordinates,
        ':sector': project.sector,
        ':startYear': project.startYear,
        ':endYear': project.endYear,
        ':duration': project.duration,
        ':impact': project.impact,
        ':images': project.images,
        ':updatedAt': timestamp,
      },
      ReturnValues: 'ALL_NEW',
    })

    return NextResponse.json(Attributes)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()

    await ddbDocClient.delete({
      TableName,
      Key: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
} 