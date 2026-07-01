import { useRef, useState, type ChangeEvent } from "react";
import type { Filters } from "../types/employee";
import { useFiltersOptions } from "../hooks/useEmployees"
import CollapseGroup from "./CollapseGroup";

interface Props {
    filters: Filters,
    onChange: (key: keyof Filters, value: string | number) => void
    onReset: () => void
}

export default function Filters({ filters, onChange, onReset }: Props) {
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
        <div className="flex flex-col gap-4 p-4 min-w-90">
            <button
                className="w-full border-2 rounded px-2 py-1 text-sm bg-red-50 hover:bg-red-100 text-red-600 hover:cursor-pointer"
                onClick={onReset}
            >Reset filters</button>

            <CollapseGroup title="Personal">
                <div>
                    <label>Search</label>
                    <input type="text" className="w-full border-2 rounded px-2 py-1 text-sm"
                        placeholder="Name or email..."
                        value={localSearch}
                        onChange={searchInputChange}
                    />
                </div>

                <div>
                    <label>Gender</label>
                    <select
                        className="w-full border-2 rounded px-2 py-1 text-sm hover:cursor-pointer"
                        value={filters.gender ?? ""}
                        onChange={e => onChange("gender", e.target.value)}
                    >
                        <option value="">All</option>
                        {options?.genders.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>

                <div>
                    <label>Birth date</label>
                    <div className="flex gap-4">
                        <input type="date" className="w-full border-2 rounded px-2 py-1 text-sm"
                            value={filters.birthDateFrom ?? ""}
                            onChange={e => onChange("birthDateFrom", e.target.value)}
                        />

                        <input type="date" className="w-full border-2 rounded px-2 py-1 text-sm"
                            value={filters.birthDateTo ?? ""}
                            onChange={e => onChange("birthDateTo", e.target.value)}
                        />
                    </div>
                </div>
            </CollapseGroup>

            <CollapseGroup title="Employment" defaultOpen={false}>
                <div>
                    <label>Departments</label>
                    <select
                        className="w-full border-2 rounded px-2 py-1 text-sm hover:cursor-pointer"
                        value={filters.department ?? ""}
                        onChange={e => onChange("department", e.target.value)}
                    >
                        <option value="">All</option>
                        {options?.departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                </div>

                <div>
                    <label>Grades</label>
                    <select
                        className="w-full border-2 rounded px-2 py-1 text-sm hover:cursor-pointer"
                        value={filters.grade ?? ""}
                        onChange={e => onChange("grade", e.target.value)}
                    >
                        <option value="">All</option>
                        {options?.grades.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>

                <div>
                    <label>Status</label>
                    <select
                        className="w-full border-2 rounded px-2 py-1 text-sm hover:cursor-pointer"
                        value={filters.status ?? ""}
                        onChange={e => onChange("status", e.target.value)}
                    >
                        <option value="">All</option>
                        {options?.statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                <div>
                    <label>Format</label>
                    <select
                        className="w-full border-2 rounded px-2 py-1 text-sm hover:cursor-pointer"
                        value={filters.format ?? ""}
                        onChange={e => onChange("format", e.target.value)}
                    >
                        <option value="">All</option>
                        {options?.formats.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>

                <div>
                    <label>Employment type</label>
                    <select
                        className="w-full border-2 rounded px-2 py-1 text-sm hover:cursor-pointer"
                        value={filters.employmentType ?? ""}
                        onChange={e => onChange("employmentType", e.target.value)}
                    >
                        <option value="">All</option>
                        {options?.employmentTypes.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                </div>

                <div>
                    <label>Positions</label>
                    <select
                        className="w-full border-2 rounded px-2 py-1 text-sm hover:cursor-pointer"
                        value={filters.position ?? ""}
                        onChange={e => onChange("position", e.target.value)}
                    >
                        <option value="">All</option>
                        {options?.positions.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                </div>
            </CollapseGroup>

            <CollapseGroup title="Salary & Dates" defaultOpen={false}>
                <div>
                    <label>Salary</label>
                    <div className="flex gap-4">
                        <input type="text" className="w-full border-2 rounded px-2 py-1 text-sm"
                            placeholder="From"
                            value={filters.salaryFrom ?? ""}
                            onChange={e => onChange("salaryFrom", e.target.value)}
                        />

                        <input type="text" className="w-full border-2 rounded px-2 py-1 text-sm"
                            placeholder="To"
                            value={filters.salaryTo ?? ""}
                            onChange={e => onChange("salaryTo", e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label>Hire Date</label>
                    <div className="flex gap-4">
                        <input type="date" className="w-full border-2 rounded px-2 py-1 text-sm"
                            value={filters.startDateFrom ?? ""}
                            onChange={e => onChange("startDateFrom", e.target.value)}
                        />

                        <input type="date" className="w-full border-2 rounded px-2 py-1 text-sm"
                            value={filters.startDateTo ?? ""}
                            onChange={e => onChange("startDateTo", e.target.value)}
                        />
                    </div>
                </div>
            </CollapseGroup>

            <CollapseGroup title="Location" defaultOpen={false}>
                <div>
                    <label>City</label>
                    <select
                        className="w-full border-2 rounded px-2 py-1 text-sm hover:cursor-pointer"
                        value={filters.officeCity ?? ""}
                        onChange={e => onChange("officeCity", e.target.value)}
                    >
                        <option value="">All</option>
                        {options?.cities.map(c => <option key={c.id} value={c.city}>{c.city}</option>)}
                    </select>
                </div>
            </CollapseGroup>
        </div>
    )
}