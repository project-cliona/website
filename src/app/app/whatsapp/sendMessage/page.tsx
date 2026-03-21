"use client";

import { WhatsappPreview } from "@/components/ui/WhatsappPreview";
import { FileUpload } from "@/components/ui/FileUpload";
import { PageHeading } from "@/components/ui/PageHeading";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchWhatsappTemplates } from "@/lib/api/whatsapp/templates";
import { sendWhatsappCampaign } from "@/lib/api/whatsapp/campaigns";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Controller, useForm } from "react-hook-form";
import {
  SendWhatsappCampaignForm,
  sendWhatsappCampaignSchema,
} from "@/lib/schema/whatsapp.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/Button";
import { WhatsappTemplate } from "@/lib/type";
import { useUser } from "@/providers/userProvider";
import { useState } from "react";

export default function SendWhatsappMessage() {
  const { user } = useUser();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<SendWhatsappCampaignForm>({
    resolver: zodResolver(sendWhatsappCampaignSchema),
    defaultValues: {
      campaignName: "",
      templateId: "",
      mobileNumbers: "",
      uploadedFile: null,
      scheduledAt: "",
      removeDuplicates: false,
    },
  });

  const selectedTemplateId = watch("templateId");

  const { data: templates } = useQuery<WhatsappTemplate[]>({
    queryKey: ["whatsapp-templates"],
    queryFn: fetchWhatsappTemplates,
  });

  // Find the selected template and extract body/header/footer for preview
  const selectedTemplate = templates?.find(
    (t) => t.id.toString() === selectedTemplateId
  );

  let previewBody = "";
  let previewHeaderType: "none" | "text" | "image" | "video" | "document" = "none";
  let previewHeaderValue = "";
  let previewFooter = "";
  let previewButtons: { type: string; text: string }[] = [];

  if (selectedTemplate && Array.isArray(selectedTemplate.components)) {
    for (const comp of selectedTemplate.components) {
      if (comp.type === "BODY") previewBody = comp.text || "";
      if (comp.type === "HEADER") {
        previewHeaderType = (comp.format?.toLowerCase() || "text") as typeof previewHeaderType;
        previewHeaderValue = comp.text || "";
      }
      if (comp.type === "FOOTER") previewFooter = comp.text || "";
      if (comp.type === "BUTTONS" && Array.isArray(comp.buttons)) {
        previewButtons = comp.buttons.map((b: Record<string, string>) => ({
          type: b.type,
          text: b.text,
        }));
      }
    }
  }

  const mutation = useMutation({
    mutationFn: async (data: SendWhatsappCampaignForm) => {
      const phoneNumbers = data.mobileNumbers
        ? data.mobileNumbers
            .split(/[,\n]+/)
            .map((n) => n.trim())
            .filter(Boolean)
        : [];

      const payload = {
        campaignName: data.campaignName,
        templateId: data.templateId,
        phoneNumbers,
        scheduledAt: data.scheduledAt || null,
        removeDuplicates: data.removeDuplicates,
        userId: user?.userId,
      };

      return await sendWhatsappCampaign(payload);
    },
    onSuccess: () => {
      setSubmitError(null);
      setSubmitSuccess(true);
      reset();
      setTimeout(() => setSubmitSuccess(false), 5000);
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send campaign";
      setSubmitError(msg);
    },
  });

  const onSubmit = (data: SendWhatsappCampaignForm) => {
    setSubmitError(null);
    setSubmitSuccess(false);
    mutation.mutate(data);
  };

  return (
    <div className="p-6 text-muted-foreground">
      Send Message — coming soon.
    </div>
  );
}

// "use client";

// import { WhatsappPreview } from "@/components/ui/WhatsappPreview";
// import { FileUpload } from "@/components/ui/FileUpload";
// import { PageHeading } from "@/components/PageHeading";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { fetchWhatsappTemplates } from "@/lib/api/whatsapp/templates";
// import { sendWhatsappCampaign } from "@/lib/api/whatsapp/campaigns";
// import { Label } from "@/components/ui/Label";
// import { Input } from "@/components/ui/Input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/Select";
// import { Controller, useForm } from "react-hook-form";
// import {
//   SendWhatsappCampaignForm,
//   sendWhatsappCampaignSchema,
// } from "@/lib/schema/whatsapp.schema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Textarea } from "@/components/ui/Textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/Button";
// import { WhatsappTemplate } from "@/lib/type";
// import { useUser } from "@/providers/userProvider";
// import { useState } from "react";

