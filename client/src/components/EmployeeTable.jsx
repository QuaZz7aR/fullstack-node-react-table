import { useState } from "react";
import { useEmployees } from "../hooks/useEmployees"
import columns from "../columns/columns"
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

export default function EmployeeTable() {
    const [filters, setFilters] = useState({ 
        page: 1, 
        pageSize: 20,
    });

    const { data, isLoading, isError } = useEmployees(filters);

    const table = useReactTable({
        data: data?.data ?? [],
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        manualSorting: true,
        onSortingChange: (updater) => {
            const newSorting = typeof updater === "function" ? updater([]) : updater;
            if(newSorting.length > 0){
                setFilters(prev => ({
                    ...prev,
                    sortBy: newSorting[0].id,
                    sortOrder: newSorting[0].desc ? "desc" : "asc",
                    page: 1
                }))
            }
        },
        state: {
            sorting: [{
                id: filters.sortBy ?? "last_name",
                desc: filters.sortOrder === "desc"
            }]
        }
    })

    if (isLoading) return <div>Data is loading...</div>
    if (isError) return <div>Something went wrong while fetching employees...</div>

    return <div className="p-4">
        <p className="mb-4 text-sm font-semibold">Total: {data?.total}</p>
        <table className="w-full border-collapse text-sm">
            <thead>
                {table.getHeaderGroups().map(headerGroup => <tr key={headerGroup.id} className="border-b bg-gray-300">
                    {headerGroup.headers.map(header => <th 
                        key={header.id} 
                        className="p-2 text-left font-semibold hover:cursor-pointer border"
                        onClick={header.column.getToggleSortingHandler()}
                        >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === 'asc' ? ' ↑' : header.column.getIsSorted() === 'desc' ? ' ↓' : ' ↕'}
                    </th>)}
                </tr>)}
            </thead>
            <tbody>
                {table.getRowModel().rows.map(row => <tr key={row.id} className="border-b hover:bg-gray-300">
                    {row.getVisibleCells().map(cell => <td key={cell.id} className="p-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>)}
                </tr>)}
            </tbody>
        </table>
    </div>
}