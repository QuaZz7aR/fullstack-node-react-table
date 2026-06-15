import { createColumnHelper } from "@tanstack/react-table";
import type { Employee } from "../api/employee";

const columnHelper = createColumnHelper<Employee>();

const columns = [
    
    columnHelper.accessor("first_name", {
        header: "Firts Name"
    }),
    columnHelper.accessor("last_name", {
        header: "Last Name"
    }),
    columnHelper.accessor("salary", {
        header: "Salary"
    }),
    columnHelper.accessor("department", {
        header: "Department"
    }),
    columnHelper.accessor("position", {
        header: "Position"
    }),
    columnHelper.accessor("status", {
        header: "Status"
    }),

]

export default columns;