// export default function SendWhatsappMessage() {
//   const { user } = useUser();
//   const [submitError, setSubmitError] = useState<string | null>(null);
//   const [submitSuccess, setSubmitSuccess] = useState(false);

//   const {
//     control,
//     handleSubmit,
//     watch,
//     reset,
//     formState: { errors },
//   } = useForm<SendWhatsappCampaignForm>({
//     resolver: zodResolver(sendWhatsappCampaignSchema),
//     defaultValues: {
//       campaignName: "",
//       templateId: "",
//       mobileNumbers: "",
//       uploadedFile: null,
//       scheduledAt: "",
//       removeDuplicates: false,
//     },
//   });

//   const selectedTemplateId = watch("templateId");

//   const { data: templates } = useQuery<WhatsappTemplate[]>({
//     queryKey: ["whatsapp-templates"],
//     queryFn: fetchWhatsappTemplates,
//   });

//   // Find the selected template and extract body/header/footer for preview
//   const selectedTemplate = templates?.find(
//     (t) => t.id.toString() === selectedTemplateId
//   );

//   let previewBody = "";
//   let previewHeaderType: "none" | "text" | "image" | "video" | "document" = "none";
//   let previewHeaderValue = "";
//   let previewFooter = "";
//   let previewButtons: { type: string; text: string }[] = [];

//   if (selectedTemplate && Array.isArray(selectedTemplate.components)) {
//     for (const comp of selectedTemplate.components) {
//       if (comp.type === "BODY") previewBody = comp.text || "";
//       if (comp.type === "HEADER") {
//         previewHeaderType = (comp.format?.toLowerCase() || "text") as typeof previewHeaderType;
//         previewHeaderValue = comp.text || "";
//       }
//       if (comp.type === "FOOTER") previewFooter = comp.text || "";
//       if (comp.type === "BUTTONS" && Array.isArray(comp.buttons)) {
//         previewButtons = comp.buttons.map((b: Record<string, string>) => ({
//           type: b.type,
//           text: b.text,
//         }));
//       }
//     }
//   }

//   const mutation = useMutation({
//     mutationFn: async (data: SendWhatsappCampaignForm) => {
//       const phoneNumbers = data.mobileNumbers
//         ? data.mobileNumbers
//             .split(/[,\n]+/)
//             .map((n) => n.trim())
//             .filter(Boolean)
//         : [];

//       const payload = {
//         campaignName: data.campaignName,
//         templateId: data.templateId,
//         phoneNumbers,
//         scheduledAt: data.scheduledAt || null,
//         removeDuplicates: data.removeDuplicates,
//         userId: user?.userId,
//       };

//       return await sendWhatsappCampaign(payload);
//     },
//     onSuccess: () => {
//       setSubmitError(null);
//       setSubmitSuccess(true);
//       reset();
//       setTimeout(() => setSubmitSuccess(false), 5000);
//     },
//     onError: (error: any) => {
//       const msg =
//         error?.response?.data?.message ||
//         error?.message ||
//         "Failed to send campaign";
//       setSubmitError(msg);
//     },
//   });

//   const onSubmit = (data: SendWhatsappCampaignForm) => {
//     setSubmitError(null);
//     setSubmitSuccess(false);
//     mutation.mutate(data);
//   };

//   return (
//     <div className="space-y-8">
//       <PageHeading
//         title="Send WhatsApp Campaign"
//         subtitle="Create and send WhatsApp campaigns to your audience"
//       />

