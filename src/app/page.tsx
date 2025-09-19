"use client";

import React, { useEffect, useState, useMemo  } from "react";
import DataTable, { Column } from "../app/components/DataTable";
import Link from "next/link";

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    brand: string;
    stock: number;
    rating: number;
    thumbnail: string;
  }
  

export default function ProductPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [sortBy, setSortBy] = useState<keyof Product | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const [page, setPage] = useState(1);

    const [filterKey, setFilterKey] = useState<keyof Product | "">("");
    const [filterValue, setFilterValue] = useState("");;

    const rowsPerPageOptions = [5, 10, 20, 30];
    const [pageSize, setPageSize] = useState<number>(10);
    const [total, setTotal] = useState(0);

  useEffect(() => {
    const skip = (page - 1) * pageSize;

    let url = `https://dummyjson.com/products?limit=${pageSize}&skip=${skip}`;

    if (filterKey && filterValue) {
      if (filterKey === "title") {
        url = `https://dummyjson.com/products/search?q=${filterValue}&limit=${pageSize}&skip=${skip}`;
      } else if (filterKey === "category") {
        url = `https://dummyjson.com/products/category/${filterValue}?limit=${pageSize}&skip=${skip}`;
      }
    }

    if (sortBy) {
      url += `&sortBy=${sortBy}&order=${sortOrder}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setTotal(data.total || 0);
      });
  }, [sortBy, sortOrder, page, pageSize, filterKey, filterValue]);


    // Filtering
    const filtered = useMemo(() => {
        if (!filterKey || !filterValue) return products;
        return products.filter((p) =>
          String(p[filterKey]).toLowerCase().includes(filterValue.toLowerCase())
        );
    }, [products, filterKey, filterValue]);
      
    // Sorting
    const sorted = useMemo(() => {
    if (!sortBy) return filtered;
    return [...filtered].sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });
    }, [filtered, sortBy, sortOrder]);
    const paginated = sorted;

    // Pagination
    const totalPages = Math.ceil(total / pageSize);

    const columns = [
        { key: "id", label: "ID", sortable: true },
        { key: "title", label: "Title", sortable: true },
        { key: "category", label: "Category", sortable: true },
        { key: "price", label: "Price", sortable: true },
        {
          key: "actions",
          label: "Actions",
          render: (row: Product) => (
            <Link
              href={`/product/${row.id}`}
              className="text-blue-600 hover:underline"
            >
              View Detail
            </Link>
          ),
        },
    ] as Column<Product>[];
      

    const handleSort = (key: keyof Product) => {
    if (sortBy === key) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
        // setSortKey(key);
        setSortBy(key);
        setSortOrder("asc");
    }
    };
  return (
    <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Product List</h1>
        {/* Filtering UI */}
        <div className="flex gap-2 mb-4">
          <select
            value={filterKey as string}
            onChange={(e) => setFilterKey(e.target.value as keyof Product)}
            className="border p-2 rounded"
          >
            <option value="">Filter by...</option>
            {columns
              .filter((col) => col.key !== "actions") // exclude non-data columns
              .map((col) => (
                <option key={col.key as string} value={col.key as string}>
                  {col.label}
                </option>
              ))}
          </select>

          <input
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              placeholder="Enter filter value"
              className="border p-2 rounded flex-1"
          />
        </div>
        <DataTable
            data={paginated}
            columns={columns}
            onSort={handleSort}
            sortKey={sortBy}
            sortOrder={sortOrder}
        />

        {/* Pagination Controls */}
        <div className="flex justify-between mt-4">
            <div className="flex gap-2 mt-4">
            <select
              className="border px-2 py-1 rounded"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
                {rowsPerPageOptions.map((size) => (
                <option
                    key={size}
                    value={size}
                >
                    {size} rows
                </option>
                ))}
            </select>
            </div>
            <div className="flex gap-2 items-center">
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Prev
                </button>
                <span>
                Page {page} of {totalPages}
                </span>
                <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                Next
                </button>
            </div>
        </div>
    </div>
  );
}
