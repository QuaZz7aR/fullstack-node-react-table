import { Router } from "express";
import db from "../database.js";

const router = Router();

router.post("/list", (req, res) => {

    const { search, department, grade, salaryFrom, salaryTo, startDateFrom, startDateTo,
        status, format, employmentType, gender, birthDateFrom, birthDateTo, position, officeCity,
        page, pageSize
    } = req.body;

    const conditions = [];
    const params = [];

    if (search) {
        conditions.push(`(e.first_name LIKE ? OR e.last_name LIKE ? OR e.email LIKE ?)`);
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (department) {
        conditions.push(`d.name = ?`);
        params.push(department);
    }

    if (grade) {
        conditions.push(`c.grade = ?`);
        params.push(grade);
    }

    if (salaryFrom) {
        conditions.push(`c.salary >= ?`);
        params.push(salaryFrom);
    }

    if (salaryTo) {
        conditions.push(`c.salary <= ?`);
        params.push(salaryTo);
    }

    if (startDateFrom) {
        conditions.push(`c.start_date >= ?`);
        params.push(startDateFrom);
    }

    if (startDateTo) {
        conditions.push(`c.start_date <= ?`);
        params.push(startDateTo);
    }

    if (status) {
        conditions.push(`c.status = ?`)
        params.push(status)
    }

    if (format) {
        conditions.push(`c.format = ?`)
        params.push(format)
    }

    if (employmentType) {
        conditions.push(`c.employment_type = ?`)
        params.push(employmentType)
    }

    if (gender) {
        conditions.push(`e.gender = ?`)
        params.push(gender)
    }

    if (birthDateFrom) {
        conditions.push(`e.birth_date >= ?`)
        params.push(birthDateFrom)
    }

    if (birthDateTo) {
        conditions.push(`e.birth_date <= ?`)
        params.push(birthDateTo)
    }

    if (position) {
        conditions.push(`p.name = ?`)
        params.push(position)
    }

    if (officeCity) {
        conditions.push(`o.city = ?`)
        params.push(officeCity)
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const limit = pageSize || 20;
    const offset = ((page || 1) - 1) * limit;

    const baseQuery = `
        FROM employees e
        JOIN contracts c ON c.employee_id = e.id AND c.is_current = 1
        JOIN departments d ON d.id = c.department_id
        JOIN positions p ON p.id = c.position_id
        JOIN offices o ON o.id = c.office_id
        ${where}
    `

    const employees = db.prepare(`
        SELECT
        e.id,
        e.first_name,
        e.last_name,
        e.email,
        e.phone,
        e.gender,
        e.birth_date,
        c.salary,
        c.grade,
        c.employment_type,
        c.format,
        c.status,
        c.start_date,
        d.name AS department,
        p.name AS position,
        o.city AS office_city,
        o.country AS office_country
        ${baseQuery}
        LIMIT ? OFFSET ?
    `).all(...params, limit, offset)

    const total = db.prepare(`
        SELECT COUNT(*) AS count
        ${baseQuery}
    `).get(...params)

    res.json({
        data: employees,
        total: total.count,
        page: page || 1,
        pageSize: limit,
        totalPages: Math.ceil(total.count / limit)
    });
})

export default router;