'use client'

import { useState } from 'react'
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAgentSchema, CreateAgentForm } from "@/lib/schema/createAgent.schema";
import TextInput from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Label from "@/components/ui/Label";
import Button from '@/components/ui/Button';

export default function CreateAgent() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, errors, isSubmitting },
  } = useForm<CreateAgentForm>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: {
      userName: "",
      agentname: "",
      brandName: "",
      agentdescription: "",
      billingcategory: "OTP",
      brandcolor: "#3B82F6",
      country: "India",
      phoneno: "",
      labelphoneno: "",
      email: "",
      labelemail: "",
      website: "",
      labelwebsite: "",
      spocname: "",
      spocemail: "",
      spocphonenumber: "",
      optinUrl: "",
      termconditonURL: "",
      privacypolicyURL: "",
      status: "Pending",
    },
  });

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)

  const users = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Mike Johnson' }
  ]

  const countries = ['India']

  const handleFileUpload = (type: 'logo' | 'banner', file: File | null) => {
    if (type === 'logo') {
      setLogoFile(file)
    } else {
      setBannerFile(file)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Add New Agent</h1>
      <div>
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>User Name *</Label>
              <Controller
                name="userName"
                control={control}
                render={({ field }) => (
                  <Select {...field}>
                    <option value="">Select a user</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.name}>
                        {user.name}
                      </option>
                    ))}
                  </Select>
                )}
              />
              {errors.userName && (
                <p className="text-xs text-red-500 mt-1">{errors.userName.message}</p>
              )}
            </div>

            <div>
              <Label>Agent Category *</Label>
              <Controller
                name="billingcategory"
                control={control}
                render={({ field }) => (
                  <Select {...field}>
                    <option value="OTP">OTP</option>
                    <option value="Transactional">Transactional</option>
                    <option value="Promotional">Promotional</option>
                  </Select>
                )}
              />
              <p className="text-xs text-red-500">{errors.billingcategory?.message}</p>
            </div>

            <div className="md:col-span-2">
              <Label>Agent Name *</Label>
              <Controller
                name="agentname"
                control={control}
                render={({ field }) => (
                  <TextInput {...field} placeholder="Enter agent name" />
                )}
              />
              <p className="text-xs text-red-500">{errors.agentname?.message}</p>
            </div>

            <div className="md:col-span-2">
              <Label>Brand Name *</Label>
              <Controller
                name="brandName"
                control={control}
                render={({ field }) => (
                  <TextInput {...field} placeholder="Enter brand name" />
                )}
              />
              <p className="text-xs text-red-500">{errors.brandName?.message}</p>
            </div>

            <div className="md:col-span-2">
              <Label>Description *</Label>
              <Controller
                name="agentdescription"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
                    placeholder="Describe the agent's purpose and services"
                  />
                )}
              />
              <p className="text-xs text-red-500">{errors.agentdescription?.message}</p>
            </div>

            <div>
              <Label>Brand Color</Label>
              <Controller
                name="brandcolor"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-3">
                    <input type="color" {...field} className="h-10 w-12 rounded border" />
                    <TextInput {...field} />
                  </div>
                )}
              />
            </div>

            <div>
              <Label>Country *</Label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Select {...field}>
                    {countries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </Select>
                )}
              />
              <p className="text-xs text-red-500">{errors.country?.message}</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label>Primary Phone *</Label>
                <Controller
                  name="phoneno"
                  control={control}
                  render={({ field }) => (
                    <TextInput {...field} placeholder="+91-0000000000" />
                  )}
                />
                <p className="text-xs text-red-500">{errors.phoneno?.message}</p>
              </div>
              <div>
                <Label>Phone Label</Label>
                <Controller
                  name="labelphoneno"
                  control={control}
                  render={({ field }) => <TextInput {...field} />}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label>Email *</Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextInput type="email" {...field} />
                  )}
                />
                <p className="text-xs text-red-500">{errors.email?.message}</p>
              </div>
              <div>
                <Label>Email Label</Label>
                <Controller
                  name="labelemail"
                  control={control}
                  render={({ field }) => <TextInput {...field} />}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label>Website *</Label>
                <Controller
                  name="website"
                  control={control}
                  render={({ field }) => (
                    <TextInput type="url" {...field} />
                  )}
                />
                <p className="text-xs text-red-500">{errors.website?.message}</p>
              </div>
              <div>
                <Label>Website Label</Label>
                <Controller
                  name="labelwebsite"
                  control={control}
                  render={({ field }) => <TextInput {...field} />}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SPOC Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">SPOC (Single Point of Contact)</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>SPOC Name *</Label>
              <Controller
                name="spocname"
                control={control}
                render={({ field }) => <TextInput {...field} />}
              />
              <p className="text-xs text-red-500">{errors.spocname?.message}</p>
            </div>

            <div>
              <Label>SPOC Email *</Label>
              <Controller
                name="spocemail"
                control={control}
                render={({ field }) => (
                  <TextInput type="email" {...field} />
                )}
              />
              <p className="text-xs text-red-500">{errors.spocemail?.message}</p>
            </div>

            <div>
              <Label>SPOC Phone *</Label>
              <Controller
                name="spocphonenumber"
                control={control}
                render={({ field }) => (
                  <TextInput type="tel" {...field} />
                )}
              />
              <p className="text-xs text-red-500">{errors.spocphonenumber?.message}</p>
            </div>
          </div>
        </div>

        {/* Media Upload */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Brand Assets</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo Upload *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload('logo', e.target.files?.[0] || null)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
              />
              {logoFile && (
                <p className="text-sm text-green-600 mt-2">
                  ✅ Logo uploaded: {logoFile.name}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">Recommended: 200x200px, PNG/JPG</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner Image Upload *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload('banner', e.target.files?.[0] || null)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
              />
              {bannerFile && (
                <p className="text-sm text-green-600 mt-2">
                  ✅ Banner uploaded: {bannerFile.name}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">Recommended: 1200x600px, PNG/JPG</p>
            </div>
          </div>
        </div>

        {/* Legal & Compliance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Legal & Compliance</h2>

          <div className="space-y-4">
            <div>
              <Label>Opt-in URL *</Label>
              <Controller
                name="optinUrl"
                control={control}
                render={({ field }) => (
                  <TextInput type="url" {...field} />
                )}
              />
              <p className="text-xs text-red-500">{errors.optinUrl?.message}</p>
              <p className="text-xs text-gray-500 mt-1">URL where users can opt-in to receive messages</p>
            </div>

            <div>
              <Label>Terms URL *</Label>
              <Controller
                name="termconditonURL"
                control={control}
                render={({ field }) => (
                  <TextInput type="url" {...field} />
                )}
              />
              <p className="text-xs text-red-500">{errors.termconditonURL?.message}</p>
            </div>

            <div>
              <Label>Privacy URL *</Label>
              <Controller
                name="privacypolicyURL"
                control={control}
                render={({ field }) => (
                  <TextInput type="url" {...field} />
                )}
              />
              <p className="text-xs text-red-500">{errors.privacypolicyURL?.message}</p>
            </div>

            <div>
              <Label>Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select {...field}>
                    <option value="Pending">Pending</option>
                    <option value="Active">Active</option>
                    <option value="Rejected">Rejected</option>
                  </Select>
                )}
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Agent"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}