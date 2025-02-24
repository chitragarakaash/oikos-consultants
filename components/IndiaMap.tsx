'use client'

import React, { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, useMap, Marker, Popup, ZoomControl } from 'react-leaflet'
import L, { Icon, DivIcon } from 'leaflet'
import Image from 'next/image'
import 'leaflet/dist/leaflet.css'

// Define the project location type
interface ProjectLocation {
  title: string
  client: string
  coordinates: [number, number] // [longitude, latitude]
  isOngoing: boolean
  sector?: string
  description?: string
}

interface IndiaMapProps {
  projectLocations: ProjectLocation[]
}

// Custom cluster icon component
const createClusterIcon = (count: number, isOngoing: boolean) => {
  return new DivIcon({
    html: `
      <div class="flex items-center justify-center w-8 h-8 rounded-full ${
        isOngoing ? 'bg-blue-500' : 'bg-green-500'
      } text-white font-semibold text-sm shadow-lg border-2 border-white">
        ${count}
      </div>
    `,
    className: 'custom-cluster-icon',
    iconSize: L.point(32, 32),
    iconAnchor: L.point(16, 16)
  })
}

// Component to handle project markers with hover functionality
function ProjectMarkers({ projectLocations, completedIcon, ongoingIcon }: {
  projectLocations: ProjectLocation[]
  completedIcon: Icon
  ongoingIcon: Icon
}) {
  const map = useMap()

  // Group markers by location
  const groupedMarkers = projectLocations.reduce((acc, project) => {
    const key = `${project.coordinates[0]},${project.coordinates[1]}`
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(project)
    return acc
  }, {} as Record<string, ProjectLocation[]>)

  return (
    <>
      {Object.entries(groupedMarkers).map(([coords, projects]) => {
        const [lng, lat] = coords.split(',').map(Number)
        const ongoingCount = projects.filter(p => p.isOngoing).length
        const completedCount = projects.filter(p => !p.isOngoing).length

        if (projects.length === 1) {
          const project = projects[0]
          return (
            <Marker
              key={coords}
              position={[lat, lng]}
              icon={project.isOngoing ? ongoingIcon : completedIcon}
              eventHandlers={{
                mouseover: (e) => {
                  e.target.openPopup()
                },
                mouseout: (e) => {
                  e.target.closePopup()
                },
                click: () => {
                  map.setView([lat, lng], map.getZoom() || 6)
                }
              }}
            >
              <Popup 
                className="project-popup"
                closeButton={false}
                autoPan={false}
              >
                <div className="p-3 max-w-[300px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      project.isOngoing 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'bg-green-50 text-green-700'
                    }`}>
                      {project.isOngoing ? 'Ongoing' : 'Completed'}
                    </span>
                    {project.sector && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                        {project.sector}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 leading-snug">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-xs text-gray-600 mb-2 leading-snug">
                      {project.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 leading-snug">
                    {project.client}
                  </p>
                </div>
              </Popup>
            </Marker>
          )
        } else {
          // Create a cluster for multiple projects at the same location
          return (
            <Marker
              key={coords}
              position={[lat, lng]}
              icon={createClusterIcon(projects.length, ongoingCount > completedCount)}
              eventHandlers={{
                mouseover: (e) => e.target.openPopup(),
                mouseout: (e) => e.target.closePopup(),
                click: () => {
                  map.setView([lat, lng], map.getZoom() || 6)
                }
              }}
            >
              <Popup 
                className="cluster-popup"
                closeButton={false}
                autoPan={false}
              >
                <div className="p-3 max-w-[300px]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-900">
                      {projects.length} Projects
                    </span>
                    <div className="flex gap-2">
                      {completedCount > 0 && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700">
                          {completedCount} Completed
                        </span>
                      )}
                      {ongoingCount > 0 && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                          {ongoingCount} Ongoing
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {projects.map((project, index) => (
                      <div key={index} className="border-t border-gray-100 pt-2 first:border-0 first:pt-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${
                            project.isOngoing ? 'bg-blue-500' : 'bg-green-500'
                          }`} />
                          <div className="text-xs font-medium text-gray-900">
                            {project.title}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 pl-4">
                          {project.client}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        }
      })}
    </>
  )
}

const STATE_LABEL_STYLE = `
  .state-label {
    background: none;
    border: none;
    box-shadow: none;
    font-size: 11px;
    font-weight: 500;
    color: #1f2937;
    text-shadow: 1px 1px 1px rgba(255,255,255,0.8);
  }
  .project-popup .leaflet-popup-content-wrapper,
  .cluster-popup .leaflet-popup-content-wrapper {
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  .project-popup .leaflet-popup-content,
  .cluster-popup .leaflet-popup-content {
    margin: 0;
  }
  .project-popup .leaflet-popup-tip-container,
  .cluster-popup .leaflet-popup-tip-container {
    display: none;
  }
`

