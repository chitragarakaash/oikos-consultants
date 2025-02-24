# Oikos Consultants Website Frontend

## Overview

Oikos Consultants is a leading environmental consulting firm specializing in sustainability solutions, biodiversity conservation, and ecological services. Our modern, Next.js-powered website showcases our comprehensive range of environmental services, from BRSR compliance to ecological restoration projects. With seamless Calendly integration, clients can easily schedule consultations with our expert team. We are committed to promoting sustainable practices and helping organizations achieve their environmental goals while ensuring regulatory compliance.

## Our Services

Oikos Consultants specializes in environmental consulting and sustainability services:

- BRSR Compliance and Reporting
- Sustainability Audits
- Biodiversity Assessment & Surveys
- Wildlife Conservation and Planning
- Greenhouse Gas (GHG) Inventorisation
- Ecological Restoration Projects
- Promotion of Native Species
- Environmental Impact Assessment (EIA)
- Corporate ESG Strategy Development
- Sustainable Supply Chain Management
- Carbon Footprint Analysis
- Environmental Training & Workshops

## Tech Stack

- Next.js 14+
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix UI Components
- Framer Motion
- React Hook Form
- react-calendly
- SendGrid Email Integration
- Leaflet & react-leaflet
- react-simple-maps
- Embla Carousel
- Lucide Icons
- Class Variance Authority (CVA)
- ESLint
- PostCSS

## Color Theme

Our color palette reflects our commitment to environmental sustainability and professionalism:

```css
:root {
  /* Primary Colors */
  --primary-green: #2E7D32;     /* Deep Forest Green - Main brand color */
  --primary-blue: #1B5E20;      /* Emerald Green - Call to actions */
  
  /* Secondary Colors */
  --accent-sage: #A8C6A1;       /* Sage Green - Subtle accents */
  --accent-leaf: #4CAF50;       /* Leaf Green - Success states */
  
  /* Neutral Colors */
  --neutral-100: #FFFFFF;       /* Pure White - Background */
  --neutral-200: #F8FAF9;       /* Off White - Card backgrounds */
  --neutral-300: #E8F5E9;       /* Pale Green - Hover states */
  --neutral-700: #2C302E;       /* Deep Gray - Body text */
  --neutral-900: #1A1C1B;       /* Almost Black - Headings */
  
  /* UI States */
  --success: #43A047;           /* Success messages */
  --warning: #FFA000;           /* Warning messages */
  --error: #D32F2F;            /* Error states */
  --info: #0288D1;             /* Info messages */
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
  --gradient-accent: linear-gradient(135deg, #A8C6A1 0%, #4CAF50 100%);
}
```

## Project Structure

```text
Oikos/
├── app/
│   ├── page.tsx                 # Home page
│   ├── about/page.tsx           # About page
│   ├── services/page.tsx        # Services page
│   ├── contact/page.tsx         # Contact page
│   ├── book/page.tsx            # Calendly booking page
│   ├── blog/                    # Blog section
│   ├── case-studies/            # Case studies
│   ├── team/                    # Team profiles
│   └── admin/                   # Admin dashboard
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── layout/                  # Layout components
│   ├── features/                # Feature components
│   ├── forms/                   # Form components
│   ├── blog/                    # Blog components
│   ├── animations/              # Framer motion animations
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── BookingWidget.tsx
├── lib/
│   ├── utils/                   # Utility functions
│   ├── hooks/                   # Custom hooks
│   ├── api/                     # API handlers
│   └── db/                      # Database utilities
├── public/
│   ├── images/
│   ├── icons/
│   └── locales/                 # Translation files
└── styles/
    └── globals.css

## Prerequisites

- Node.js 18.x or higher
- npm/yarn
- Basic knowledge of React and Next.js

## Installation & Development

```bash
# Clone the repository
git clone https://github.com/chitragarakaash/Oikos.git

# Navigate to project directory
cd oikos-consultants

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Current Features

- Modern, responsive design with Tailwind CSS
- SEO optimized with Next.js metadata API
- Fast page loads with static generation
- Dynamic server-side rendering where needed
- Calendly integration for consultation booking
- Interactive service showcase with Framer Motion animations
- Secure contact forms with React Hook Form validation
- Mobile-friendly interface
- Interactive maps with Leaflet & react-simple-maps
- Image optimization with Next/Image
- Loading states and skeleton screens
- SendGrid email integration
- SSL encryption via AWS Amplify
- Embla Carousel for testimonials and showcases
- Dark mode support with Tailwind

## Environment Variables

Create a `.env.local` file in the root directory:

```text
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/oikosconsultants/30min
SENDGRID_API_KEY=your_sendgrid_key
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## Deployment

The project is automatically deployed through AWS Amplify's CI/CD pipeline when changes are pushed to the main branch of the GitHub repository.

### Build Settings

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## Support & Contact

For support, email [akash@webart4u.com](mailto:akash@webart4u.com) or create an issue in the repository.

## Authors

- Akash Chitragar
- Contact: [akash@webart4u.com](mailto:akash@webart4u.com) 