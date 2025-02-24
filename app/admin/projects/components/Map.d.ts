import { FC } from 'react'

interface MapProps {
  center: [number, number]
  onLocationSelect: (coordinates: [number, number]) => void
}

declare const Map: FC<MapProps>

export default Map 