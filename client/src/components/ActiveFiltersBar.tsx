import type { Filters } from "../types/employee"

interface Props {
    activeFilters: [keyof Filters, string | number][],
    onRemove: (key: keyof Filters) => void
}

const labels: Partial<Record<keyof Filters, string>> = {
    search: 'Search',
    department: 'Department',
    grade: 'Grade',
    salaryFrom: 'Salary from',
    salaryTo: 'Salary to',
    startDateFrom: 'Hired from',
    startDateTo: 'Hired to',
    status: 'Status',
    format: 'Format',
    employmentType: 'Employment',
    gender: 'Gender',
    birthDateFrom: 'Born from',
    birthDateTo: 'Born to',
    position: 'Position',
    officeCity: 'City',
}

export default function ActiveFiltersBar({ activeFilters, onRemove }: Props) {
    return (
        <div className="flex pl-4 gap-1">
            {activeFilters.map(([key, value]) => <div key={key} className="flex gap-2 px-2 py-1 border-2 rounded text-sm font-semibold ">
                {labels[key] ?? key}: {value}
                <span className="hover:cursor-pointer" onClick={() => onRemove(key)}>✕</span>
            </div>)}
        </div>
    )
}