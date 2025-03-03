export interface Project {
  id?: string
  title: string
  client: string
  status: 'ongoing' | 'completed'
  description?: string
  coordinates: [number, number]
  sector: string
  startYear: string
  endYear?: string
  duration?: string
  impact?: string[]
  images?: string[]
  createdAt?: string
  updatedAt?: string
} 