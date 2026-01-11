'use client'

import { useEffect } from 'react'
import { MobilePreview } from '@/components/ui/MobilePreview'
import { PageHeading } from '@/components/PageHeading'
import { CreateTemplateForm, createTemplateSchema } from '@/lib/schema/rcs.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Label } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/badge'
import { Info, Plus, Trash2, Image, CreditCard, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import SubHeading from '@/components/SubHeading'
import { useQuery } from '@tanstack/react-query'
import { fetchAgents } from '@/lib/api/rcs/agents'
import { authenticatedApiClient } from '@/lib/axios'

export default function CreateTemplate() {
  const userId = 2

  const { data: agentData } = useQuery({
    queryKey: ['agents', userId],
    queryFn: () => fetchAgents(userId),
  })

  // React Hook Form
  const {
    control,
    handleSubmit: rhfSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateTemplateForm>({
    resolver: zodResolver(createTemplateSchema),
    mode: 'onChange',
    defaultValues: {
      templateName: '',
      templateType: 'standalone',
      agentID: '',
      agentCategory: '',
      cardTitle: '',
      cardDescription: '',
      mediaFile: null,
      suggestions: [{ actionType: 'reply', displayText: '', actionData: '' }],
    },
  })

  // Manage suggestions with useFieldArray
  const { fields: suggestions, append, remove } = useFieldArray({
    control,
    name: 'suggestions',
  })

  const addSuggestion = () => {
    append({ actionType: 'reply', displayText: '', actionData: '' })
  }

  const removeSuggestionByIndex = (index: number) => {
    remove(index)
  }

  // Update agentCategory automatically when agent changes
  const selectedAgentId = watch('agentID')
  useEffect(() => {
    if (!selectedAgentId || !agentData) return

    const category =
      agentData.find((agent) => agent.id === selectedAgentId)?.billingcategory ?? ''

    setValue('agentCategory', category, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }, [selectedAgentId, agentData, setValue])

  const cardTitle = watch('cardTitle');
  const cardDescription = watch('cardDescription');
  const mediaFile = watch('mediaFile');
  const suggestionsPreview = watch('suggestions');

  // Submit handler
  const onSubmit = async (data: CreateTemplateForm) => {
    try {
      console.log('Submitting template data:', data)
      const filePath = await uploadImage(data.mediaFile);
      const payload = {
        userId: 2,
        agentID: data.agentID,
        templateType: data.templateType,
        templateName: data.templateName,
        cardOrientation: 'vertical',
        templateTypeTxt: data.templateType,
        status: 'pending',
        cards: [
          {
            cardTitle: data.cardTitle,
            cardDescription: data.cardDescription,
            mediaType: data.mediaFile?.type.startsWith('image') ? 'image' : 'video',
            mediaHeight: 'medium',
            fileUrl: filePath,
            filePath: filePath,
            cardOrder: 1,
            suggestions: data.suggestions.map((sug) => ({
              actionType: sug.actionType,
              displayText: sug.displayText,
              actionData: sug.actionData || null,
            })),
          },
        ],
      };

      console.log(payload)

      const res = await authenticatedApiClient().post('/rcs/template', payload)
      alert('Template created successfully ✅')
    } catch (error) {
      console.error('Template creation failed:', error)
      alert('Failed to create template ❌')
    }
  }

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await authenticatedApiClient().post(
      "/common/upload",
      formData
    );

    return res.data.result.url;
  };

  return (
    <div className="space-y-6">
      <PageHeading title="Create Template" subtitle="Define the content and settings to create a new template." />
      <form onSubmit={rhfSubmit(
        onSubmit,
        (errors) => console.log("Validation errors:", errors)
      )} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <SubHeading title="Basic Information" Icon={Info} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Template Name */}
              <div>
                <Label htmlFor="templateName" className="mb-2 block">Template Name *</Label>
                <Controller
                  name="templateName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Input id="templateName" placeholder="Enter template name" {...field} />
                      {fieldState.error && <p className="mt-1 text-sm text-red-500">{fieldState.error.message}</p>}
                    </>
                  )}
                />
              </div>

              {/* Template Type */}
              <div>
                <Label htmlFor="templateType" className="mb-2 block">Template Type</Label>
                <Controller
                  name="templateType"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standalone">Standalone</SelectItem>
                        <SelectItem value="carousel">Carousel</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.templateType && <p className="text-sm text-red-500 mt-1">{errors.templateType.message}</p>}
              </div>

              {/* Agent Name */}
              <div>
                <Label htmlFor="agentID" className="mb-2 block">Agent Name *</Label>
                <Controller
                  name="agentID"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an agent" />
                      </SelectTrigger>
                      <SelectContent>
                        {agentData?.map((agent) => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.agentID && <p className="text-sm text-red-500 mt-1">{errors.agentID.message}</p>}
              </div>

              {/* Agent Category */}
              <div>
                <Label htmlFor="agentCategory" className="mb-2 block">Agent Category</Label>
                <Controller
                  name="agentCategory"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} disabled className="bg-gray-100" />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Card Title */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <SubHeading title="Card Content" Icon={Image} />
            <div>
              <Label htmlFor="cardTitle" className="mb-2 block">Card Title *</Label>
              <Controller
                name="cardTitle"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Input id="cardTitle" placeholder="Enter card title" {...field} />
                    {fieldState.error && <p className="mt-1 text-sm text-red-500">{fieldState.error.message}</p>}
                  </>
                )}
              />
            </div>

            {/* Card Description */}
            <div className='mt-4'>
              <Label htmlFor="cardDescription" className="mb-2 block">Card Description *</Label>
              <Controller
                name="cardDescription"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Textarea id="cardDescription" placeholder="Enter card description" {...field} />
                    {fieldState.error && <p className="mt-1 text-sm text-red-500">{fieldState.error.message}</p>}
                  </>
                )}
              />
            </div>
          </div>

          {/* Media Upload */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <SubHeading title="Media Content" Icon={Image} />
            <Controller
              name="mediaFile"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Media (Image/Video)
                  </label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
                        field.onChange(file) // set file in RHF state
                      } else {
                        alert('Please upload an image or video file')
                      }
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
                  />
                  {field.value && (
                    <p className="text-sm text-green-600 mt-2">
                      File uploaded: {(field.value as File).name}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Suggestions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <SubHeading title="Suggestions (Buttons)" Icon={Lightbulb} />
              <Button type="button" variant="default" size="sm" onClick={addSuggestion} disabled={suggestions.length >= 3}>
                <Plus className="w-4 h-4" /> Add Button
              </Button>
            </div>
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">Button {index + 1}</h3>
                    {suggestions.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeSuggestionByIndex(index)} className="p-1">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label>Action Type</Label>
                      <Controller
                        name={`suggestions.${index}.actionType`}
                        control={control}
                        render={({ field }) => (
                          <Select {...field} onValueChange={field.onChange}>
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="Select action" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="reply">Reply</SelectItem>
                              <SelectItem value="url">URL</SelectItem>
                              <SelectItem value="postback">Postback</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div>
                      <Label>Suggestion Text</Label>
                      <Controller
                        name={`suggestions.${index}.displayText`}
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Button text" />}
                      />
                    </div>
                    <div>
                      <Label>Postback Text</Label>
                      <Controller
                        name={`suggestions.${index}.actionData`}
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Postback value" />}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="submit" variant="default" size="lg">
              {isSubmitting ? 'Creating...' : 'Create Template'}
            </Button>
          </div>
        </div>
        <div className="lg:col-span-1">
          <MobilePreview title={cardTitle}
            description={cardDescription}
            mediaFile={mediaFile}
            suggestions={suggestionsPreview} />
        </div>
      </form>
    </div>
  )
}
