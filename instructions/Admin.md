# Oikos Consultants Admin Panel Implementation

## Overview

This document outlines the implementation plan for the admin panel of the Oikos Consultants website. The admin panel will provide functionality for managing projects and blog content through a secure interface.

## Features to be Implemented

1. **Project Management**
   - Add new projects
   - Edit existing projects
   - Change project status (ongoing/completed)
   - Delete projects

2. **Blog Management**
   - Create new blog posts
   - Edit existing posts
   - Delete posts
   - Manage blog media

3. **Authentication**
   - Secure login for admin users
   - Protected admin routes
   - Login button in website footer

## Tech Stack Additions

### Core Technologies
- **Authentication**: Clerk
- **Database**: Amazon DynamoDB
- **File Storage**: Amazon S3
- **API Integration**: AWS SDK

### Required Packages
```json
{
  "dependencies": {
    "@clerk/nextjs": "latest",
    "aws-sdk": "latest",
    "@aws-sdk/client-dynamodb": "latest",
    "@aws-sdk/lib-dynamodb": "latest",
    "react-markdown": "latest",
    "date-fns": "latest",
    "uploadthing": "latest"
  }
}
```

## Project Structure Additions

```text
app/
├── admin/
│   ├── page.tsx           # Admin dashboard
│   ├── projects/          # Project management
│   └── blogs/            # Blog management
├── auth/
│   └── sign-in/          # Clerk signin page
└── api/                  # API routes
    ├── projects/         # Project CRUD endpoints
    └── blogs/           # Blog CRUD endpoints
```

## Data Structures

### Projects Table Schema
```typescript
{
  id: string
  title: string
  client: string
  status: 'ongoing' | 'completed'
  description: string
  coordinates: [number, number]
  sector: string
  startDate: string
  completionDate?: string
  images: string[]
  createdAt: string
  updatedAt: string
}
```

### Blogs Table Schema
```typescript
{
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  coverImage: string
  author: string
  tags: string[]
  publishedAt: string
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}
```

## Required Environment Variables

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# AWS Configuration
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=

# Upload Thing (for file uploads)
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
```

## Implementation Benefits

- **Serverless Architecture**: Maintains current serverless approach
- **AWS Integration**: Seamless integration with existing AWS Amplify setup
- **Cost-Effective**: Pay-per-use pricing model
- **Scalability**: Automatic scaling with demand
- **Low Maintenance**: Minimal DevOps requirements
- **Modern Stack**: Consistent with current modern tech stack
- **Developer Experience**: Familiar tools and workflows
- **Performance**: High performance and low latency

## Implementation Steps

1. **Authentication Setup**
   - Configure Clerk
   - Implement protected routes
   - Add login button to footer
   - Create sign-in page

2. **Database Setup**
   - Create DynamoDB tables
   - Configure AWS IAM roles
   - Set up AWS SDK

3. **Admin Interface**
   - Create admin dashboard
   - Implement project management UI
   - Implement blog management UI
   - Add rich text editor

4. **API Implementation**
   - Create CRUD endpoints for projects
   - Create CRUD endpoints for blogs
   - Implement file upload handlers

5. **Testing & Security**
   - Test all CRUD operations
   - Verify authentication flow
   - Check file upload security
   - Test admin permissions

## Security Considerations

- All admin routes protected by Clerk authentication
- AWS IAM roles with minimal required permissions
- Secure file upload handling
- Input validation and sanitization
- CORS configuration
- Rate limiting on API routes

## Deployment Considerations

- Update AWS Amplify build settings if needed
- Configure environment variables in AWS Amplify Console
- Set up proper AWS IAM roles
- Configure CORS for S3 bucket
- Set up proper backup strategy for DynamoDB

## Maintenance

- Regular security updates
- Backup management
- Performance monitoring
- Usage analytics
- Cost optimization 