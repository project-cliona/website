// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'
// import { PageHeading } from '@/components/PageHeading'

// export default function Templates() {
//   const [searchTerm, setSearchTerm] = useState('')
//   const [currentPage, setCurrentPage] = useState(1)
//   const itemsPerPage = 10

//   const templates = [
//     {
//       id: '1',
//       userName: 'John Doe',
//       agentName: 'E-commerce Store',
//       templateName: 'Holiday Sale',
//       templateType: 'Standalone',
//       status: 'Active',
//       modifiedOn: '2024-01-15 10:30 AM'
//     },
//     {
//       id: '2',
//       userName: 'Jane Smith',
//       agentName: 'Banking Services',
//       templateName: 'Account Statement',
//       templateType: 'Standalone',
//       status: 'Pending',
//       modifiedOn: '2024-01-14 02:15 PM'
//     },
//     {
//       id: '3',
//       userName: 'Mike Johnson',
//       agentName: 'Healthcare OTP',
//       templateName: 'Login Verification',
//       templateType: 'Standalone',
//       status: 'Active',
//       modifiedOn: '2024-01-13 09:45 AM'
//     },
//     {
//       id: '4',
//       userName: 'Sarah Wilson',
//       agentName: 'E-commerce Store',
//       templateName: 'Cart Abandonment',
//       templateType: 'Standalone',
//       status: 'Rejected',
//       modifiedOn: '2024-01-12 04:20 PM'
//     },
//     {
//       id: '5',
//       userName: 'David Brown',
//       agentName: 'Travel Agency',
//       templateName: 'Booking Confirmation',
//       templateType: 'Standalone',
//       status: 'Active',
//       modifiedOn: '2024-01-11 11:10 AM'
//     }
//   ]

//   const filteredTemplates = templates.filter(template =>
//     template.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     template.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     template.agentName.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   const paginatedTemplates = filteredTemplates.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   )

//   const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage)

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'Active':
//         return 'bg-green-100 text-green-700'
//       case 'Pending':
//         return 'bg-yellow-100 text-yellow-700'
//       case 'Rejected':
//         return 'bg-red-100 text-red-700'
//       default:
//         return 'bg-gray-100 text-gray-700'
//     }
//   }

//   return (
//       <div className="space-y-6">
// <PageHeading
//         title="Templates"
//         subtitle="Overview and manage your templates"
//       />
//         {/* Search Bar */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1">
//               <input
//                 type="text"
//                 placeholder="Search templates, users, or agents..."
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-500"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Templates Table */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     User Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Agent Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Template Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Template Type
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Modified On
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {paginatedTemplates.map((template) => (
//                   <tr key={template.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {template.userName}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {template.agentName}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {template.templateName}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {template.templateType}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(template.status)}`}>
//                         {template.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {template.modifiedOn}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex space-x-2">
//                         <Link 
//                           href={`/dashboard/templates/${template.id}/edit`}
//                           className="text-blue-600 hover:text-blue-900"
//                         >
//                           Edit
//                         </Link>
//                         <button className="text-red-600 hover:text-red-900">
//                           Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
//               <div className="flex-1 flex justify-between sm:hidden">
//                 <button
//                   onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//                 >
//                   Previous
//                 </button>
//                 <button
//                   onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//                 >
//                   Next
//                 </button>
//               </div>
//               <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//                 <div>
//                   <p className="text-sm text-gray-700">
//                     Showing{' '}
//                     <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
//                     {' '}to{' '}
//                     <span className="font-medium">
//                       {Math.min(currentPage * itemsPerPage, filteredTemplates.length)}
//                     </span>
//                     {' '}of{' '}
//                     <span className="font-medium">{filteredTemplates.length}</span>
//                     {' '}results
//                   </p>
//                 </div>
//                 <div>
//                   <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
//                     <button
//                       onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
//                       disabled={currentPage === 1}
//                       className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                     >
//                       ←
//                     </button>
//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                       <button
//                         key={page}
//                         onClick={() => setCurrentPage(page)}
//                         className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                           currentPage === page
//                             ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
//                             : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                         }`}
//                       >
//                         {page}
//                       </button>
//                     ))}
//                     <button
//                       onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
//                       disabled={currentPage === totalPages}
//                       className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                     >
//                       →
//                     </button>
//                   </nav>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//   )
// }

"use client";

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/Table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { PageHeading } from "@/components/PageHeading";

export type Item = {
  id: string;
  name: string;
  email: string;
  location: string;
  flag: string;
  status: "Active" | "Inactive" | "Pending";
  balance: number;
};

const multiColumnFilterFn = (row: any, _columnId: string, value: string) => {
  const search = value.toLowerCase();
  return `${row.original.name} ${row.original.email}`
    .toLowerCase()
    .includes(search);
};

const statusFilterFn = (row: any, columnId: string, value: string[]) => {
  if (!value?.length) return true;
  return value.includes(row.getValue(columnId));
};

const columns: ColumnDef<Item>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(val) => table.toggleAllPageRowsSelected(!!val)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(val) => row.toggleSelected(!!val)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "name",
    header: "Name",
    filterFn: multiColumnFilterFn,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
    size: 80,
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 160,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span>
        {row.original.flag} {row.getValue("location")}
      </span>
    ),
    size: 80,
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: statusFilterFn,
    cell: ({ row }) => (
      <Badge
        className={cn(
          row.getValue("status") === "Inactive" &&
          "bg-muted-foreground/60 text-primary-foreground"
        )}
      >
        {row.getValue("status")}
      </Badge>
    ),
    size: 80,
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(row.getValue("balance")),
    size: 80,
  },
];

/* ---------------- Component ---------------- */

export default function UsersTable() {
  const [data, setData] = useState<Item[]>([]);

  useEffect(() => {
    fetch("https://dummyjson.com/users")
      .then((res) => res.json())
      .then((res) => {
        // Map DummyJSON to our Item type
        const mapped: Item[] = res.users.map((u: any) => ({
          id: String(u.id),
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
          location: u.address.city,
          status: ["Active", "Inactive", "Pending"][Math.floor(Math.random() * 3)] as
            | "Active"
            | "Inactive"
            | "Pending",
          balance: Math.floor(Math.random() * 5000),
        }));
        setData(mapped);
      });
  }, []);

  return (
    <div className="space-y-8">
      <PageHeading
        title="Templates"
        subtitle="Overview and manage your templates"
      />
      <DataTable<Item> incomingData={data} columns={columns} filterPlaceHolder={"Filter with template name"} />
    </div>
  );
}
