export default function WhatsappDeliveryReports() {
  return (
    <div className="p-6 text-muted-foreground">
      Delivery Reports — coming soon.
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { PageHeading } from "@/components/PageHeading";
// import { TableSkeleton } from "@/components/ui/skeleton/table";
// import { useQuery } from "@tanstack/react-query";
// import { fetchWhatsappDeliveryReport } from "@/lib/api/whatsapp/dashboard";
// import { WhatsappDeliveryReportResponse } from "@/lib/type";

// export default function WhatsappDeliveryReports() {
//   const [filters, setFilters] = useState({
//     dateType: "Day",
//     startDate: new Date().toISOString().split("T")[0],
//     endDate: new Date().toISOString().split("T")[0],
//     uploadSource: "All",
//   });

//   const { data, isLoading } = useQuery<WhatsappDeliveryReportResponse | null>({
//     queryKey: ["whatsapp-delivery-report"],
//     queryFn: fetchWhatsappDeliveryReport,
//   });

//   const handleFilterChange = (field: string, value: string) => {
//     setFilters((prev) => ({ ...prev, [field]: value }));
//   };

//   const exportReport = () => {
//     console.log("Exporting delivery report...", filters);
//   };

//   if (isLoading) {
//     return (
//       <div className="space-y-6">
//         <PageHeading
//           title="Delivery Reports"
//           subtitle="Track your WhatsApp message delivery performance"
//         />
//         <TableSkeleton rows={5} columns={8} />
//       </div>
//     );
//   }

//   const summary = data?.summary ?? {
//     totalSubmitted: 0,
//     sent: 0,
//     delivered: 0,
//     undelivered: 0,
//     read: 0,
//   };
//   const records = data?.records ?? [];

//   const getDeliveryRate = () => {
//     if (summary.sent === 0) return "0";
//     return ((summary.delivered / summary.sent) * 100).toFixed(1);
//   };

//   const getReadRate = () => {
//     if (summary.delivered === 0) return "0";
//     return ((summary.read / summary.delivered) * 100).toFixed(1);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <PageHeading
//           title="Delivery Reports"
//           subtitle="Track your WhatsApp message delivery performance"
//         />
//         <button
//           onClick={exportReport}
//           className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors flex items-center text-sm"
//         >
//           Export to Excel
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="bg-card rounded-xl shadow-sm border border-border p-6">
//         <h2 className="text-lg font-semibold text-foreground mb-4">Filters</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-foreground mb-2">
//               Date Type
//             </label>
//             <select
//               className="w-full border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-foreground"
//               value={filters.dateType}
//               onChange={(e) => handleFilterChange("dateType", e.target.value)}
//             >
//               <option value="Day">Day</option>
//               <option value="Range">Date Range</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-foreground mb-2">
//               {filters.dateType === "Day" ? "Date" : "Start Date"}
//             </label>
//             <input
//               type="date"
//               className="w-full border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-foreground"
//               value={filters.startDate}
//               onChange={(e) => handleFilterChange("startDate", e.target.value)}
//             />
//           </div>

//           {filters.dateType === "Range" && (
//             <div>
//               <label className="block text-sm font-medium text-foreground mb-2">
//                 End Date
//               </label>
//               <input
//                 type="date"
//                 className="w-full border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-foreground"
//                 value={filters.endDate}
//                 onChange={(e) => handleFilterChange("endDate", e.target.value)}
//               />
//             </div>
//           )}

//           <div>
//             <label className="block text-sm font-medium text-foreground mb-2">
//               Upload Source
//             </label>
//             <select
//               className="w-full border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-foreground"
//               value={filters.uploadSource}
//               onChange={(e) =>
//                 handleFilterChange("uploadSource", e.target.value)
//               }
//             >
//               <option value="All">All Sources</option>
//               <option value="File Upload">File Upload</option>
//               <option value="Manual Entry">Manual Entry</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Metrics Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//         <div className="bg-card rounded-xl shadow-sm border border-border p-6">
//           <div className="text-center">
//             <div className="text-2xl font-bold text-blue-600">
//               {summary.totalSubmitted.toLocaleString()}
//             </div>
//             <div className="text-sm text-muted-foreground mt-1">Total Submitted</div>
//           </div>
//         </div>
//         <div className="bg-card rounded-xl shadow-sm border border-border p-6">
//           <div className="text-center">
//             <div className="text-2xl font-bold text-green-600">
//               {summary.sent.toLocaleString()}
//             </div>
//             <div className="text-sm text-muted-foreground mt-1">Sent</div>
//             <div className="text-xs text-green-500">
//               {summary.totalSubmitted > 0
//                 ? (
//                     (summary.sent / summary.totalSubmitted) *
//                     100
//                   ).toFixed(1)
//                 : 0}
//               %
//             </div>
//           </div>
//         </div>
//         <div className="bg-card rounded-xl shadow-sm border border-border p-6">
//           <div className="text-center">
//             <div className="text-2xl font-bold text-blue-600">
//               {summary.delivered.toLocaleString()}
//             </div>
//             <div className="text-sm text-muted-foreground mt-1">Delivered</div>
//             <div className="text-xs text-blue-500">{getDeliveryRate()}%</div>
//           </div>
//         </div>
//         <div className="bg-card rounded-xl shadow-sm border border-border p-6">
//           <div className="text-center">
//             <div className="text-2xl font-bold text-red-600">
//               {summary.undelivered.toLocaleString()}
//             </div>
//             <div className="text-sm text-muted-foreground mt-1">Undelivered</div>
//             <div className="text-xs text-red-500">
//               {summary.sent > 0
//                 ? ((summary.undelivered / summary.sent) * 100).toFixed(1)
//                 : 0}
//               %
//             </div>
//           </div>
//         </div>
//         <div className="bg-card rounded-xl shadow-sm border border-border p-6">
//           <div className="text-center">
//             <div className="text-2xl font-bold text-purple-600">
//               {summary.read.toLocaleString()}
//             </div>
//             <div className="text-sm text-muted-foreground mt-1">Read</div>
//             <div className="text-xs text-purple-500">{getReadRate()}%</div>
//           </div>
//         </div>
//       </div>

//       {/* Delivery Funnel */}
//       <div className="bg-card rounded-xl shadow-sm border border-border p-6">
//         <h2 className="text-lg font-semibold text-foreground mb-4">
//           Delivery Funnel
//         </h2>
//         <div className="space-y-3">
//           <div className="flex items-center">
//             <div className="w-24 text-sm text-muted-foreground">Submitted</div>
//             <div className="flex-1 bg-gray-200 rounded-full h-4 ml-4">
//               <div
//                 className="bg-blue-500 h-4 rounded-full"
//                 style={{ width: "100%" }}
//               ></div>
//             </div>
//             <div className="w-20 text-right text-sm font-medium ml-4">
//               {summary.totalSubmitted.toLocaleString()}
//             </div>
//           </div>
//           <div className="flex items-center">
//             <div className="w-24 text-sm text-muted-foreground">Sent</div>
//             <div className="flex-1 bg-gray-200 rounded-full h-4 ml-4">
//               <div
//                 className="bg-green-500 h-4 rounded-full"
//                 style={{
//                   width: `${
//                     summary.totalSubmitted > 0
//                       ? (summary.sent / summary.totalSubmitted) * 100
//                       : 0
//                   }%`,
//                 }}
//               ></div>
//             </div>
//             <div className="w-20 text-right text-sm font-medium ml-4">
//               {summary.sent.toLocaleString()}
//             </div>
//           </div>
//           <div className="flex items-center">
//             <div className="w-24 text-sm text-muted-foreground">Delivered</div>
//             <div className="flex-1 bg-gray-200 rounded-full h-4 ml-4">
//               <div
//                 className="bg-blue-500 h-4 rounded-full"
//                 style={{
//                   width: `${
//                     summary.totalSubmitted > 0
//                       ? (summary.delivered / summary.totalSubmitted) * 100
//                       : 0
//                   }%`,
//                 }}
//               ></div>
//             </div>
//             <div className="w-20 text-right text-sm font-medium ml-4">
//               {summary.delivered.toLocaleString()}
//             </div>
//           </div>
//           <div className="flex items-center">
//             <div className="w-24 text-sm text-muted-foreground">Read</div>
//             <div className="flex-1 bg-gray-200 rounded-full h-4 ml-4">
//               <div
//                 className="bg-purple-500 h-4 rounded-full"
//                 style={{
//                   width: `${
//                     summary.totalSubmitted > 0
//                       ? (summary.read / summary.totalSubmitted) * 100
//                       : 0
//                   }%`,
//                 }}
//               ></div>
//             </div>
//             <div className="w-20 text-right text-sm font-medium ml-4">
//               {summary.read.toLocaleString()}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Detailed Reports Table */}
//       <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
//         <div className="px-6 py-4 border-b border-border">
//           <h2 className="text-lg font-semibold text-foreground">
//             Detailed Delivery Reports
//           </h2>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-muted/50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Campaign
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Template
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Submission Time
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Total
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Sent
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Delivered
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Undelivered
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Read
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Source
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-card divide-y divide-gray-200">
//               {records.map((report) => (
//                 <tr key={report.id} className="hover:bg-muted/30">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
//                     {report.campaignName}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
//                     {report.templateName}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
//                     {report.submissionTime}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
//                     {report.totalNumbers.toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
//                     {report.sent.toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
//                     {report.delivered.toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
//                     {report.undelivered.toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-medium">
//                     {report.read.toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
//                         report.uploadSource === "File Upload"
//                           ? "bg-blue-100 text-blue-700"
//                           : "bg-green-100 text-green-700"
//                       }`}
//                     >
//                       {report.uploadSource}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