// Component to handle India border and state labels
function IndiaBorder() {
  const map = useMap()

  useEffect(() => {
    // Add custom CSS for state labels and popups
    const styleElement = document.createElement('style')
    styleElement.textContent = STATE_LABEL_STYLE
    document.head.appendChild(styleElement)

    fetch('https://raw.githubusercontent.com/HarshKumarraghav/Indian_Map/main/States/India_States.json')
      .then(response => response.json())
      .then(data => {
        // Add border and state labels
        L.geoJSON(data, {
          style: {
            color: '#2E7D32', // Green color to match theme
            weight: 4,
            fillOpacity: 0.05,
            fillColor: '#f1f5f9',
            opacity: 1,
            dashArray: '8, 8', // Larger dash pattern
          },
          onEachFeature: (feature, layer) => {
            if (feature.properties && feature.properties.name) {
              layer.bindTooltip(feature.properties.name, {
                permanent: true,
                direction: 'center',
                className: 'state-label',
                opacity: 0.8
              })
            }
          }
        }).addTo(map)
      })

    return () => {
      // Clean up custom styles on unmount
      const styles = document.getElementsByTagName('style')
      for (let i = 0; i < styles.length; i++) {
        const style = styles[i]
        if (style.textContent?.includes('state-label')) {
          style.remove()
        }
      }
    }
  }, [map])

  return null
}

// Add a new component to handle scroll zoom
function ScrollHandler() {
  const map = useMap()
  
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault()
        const delta = e.deltaY
        if (delta > 0) {
          map.zoomOut()
        } else {
          map.zoomIn()
        }
      }
    }

    map.getContainer().addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      map.getContainer().removeEventListener('wheel', handleWheel)
    }
  }, [map])

  return null
}

export default function IndiaMap({ projectLocations }: IndiaMapProps) {
  const [isScrollEnabled, setIsScrollEnabled] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const overlayTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Add event listeners for key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        setIsScrollEnabled(true)
        setShowOverlay(false)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.metaKey && !e.ctrlKey) {
        setIsScrollEnabled(false)
      }
    }

    const handleWheel = (e: WheelEvent) => {
      if (!isScrollEnabled && e.deltaY !== 0) {
        setShowOverlay(true)
        if (overlayTimeoutRef.current) {
          clearTimeout(overlayTimeoutRef.current)
        }
        overlayTimeoutRef.current = setTimeout(() => {
          setShowOverlay(false)
        }, 1500)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('wheel', handleWheel)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('wheel', handleWheel)
      if (overlayTimeoutRef.current) {
        clearTimeout(overlayTimeoutRef.current)
      }
    }
  }, [isScrollEnabled])

  // Create custom icons for completed and ongoing projects
  const completedIcon = new Icon({
    iconUrl: '/map-pin-green.svg',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  })

  const ongoingIcon = new Icon({
    iconUrl: '/map-pin-blue.svg',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  })

  return (
    <div className="relative w-full h-[700px] bg-white">
      {/* Scroll Overlay */}
      <div 
        className={`absolute top-8 left-8 z-[2000] pointer-events-none transition-opacity duration-300 ${
          showOverlay ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-black/75 backdrop-blur-sm text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg">
          <span className="text-sm">
            Use {navigator.platform.includes('Mac') ? '⌘ Command' : 'Ctrl'} + scroll to zoom
          </span>
        </div>
      </div>

      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: '100%', width: '100%', position: 'relative', zIndex: 1 }}
        scrollWheelZoom={false}
        zoomControl={false}
        dragging={true}
        touchZoom={true}
        doubleClickZoom={true}
        bounds={[[8.4, 68.7], [37.6, 97.25]]}
        maxBounds={[[6.4, 66.7], [39.6, 99.25]]}
        minZoom={4}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <IndiaBorder />
        <ProjectMarkers
          projectLocations={projectLocations}
          completedIcon={completedIcon}
          ongoingIcon={ongoingIcon}
        />
        <ScrollHandler />
      </MapContainer>

      {/* Legend */}
      <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-4 space-y-3 z-[1000]">
        <div className="flex items-center gap-2">
          <Image src="/map-pin-green.svg" alt="Completed" width={16} height={16} />
          <span className="text-sm text-gray-600">Completed Projects</span>
        </div>
        <div className="flex items-center gap-2">
          <Image src="/map-pin-blue.svg" alt="Ongoing" width={16} height={16} />
          <span className="text-sm text-gray-600">Ongoing Projects</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white font-medium">
            3
          </div>
          <span className="text-sm text-gray-600">Multiple Projects</span>
        </div>
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Hold {navigator.platform.includes('Mac') ? '⌘ Command' : 'Ctrl'} to zoom with scroll
          </p>
        </div>
      </div>
    </div>
  )
} 