export default function WhatsappCampaignReports() {
  return (
    <div className="p-6 text-muted-foreground">
      Campaign Reports — coming soon.
    </div>
  );
}

// "use client";

// import { useState, useMemo } from "react";
// import { PageHeading } from "@/components/PageHeading";
// import { TableSkeleton } from "@/components/ui/skeleton/table";
// import { useQuery } from "@tanstack/react-query";
// import { authenticatedApiClient } from "@/lib/axios";
// import { WhatsappCampaign } from "@/lib/type";

// const fetchWhatsappCampaigns = async (): Promise<WhatsappCampaign[]> => {
//   try {
//     const res = await authenticatedApiClient().get("/whatsApp/campaigns");
//     return res.data.result;
//   } catch (error) {
//     console.log("Error fetching WhatsApp campaigns:", error);
//     return [];
//   }
// };

// export default function WhatsappCampaignReports() {
//   const [filters, setFilters] = useState({
//     dateType: "Day",
//     startDate: new Date().toISOString().split("T")[0],
//     endDate: new Date().toISOString().split("T")[0],
//   });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const { data: campaigns, isLoading } = useQuery<WhatsappCampaign[]>({
//     queryKey: ["whatsapp-campaigns"],
//     queryFn: fetchWhatsappCampaigns,
//   });

//   const handleFilterChange = (field: string, value: string) => {
//     setFilters((prev) => ({ ...prev, [field]: value }));
//   };

//   const filteredCampaigns = useMemo(() => {
//     if (!campaigns) return [];
//     return campaigns.filter((campaign) => {
//       const matchesSearch =
//         campaign.campaignName
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase()) ||
//         campaign.templateName
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase());
//       return matchesSearch;
//     });
//   }, [campaigns, searchTerm]);

//   const paginatedCampaigns = useMemo(() => {
//     return filteredCampaigns.slice(
//       (currentPage - 1) * itemsPerPage,
//       currentPage * itemsPerPage
//     );
//   }, [filteredCampaigns, currentPage]);

//   const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Completed":
//         return "bg-green-100 text-green-700";
//       case "Scheduled":
//         return "bg-blue-100 text-blue-700";
//       case "Sending":
//         return "bg-yellow-100 text-yellow-700";
//       case "Failed":
//         return "bg-red-100 text-red-700";
//       default:
//         return "bg-muted text-foreground";
//     }
//   };

//   const getRateColor = (rate: number) => {
//     if (rate >= 95) return "text-green-600";
//     if (rate >= 90) return "text-yellow-600";
//     return "text-red-600";
//   };

//   const handleDownload = (campaignId: string, campaignName: string) => {
//     console.log(
//       `Downloading report for campaign ${campaignId}: ${campaignName}`
//     );
//   };

//   const exportAllReports = () => {
//     console.log("Exporting all campaign reports...");
//   };

//   if (isLoading) {
//     return (
//       <div className="space-y-6">
//         <PageHeading
//           title="Campaign Reports"
//           subtitle="View and analyze your WhatsApp campaign performance"
//         />
//         <TableSkeleton rows={5} columns={8} />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <PageHeading
//           title="Campaign Reports"
//           subtitle="View and analyze your WhatsApp campaign performance"
//         />
//         <button
//           onClick={exportAllReports}
//           className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors flex items-center text-sm"
//         >
//           Export All Reports
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="bg-card rounded-xl shadow-sm border border-border p-6">
//         <h2 className="text-lg font-semibold text-foreground mb-4">Filters</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="bg-card rounded-xl shadow-sm border border-border p-6">
//         <input
//           type="text"
//           placeholder="Search campaigns or templates..."
//           className="w-full border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-foreground"
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setCurrentPage(1);
//           }}
//         />
//       </div>

//       {/* Summary Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-card rounded-xl shadow-sm border border-border p-6">
//           <div className="text-center">
//             <div className="text-2xl font-bold text-blue-600">
//               {filteredCampaigns.length}
//             </div>
//             <div className="text-sm text-muted-foreground mt-1">Total Campaigns</div>
//           </div>
//         </div>
//         <div className="bg-card rounded-xl shadow-sm border border-border p-6">
//           <div className="text-center">
//             <div className="text-2xl font-bold text-green-600">
//               {filteredCampaigns.filter((c) => c.status === "Completed").length}
//             </div>
//             <div className="text-sm text-muted-foreground mt-1">Completed</div>
//           </div>
//         </div>
//         <div className="bg-card rounded-xl shadow-sm border border-border p-6">
//           <div className="text-center">
//             <div className="text-2xl font-bold text-blue-600">
//               {filteredCampaigns.filter((c) => c.status === "Scheduled").length}
//             </div>
//             <div className="text-sm text-muted-foreground mt-1">Scheduled</div>
//           </div>
//         </div>
//         <div className="bg-card rounded-xl shadow-sm border border-border p-6">
//           <div className="text-center">
//             <div className="text-2xl font-bold text-red-600">
//               {filteredCampaigns.filter((c) => c.status === "Failed").length}
//             </div>
//             <div className="text-sm text-muted-foreground mt-1">Failed</div>
//           </div>
//         </div>
//       </div>

