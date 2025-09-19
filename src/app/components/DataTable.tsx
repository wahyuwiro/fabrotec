"use client";

import React from "react";

export interface Column<T> {
    key: keyof T | "actions";
    label: string;
    sortable?: boolean;
    render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowsPerPageOptions?: number[];
  sortBy?: keyof T | null;
  onSort?: (key: keyof T) => void;
  sortKey?: keyof T | null;
  sortOrder?: "asc" | "desc";
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  sortBy,
  onSort,
  sortKey,
  sortOrder,
  
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`border px-2 py-1 text-left ${
                  col.sortable ? "cursor-pointer select-none hover:bg-gray-200" : ""
                }`}
                onClick={() => {
                  if (col.sortable && onSort) onSort(col.key);
                }}
              >
                {col.label}
                {col.sortable && sortBy === col.key && (
                  <span>{sortOrder === "asc" ? " 🔼" : " 🔽"}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
            {data.length > 0 ? (
                data.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                    {columns.map((col) => (
                    <td key={String(col.key)} className="p-2 border">
                        {col.render ? col.render(row) : String(row[col.key as keyof T] ?? "")}
                    </td>
                    ))}
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan={columns.length} className="p-4 text-center">
                    No data found
                </td>
                </tr>
            )}
        </tbody>

      </table>
    </div>
  );
}
