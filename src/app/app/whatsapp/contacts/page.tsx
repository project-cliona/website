export default function WhatsappContacts() {
  return (
    <div className="p-6 text-gray-500">
      Contacts — coming soon.
    </div>
  );
}

// "use client";

// import { PageHeading } from "@/components/PageHeading";
// import { Input } from "@/components/ui/Input";
// import { Label } from "@/components/ui/Label";
// import { Button } from "@/components/ui/Button";
// import { FileUpload } from "@/components/ui/FileUpload";
// import { TableSkeleton } from "@/components/ui/skeleton/table";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   fetchWhatsappContacts,
//   addWhatsappContact,
// } from "@/lib/api/whatsapp/contacts";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { addContactSchema, AddContactForm } from "@/lib/schema/whatsapp.schema";
// import { WhatsappContact } from "@/lib/type";
// import { useState } from "react";

// export default function WhatsappContactsPage() {
//   const queryClient = useQueryClient();
//   const [submitError, setSubmitError] = useState<string | null>(null);
//   const [submitSuccess, setSubmitSuccess] = useState(false);

//   const { data: contacts, isLoading } = useQuery<WhatsappContact[]>({
//     queryKey: ["whatsapp-contacts"],
//     queryFn: fetchWhatsappContacts,
//   });

//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { },
//   } = useForm<AddContactForm>({
//     resolver: zodResolver(addContactSchema),
//     defaultValues: {
//       name: "",
//       countryCode: "+91",
//       phoneNumber: "",
//     },
//   });

//   const mutation = useMutation({
//     mutationFn: addWhatsappContact,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["whatsapp-contacts"] });
//       reset();
//       setSubmitError(null);
//       setSubmitSuccess(true);
//       setTimeout(() => setSubmitSuccess(false), 3000);
//     },
//     onError: (error: any) => {
//       const msg =
//         error?.response?.data?.message ||
//         error?.message ||
//         "Failed to add contact";
//       setSubmitError(msg);
//     },
//   });

//   const onSubmit = (data: AddContactForm) => {
//     setSubmitError(null);
//     setSubmitSuccess(false);
//     mutation.mutate(data);
//   };

//   return (
//     <div className="space-y-8">
//       <PageHeading
//         title="Contacts"
//         subtitle="Manage your WhatsApp recipient contacts"
//       />

//       {/* Add Contact Form */}
//       <div className="bg-white rounded-lg border border-gray-200 p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">
//           Add Contact
//         </h3>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//             <div>
//               <Label className="mb-2 block">Name *</Label>
//               <Controller
//                 name="name"
//                 control={control}
//                 render={({ field, fieldState }) => (
//                   <>
//                     <Input {...field} placeholder="Contact name" />
//                     {fieldState.error && (
//                       <p className="mt-1 text-sm text-red-500">
//                         {fieldState.error.message}
//                       </p>
//                     )}
//                   </>
//                 )}
//               />
//             </div>
//             <div>
//               <Label className="mb-2 block">Country Code *</Label>
//               <Controller
//                 name="countryCode"
//                 control={control}
//                 render={({ field, fieldState }) => (
//                   <>
//                     <Input {...field} placeholder="+91" />
//                     {fieldState.error && (
//                       <p className="mt-1 text-sm text-red-500">
//                         {fieldState.error.message}
//                       </p>
//                     )}
//                   </>
//                 )}
//               />
//             </div>
//             <div>
//               <Label className="mb-2 block">Phone Number *</Label>
//               <Controller
//                 name="phoneNumber"
//                 control={control}
//                 render={({ field, fieldState }) => (
//                   <>
//                     <Input {...field} placeholder="9876543210" />
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

//           {submitError && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-4">
//               {submitError}
//             </div>
//           )}
//           {submitSuccess && (
//             <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 mb-4">
//               Contact added successfully!
//             </div>
//           )}

//           <Button type="submit" disabled={mutation.isPending}>
//             {mutation.isPending ? "Adding..." : "Add Contact"}
//           </Button>
//         </form>

//         {/* CSV Upload Section */}
//         <div className="border-t border-gray-200 pt-4 mt-4">
//           <p className="text-sm font-medium text-gray-700 mb-3">
//             OR Upload CSV
//           </p>
//           <FileUpload
//             onFileUpload={(file) => {
//               console.log("CSV file uploaded:", file.name);
//             }}
//           />
//         </div>
//       </div>

//       {/* Contacts Table */}
//       <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-900">
//             All Contacts
//           </h3>
//         </div>

//         {isLoading ? (
//           <div className="p-6">
//             <TableSkeleton rows={5} columns={4} />
//           </div>
//         ) : !contacts || contacts.length === 0 ? (
//           <div className="p-8 text-center">
//             <p className="text-gray-500">
//               No contacts yet. Add your first contact above.
//             </p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Phone Number
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Country Code
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Added On
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {contacts.map((contact) => (
//                   <tr key={contact.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {contact.name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {contact.phoneNumber}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {contact.countryCode}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {new Date(contact.createdAt).toLocaleDateString()}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
