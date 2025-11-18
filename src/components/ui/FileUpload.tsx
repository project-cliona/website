'use client'

import { useState, useCallback } from 'react'

interface FileUploadProps {
  onFileUpload: (file: File) => void
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)

  const validateFile = (file: File): boolean => {
    const validTypes = ['.csv', '.txt', '.xlsx', '.xls']
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (!validTypes.includes(fileExtension)) {
      alert('Please upload a CSV, TXT, or Excel file')
      return false
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      alert('File size should be less than 10MB')
      return false
    }
    
    return true
  }

  const handleFileUpload = useCallback(async (file: File) => {
    setUploading(true)
    
    // Simulate file processing
    setTimeout(() => {
      onFileUpload(file)
      setUploading(false)
    }, 1000)
  }, [onFileUpload])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (validateFile(file)) {
        handleFileUpload(file)
      }
    }
  }, [handleFileUpload])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateFile(file)) {
        handleFileUpload(file)
      }
    }
  }

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".csv,.txt,.xlsx,.xls"
          onChange={handleChange}
        />
        
        {uploading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-sm text-gray-600">Processing file...</span>
          </div>
        ) : (
          <div>
            <div className="mx-auto h-12 w-12 text-gray-400 mb-3">
              📄
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">
                Drop your file here, or{' '}
                <span className="text-blue-600 underline">browse</span>
              </p>
              <p className="text-gray-500 mt-1">
                Supports CSV, TXT, XLSX files up to 10MB
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        <p><strong>File format:</strong> One mobile number per line or comma-separated</p>
        <p><strong>Example:</strong> +919876543210, +919876543211</p>
      </div>
    </div>
  )
}