'use client'

import { useState } from 'react'
import { MobilePreview } from '@/components/ui/MobilePreview'
import { PageHeading } from '@/components/PageHeading'
import { CreateTemplateForm, createTemplateSchema } from '@/lib/schema/createTemplate.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Label } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function CreateTemplate() {

  const {
    control,
     handleSubmit: rhfSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateTemplateForm>({
    resolver: zodResolver(createTemplateSchema),
    mode: "onChange",
    defaultValues: {
      templateName: "",
      templateType: "Standalone",
      selectedAgent: "",
      agentCategory: "",
      cardTitle: "",
      cardDescription: "",
      suggestions: [
        { actionType: "Reply", suggestionText: "", postbackText: "" }
      ],
    },
  })

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

  const onSubmit = (data: CreateTemplateForm) => {
  console.log("Template Data:", data);
  alert("Template created successfully!");
};

  return (
    <div className="space-y-6">
      <PageHeading
        title="Create Template"
        subtitle="Define the content and settings to create a new template."
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="templateName" className="mb-2 block">
                  Template Name *
                </Label>
                <Controller
                  name="templateName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        id="templateName"
                        placeholder="Enter template name"
                        {...field}
                      />
                      {fieldState.error && (
                        <p className="mt-1 text-sm text-red-500">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="templateType" className="mb-2 block">
                  Template Type
                </Label>
                <Controller
                  name="templateType"
                  control={control}
                  render={({ field }) => (
                    <Select {...field}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standalone">Standalone</SelectItem>
                        <SelectItem value="Carousel">Carousel</SelectItem>
                        <SelectItem value="List">List</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.templateType && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.templateType.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="selectedAgent" className="mb-2 block">
                  Agent Name *
                </Label>
                <Controller
                  name="selectedAgent"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      onValueChange={(value) => handleAgentChange(value)} // keep your logic
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an agent" />
                      </SelectTrigger>
                      <SelectContent>
                        {agents.map(agent => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.selectedAgent && (
                  <p className="text-sm text-red-500 mt-1">{errors.selectedAgent.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="agentCategory" className="mb-2 block">
                  Agent Category
                </Label>
                <Input
                  id="agentCategory"
                  value={agentCategory}
                  disabled
                  className="bg-gray-100"
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
                <Label htmlFor="cardTitle" className="mb-2 block">
                  Card Title *
                </Label>

                <Controller
                  name="cardTitle"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        id="cardTitle"
                        placeholder="Enter card title"
                        maxLength={100}
                        {...field}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {field.value?.length || 0}/100 characters
                      </p>
                      {fieldState.error && (
                        <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="cardDescription" className="mb-2 block">
                  Card Description *
                </Label>

                <Controller
                  name="cardDescription"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Textarea
                        id="cardDescription"
                        placeholder="Enter card description"
                        maxLength={300}
                        className="h-24"
                        {...field}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {field.value?.length || 0}/300 characters
                      </p>
                      {fieldState.error && (
                        <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>
                      )}
                    </>
                  )}
                />
              </div>

              <div>
                <div>
                  <Label className="mb-2 block">
                    Variables
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {['name', 'phone', 'email', 'company', 'amount'].map(variable => (
                      <Badge
                        key={variable}
                        variant="default"
                        className="cursor-pointer hover:opacity-80"
                        onClick={() => insertVariable(variable)}
                      >
                        #{variable}#
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Suggestions (Buttons) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Suggestions (Buttons)</h2>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={addSuggestion}
              >
                <Plus className="w-4 h-4" />
                Add Button
              </Button>
            </div>

            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">Button {index + 1}</h3>
                    {suggestions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSuggestion(suggestion.id)}
                        className="p-1"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor={`actionType-${suggestion.id}`}>
                        Action Type
                      </Label>
                      <Controller
                        name={`suggestions.${index}.actionType`}
                        control={control}
                        render={({ field }) => (
                          <Select {...field}>
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="Select action" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Reply">Reply</SelectItem>
                              <SelectItem value="URL">URL</SelectItem>
                              <SelectItem value="Postback">Postback</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`suggestionText-${suggestion.id}`}>
                        Suggestion Text
                      </Label>
                      <Controller
                        name={`suggestions.${index}.suggestionText`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Button text"
                            id={`suggestionText-${suggestion.id}`}
                          />
                        )}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`postbackText-${suggestion.id}`}>
                        Postback Text
                      </Label>
                      <Controller
                        name={`suggestions.${index}.postbackText`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Postback value"
                            id={`postbackText-${suggestion.id}`}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={rhfSubmit(onSubmit)}
              disabled={!isValid || isSubmitting}
              variant="default"
              size="lg"
            >
              {isSubmitting ? "Creating..." : "Create Template"}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
            >
              Cancel
            </Button>
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