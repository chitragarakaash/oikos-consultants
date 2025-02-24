import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// Validate required environment variables
if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.error('Missing required AWS environment variables')
  process.exit(1)
}

const ddbClient = new DynamoDB({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

const ddbDocClient = DynamoDBDocument.from(ddbClient)
const TableName = 'OikosProjects'

async function backupProjects() {
  try {
    console.log('Creating backup...')
    
    // Scan all items in the table
    const { Items = [] } = await ddbDocClient.scan({ TableName })
    
    // Create backups directory if it doesn't exist
    const backupDir = path.join(process.cwd(), 'backups')
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir)
    }

    // Save backup with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupPath = path.join(backupDir, `projects-backup-${timestamp}.json`)
    fs.writeFileSync(backupPath, JSON.stringify(Items, null, 2))
    
    console.log(`Backup created at ${backupPath}`)
    return Items
  } catch (error) {
    console.error('Backup failed:', error)
    process.exit(1)
  }
}

async function migrateProjectDates() {
  try {
    console.log('Starting migration...')
    
    // Create backup first
    const items = await backupProjects()
    console.log(`Found ${items.length} projects to migrate`)

    for (const item of items) {
      try {
        // Convert startDate to startYear
        let startYear = item.startDate 
          ? new Date(item.startDate).getFullYear().toString()
          : new Date().getFullYear().toString()

        // Convert completionDate to endYear for completed projects
        let endYear = undefined
        if (item.status === 'completed' && item.completionDate) {
          endYear = new Date(item.completionDate).getFullYear().toString()
        }

        // Update the item with new year fields
        await ddbDocClient.update({
          TableName,
          Key: { id: item.id },
          UpdateExpression: 'SET startYear = :startYear, endYear = :endYear REMOVE startDate, completionDate',
          ExpressionAttributeValues: {
            ':startYear': startYear,
            ':endYear': endYear,
          },
        })

        console.log(`Successfully migrated project ${item.id}`)
      } catch (error) {
        console.error(`Failed to migrate project ${item.id}:`, error)
      }
    }

    console.log('Migration completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateProjectDates() 