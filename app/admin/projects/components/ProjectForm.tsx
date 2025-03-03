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
import { useToast } from '@/components/ui/use-toast'
import { Project } from '@/types/project'
import { MapPin, Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

  const handleCoordinateChange = (type: 'lat' | 'lng', value: string) => {
    const numValue = parseFloat(value)
    
    // Validate latitude (-90 to 90)
    if (type === 'lat' && (isNaN(numValue) || numValue < -90 || numValue > 90)) {
      toast({
        title: "Invalid Latitude",
        description: "Latitude must be between -90 and 90 degrees",
        variant: "destructive"
      })
      return
    }
    
    // Validate longitude (-180 to 180)
    if (type === 'lng' && (isNaN(numValue) || numValue < -180 || numValue > 180)) {
      toast({
        title: "Invalid Longitude",
        description: "Longitude must be between -180 and 180 degrees",
        variant: "destructive"
      })
      return
    }

    setFormData(prev => ({
      ...prev,
      coordinates: type === 'lat' 
        ? [numValue || 0, prev.coordinates[1]]
        : [prev.coordinates[0], numValue || 0]
    }))
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                className="h-32"
              />
            </div>

            {/* Location Coordinates */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Label>Location Coordinates *</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>These coordinates will place a marker on the projects map.</p>
                      <p>Latitude: -90 to 90 degrees</p>
                      <p>Longitude: -180 to 180 degrees</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude" className="text-muted-foreground text-sm">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.000001"
                    min="-90"
                    max="90"
                    value={formData.coordinates[0]}
                    onChange={(e) => handleCoordinateChange('lat', e.target.value)}
                    placeholder="e.g., 15.3647"
                    required
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Current: {formData.coordinates[0].toFixed(6)}°N
                  </p>
                </div>
                <div>
                  <Label htmlFor="longitude" className="text-muted-foreground text-sm">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.000001"
                    min="-180"
                    max="180"
                    value={formData.coordinates[1]}
                    onChange={(e) => handleCoordinateChange('lng', e.target.value)}
                    placeholder="e.g., 75.1240"
                    required
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Current: {formData.coordinates[1].toFixed(6)}°E
                  </p>
                </div>
              </div>
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