//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Main Form */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Campaign Settings */}
//             <div className="bg-card border border-border rounded-xl p-6">
//               <h2 className="text-lg font-semibold text-foreground mb-4">
//                 Campaign Settings
//               </h2>
//               <div className="space-y-4">
//                 <div>
//                   <Label className="mb-2 block">Campaign Name *</Label>
//                   <Controller
//                     name="campaignName"
//                     control={control}
//                     render={({ field, fieldState }) => (
//                       <>
//                         <Input
//                           {...field}
//                           placeholder="Enter campaign name"
//                         />
//                         {fieldState.error && (
//                           <p className="text-sm text-red-500 mt-1">
//                             {fieldState.error.message}
//                           </p>
//                         )}
//                       </>
//                     )}
//                   />
//                 </div>

//                 <div>
//                   <Label className="mb-2 block">Select Template *</Label>
//                   <Controller
//                     name="templateId"
//                     control={control}
//                     render={({ field }) => (
//                       <Select
//                         value={field.value}
//                         onValueChange={field.onChange}
//                         disabled={!templates || templates.length === 0}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Choose a template" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {templates && templates.length > 0 ? (
//                             templates.map((template) => (
//                               <SelectItem
//                                 key={template.id}
//                                 value={template.id.toString()}
//                               >
//                                 {template.name} ({template.category})
//                               </SelectItem>
//                             ))
//                           ) : (
//                             <SelectItem value="no-template" disabled>
//                               No templates available
//                             </SelectItem>
//                           )}
//                         </SelectContent>
//                       </Select>
//                     )}
//                   />
//                   {errors.templateId && (
//                     <p className="text-sm text-red-500 mt-1">
//                       {errors.templateId.message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Mobile Numbers */}
//             <div className="bg-card border border-border rounded-xl p-6">
//               <h2 className="text-lg font-semibold text-foreground mb-4">
//                 Mobile Numbers
//               </h2>
//               <div className="space-y-4">
//                 <Controller
//                   name="mobileNumbers"
//                   control={control}
//                   render={({ field }) => (
//                     <div className="space-y-2">
//                       <Label className="text-sm font-medium text-foreground">
//                         Enter Mobile Numbers
//                       </Label>
//                       <Textarea
//                         {...field}
//                         rows={6}
//                         placeholder="Enter numbers separated by commas or new lines"
//                         className="mt-2"
//                       />
//                     </div>
//                   )}
//                 />

//                 <div className="border-t border-border pt-4">
//                   <p className="text-sm font-medium text-foreground mb-3">
//                     OR Upload File
//                   </p>
//                   <Controller
//                     name="uploadedFile"
//                     control={control}
//                     render={({ field }) => (
//                       <FileUpload onFileUpload={field.onChange} />
//                     )}
//                   />
//                 </div>

//                 <Controller
//                   name="removeDuplicates"
//                   control={control}
//                   render={({ field }) => (
//                     <div className="flex items-center gap-2">
//                       <Checkbox
//                         checked={field.value}
//                         onCheckedChange={(checked) =>
//                           field.onChange(checked === true)
//                         }
//                       />
//                       <Label className="cursor-pointer">
//                         Remove duplicate numbers
//                       </Label>
//                     </div>
//                   )}
//                 />

//                 <div>
//                   <Label className="mb-2 block">
//                     Schedule (optional)
//                   </Label>
//                   <Controller
//                     name="scheduledAt"
//                     control={control}
//                     render={({ field }) => (
//                       <Input type="datetime-local" {...field} />
//                     )}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Error / Success Messages */}
//             {submitError && (
//               <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
//                 {submitError}
//               </div>
//             )}
//             {submitSuccess && (
//               <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
//                 Campaign sent successfully!
//               </div>
//             )}

//             {/* Submit */}
//             <Button
//               type="submit"
//               className="w-full"
//               disabled={mutation.isPending}
//             >
//               {mutation.isPending ? "Sending..." : "Send Campaign"}
//             </Button>
//           </div>

//           {/* Preview */}
//           <div className="lg:col-span-1">
//             <WhatsappPreview
//               headerType={previewHeaderType}
//               headerValue={previewHeaderValue}
//               body={previewBody}
//               footer={previewFooter}
//               buttons={previewButtons}
//             />
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }
