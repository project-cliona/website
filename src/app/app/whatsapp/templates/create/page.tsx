"use client";

import { PageHeading } from "@/components/ui/PageHeading";
import { WhatsappPreview } from "@/components/ui/WhatsappPreview";
import {
  CreateWhatsappTemplateForm,
  createWhatsappTemplateSchema,
} from "@/lib/schema/whatsapp.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Plus, Trash2, Info, MessageSquare, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import SubHeading from "@/components/SubHeading";
import { authenticatedApiClient } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/userProvider";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

export default function CreateWhatsappTemplate() {
  const router = useRouter();
  const { user } = useUser();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    control,
    handleSubmit: rhfSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateWhatsappTemplateForm>({
    resolver: zodResolver(createWhatsappTemplateSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      language: "en",
      category: "marketing",
      wabaId: "",
      headerType: "none",
      headerValue: "",
      body: "",
      footer: "",
      buttons: [],
    },
  });

  const {
    fields: buttonFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "buttons",
  });

  const addButton = () => {
    if (buttonFields.length < 3) {
      append({ type: "quick_reply", text: "", value: "" });
    }
  };

  const headerType = watch("headerType");
  const headerValue = watch("headerValue");
  const bodyText = watch("body");
  const footerText = watch("footer");
  const buttonsPreview = watch("buttons");

  const mutation = useMutation({
    mutationFn: async (data: CreateWhatsappTemplateForm) => {
      const components: any[] = [];

      if (data.headerType !== "none") {
        components.push({
          type: "HEADER",
          format: data.headerType!.toUpperCase(),
          text: data.headerValue || "",
        });
      }

      components.push({ type: "BODY", text: data.body });

      if (data.footer) {
        components.push({ type: "FOOTER", text: data.footer });
      }

      if (data.buttons && data.buttons.length > 0) {
        components.push({
          type: "BUTTONS",
          buttons: data.buttons.map((b) => ({
            type: b.type.toUpperCase(),
            text: b.text,
            url: b.value || undefined,
          })),
        });
      }

      const payload = {
        name: data.name,
        language: data.language,
        category: data.category,
        wabaId: data.wabaId,
        components,
        modifiedBy: user?.userId,
      };

      const res = await authenticatedApiClient().post("/whatsApp/template", payload);
      return res.data;
    },
    onSuccess: () => {
      setSubmitError(null);
      setSubmitSuccess(true);
      router.push("/app/whatsapp/templates");
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create template";
      setSubmitError(msg);
    },
  });

  const onSubmit = (data: CreateWhatsappTemplateForm) => {
    setSubmitError(null);
    mutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <PageHeading
        title="Create Template"
        subtitle="Define the content and settings to create a new WhatsApp template."
      />
      <form
        onSubmit={rhfSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Main Form -- Left 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Template Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <SubHeading title="Template Info" Icon={Info} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="mb-2 block">
                  Template Name *
                </Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        id="name"
                        placeholder="e.g. order_confirmation"
                        {...field}
                      />
                      {fieldState.error && (
                        <p className="mt-1 text-sm text-red-500">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              <div>
                <Label htmlFor="language" className="mb-2 block">
                  Language *
                </Label>
                <Controller
                  name="language"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="en_US">English (US)</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="ta">Tamil</SelectItem>
                        <SelectItem value="te">Telugu</SelectItem>
                        <SelectItem value="mr">Marathi</SelectItem>
                        <SelectItem value="bn">Bengali</SelectItem>
                        <SelectItem value="gu">Gujarati</SelectItem>
                        <SelectItem value="kn">Kannada</SelectItem>
                        <SelectItem value="ml">Malayalam</SelectItem>
                        <SelectItem value="pa">Punjabi</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.language && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.language.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="category" className="mb-2 block">
                  Category *
                </Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="utility">Utility</SelectItem>
                        <SelectItem value="authentication">
                          Authentication
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="mb-2 block">WABA ID</Label>
                {connectedWabaId ? (
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 font-mono">
                    {connectedWabaId}
                  </div>
                ) : (
                  <div className="px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
                    No WhatsApp account connected.{" "}
                    <a
                      href="/app/whatsapp"
                      className="underline font-medium"
                    >
                      Connect your account
                    </a>{" "}
                    to create templates.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <SubHeading title="Message Content" Icon={MessageSquare} />

            {/* Header */}
            <div className="mb-4">
              <Label className="mb-2 block">Header</Label>
              <Controller
                name="headerType"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select header type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {headerType !== "none" && (
              <div className="mb-4">
                <Label className="mb-2 block">
                  Header {headerType === "text" ? "Text" : "URL"}
                </Label>
                <Controller
                  name="headerValue"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={
                        headerType === "text"
                          ? "Enter header text"
                          : `Enter ${headerType} URL`
                      }
                    />
                  )}
                />
              </div>
            )}

            {/* Body */}
            <div className="mb-4">
              <Label htmlFor="body" className="mb-2 block">
                Body *
              </Label>
              <Controller
                name="body"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Textarea
                      id="body"
                      rows={6}
                      placeholder='Enter message body. Use {{1}}, {{2}} for variables.'
                      {...field}
                    />
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            {/* Footer */}
            <div>
              <Label htmlFor="footer" className="mb-2 block">
                Footer (optional)
              </Label>
              <Controller
                name="footer"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      id="footer"
                      placeholder="e.g. Reply STOP to unsubscribe"
                      {...field}
                    />
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <SubHeading title="Buttons (Optional)" Icon={Zap} />
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={addButton}
                disabled={buttonFields.length >= 3}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Button
              </Button>
            </div>

            {buttonFields.length === 0 && (
              <p className="text-sm text-gray-500">
                No buttons added. Click "Add Button" to include interactive
                buttons.
              </p>
            )}

            <div className="space-y-4">
              {buttonFields.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">
                      Button {index + 1}
                    </h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="p-1"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label>Type</Label>
                      <Controller
                        name={`buttons.${index}.type`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="quick_reply">
                                Quick Reply
                              </SelectItem>
                              <SelectItem value="url">URL</SelectItem>
                              <SelectItem value="phone">Phone</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div>
                      <Label>Button Text</Label>
                      <Controller
                        name={`buttons.${index}.text`}
                        control={control}
                        render={({ field, fieldState }) => (
                          <>
                            <Input {...field} placeholder="Button text" />
                            {fieldState.error && (
                              <p className="mt-1 text-sm text-red-500">
                                {fieldState.error.message}
                              </p>
                            )}
                          </>
                        )}
                      />
                    </div>
                    {watch(`buttons.${index}.type`) !== "quick_reply" && (
                      <div>
                        <Label>Value</Label>
                        <Controller
                          name={`buttons.${index}.value`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder={
                                watch(`buttons.${index}.type`) === "url"
                                  ? "https://..."
                                  : "+91..."
                              }
                            />
                          )}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error / Success Messages */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
              {submitError}
            </div>
          )}
          {submitSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
              Template created successfully! Redirecting...
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="submit" variant="default" size="lg" disabled={isSubmitting || mutation.isPending || !connectedWabaId}>
              {isSubmitting || mutation.isPending ? "Creating..." : "Create Template"}
            </Button>
          </div>
        </div>

        {/* Right Panel -- Preview */}
        <div className="lg:col-span-1">
          <WhatsappPreview
            headerType={headerType}
            headerValue={headerValue}
            body={bodyText}
            footer={footerText}
            buttons={buttonsPreview?.map((b) => ({ type: b.type, text: b.text })) ?? []}
          />
        </div>
      </form>
    </div>
  );
}

// "use client";

// import { PageHeading } from "@/components/PageHeading";
// import { WhatsappPreview } from "@/components/ui/WhatsappPreview";
// import {
//   CreateWhatsappTemplateForm,
//   createWhatsappTemplateSchema,
// } from "@/lib/schema/whatsapp.schema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Controller, useFieldArray, useForm } from "react-hook-form";
// import { Label } from "@/components/ui/Label";
// import { Input } from "@/components/ui/Input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/Select";
// import { Textarea } from "@/components/ui/Textarea";
// import { Plus, Trash2, Info, MessageSquare, Zap } from "lucide-react";
// import { Button } from "@/components/ui/Button";
// import SubHeading from "@/components/SubHeading";
// import { authenticatedApiClient } from "@/lib/axios";
// import { useRouter } from "next/navigation";
// import { useUser } from "@/providers/userProvider";
// import { useState } from "react";
// import { useMutation } from "@tanstack/react-query";

// export default function CreateWhatsappTemplate() {
//   const router = useRouter();
//   const { user } = useUser();
//   const [submitError, setSubmitError] = useState<string | null>(null);
//   const [submitSuccess, setSubmitSuccess] = useState(false);

//   const {
//     control,
//     handleSubmit: rhfSubmit,
//     watch,
//     formState: { errors, isSubmitting },
//   } = useForm<CreateWhatsappTemplateForm>({
//     resolver: zodResolver(createWhatsappTemplateSchema),
//     mode: "onChange",
//     defaultValues: {
//       name: "",
//       language: "en",
//       category: "marketing",
//       wabaId: "",
//       headerType: "none",
//       headerValue: "",
//       body: "",
//       footer: "",
//       buttons: [],
//     },
//   });

//   const {
//     fields: buttonFields,
//     append,
//     remove,
//   } = useFieldArray({
//     control,
//     name: "buttons",
//   });

//   const addButton = () => {
//     if (buttonFields.length < 3) {
//       append({ type: "quick_reply", text: "", value: "" });
//     }
//   };

//   const headerType = watch("headerType");
//   const headerValue = watch("headerValue");
//   const bodyText = watch("body");
//   const footerText = watch("footer");
//   const buttonsPreview = watch("buttons");

//   const mutation = useMutation({
//     mutationFn: async (data: CreateWhatsappTemplateForm) => {
//       const components: any[] = [];

//       if (data.headerType !== "none") {
//         components.push({
//           type: "HEADER",
//           format: data.headerType!.toUpperCase(),
//           text: data.headerValue || "",
//         });
//       }

//       components.push({ type: "BODY", text: data.body });

//       if (data.footer) {
//         components.push({ type: "FOOTER", text: data.footer });
//       }

//       if (data.buttons && data.buttons.length > 0) {
//         components.push({
//           type: "BUTTONS",
//           buttons: data.buttons.map((b) => ({
//             type: b.type.toUpperCase(),
//             text: b.text,
//             url: b.value || undefined,
//           })),
//         });
//       }

//       const payload = {
//         name: data.name,
//         language: data.language,
//         category: data.category,
//         wabaId: data.wabaId,
//         components,
//         modifiedBy: user?.userId,
//       };

//       const res = await authenticatedApiClient().post("/whatsApp/template", payload);
//       return res.data;
//     },
//     onSuccess: () => {
//       setSubmitError(null);
//       setSubmitSuccess(true);
//       router.push("/app/whatsapp/templates");
//     },
//     onError: (error: any) => {
//       const msg =
//         error?.response?.data?.message ||
//         error?.message ||
//         "Failed to create template";
//       setSubmitError(msg);
//     },
//   });

//   const onSubmit = (data: CreateWhatsappTemplateForm) => {
//     setSubmitError(null);
//     mutation.mutate(data);
//   };

//   return (
//     <div className="space-y-6">
//       <PageHeading
//         title="Create Template"
//         subtitle="Define the content and settings to create a new WhatsApp template."
//       />
//       <form
//         onSubmit={rhfSubmit(onSubmit)}
//         className="grid grid-cols-1 lg:grid-cols-3 gap-6"
//       >
//         {/* Main Form -- Left 2/3 */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Template Info */}
//           <div className="bg-white rounded-lg border border-gray-200 p-6">
//             <SubHeading title="Template Info" Icon={Info} />
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="name" className="mb-2 block">
//                   Template Name *
//                 </Label>
//                 <Controller
//                   name="name"
//                   control={control}
//                   render={({ field, fieldState }) => (
//                     <>
//                       <Input
//                         id="name"
//                         placeholder="e.g. order_confirmation"
//                         {...field}
//                       />
//                       {fieldState.error && (
//                         <p className="mt-1 text-sm text-red-500">
//                           {fieldState.error.message}
//                         </p>
//                       )}
//                     </>
//                   )}
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="language" className="mb-2 block">
//                   Language *
//                 </Label>
//                 <Controller
//                   name="language"
//                   control={control}
//                   render={({ field }) => (
//                     <Select value={field.value} onValueChange={field.onChange}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select language" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="en">English</SelectItem>
//                         <SelectItem value="en_US">English (US)</SelectItem>
//                         <SelectItem value="hi">Hindi</SelectItem>
//                         <SelectItem value="ta">Tamil</SelectItem>
//                         <SelectItem value="te">Telugu</SelectItem>
//                         <SelectItem value="mr">Marathi</SelectItem>
//                         <SelectItem value="bn">Bengali</SelectItem>
//                         <SelectItem value="gu">Gujarati</SelectItem>
//                         <SelectItem value="kn">Kannada</SelectItem>
//                         <SelectItem value="ml">Malayalam</SelectItem>
//                         <SelectItem value="pa">Punjabi</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   )}
//                 />
//                 {errors.language && (
//                   <p className="text-sm text-red-500 mt-1">
//                     {errors.language.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <Label htmlFor="category" className="mb-2 block">
//                   Category *
//                 </Label>
//                 <Controller
//                   name="category"
//                   control={control}
//                   render={({ field }) => (
//                     <Select value={field.value} onValueChange={field.onChange}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select category" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="marketing">Marketing</SelectItem>
//                         <SelectItem value="utility">Utility</SelectItem>
//                         <SelectItem value="authentication">
//                           Authentication
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                   )}
//                 />
//                 {errors.category && (
//                   <p className="text-sm text-red-500 mt-1">
//                     {errors.category.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <Label htmlFor="wabaId" className="mb-2 block">
//                   WABA ID *
//                 </Label>
//                 <Controller
//                   name="wabaId"
//                   control={control}
//                   render={({ field, fieldState }) => (
//                     <>
//                       <Input
//                         id="wabaId"
//                         placeholder="Enter your WABA ID"
//                         {...field}
//                       />
//                       {fieldState.error && (
//                         <p className="mt-1 text-sm text-red-500">
//                           {fieldState.error.message}
//                         </p>
//                       )}
//                     </>
//                   )}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Message Content */}
//           <div className="bg-white rounded-lg border border-gray-200 p-6">
//             <SubHeading title="Message Content" Icon={MessageSquare} />

//             {/* Header */}
//             <div className="mb-4">
//               <Label className="mb-2 block">Header</Label>
//               <Controller
//                 name="headerType"
//                 control={control}
//                 render={({ field }) => (
//                   <Select value={field.value} onValueChange={field.onChange}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select header type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="none">None</SelectItem>
//                       <SelectItem value="text">Text</SelectItem>
//                       <SelectItem value="image">Image</SelectItem>
//                       <SelectItem value="video">Video</SelectItem>
//                       <SelectItem value="document">Document</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 )}
//               />
//             </div>

//             {headerType !== "none" && (
//               <div className="mb-4">
//                 <Label className="mb-2 block">
//                   Header {headerType === "text" ? "Text" : "URL"}
//                 </Label>
//                 <Controller
//                   name="headerValue"
//                   control={control}
//                   render={({ field }) => (
//                     <Input
//                       {...field}
//                       placeholder={
//                         headerType === "text"
//                           ? "Enter header text"
//                           : `Enter ${headerType} URL`
//                       }
//                     />
//                   )}
//                 />
//               </div>
//             )}

//             {/* Body */}
//             <div className="mb-4">
//               <Label htmlFor="body" className="mb-2 block">
//                 Body *
//               </Label>
//               <Controller
//                 name="body"
//                 control={control}
//                 render={({ field, fieldState }) => (
//                   <>
//                     <Textarea
//                       id="body"
//                       rows={6}
//                       placeholder='Enter message body. Use {{1}}, {{2}} for variables.'
//                       {...field}
//                     />
//                     {fieldState.error && (
//                       <p className="mt-1 text-sm text-red-500">
//                         {fieldState.error.message}
//                       </p>
//                     )}
//                   </>
//                 )}
//               />
//             </div>

//             {/* Footer */}
//             <div>
//               <Label htmlFor="footer" className="mb-2 block">
//                 Footer (optional)
//               </Label>
//               <Controller
//                 name="footer"
//                 control={control}
//                 render={({ field, fieldState }) => (
//                   <>
//                     <Input
//                       id="footer"
//                       placeholder="e.g. Reply STOP to unsubscribe"
//                       {...field}
//                     />
//                     {fieldState.error && (
//                       <p className="mt-1 text-sm text-red-500">
//                         {fieldState.error.message}
//                       </p>
//                     )}
//                   </>
//                 )}
//               />
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="bg-white rounded-lg border border-gray-200 p-6">
//             <div className="flex items-center justify-between mb-4">
//               <SubHeading title="Buttons (Optional)" Icon={Zap} />
//               <Button
//                 type="button"
//                 variant="default"
//                 size="sm"
//                 onClick={addButton}
//                 disabled={buttonFields.length >= 3}
//               >
//                 <Plus className="w-4 h-4 mr-1" /> Add Button
//               </Button>
//             </div>

//             {buttonFields.length === 0 && (
//               <p className="text-sm text-gray-500">
//                 No buttons added. Click "Add Button" to include interactive
//                 buttons.
//               </p>
//             )}

//             <div className="space-y-4">
//               {buttonFields.map((field, index) => (
//                 <div
//                   key={field.id}
//                   className="border border-gray-200 rounded-lg p-4"
//                 >
//                   <div className="flex items-center justify-between mb-3">
//                     <h3 className="font-medium text-gray-900">
//                       Button {index + 1}
//                     </h3>
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => remove(index)}
//                       className="p-1"
//                     >
//                       <Trash2 className="w-4 h-4 text-red-400" />
//                     </Button>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                     <div>
//                       <Label>Type</Label>
//                       <Controller
//                         name={`buttons.${index}.type`}
//                         control={control}
//                         render={({ field }) => (
//                           <Select
//                             value={field.value}
//                             onValueChange={field.onChange}
//                           >
//                             <SelectTrigger className="text-sm">
//                               <SelectValue placeholder="Select type" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="quick_reply">
//                                 Quick Reply
//                               </SelectItem>
//                               <SelectItem value="url">URL</SelectItem>
//                               <SelectItem value="phone">Phone</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         )}
//                       />
//                     </div>
//                     <div>
//                       <Label>Button Text</Label>
//                       <Controller
//                         name={`buttons.${index}.text`}
//                         control={control}
//                         render={({ field, fieldState }) => (
//                           <>
//                             <Input {...field} placeholder="Button text" />
//                             {fieldState.error && (
//                               <p className="mt-1 text-sm text-red-500">
//                                 {fieldState.error.message}
//                               </p>
//                             )}
//                           </>
//                         )}
//                       />
//                     </div>
//                     {watch(`buttons.${index}.type`) !== "quick_reply" && (
//                       <div>
//                         <Label>Value</Label>
//                         <Controller
//                           name={`buttons.${index}.value`}
//                           control={control}
//                           render={({ field }) => (
//                             <Input
//                               {...field}
//                               placeholder={
//                                 watch(`buttons.${index}.type`) === "url"
//                                   ? "https://..."
//                                   : "+91..."
//                               }
//                             />
//                           )}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Error / Success Messages */}
//           {submitError && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
//               {submitError}
//             </div>
//           )}
//           {submitSuccess && (
//             <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
//               Template created successfully! Redirecting...
//             </div>
//           )}

//           {/* Submit */}
//           <div className="flex gap-4">
//             <Button type="submit" variant="default" size="lg" disabled={isSubmitting || mutation.isPending}>
//               {isSubmitting || mutation.isPending ? "Creating..." : "Create Template"}
//             </Button>
//           </div>
//         </div>

//         {/* Right Panel -- Preview */}
//         <div className="lg:col-span-1">
//           <WhatsappPreview
//             headerType={headerType}
//             headerValue={headerValue}
//             body={bodyText}
//             footer={footerText}
//             buttons={buttonsPreview?.map((b) => ({ type: b.type, text: b.text })) ?? []}
//           />
//         </div>
//       </form>
//     </div>
//   );
// }
