const API_URL = "http://localhost:3000/api/employees";

export interface Employee {
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    phone: string,
    gender: string,
    birth_date: string,
    salary: number,
    grade: string,
    employment_type: string,
    format: string,
    status: string,
    start_date: string,
    department: string,
    position: string,
    office_city: string,
    office_country: string
}

export interface Filters {
    search: string,
    department: string,
    grade: string,
    salaryFrom: string,
    salaryTo: string,
    startDateFrom: string,
    startDateTo: string,
    status: string,
    format: string,
    employmentType: string,
    gender: string,
    birthDateFrom: string,
    birthDateTo: string,
    position: string,
    officeCity: string,
    page: number,
    pageSize: number,
    sortBy: string,
    sortOrder: "asc" | "desc"
}

export interface EmployeeResponse {
    data: Employee[],
    total: number,
    page: number,
    pageSize: number,
    totalPages: number
}

export interface FilterOptions {
    departments: string[],
    positions: string[],
    cities: string[],
    grades: string[],
    statuses: string[],
    formats: string[],
    employmentTypes: string[],
    genders: string[]
}

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