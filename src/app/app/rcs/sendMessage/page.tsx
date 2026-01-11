'use client'

import { MobilePreview } from '@/components/ui/MobilePreview'
import { FileUpload } from "@/components/ui/FileUpload"
import { PageHeading } from '@/components/PageHeading'
import { useQuery } from '@tanstack/react-query'
import { fetchAgents } from '@/lib/api/rcs/agents'
import { Label } from '@/components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Controller, useForm } from 'react-hook-form'
import { SendRCSForm, sendRCSSchema } from '@/lib/schema/rcs.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from '@/components/ui/Textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/Button'
import { fetchTemplatesByAgentID } from '@/lib/api/rcs/templates'
import { RCSTemplate } from '@/lib/type'
export default function SendMessage() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SendRCSForm>({
    resolver: zodResolver(sendRCSSchema),
    defaultValues: {
      agentID: "",
      templateID: "",
      mobileNumbers: "",
      removeDuplicates: false,
      uploadedFile: null,
    },
  })

  const selectedAgent = watch("agentID")
  const selectedTemplate = watch("templateID")
  const mobileNumbers = watch("mobileNumbers")

  const userId = 2

  const { data: agentData } = useQuery({
    queryKey: ['agents', userId],
    queryFn: () => fetchAgents(userId),
  })

  const { data: templateData } = useQuery({
    queryKey: ['agents', selectedAgent],
    queryFn: () => fetchTemplatesByAgentID(selectedAgent),
  })

  const template: RCSTemplate = templateData?.find(
    (temp: RCSTemplate) => temp.id.toString() === selectedTemplate
  );

  const onSubmit = (data: SendRCSForm) => {
    console.log("Form submitted:", data);
    // Here you can call your API to send the RCS campaign
  };

  return (
    <div className="space-y-8">
      <PageHeading
        title="Send RCS"
        subtitle="Create and send RCS campaigns to your audience"
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Campaign Settings
              </h2>

              <div className="space-y-4">
                {/* Agent */}
                <div>
                  <Label className="mb-2 block">Agent Name *</Label>
                  <Controller
                    name="agentID"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
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
                  {errors.agentID && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.agentID.message}
                    </p>
                  )}
                </div>

                {/* Template */}
                <div>
                  <Label className="mb-2 block">Select Template *</Label>
                  <Controller
                    name="templateID"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!selectedAgent || !templateData || templateData.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a template" />
                        </SelectTrigger>
                        <SelectContent>
                          {templateData && templateData.length > 0 ? (
                            templateData.map((template: RCSTemplate) => (
                              <SelectItem key={template.id} value={template.id.toString()}>
                                {template.templateName} ({template.templateType})
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-template" disabled>
                              No templates available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {!selectedAgent && (
                    <p className="text-sm text-gray-500 mt-1">
                      Select an agent first
                    </p>
                  )}
                  {errors.templateID && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.templateID.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Numbers */}
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Mobile Numbers
              </h2>

              <div className="space-y-4">
                <Controller
                  name="mobileNumbers"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label>Enter Mobile Numbers</Label>
                      <Textarea
                        {...field}
                        rows={6}
                        placeholder="Enter numbers separated by commas or new lines"
                      />
                      {errors.mobileNumbers && (
                        <p className="text-sm text-red-500">
                          {errors.mobileNumbers.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    OR Upload File
                  </p>
                  <Controller
                    name="uploadedFile"
                    control={control}
                    render={({ field }) => (
                      <FileUpload onFileUpload={field.onChange} />
                    )}
                  />
                </div>

                <Controller
                  name="removeDuplicates"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                      <Label className="cursor-pointer">
                        Remove duplicate numbers
                      </Label>
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full">
              Send Campaign
            </Button>
          </div>

          {/* Mobile Preview */}
          <div className="lg:col-span-1">
            <MobilePreview title={template?.cards[0].cardTitle}
              description={template?.cards[0].cardDescription}
              fileUrl={template?.cards[0].fileUrl}
              suggestions={template?.cards[0].suggestions} />
          </div>
        </div>
      </form>
    </div>
  )
}