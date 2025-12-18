// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'

// export default function Agents() {
//   const [searchTerm, setSearchTerm] = useState('')
//   const [statusFilter, setStatusFilter] = useState('All')
//   const [currentPage, setCurrentPage] = useState(1)
//   const itemsPerPage = 10

//   const agents = [
//     {
//       id: '1',
//       status: 'Active',
//       userName: 'John Doe',
//       agentName: 'E-commerce Store',
//       description: 'Online retail store for electronics and gadgets',
//       agentType: 'Promotional',
//       phone: '+91-9876543210',
//       email: 'john@estore.com'
//     },
//     {
//       id: '2',
//       status: 'Pending',
//       userName: 'Jane Smith',
//       agentName: 'Banking Services',
//       description: 'Digital banking and financial services',
//       agentType: 'Transactional',
//       phone: '+91-9876543211',
//       email: 'jane@bankservices.com'
//     },
//     {
//       id: '3',
//       status: 'Active',
//       userName: 'Mike Johnson',
//       agentName: 'Healthcare OTP',
//       description: 'Medical services and appointment booking',
//       agentType: 'OTP',
//       phone: '+91-9876543212',
//       email: 'mike@healthotp.com'
//     },
//     {
//       id: '4',
//       status: 'Rejected',
//       userName: 'Sarah Wilson',
//       agentName: 'Travel Agency',
//       description: 'Travel booking and tour packages',
//       agentType: 'Promotional',
//       phone: '+91-9876543213',
//       email: 'sarah@travelagency.com'
//     },
//     {
//       id: '5',
//       status: 'Active',
//       userName: 'David Brown',
//       agentName: 'Food Delivery',
//       description: 'Restaurant food delivery service',
//       agentType: 'Transactional',
//       phone: '+91-9876543214',
//       email: 'david@fooddelivery.com'
//     },
//     {
//       id: '6',
//       status: 'Pending',
//       userName: 'Emily Davis',
//       agentName: 'Insurance Corp',
//       description: 'Life and health insurance services',
//       agentType: 'Transactional',
//       phone: '+91-9876543215',
//       email: 'emily@insurance.com'
//     }
//   ]

//   const filteredAgents = agents.filter(agent => {
//     const matchesSearch = agent.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          agent.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          agent.description.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesStatus = statusFilter === 'All' || agent.status === statusFilter
//     return matchesSearch && matchesStatus
//   })

//   const paginatedAgents = filteredAgents.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   )

//   const totalPages = Math.ceil(filteredAgents.length / itemsPerPage)

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

//   const getAgentTypeColor = (type: string) => {
//     switch (type) {
//       case 'OTP':
//         return 'bg-blue-100 text-blue-700'
//       case 'Transactional':
//         return 'bg-purple-100 text-purple-700'
//       case 'Promotional':
//         return 'bg-orange-100 text-orange-700'
//       default:
//         return 'bg-gray-100 text-gray-700'
//     }
//   }

//   return (
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h1 className="text-3xl font-bold text-gray-900">Agents</h1>
//           <Link 
//             href="/app/rcs/agents/create"
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
//           >
//             <span className="mr-2">+</span>
//             Add Agent
//           </Link>
//         </div>

//         {/* Search and Filter Bar */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1">
//               <input
//                 type="text"
//                 placeholder="Search agents, users, or descriptions..."
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-500"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <div className="w-full md:w-48">
//               <select
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-500"
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option value="All">All Status</option>
//                 <option value="Active">Active</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Rejected">Rejected</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Agents Table */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     User Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Agent Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Description
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Agent Type
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Contact
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {paginatedAgents.map((agent) => (
//                   <tr key={agent.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(agent.status)}`}>
//                         {agent.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {agent.userName}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-8 w-8">
//                           <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
//                             <span className="text-white text-xs font-bold">
//                               {agent.agentName.charAt(0)}
//                             </span>
//                           </div>
//                         </div>
//                         <div className="ml-3">
//                           <div className="text-sm font-medium text-gray-900">{agent.agentName}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-900 max-w-xs truncate" title={agent.description}>
//                         {agent.description}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getAgentTypeColor(agent.agentType)}`}>
//                         {agent.agentType}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       <div>{agent.phone}</div>
//                       <div className="text-xs text-gray-400">{agent.email}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex space-x-2">
//                         <Link 
//                           href={`/dashboard/agents/${agent.id}/edit`}
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
//                       {Math.min(currentPage * itemsPerPage, filteredAgents.length)}
//                     </span>
//                     {' '}of{' '}
//                     <span className="font-medium">{filteredAgents.length}</span>
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
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span>
        {row.original.flag} {row.getValue("location")}
      </span>
    ),
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
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(row.getValue("balance")),
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
    <div className="p-4">
      <DataTable<Item> incomingData={data} columns={columns} />
    </div>
  );
}
