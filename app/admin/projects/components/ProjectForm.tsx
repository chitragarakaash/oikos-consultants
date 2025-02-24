'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'
import dynamic from 'next/dynamic'
import { Project } from '@/types/project'

// Dynamically import the map component to avoid SSR issues
const Map = dynamic(() => import('./Map'), { ssr: false })

interface ProjectFormProps {
  project?: Project
  isOpen: boolean
  onClose: () => void
}

const sectors = [
  'Environmental Conservation',
  'Wildlife Protection',
  'Sustainable Development',
  'Ecological Restoration',
  'Biodiversity Assessment',
  'Climate Change',
  'Waste Management',
  'Other',
]

// Generate years from 2000 to current year + 5
const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1999 + 5 }, (_, i) => (2000 + i).toString())

export default function ProjectForm({ project, isOpen, onClose }: ProjectFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Project>({
    title: '',
    client: '',
    status: 'ongoing',
    description: '',
    coordinates: [15.3647, 75.1240], // Default to Hubballi coordinates
    sector: sectors[0],
    startYear: currentYear.toString(),
    images: [],
  })

  useEffect(() => {
    if (project) {
      setFormData(project)
    }
  }, [project])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/projects', {
        method: project ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to save project')

      toast({
        title: 'Success',
        description: `Project ${project ? 'updated' : 'created'} successfully`,
      })

      router.refresh()
      onClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${project ? 'update' : 'create'} project`,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLocationSelect = (coordinates: [number, number]) => {
    setFormData((prev) => ({ ...prev, coordinates }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          <DialogDescription>
            Fill in the project details below. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Title */}
            <div className="col-span-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            {/* Client */}
            <div className="col-span-1">
              <Label htmlFor="client">Client *</Label>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) => setFormData((prev) => ({ ...prev, client: e.target.value }))}
                required
              />
            </div>

            {/* Sector */}
            <div className="col-span-1">
              <Label htmlFor="sector">Sector *</Label>
              <Select
                value={formData.sector}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, sector: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="col-span-1">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'ongoing' | 'completed') =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Start Year */}
            <div className="col-span-1">
              <Label htmlFor="startYear">Start Year *</Label>
              <Select
                value={formData.startYear}
                onValueChange={(value: string) =>
                  setFormData((prev) => ({ ...prev, startYear: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select start year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* End Year - Only show for completed projects */}
            {formData.status === 'completed' && (
              <div className="col-span-1">
                <Label htmlFor="endYear">End Year *</Label>
                <Select
                  value={formData.endYear}
                  onValueChange={(value: string) =>
                    setFormData((prev) => ({ ...prev, endYear: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select end year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years
                      .filter((year) => parseInt(year) >= parseInt(formData.startYear))
                      .map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Description */}
            <div className="col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                className="h-32"
                required
              />
            </div>

            {/* Location Map */}
            <div className="col-span-2">
              <Label className="mb-2 block">Location *</Label>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.coordinates[0]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        coordinates: [parseFloat(e.target.value) || 0, prev.coordinates[1]],
                      }))
                    }
                    placeholder="Enter latitude"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.coordinates[1]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        coordinates: [prev.coordinates[0], parseFloat(e.target.value) || 0],
                      }))
                    }
                    placeholder="Enter longitude"
                  />
                </div>
              </div>
              <div className="h-[300px] rounded-md border">
                {typeof window !== 'undefined' && (
                  <Map
                    center={formData.coordinates}
                    onLocationSelect={handleLocationSelect}
                  />
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Selected: {formData.coordinates[0].toFixed(6)},{' '}
                {formData.coordinates[1].toFixed(6)}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#2E7D32] hover:bg-[#1B5E20]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>
                  {project ? 'Updating...' : 'Creating...'}
                </>
              ) : project ? (
                'Update Project'
              ) : (
                'Create Project'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 