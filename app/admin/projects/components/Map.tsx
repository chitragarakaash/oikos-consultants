'use client'

import { useEffect, useMemo, FC } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Initialize Leaflet icons once outside the component
const initializeLeaflet = () => {
  // @ts-expect-error - Known issue with Leaflet types for icon URL methods
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  })
}

// Initialize once when the module loads
if (typeof window !== 'undefined') {
  initializeLeaflet()
}

interface MapProps {
  center: [number, number]
  onLocationSelect: (coordinates: [number, number]) => void
}

function MapEvents({ onLocationSelect }: { onLocationSelect: MapProps['onLocationSelect'] }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      onLocationSelect([lat, lng])
    },
  })
  return null
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])
  return null
}

const Map: FC<MapProps> = ({ center, onLocationSelect }) => {
  const mapProps = useMemo(() => ({
    center: center as LatLngExpression,
    zoom: 13,
    style: { height: '100%', width: '100%', zIndex: 1 } as const,
    scrollWheelZoom: false as const,
  }), [center])

  return (
    <MapContainer key={`map-${center.join(',')}`} {...mapProps}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center as LatLngExpression} />
      <MapEvents onLocationSelect={onLocationSelect} />
      <ChangeView center={center} />
    </MapContainer>
  )
}

export default Map 