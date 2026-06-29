import { createColumnHelper } from "@tanstack/react-table";
import type { Employee } from "../types/employee";

const columnHelper = createColumnHelper<Employee>();


export function createColumns(handleEdit: (employee: Employee) => void, handleDelete: (id: number) => void) {
  return [
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
            onClick={() => handleEdit(row.original)}
          >
            Edit
          </button>
          <button
            className="text-xs px-2 py-1 border rounded text-red-500 hover:bg-red-50"
            onClick={() => handleDelete(row.original.id)}
          >
            Delete
          </button>
        </div>
      )
    }),
    columnHelper.accessor("first_name", { header: "First Name" }),
    columnHelper.accessor("last_name", { header: "Last Name" }),
    columnHelper.accessor("email", { header: "Email" }),
    columnHelper.accessor("phone", { header: "Phone" }),
    columnHelper.accessor("gender", { header: "Gender" }),
    columnHelper.accessor("birth_date", { header: "Birth Date" }),
    columnHelper.accessor("salary", { header: "Salary" }),
    columnHelper.accessor("grade", { header: "Grade" }),
    columnHelper.accessor("employment_type", { header: "Employment Type" }),
    columnHelper.accessor("format", { header: "Format" }),
    columnHelper.accessor("status", { header: "Status" }),
    columnHelper.accessor("start_date", { header: "Start Date" }),
    columnHelper.accessor("department", { header: "Department" }),
    columnHelper.accessor("position", { header: "Position" }),
    columnHelper.accessor("office_city", { header: "Office City" }),
    columnHelper.accessor("office_country", { header: "Office Country" }),
    
  ]
}