'use client'

import { useState } from 'react'
import { MobilePreview } from '@/components/ui/MobilePreview'

export default function CreateTemplate() {
  const [templateName, setTemplateName] = useState('')
  const [templateType, setTemplateType] = useState('Standalone')
  const [selectedAgent, setSelectedAgent] = useState('')
  const [agentCategory, setAgentCategory] = useState('')
  const [cardTitle, setCardTitle] = useState('')
  const [cardDescription, setCardDescription] = useState('')
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [suggestions, setSuggestions] = useState([
    { id: '1', actionType: 'Reply', suggestionText: '', postbackText: '' }
  ])

  const agents = [
    { id: '1', name: 'E-commerce Store', category: 'Promotional' },
    { id: '2', name: 'Banking Services', category: 'Transactional' },
    { id: '3', name: 'Healthcare OTP', category: 'OTP' }
  ]

  const templates = [
    { id: '1', name: templateName || 'New Template', type: templateType, agentId: selectedAgent }
  ]

  const handleAgentChange = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId)
    setSelectedAgent(agentId)
    setAgentCategory(agent?.category || '')
  }

  const addSuggestion = () => {
    setSuggestions([
      ...suggestions,
      { id: Date.now().toString(), actionType: 'Reply', suggestionText: '', postbackText: '' }
    ])
  }

  const removeSuggestion = (id: string) => {
    setSuggestions(suggestions.filter(s => s.id !== id))
  }

  const updateSuggestion = (id: string, field: string, value: string) => {
    setSuggestions(suggestions.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ))
  }

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      setMediaFile(file)
    } else {
      alert('Please upload an image or video file')
    }
  }

  const insertVariable = (variable: string) => {
    setCardDescription(prev => prev + `#{${variable}#}`)
  }

  const handleSubmit = () => {
    const templateData = {
      templateName,
      templateType,
      agentName: agents.find(a => a.id === selectedAgent)?.name,
      agentCategory,
      cardTitle,
      cardDescription,
      mediaFile: mediaFile?.name,
      suggestions: suggestions.filter(s => s.suggestionText.trim() !== '')
    }
    console.log('Template data:', templateData)
    alert('Template created successfully!')
  }

  return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Create Template</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
                    placeholder="Enter template name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Type
                  </label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
                    value={templateType}
                    onChange={(e) => setTemplateType(e.target.value)}
                  >
                    <option value="Standalone">Standalone</option>
                    <option value="Carousel">Carousel</option>
                    <option value="List">List</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agent Name *
                  </label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
                    value={selectedAgent}
                    onChange={(e) => handleAgentChange(e.target.value)}
                  >
                    <option value="" className="text-gray-500">Choose an agent</option>
                    {agents.map(agent => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agent Category
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                    value={agentCategory}
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Media Upload */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Media Content</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Media (Image/Video)
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
                />
                {mediaFile && (
                  <p className="text-sm text-green-600 mt-2">
                    ✅ File uploaded: {mediaFile.name}
                  </p>
                )}
              </div>
            </div>

            {/* Card Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Card Content</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Title *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
                    placeholder="Enter card title"
                    value={cardTitle}
                    onChange={(e) => setCardTitle(e.target.value)}
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-500 mt-1">{cardTitle.length}/100 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Description *
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-500 h-24"
                    placeholder="Enter card description"
                    value={cardDescription}
                    onChange={(e) => setCardDescription(e.target.value)}
                    maxLength={300}
                  />
                  <p className="text-xs text-gray-500 mt-1">{cardDescription.length}/300 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variables
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['name', 'phone', 'email', 'company', 'amount'].map(variable => (
                      <button
                        key={variable}
                        type="button"
                        onClick={() => insertVariable(variable)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200"
                      >
                        #{variable}#
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Suggestions (Buttons) */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Suggestions (Buttons)</h2>
                <button
                  type="button"
                  onClick={addSuggestion}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  + Add Button
                </button>
              </div>

              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">Button {index + 1}</h3>
                      {suggestions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSuggestion(suggestion.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Action Type
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={suggestion.actionType}
                          onChange={(e) => updateSuggestion(suggestion.id, 'actionType', e.target.value)}
                        >
                          <option value="Reply">Reply</option>
                          <option value="URL">URL</option>
                          <option value="Postback">Postback</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Suggestion Text
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Button text"
                          value={suggestion.suggestionText}
                          onChange={(e) => updateSuggestion(suggestion.id, 'suggestionText', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Postback Text
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Postback value"
                          value={suggestion.postbackText}
                          onChange={(e) => updateSuggestion(suggestion.id, 'postbackText', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={!templateName || !selectedAgent || !cardTitle || !cardDescription}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Create Template
              </button>
              <button
                type="button"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Mobile Preview */}
          <div className="lg:col-span-1">
            <MobilePreview 
              selectedAgent={selectedAgent}
              selectedTemplate="1"
              agents={agents}
              templates={templates}
            />
          </div>
        </div>
      </div>
  )
}