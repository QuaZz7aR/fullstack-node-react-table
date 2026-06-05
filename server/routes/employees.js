import { Router } from "express";
import db from "../database.js";

const router = Router();

router.post("/list", (req, res) => {
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
        FROM employees e
        JOIN contracts c ON c.employee_id = e.id AND c.is_current = 1
        JOIN departments d ON d.id = c.department_id
        JOIN positions p ON p.id = c.position_id
        JOIN offices o ON o.id = c.office_id
    `).all()

    res.json(employees);
})

export default router;