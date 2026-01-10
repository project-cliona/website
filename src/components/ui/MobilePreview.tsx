'use client'

import Image from 'next/image'
import { useEffect, useMemo } from 'react'
import { Icon } from './Icon'

interface MobilePreviewProps {
  title?: string
  description?: string
  mediaFile?: File | null
  suggestions?: {
    actionType: string
    suggestionText: string
    postbackText?: string
  }[]
}

export function MobilePreview({
  title,
  description,
  mediaFile,
  suggestions = [],
}: MobilePreviewProps) {

  const mediaUrl = useMemo(() => {
    return mediaFile ? URL.createObjectURL(mediaFile) : null
  }, [mediaFile])

  useEffect(() => {
    return () => {
      if (mediaUrl) URL.revokeObjectURL(mediaUrl)
    }
  }, [mediaUrl])

  const hasContent = title || description || mediaUrl || suggestions.length > 0

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Icon name="phone" className="w-5 h-5 mr-2" />
        Live Preview
      </h2>

      {/* Phone Frame */}
      <div className="mx-auto bg-black rounded-[2rem] p-2 w-64">
        <div className="bg-white rounded-[1.5rem] h-96 overflow-hidden">
          {/* Status Bar */}
          <div className="bg-gray-100 px-4 py-2 flex justify-between items-center text-xs">
            <span>9:41</span>
            <div className="flex items-center space-x-1">
              <Icon name="signal" className="w-3 h-3" />
              <Icon name="signal" className="w-3 h-3" />
              <Icon name="battery" className="w-3 h-3" />
            </div>
          </div>

          {/* Message Body */}
          <div className="p-4 h-full overflow-y-auto">
            {hasContent ? (
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                {/* Sender */}
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-xs font-bold">B</span>
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    Business
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  {/* Title */}
                  {title && (
                    <h3 className="font-semibold text-sm">{title}</h3>
                  )}
                  {mediaUrl && (
                    mediaFile?.type.startsWith('image') ? (
                      <Image
                        src={mediaUrl}
                        alt="Preview media"
                        width={240}
                        height={120}
                        className="w-full h-24 rounded object-cover bg-gray-200"
                        unoptimized
                      />
                    ) : (
                      <video
                        src={mediaUrl}
                        controls
                        className="w-full h-24 rounded object-cover bg-black"
                      />
                    )
                  )}

                  {/* Description */}
                  {description && (
                    <p className="text-xs text-gray-700">{description}</p>
                  )}

                  {/* Buttons */}
                  {suggestions.length > 0 && (
                    <div className="space-y-1 mt-3">
                      {suggestions.map((btn, index) => (
                        <button
                          type="button"
                          key={index}
                          className="w-full text-xs bg-white border border-blue-300 text-blue-600 py-2 rounded font-medium hover:bg-blue-50"
                        >
                          <span className="flex items-center justify-center gap-1">
                            {btn.suggestionText || 'Button'}
                            <Icon
                              name={
                                btn.actionType === 'url'
                                  ? 'link'
                                  : 'chat'
                              }
                              className="w-3 h-3"
                            />
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-400 mt-2">
                  Delivered • Just now
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center">
                <div className="text-gray-400">
                  <Icon name="phone" className="w-12 h-12 mb-2" />
                  <p className="text-sm">
                    Fill the form to see live preview
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
