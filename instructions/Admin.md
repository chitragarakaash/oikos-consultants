# Oikos Consultants Admin Panel Implementation

## Overview

This document outlines the implementation plan for the admin panel of the Oikos Consultants website. The admin panel will provide functionality for managing projects and blog content through a secure interface.

**IMPORTANT: DO NOT CHANGE ANYTHING FROM THE CURRENT PROJECT & BLOGS PAGE. The admin panel implementation should not affect or modify the existing project page functionality.**

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
- **Authentication**: NextAuth.js
- **Database**: Amazon DynamoDB
- **File Storage**: Amazon S3
- **API Integration**: AWS SDK
- **UI Components**: Shadcn UI

### Required Packages
```json
{
  "dependencies": {
    "next-auth": "latest",
    "bcryptjs": "latest",
    "aws-sdk": "latest",
    "@aws-sdk/client-dynamodb": "latest",
    "@aws-sdk/lib-dynamodb": "latest",
    "react-markdown": "latest",
    "date-fns": "latest",
    "uploadthing": "latest",
    "@radix-ui/react-label": "latest",
    "@radix-ui/react-slot": "latest",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "tailwindcss": "latest",
    "postcss": "latest",
    "autoprefixer": "latest",
    "@types/bcryptjs": "latest"
  }
}
```

## Project Structure Additions

```text
app/
├── admin/
│   ├── layout.tsx        # Admin-specific layout
│   ├── components/       # Admin-specific components
│   │   ├── AdminNav.tsx  # Admin navigation bar
│   │   └── AdminFooter.tsx # Admin footer
│   ├── page.tsx         # Admin dashboard
│   ├── projects/        # Project management
│   └── blogs/          # Blog management
├── auth/
│   └── sign-in/
│       ├── page.tsx     # Sign-in page with Shadcn UI
│       └── components/  # Sign-in components
├── api/
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts # NextAuth configuration
│   ├── projects/       # Project CRUD endpoints
│   └── blogs/         # Blog CRUD endpoints
├── lib/
│   └── auth.ts        # NextAuth utilities and types
└── components/
    └── ui/           # Shadcn UI components
```

## Admin Layout Specifications

### Admin Layout Features
- **Dedicated Layout**: Separate layout wrapper for all admin pages
- **Custom Navigation**: Admin-specific navigation with quick access to all management features
- **Secure Wrapper**: Authentication check built into the layout
- **Consistent Styling**: Admin-specific theme and styling

### Admin Navigation Bar
- Dashboard overview link
- Project management section
- Blog management section
- Quick actions menu
- Admin user profile/settings
- Logout button

### Admin Footer
- Quick links to documentation
- Support contact information
- Version information
- Environment indicator (development/production)

### Admin Theme
- Distinct color scheme from main website
- Clear visual hierarchy
- Responsive design for all screen sizes
- Optimized for productivity and quick access

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
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Admin User Credentials (for initial setup)
ADMIN_EMAIL=
ADMIN_PASSWORD=

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
   - Install and configure NextAuth.js
   - Create sign-in page with Shadcn UI components
   - Set up protected API routes
   - Implement session management
   - Add authentication middleware
   - Create secure password hashing with bcryptjs

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