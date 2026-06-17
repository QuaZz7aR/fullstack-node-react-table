import { useRef, useState, type ChangeEvent } from "react";
import type { Filters } from "../api/employee";
import { useFiltersOptions } from "../hooks/useEmployees"

interface Props {
    filters: Filters,
    onChange: (key: keyof Filters, value: string | number) => void
}

export default function Filters({ filters, onChange }: Props) {
    const { data: options, isLoading } = useFiltersOptions();
    const searchDebounceRef = useRef<ReturnType<typeof setTimeout>>(null);
    const [localSearch, setLocalSearch] = useState(filters.search ?? "");

    function searchInputChange(e: ChangeEvent<HTMLInputElement>) {
        setLocalSearch(e.target.value);

        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
        }

        const value = e.target.value;

        searchDebounceRef.current = setTimeout(() => {
            onChange("search", value);
        }, 500)
    }

    if (isLoading) return <div>Loading...</div>

    return (
        <div className="flex gap-4 p-4">
            <div>
                <label>Search</label>
                <input type="text" className="w-full border-2 rounded px-2 py-1 text-sm"
                    placeholder="Name or email..."
                    value={localSearch}
                    onChange={searchInputChange}
                />
            </div>

            <div>
                <label>Departments</label>
                <select
                    className="w-full border-2 rounded px-2 py-1 text-sm"
                    value={filters.department ?? ""}
                    onChange={e => onChange("department", e.target.value)}
                >
                    <option value="">All</option>
                    {options?.departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>
        </div>
    )
}