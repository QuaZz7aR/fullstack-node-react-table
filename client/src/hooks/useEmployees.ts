import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchEmployees, fetchFilterOptions, type Filters } from "../api/employee";

export function useFiltersOptions() {
    return useQuery({
        queryKey: ["filterOptions"],
        queryFn: fetchFilterOptions
    })
}
export function useEmployees(filters: Filters) {
    return useQuery({
        queryKey: ["employees", filters],
        queryFn: () => fetchEmployees(filters),
        placeholderData: keepPreviousData
    })
}