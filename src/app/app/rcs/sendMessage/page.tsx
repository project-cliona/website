'use client'

import { useState } from 'react'
import { MobilePreview } from '@/components/ui/MobilePreview'
import { FileUpload } from "@/components/ui/FileUpload"
export default function SendMessage() {
  const [selectedAgent, setSelectedAgent] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [mobileNumbers, setMobileNumbers] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [removeDuplicates, setRemoveDuplicates] = useState(true)

  const agents = [
    { id: '1', name: 'E-commerce Store', category: 'Promotional' },
    { id: '2', name: 'Banking Services', category: 'Transactional' },
    { id: '3', name: 'Healthcare OTP', category: 'OTP' }
  ]

  const templates = [
    { id: '1', name: 'Holiday Sale', type: 'Standalone', agentId: '1' },
    { id: '2', name: 'Account Statement', type: 'Standalone', agentId: '2' },
    { id: '3', name: 'Login OTP', type: 'Standalone', agentId: '3' }
  ]

  const filteredTemplates = templates.filter(t => t.agentId === selectedAgent)

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
  }

  const handleSubmit = () => {
    const data = {
      agent: selectedAgent,
      template: selectedTemplate,
      mobileNumbers: mobileNumbers,
      uploadedFile: uploadedFile?.name,
      removeDuplicates
    }
    console.log('Campaign data:', data)
    alert('Campaign submitted successfully!')
  }

  return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Send RCS Message</h1>
          <p className="text-gray-600 mt-1">Create and send RCS campaigns to your audience</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Campaign Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Agent
                  </label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                  >
                    <option value="" className="text-gray-500">Choose an agent</option>
                    {agents.map(agent => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name} ({agent.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Template
                  </label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    disabled={!selectedAgent}
                  >
                    <option value="" className="text-gray-500">Choose a template</option>
                    {filteredTemplates.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name} ({template.type})
                      </option>
                    ))}
                  </select>
                  {!selectedAgent && (
                    <p className="text-sm text-gray-500 mt-1">Select an agent first</p>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Numbers Section */}
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Mobile Numbers</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Mobile Numbers
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-500 h-32"
                    placeholder="Enter mobile numbers separated by commas or new lines&#10;Example:&#10;+919876543210&#10;+919876543211&#10;+919876543212"
                    value={mobileNumbers}
                    onChange={(e) => setMobileNumbers(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Up to 100,000 numbers allowed. Separate by commas or new lines.
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">OR Upload File</p>
                  <FileUpload onFileUpload={handleFileUpload} />
                  {uploadedFile && (
                    <p className="text-sm text-green-600 mt-2">
                      ✅ File uploaded: {uploadedFile.name}
                    </p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="removeDuplicates"
                    checked={removeDuplicates}
                    onChange={(e) => setRemoveDuplicates(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="removeDuplicates" className="ml-2 text-sm text-gray-700">
                    Remove duplicate numbers
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!selectedAgent || !selectedTemplate || (!mobileNumbers && !uploadedFile)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Send Campaign
            </button>
          </div>

          {/* Mobile Preview */}
          <div className="lg:col-span-1">
            <MobilePreview 
              selectedAgent={selectedAgent}
              selectedTemplate={selectedTemplate}
              agents={agents}
              templates={templates}
            />
          </div>
        </div>
      </div>
  )
}