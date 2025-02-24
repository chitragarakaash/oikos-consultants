'use client'

import { useState } from 'react'
import { UploadButton } from '@uploadthing/react'
import type { OurFileRouter } from '@/app/api/uploadthing/core'
import Image from 'next/image'
import { X, ImageIcon } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove: () => void
}

export default function ImageUpload({
  value = '',
  onChange,
  onRemove
}: ImageUploadProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="space-y-4 w-full max-w-3xl">
      <div
        className="relative h-[200px] md:h-[250px] rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {value ? (
          <>
            <Image
              src={value}
              alt="Cover image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
            {isHovered && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity">
                <button
                  onClick={onRemove}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <ImageIcon className="w-8 h-8 mb-2" />
            <p className="text-sm">Click below to upload a cover image</p>
            <p className="text-xs text-gray-400 mt-1">Recommended size: 1200x630px</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center">
        <UploadButton<OurFileRouter, "blogImageUploader">
          endpoint="blogImageUploader"
          onClientUploadComplete={(res) => {
            if (res?.[0]) {
              onChange(res[0].url)
            }
          }}
          onUploadError={(error: Error) => {
            toast.error(error.message || 'Upload failed')
          }}
        />
      </div>
    </div>
  )
} 