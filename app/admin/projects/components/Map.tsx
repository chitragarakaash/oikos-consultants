'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

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

export default function Map({ center, onLocationSelect }: MapProps) {
  // Initialize Leaflet icons
  useEffect(() => {
    (async function init() {
      // @ts-ignore - Known issue with Leaflet types
      delete L.Icon.Default.prototype._getIconUrl
      // @ts-ignore - Known issue with Leaflet types
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      })
    })()
  }, [])

  const mapProps = {
    center: center as LatLngExpression,
    zoom: 13,
    style: { height: '100%', width: '100%', zIndex: 1 } as const,
    scrollWheelZoom: false as const,
  }

  return (
    // @ts-ignore - Known issue with react-leaflet types
    <MapContainer {...mapProps}>
      {/* @ts-ignore - Known issue with react-leaflet types */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center as LatLngExpression} />
      <MapEvents onLocationSelect={onLocationSelect} />
      <ChangeView center={center} />
    </MapContainer>
  )
} 