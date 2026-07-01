import {useState} from "react";
import {useEmployees} from "../hooks/useEmployees"
import {createColumns} from "../columns/columns"
import {flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import Filters from "./Filters"
import Drawer from "./Drawer"
import type {Employee, EmployeeFormData, Filters as FiltersType} from "../types/employee";
import {useMutation} from "@tanstack/react-query";
import {createEmployee, deleteEmployee, updateEmployee} from "../api/employee";
import queryClient from "../queryClient/queryClient";
import Modal from "./Modal";
import EmployeeForm from "./EmployeeForm";
import ActiveFiltersBar from "./ActiveFiltersBar";
import {SORT_ORDER} from "../constants/filters.ts"

const allowedSortFields = [
    "first_name",
    'last_name',
    "salary",
    "grade",
    "start_date",
    "department",
    "position",
    "office_city",
    "birth_date",
    "status"
]

export default function EmployeeTable() {

    const [filters, setFilters] = useState<FiltersType>({
        page: 1,
        pageSize: 20
    });
    const {data, isLoading, isError} = useEmployees(filters);
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const columns = createColumns(handleEdit, id => deleteMutation.mutate(id));

    const currentSorting = [{
        id: filters.sortBy ?? "last_name",
        desc: filters.sortOrder === SORT_ORDER.DESC
    }];

    const table = useReactTable({
        data: data?.data ?? [],
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        manualSorting: true,
        columnResizeMode: "onChange",
        onSortingChange: (updater) => {
            const newSorting = typeof updater === "function" ? updater(currentSorting) : updater;
            if (newSorting.length > 0) {
                setFilters(prev => ({
                    ...prev,
                    sortBy: newSorting[0].id,
                    sortOrder: newSorting[0].desc ? SORT_ORDER.DESC : SORT_ORDER.ASC,
                    page: 1
                }))
            }
        },
        state: {
            sorting: currentSorting
        },
        enableSortingRemoval: false,
    })

    function getActiveFilters(filters: FiltersType): [keyof FiltersType, string | number][] {
        const ignored = ["page", "pageSize", "sortBy", "sortOrder"];
        return Object.entries(filters).filter(([key, value]) =>
            !ignored.includes(key) && value !== "" && value !== undefined && value !== null) as [keyof FiltersType, string | number][]
    }

    const activeFilters = getActiveFilters(filters);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

    const createMutation = useMutation({
        mutationFn: createEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["employees"]});
            setIsModalOpen(false);
        },
        onError: (err: { errors: Record<string, string> }) => {
            console.log(err);
            setServerErrors(err.errors);
        }
    })

    const updateMutation = useMutation({
        mutationFn: ({data, id}: { id: number, data: EmployeeFormData }) => updateEmployee(data, id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["employees"]});
            setIsModalOpen(false);
        },
        onError: (err: { errors: Record<string, string> }) => {
            setServerErrors(err.errors);
        }
    })

    const deleteMutation = useMutation({
        mutationFn: deleteEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["employees"]});
        }
    })

    function handleSubmit(data: EmployeeFormData) {
        setServerErrors({});
        if (editingEmployee) {
            updateMutation.mutate({id: editingEmployee.id, data})
        } else {
            createMutation.mutate(data);
        }
    }

    function handleEdit(employee: Employee) {
        setEditingEmployee(employee);
        setServerErrors({});
        setIsModalOpen(true);
    }

    function handleCreate() {
        setEditingEmployee(null);
        setServerErrors({});
        setIsModalOpen(true);
    }

    function handleRemoveActiveFilter(key: keyof FiltersType) {
        setFilters(prev => ({...prev, [key]: undefined, page: 1}))
    }

    if (isLoading) return <div>Data is loading...</div>
    if (isError) return <div>Something went wrong while fetching employees...</div>

    return (
        <div className="p-4">
            <div className="flex gap-2 mb-4 items-center">
                <button
                    className="px-4 py-2 border-2 rounded text-sm font-semibold hover:bg-gray-50 hover:cursor-pointer"
                    onClick={() => setDrawerIsOpen(true)}>
                    ☰ Filters ({activeFilters.length})
                </button>

                <button
                    className="px-4 py-2 border-2 rounded text-sm font-semibold hover:bg-gray-50 hover:cursor-pointer"
                    onClick={handleCreate}
                >
                    + Add Employee
                </button>
                <ActiveFiltersBar activeFilters={activeFilters} onRemove={handleRemoveActiveFilter}/>
            </div>

            <Drawer isOpen={drawerIsOpen} onClose={() => setDrawerIsOpen(false)}>
                <Filters
                    filters={filters}
                    onChange={(key, value) => setFilters(prev => ({...prev, [key]: value, page: 1}))}
                    onReset={() => setFilters({
                        page: 1,
                        pageSize: 20,
                        sortBy: "last_name",
                        sortOrder: SORT_ORDER.ASC
                    })}/>
            </Drawer>

            <div className="w-full">
                <div className="overflow-x-scroll">
                    <table className="w-full border-collapse text-sm" style={{width: table.getTotalSize()}}>
                        <thead>
                        {table.getHeaderGroups().map(headerGroup => <tr key={headerGroup.id} className="border-b bg-gray-300">
                            {headerGroup.headers.map(header => <th
                                key={header.id}
                                className={`p-2 text-left font-semibold border relative
                                        ${allowedSortFields.includes(header.column.id) ? "hover:cursor-pointer" : ""}`}
                                onClick={allowedSortFields.includes(header.column.id) ? header.column.getToggleSortingHandler() : undefined}
                                style={{width: header.getSize()}}
                            >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {allowedSortFields.includes(header.column.id) ? header.column.getIsSorted() === SORT_ORDER.ASC ? ' ↑' : header.column.getIsSorted() === SORT_ORDER.DESC ? ' ↓' : ' ↕' : undefined}

                                <div className={`absolute top-0 right-0 h-full w-1 
                                    cursor-col-resize select-none touch-none bg-gray-300 hover:bg-blue-400
                                    ${header.column.getIsResizing() ? 'bg-blue-600' : ''}`}
                                     onClick={e => e.stopPropagation()}
                                     onMouseDown={header.getResizeHandler()}
                                     onTouchStart={header.getResizeHandler()}/>
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
                <div className=" flex mt-4 gap-2 items-center">
                    <button
                        className="px-3 py-1 border rounded disabled:opacity-20 disabled:hover:cursor-auto hover:cursor-pointer"
                        onClick={() => setFilters(prev => ({...prev, page: 1}))}
                        disabled={filters.page === 1}
                    >«
                    </button>
                    <button
                        className="px-3 py-1 border rounded disabled:opacity-20 disabled:hover:cursor-auto hover:cursor-pointer"
                        onClick={() => setFilters(prev => ({...prev, page: (prev.page ?? 1) - 1}))}
                        disabled={filters.page === 1}
                    >‹
                    </button>

                    <span className="mx-2">Page {data?.page} of {data?.totalPages}</span>

                    <button
                        className="px-3 py-1 border rounded disabled:opacity-20 disabled:hover:cursor-auto hover:cursor-pointer"
                        onClick={() => setFilters(prev => ({...prev, page: (prev.page ?? 1) + 1}))}
                        disabled={filters.page === data?.totalPages}
                    >›
                    </button>
                    <button
                        className="px-3 py-1 border rounded disabled:opacity-20 disabled:hover:cursor-auto hover:cursor-pointer"
                        onClick={() => setFilters(prev => ({...prev, page: data?.totalPages}))}
                        disabled={filters.page === data?.totalPages}
                    >»
                    </button>
                </div>
                <Modal
                    title={editingEmployee ? "Edit employee data" : "Create new employee"}
                    onClose={() => setIsModalOpen(false)}
                    isOpen={isModalOpen}
                >
                    <EmployeeForm initial={editingEmployee ?? undefined} onSubmit={handleSubmit}
                                  serverErrors={serverErrors}
                                  isLoading={createMutation.isPending || updateMutation.isPending}
                    />
                </Modal>
            </div>
        </div>
    )
}