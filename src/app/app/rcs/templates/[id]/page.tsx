'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { RCSTemplate } from '@/lib/type'
import { PageHeading } from '@/components/PageHeading'
import SubHeading from '@/components/SubHeading'
import { Label } from '@/components/ui/Label'
import { Info, Layout, Layers, MessageSquare, ShieldCheck } from 'lucide-react'
import { getTemplateById } from '@/lib/api/rcs/templates'

const ReadOnlyValue = ({ value }: { value?: string | null }) => (
  <div className="mt-1 text-sm text-gray-700 break-all">
    {value && value.trim() !== '' ? value : '—'}
  </div>
)

export default function TemplateDetails() {
  const params = useParams()
  const id = params.id as string

  const { data, isLoading, error } = useQuery<RCSTemplate>({
    queryKey: ['rcs-template', id],
    queryFn: () => getTemplateById(id),
  })

  if (isLoading) return <div className="p-6">Loading template...</div>
  if (error || !data)
    return <div className="p-6 text-red-500">Failed to load template.</div>

  return (
    <div className="space-y-6">

      <PageHeading
        title="RCS Template"
        subtitle="View complete template configuration and cards."
      />

      {/* Hero header (same feeling as agent page) */}
      {/* <div className="rounded-xl border bg-white px-6 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <div className="text-lg font-semibold text-gray-900">
            {data.templateName}
          </div>
          <div className="text-sm text-gray-500">
            {data.templateTypeTxt}
          </div>
        </div>

        <span
          className={`inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold
            ${
              data.status === 'Approved'
                ? 'bg-green-100 text-green-700'
                : data.status === 'Rejected'
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
            }
          `}
        >
          {data.status}
        </span>
      </div> */}

      {/* Main grid – same structure */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* LEFT SIDE */}
        <div className="space-y-6 lg:col-span-2">

          {/* Basic info */}
          <div className="rounded-xl border bg-white p-6">
            <SubHeading title="Template Information" Icon={Info} />

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <Label>Template name</Label>
                <ReadOnlyValue value={data.templateName} />
              </div>

              <div>
                <Label>Template type</Label>
                <ReadOnlyValue value={data.templateTypeTxt} />
              </div>

              <div>
                <Label>Orientation</Label>
                <ReadOnlyValue value={data.cardOrientation} />
              </div>

              <div>
                <Label>Agent ID</Label>
                <ReadOnlyValue value={data.agentID} />
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="rounded-xl border bg-white p-6">
            <SubHeading title="Template Cards" Icon={Layers} />

            <div className="mt-4 space-y-5">

              {data.cards.map((card, index) => (
                <div
                  key={card.id}
                  className="rounded-lg border p-4 bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium text-gray-900">
                      Card {index + 1} – {card.cardTitle}
                    </div>
                    <span className="text-xs text-gray-500">
                      Order {card.cardOrder}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="md:col-span-2">
                      <Label>Description</Label>
                      <ReadOnlyValue value={card.cardDescription} />
                    </div>

                    <div>
                      <Label>Media type</Label>
                      <ReadOnlyValue value={card.mediaType} />
                    </div>

                    <div>
                      <Label>Media height</Label>
                      <ReadOnlyValue value={card.mediaHeight} />
                    </div>

                    <div className="md:col-span-2">
                      <Label>File URL</Label>
                      {card.fileUrl ? (
                        <a
                          href={card.fileUrl}
                          target="_blank"
                          className="mt-1 block text-sm text-blue-600 underline break-all"
                        >
                          {card.fileUrl}
                        </a>
                      ) : (
                        <ReadOnlyValue value={null} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">

          {/* Meta */}
          <div className="rounded-xl border bg-white p-6">
            <SubHeading title="Meta" Icon={Layout} />
              <div className='flex justify-between'>
                <div className="mt-4 space-y-4">

                          <div>
                              <Label>Template ID</Label>
                              <ReadOnlyValue value={String(data.id)} />
                          </div>

                          <div>
                              <Label>User ID</Label>
                              <ReadOnlyValue value={String(data.userId)} />
                          </div>

                          <div>
                              <Label>Created by</Label>
                              <ReadOnlyValue value={String(data.createdBy)} />
                          </div>

                      </div>
                      <div className="mt-4 space-y-4">

                          <div>
                              <Label>Created on</Label>
                              <ReadOnlyValue value={data.createdOn} />
                          </div>

                          <div>
                              <Label>Last modified</Label>
                              <ReadOnlyValue value={data.modifiedOn} />
                          </div>

                      </div>
              </div>
              
          </div>

          {/* Suggestions summary */}
          <div className="rounded-xl border bg-white p-6">
            <SubHeading title="Suggestions / Actions" Icon={MessageSquare} />

            <div className="mt-4 space-y-4 text-sm text-gray-700">

              {data.cards.map((card, i) => (
                <div key={card.id} className="space-y-2">

                  <div className="font-medium text-gray-900">
                    Card {i + 1}
                  </div>

                  {card.suggestions.length === 0 && (
                    <div className="text-gray-400">
                      No actions configured
                    </div>
                  )}

                  {card.suggestions.map((s, idx) => (
                    <div
                      key={idx}
                      className="rounded border bg-gray-50 p-2"
                    >
                      <div>
                        <span className="font-medium">Type:</span>{' '}
                        {s.actionType}
                      </div>
                      <div>
                        <span className="font-medium">Text:</span>{' '}
                        {s.displayText}
                      </div>
                      {s.actionData && (
                        <div>
                          <span className="font-medium">Data:</span>{' '}
                          {s.actionData}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
