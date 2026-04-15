"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Megaphone, Bell, ShieldCheck } from "lucide-react";
import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { getWhatsappConnectionStatus } from "@/lib/api/whatsapp/onboarding";
import { Category, categoryConfig, defaultSubType } from "@/lib/utils";

export default function CreateWhatsappTemplate() {
  const router = useRouter();
  const [category, setCategory] = useState<Category>("marketing");
  const [subType, setSubType] = useState<string>("default");

  const { data: connectionStatus } = useQuery({
    queryKey: ["whatsapp-connection-status"],
    queryFn: getWhatsappConnectionStatus,
  });

  const wabaId = connectionStatus?.account?.wabaId ?? null;

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    setSubType(defaultSubType[newCategory]);
  };

  const selectedSubType = categoryConfig[category].subTypes.find(
    (st) => st.value === subType
  );
  const isSubTypeDisabled = selectedSubType?.disabled ?? false;
  const canProceed = !!wabaId && !isSubTypeDisabled;

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
        {wabaId ? (
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                WABA ID: <span className="font-mono">{wabaId}</span>
              </p>
              {connectionStatus?.account?.businessName && (
                <p className="text-sm text-gray-500">
                  {connectionStatus.account.businessName}
                </p>
              )}
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
