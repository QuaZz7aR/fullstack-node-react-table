import type { EmployeeFormData, EmployeeResponse, FilterOptions, Filters } from "../types/employee";

const API_URL = "http://localhost:3000/api/employees";

export async function fetchEmployees(filters: Filters): Promise<EmployeeResponse> {
    const res = await fetch(`${API_URL}/list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters)
    });

    return res.json();
}

export async function fetchFilterOptions(): Promise<FilterOptions> {
    const res = await fetch(`${API_URL}/filters`);
    return res.json();
}

export async function createEmployee(data: EmployeeFormData): Promise<{ id: number }> {
    const res = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw await res.json();
    return res.json();
}
export async function updateEmployee(data: EmployeeFormData, id: number): Promise<{ sucess: boolean }> {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw await res.json();
    return res.json();
}
export async function deleteEmployee(id: number): Promise<{ sucess: boolean }> {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });
    if (!res.ok) throw await res.json();
    return res.json();
}