//       {/* Campaign Table */}
//       <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
//         <div className="px-6 py-4 border-b border-border">
//           <h2 className="text-lg font-semibold text-foreground">
//             Campaign Details
//           </h2>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-muted/50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Campaign Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Template Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Scheduled Time
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Message Count
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Delivery Rate
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Read Rate
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Download
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-card divide-y divide-gray-200">
//               {paginatedCampaigns.map((campaign) => (
//                 <tr key={campaign.id} className="hover:bg-muted/30">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
//                     {campaign.campaignName}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
//                     {campaign.templateName}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
//                     {campaign.scheduledTime}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-medium">
//                     {campaign.messageCount.toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     {campaign.deliveryRate > 0 ? (
//                       <span
//                         className={`font-medium ${getRateColor(
//                           campaign.deliveryRate
//                         )}`}
//                       >
//                         {campaign.deliveryRate}%
//                       </span>
//                     ) : (
//                       <span className="text-muted-foreground">-</span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     {campaign.readRate > 0 ? (
//                       <span
//                         className={`font-medium ${getRateColor(
//                           campaign.readRate
//                         )}`}
//                       >
//                         {campaign.readRate}%
//                       </span>
//                     ) : (
//                       <span className="text-muted-foreground">-</span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
//                         campaign.status
//                       )}`}
//                     >
//                       {campaign.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <button
//                       onClick={() =>
//                         handleDownload(campaign.id, campaign.campaignName)
//                       }
//                       disabled={
//                         campaign.status === "Scheduled" ||
//                         campaign.status === "Failed"
//                       }
//                       className="text-blue-600 hover:text-blue-900 disabled:text-muted-foreground disabled:cursor-not-allowed text-sm"
//                     >
//                       Download
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="bg-card px-4 py-3 flex items-center justify-between border-t border-border">
//             <div className="flex-1 flex justify-between sm:hidden">
//               <button
//                 onClick={() =>
//                   setCurrentPage(Math.max(currentPage - 1, 1))
//                 }
//                 disabled={currentPage === 1}
//                 className="relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-card hover:bg-muted/30 disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={() =>
//                   setCurrentPage(Math.min(currentPage + 1, totalPages))
//                 }
//                 disabled={currentPage === totalPages}
//                 className="ml-3 relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-card hover:bg-muted/30 disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//             <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//               <div>
//                 <p className="text-sm text-foreground">
//                   Showing{" "}
//                   <span className="font-medium">
//                     {(currentPage - 1) * itemsPerPage + 1}
//                   </span>{" "}
//                   to{" "}
//                   <span className="font-medium">
//                     {Math.min(
//                       currentPage * itemsPerPage,
//                       filteredCampaigns.length
//                     )}
//                   </span>{" "}
//                   of{" "}
//                   <span className="font-medium">
//                     {filteredCampaigns.length}
//                   </span>{" "}
//                   results
//                 </p>
//               </div>
//               <div>
//                 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
//                   <button
//                     onClick={() =>
//                       setCurrentPage(Math.max(currentPage - 1, 1))
//                     }
//                     disabled={currentPage === 1}
//                     className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-muted/30 disabled:opacity-50"
//                   >
//                     Previous
//                   </button>
//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                     (page) => (
//                       <button
//                         key={page}
//                         onClick={() => setCurrentPage(page)}
//                         className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                           currentPage === page
//                             ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
//                             : "bg-card border-border text-muted-foreground hover:bg-muted/30"
//                         }`}
//                       >
//                         {page}
//                       </button>
//                     )
//                   )}
//                   <button
//                     onClick={() =>
//                       setCurrentPage(
//                         Math.min(currentPage + 1, totalPages)
//                       )
//                     }
//                     disabled={currentPage === totalPages}
//                     className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-muted/30 disabled:opacity-50"
//                   >
//                     Next
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
