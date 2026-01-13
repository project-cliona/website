"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { authenticatedApiClient } from "@/lib/axios";
import { UserCheck, Home, Briefcase, ArrowRight } from "lucide-react";
import { KycFormType, kycSchema } from "@/lib/schema/common.schema";
import { useRouter } from "next/navigation";

export default function KycPage({ userId }: { userId: number }) {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<KycFormType>({
    resolver: zodResolver(kycSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      mobile: "",
      address: "",
      city: "",
      state: "",
      companyName: "",
      companyUrl: "",
    },
  });

  const onSubmit = async (data: KycFormType) => {
    try {
      const res = await authenticatedApiClient().post(`/common/profile/${userId}`, data);
      reset();
    } catch (err) {
      console.error(err);
    } finally {
      router.push("/app");
    }
  };
  const handleSkip = () => {
    router.push("/app");
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto relative">

        {/* Skip Button */}
        <div className="absolute top-0 right-0">
          <Button
            variant="ghost"
            className="text-gray-500 hover:text-gray-700"
            onClick={handleSkip}
          >
            Skip for now <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        {/* Page Heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Complete Your KYC
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Please provide your personal and company information to complete your profile.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Personal Information Section */}
          <div className="bg-white shadow-md rounded-lg px-6 py-5">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="h-5 w-5" />
              <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Full Name *</Label>
                    <Input {...field} placeholder="John Doe" />
                    {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
                  </div>
                )}
              />

              <Controller
                name="mobile"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Mobile *</Label>
                    <Input {...field} placeholder="+91-9876543210" />
                    {errors.mobile && <p className="text-xs text-red-500">{errors.mobile.message}</p>}
                  </div>
                )}
              />

            </div>
          </div>

          {/* Address Section */}
          <div className="bg-white shadow-md rounded-lg px-6 py-5">
            <div className="flex items-center gap-3 mb-4">
              <Home className="h-5 w-5" />
              <h2 className="text-lg font-medium text-gray-900">Address</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Address *</Label>
                    <Input {...field} placeholder="Street, Area, etc." />
                    {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
                  </div>
                )}
              />

              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>City *</Label>
                    <Input {...field} placeholder="Mumbai" />
                    {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
                  </div>
                )}
              />

              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>State *</Label>
                    <Input {...field} placeholder="Maharashtra" />
                    {errors.state && <p className="text-xs text-red-500">{errors.state.message}</p>}
                  </div>
                )}
              />

            </div>
          </div>

          {/* Company Information Section */}
          <div className="bg-white shadow-md rounded-lg px-6 py-5">
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="h-5 w-5" />
              <h2 className="text-lg font-medium text-gray-900">Company Information (Optional)</h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Fill in your company details if applicable.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Controller
                name="companyName"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Company Name</Label>
                    <Input {...field} placeholder="Company Ltd." />
                  </div>
                )}
              />

              <Controller
                name="companyUrl"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Company URL</Label>
                    <Input {...field} placeholder="https://company.com" />
                    {errors.companyUrl && <p className="text-xs text-red-500">{errors.companyUrl.message}</p>}
                  </div>
                )}
              />

            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit KYC"}
            </Button>
            <Button type="button" variant="outline" onClick={() => reset()}>
              Cancel
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}