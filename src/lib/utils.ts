// import { FilterFn } from "@tanstack/react-table";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Custom filter function for multi-column searching
// const multiColumnFilterFn: FilterFn<Item> = (row, columnId, filterValue) => {
//   const searchableRowContent = `${row.original.name} ${row.original.email}`.toLowerCase();
//   const searchTerm = (filterValue ?? "").toLowerCase();
//   return searchableRowContent.includes(searchTerm);
// };

// const statusFilterFn: FilterFn<Item> = (row, columnId, filterValue: string[]) => {
//   if (!filterValue?.length) return true;
//   const status = row.getValue(columnId) as string;
//   return filterValue.includes(status);
// };