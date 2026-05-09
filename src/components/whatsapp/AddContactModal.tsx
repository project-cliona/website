"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/schema/phonebook.schema";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createContact, fetchTags } from "@/lib/api/whatsapp/contacts";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { X } from "lucide-react";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AddContactModal({ open, onClose }: Props) {
  const qc = useQueryClient();
  const [tagInput, setTagInput] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: existingTags = [] } = useQuery({
    queryKey: ["whatsapp-tags"],
    queryFn: fetchTags,
    staleTime: 60_000,
  });

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      countryCode: "91",
      phoneNumber: "",
      name: "",
      email: "",
      tags: [],
    },
  });

  const mutation = useMutation({
    mutationFn: async (v: ContactFormValues) => {
      const phone = `${v.countryCode}${v.phoneNumber}`;
      return createContact({
        phone,
        name: v.name || null,
        email: v.email || null,
        tags: v.tags,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["whatsapp-contacts"] });
      qc.invalidateQueries({ queryKey: ["whatsapp-tags"] });
      form.reset();
      onClose();
    },
    onError: (e: Error) => setSubmitError(e.message),
  });

  if (!open) return null;

  const tags = form.watch("tags");
  const addTag = (t: string) => {
    const clean = t.trim().toLowerCase();
    if (!clean || tags.includes(clean)) return;
    form.setValue("tags", [...tags, clean]);
    setTagInput("");
  };
  const removeTag = (t: string) =>
    form.setValue(
      "tags",
      tags.filter((x) => x !== t)
    );

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Add contact</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <form
          onSubmit={form.handleSubmit((v) => {
            setSubmitError(null);
            mutation.mutate(v);
          })}
          className="p-6 space-y-4"
        >
          <div>
            <Label>Phone number *</Label>
            <div className="flex gap-2 mt-1">
              <Controller
                name="countryCode"
                control={form.control}
                render={({ field }) => (
                  <Input {...field} className="w-20" placeholder="91" />
                )}
              />
              <Controller
                name="phoneNumber"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="flex-1"
                    placeholder="9876543210"
                  />
                )}
              />
            </div>
            {form.formState.errors.phoneNumber && (
              <p className="text-xs text-red-500 mt-1">
                {form.formState.errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div>
            <Label>Name</Label>
            <Controller
              name="name"
              control={form.control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value ?? ""}
                  className="mt-1"
                />
              )}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Controller
              name="email"
              control={form.control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value ?? ""}
                  type="email"
                  className="mt-1"
                />
              )}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label>Tags</Label>
            <div className="mt-1 flex flex-wrap gap-1 mb-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 bg-gray-100 text-sm rounded inline-flex items-center gap-1"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <Input
              placeholder="Type tag and press Enter"
              value={tagInput}
              list="existing-tags"
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(tagInput);
                }
              }}
            />
            <datalist id="existing-tags">
              {existingTags.map((t) => (
                <option key={t.tag} value={t.tag} />
              ))}
            </datalist>
          </div>

          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
              {submitError}
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Adding…" : "Add contact"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
