import { createColumnHelper } from "@tanstack/react-table";
import type { Employee } from "../api/employee";

const columnHelper = createColumnHelper<Employee>();

const columns = [

    columnHelper.accessor("first_name", {
        header: "Firts Name",
    }),
    columnHelper.accessor("last_name", {
        header: "Last Name"
    }),
    columnHelper.accessor("email", {
        header: "Email"
    }),
    columnHelper.accessor("phone", {
        header: "Phone"
    }),
    columnHelper.accessor("gender", {
        header: "Gender"
    }),
    columnHelper.accessor("birth_date", {
        header: "Birth date"
    }),
    columnHelper.accessor("salary", {
        header: "Salary"
    }),
    columnHelper.accessor("grade", {
        header: "Grade"
    }),
    columnHelper.accessor("employment_type", {
        header: "Employmnet type"
    }),
    columnHelper.accessor("format", {
        header: "Format"
    }),
    columnHelper.accessor("status", {
        header: "Status"
    }),
    columnHelper.accessor("start_date", {
        header: "Start date",
    }),
    columnHelper.accessor("department", {
        header: "Department"
    }),
    columnHelper.accessor("position", {
        header: "Position"
    }),
    columnHelper.accessor("office_city", {
        header: "Office city"
    }),
    columnHelper.accessor("office_country", {
        header: "Office country"
    }),
]

export default columns;