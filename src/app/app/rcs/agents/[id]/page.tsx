'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchAgentById } from '@/lib/api/rcs/agents'
import { useParams } from 'next/navigation'
import { Agent } from '@/lib/type'
import { PageHeading } from '@/components/PageHeading'
import SubHeading from '@/components/SubHeading'
import { Label } from '@/components/ui/Label'
import { Info, Palette, Phone, Scale, UserCheck } from 'lucide-react'

const ReadOnlyValue = ({ value }: { value?: string | null }) => (
  <div className="mt-1 text-sm text-gray-500 break-all">
    {value && value.trim() !== '' ? value : '—'}
  </div>
)

export default function CreateAgent() {
  const params = useParams()
  const id = params.id as string

  const { data: agentData, isLoading, error } = useQuery<Agent>({
    queryKey: ['agents', id],
    queryFn: () => fetchAgentById(id),
  })

  if (isLoading) {
    return <div className="p-6">Loading agent details...</div>
  }

  if (error || !agentData) {
    return <div className="p-6 text-red-500">Failed to load agent.</div>
  }

  return (
    <div className="space-y-6">

      {/* Page heading */}
      <PageHeading
        title="Agent profile"
        subtitle="View complete information of the registered RCS agent."
      />

      {/* Hero / header card */}
      <div className="relative overflow-hidden rounded-xl border bg-white">

        {/* Banner */}
        <div className="h-44 w-full bg-gray-100">
          {agentData.agentheroimageURL && (
            <img
              src={agentData.agentheroimageURL}
              className="h-full w-full object-cover"
              alt="Agent banner"
            />
          )}
        </div>

        {/* Header content */}
        <div className="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-white">
              {agentData.agentlogo && (
                <img
                  src={agentData.agentlogo}
                  className="h-full w-full object-contain p-1"
                  alt="Agent logo"
                />
              )}
            </div>

            {/* <div>
              <div className="text-lg font-semibold text-gray-900">
                {agentData.agentname}
              </div>
              <div className="text-sm text-gray-500">
                {agentData.billingcategory}
              </div>
            </div> */}
          </div>

          <div>
            <span
              className={`inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold
                ${
                  agentData.status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : agentData.status === 'Rejected'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }
              `}
            >
              {agentData.status}
            </span>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* LEFT COLUMN */}
        <div className="space-y-6 lg:col-span-2">

          {/* Basic information */}
          <div className="rounded-xl border bg-white p-6">
            <SubHeading title="Basic Information" Icon={Info} />

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>Agent Category</Label>
                <ReadOnlyValue value={agentData.billingcategory} />
              </div>

              <div>
                <Label>Brand color</Label>
                <div className="mt-1 flex items-center gap-2">
                  <div
                    className="h-5 w-5 rounded border"
                    style={{ backgroundColor: agentData.brandcolor }}
                  />
                  <span className="text-sm text-gray-800">
                    {agentData.brandcolor || '—'}
                  </span>
                </div>
              </div>

              <div className="md:col-span-2">
                <Label>Brand name</Label>
                <ReadOnlyValue value={agentData.agentbrand} />
              </div>

              <div className="md:col-span-2">
                <Label>Description</Label>
                <ReadOnlyValue value={agentData.agentdescription} />
              </div>

              <div>
                <Label>Country</Label>
                <ReadOnlyValue value="India" />
              </div>
            </div>
          </div>

          {/* Contact information */}
          <div className="rounded-xl border bg-white p-6">
            <SubHeading title="Contact Information" Icon={Phone} />

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">

              <div className="md:col-span-2">
                <Label>Primary phone</Label>
                <ReadOnlyValue value={agentData.phoneno} />
              </div>

              <div>
                <Label>Phone label</Label>
                <ReadOnlyValue value={agentData.labelphoneno} />
              </div>

              <div className="md:col-span-2">
                <Label>Email</Label>
                <ReadOnlyValue value={agentData.email} />
              </div>

              <div>
                <Label>Email label</Label>
                <ReadOnlyValue value={agentData.labelemail} />
              </div>

              <div className="md:col-span-2">
                <Label>Website</Label>
                {agentData.website ? (
                  <a
                    href={agentData.website}
                    target="_blank"
                    className="mt-1 block text-sm text-blue-600 underline"
                  >
                    {agentData.website}
                  </a>
                ) : (
                  <ReadOnlyValue value={null} />
                )}
              </div>

              <div>
                <Label>Website label</Label>
                <ReadOnlyValue value={agentData.labelwebsite} />
              </div>
            </div>
          </div>

          {/* Legal */}
          <div className="rounded-xl border bg-white p-6">
            <SubHeading title="Legal & Compliance" Icon={Scale} />

            <div className="mt-4 space-y-4">

              <div>
                <Label>Opt-in URL</Label>
                <ReadOnlyValue value={agentData.agentopt} />
              </div>

              <div>
                <Label>Terms & conditions URL</Label>
                {agentData.termconditonURL ? (
                  <a
                    href={agentData.termconditonURL}
                    target="_blank"
                    className="mt-1 block text-sm text-blue-600 underline"
                  >
                    {agentData.termconditonURL}
                  </a>
                ) : (
                  <ReadOnlyValue value={null} />
                )}
              </div>

              <div>
                <Label>Privacy policy URL</Label>
                {agentData.privacypolicyURL ? (
                  <a
                    href={agentData.privacypolicyURL}
                    target="_blank"
                    className="mt-1 block text-sm text-blue-600 underline"
                  >
                    {agentData.privacypolicyURL}
                  </a>
                ) : (
                  <ReadOnlyValue value={null} />
                )}
              </div>

              {agentData.disapproveReason && (
                <div>
                  <Label>Disapproval reason</Label>
                  <ReadOnlyValue value={agentData.disapproveReason} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          {/* SPOC */}
          <div className="rounded-xl border bg-white p-6">
            <SubHeading title="SPOC" Icon={UserCheck} />

            <div className="mt-4 space-y-4">
              <div>
                <Label>Name</Label>
                <ReadOnlyValue value={agentData.spocname} />
              </div>

              <div>
                <Label>Email</Label>
                <ReadOnlyValue value={agentData.spocemail} />
              </div>

              <div>
                <Label>Phone</Label>
                <ReadOnlyValue value={agentData.spocphonenumber} />
              </div>

              <div>
                <Label>Designation</Label>
                <ReadOnlyValue value={agentData.spocdesignation} />
              </div>
            </div>
          </div>

          {/* Brand assets */}
          {/* <div className="rounded-xl border bg-white p-6">
            <SubHeading title="Brand Assets" Icon={Palette} />

            <div className="mt-4 space-y-4">

              <div>
                <Label>Logo</Label>
                <div className="mt-2 flex h-28 items-center justify-center rounded border bg-gray-50">
                  {agentData.agentlogo ? (
                    <img
                      src={agentData.agentlogo}
                      className="max-h-24 object-contain"
                      alt="Logo"
                    />
                  ) : (
                    <span className="text-sm text-gray-400">No logo</span>
                  )}
                </div>
              </div>

              <div>
                <Label>Banner</Label>
                <div className="mt-2 overflow-hidden rounded border bg-gray-50">
                  {agentData.agentheroimageURL ? (
                    <img
                      src={agentData.agentheroimageURL}
                      className="h-32 w-full object-cover"
                      alt="Banner"
                    />
                  ) : (
                    <div className="flex h-32 items-center justify-center text-sm text-gray-400">
                      No banner
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div> */}

        </div>
      </div>
    </div>
  )
}
