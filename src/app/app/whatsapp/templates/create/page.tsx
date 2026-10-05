"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Megaphone, Bell, ShieldCheck } from "lucide-react";
import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { useWaba } from "@/providers/wabaProvider";
import { HEALTH_DOT_CLASS, wabaHealth, wabaLabel } from "@/lib/waba";
import { Category, categoryConfig, defaultSubType } from "@/lib/utils";

export default function CreateWhatsappTemplate() {
  const router = useRouter();
  const [category, setCategory] = useState<Category>("marketing");
  const [subType, setSubType] = useState<string>("default");

  const { selectedWabaId, selected, isReadOnly } = useWaba();

  // The builder keeps carrying wabaId in its URL rather than reading the
  // selection: a half-finished template is a long-lived page, and if the
  // user switches account mid-edit it must still submit to the account it
  // was started on.
  const wabaId = selectedWabaId;

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    setSubType(defaultSubType[newCategory]);
  };

  const selectedSubType = categoryConfig[category].subTypes.find(
    (st) => st.value === subType
  );
  const isSubTypeDisabled = selectedSubType?.disabled ?? false;
  const canProceed = !!wabaId && !isSubTypeDisabled && !isReadOnly;

  const handleNext = () => {
    if (!canProceed) return;
    router.push(
      `/app/whatsapp/templates/create/builder?category=${category}&type=${subType}&wabaId=${wabaId}`
    );
  };

  return (
    <div className="space-y-6">
      <PageHeading
        title="Create Template"
        subtitle="Select a category, type, and WhatsApp Business Account to get started."
      />

      {/* Category Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Category</h2>
        <div className="inline-flex rounded-lg bg-gray-100 p-1">
          {(Object.keys(categoryConfig) as Category[]).map((key) => {
            const { label, icon: Icon } = categoryConfig[key];
            const isSelected = category === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleCategoryChange(key)}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-type Options */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Type</h2>
        <div className="space-y-3">
          {categoryConfig[category].subTypes.map((option) => {
            const isSelected = subType === option.value;
            return (
              <label
                key={option.value}
                className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                  option.disabled
                    ? "border-gray-100 bg-gray-50 cursor-not-allowed opacity-60"
                    : isSelected
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="subType"
                  value={option.value}
                  checked={isSelected}
                  disabled={option.disabled}
                  onChange={() => setSubType(option.value)}
                  className="mt-1 h-4 w-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {option.label}
                    </span>
                    {option.disabled && (
                      <Badge variant="inactive">Coming Soon</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {option.description}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* WABA ID Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-sm font-medium text-gray-700 mb-3">
          WhatsApp Business Account
        </h2>
        {wabaId && selected ? (
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div
              className={`h-2 w-2 rounded-full ${HEALTH_DOT_CLASS[wabaHealth(selected)]}`}
            />
            <div>
              {/* Identify the account the way the user thinks of it; the raw
                  id is a detail, not the headline. */}
              <p className="text-sm font-medium text-gray-900">
                {wabaLabel(selected)}
              </p>
              <p className="text-sm text-gray-500">
                {selected.displayPhoneNumber ?? wabaId}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">
              No WhatsApp Business Account connected.{" "}
              <a
                href="/app/whatsapp"
                className="font-medium underline hover:text-yellow-900"
              >
                Connect your account
              </a>{" "}
              to create templates.
            </p>
          </div>
        )}
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <Button
          variant="default"
          size="lg"
          disabled={!canProceed}
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
