import { Router } from "express";
import db from "../database.js";
import { validateEmployee } from "../validation/employee.js";
import {EMPLOYMENT_TYPE, FORMAT, GENDER, GRADE, SORT_ORDER, STATUS} from "../../client/src/constants/filters.ts";

const router = Router();

router.get("/filters", (req, res) => {
    const departments = db.prepare(`SELECT id, name FROM departments ORDER by name`).all();
    const positions = db.prepare(`SELECT id, name FROM positions ORDER by name`).all();
    const cities = db.prepare(`SELECT id, city FROM offices ORDER by city`).all();

    res.json({
        departments: departments,
        positions: positions,
        cities: cities,
        grades: [GRADE.JUNIOR, GRADE.MIDDLE, GRADE.SENIOR, GRADE.LEAD],
        statuses: [STATUS.ACTIVE, STATUS.ON_LEAVE, STATUS.FIRED],
        formats: [FORMAT.OFFICE, FORMAT.REMOTE, FORMAT.HYBRID],
        employmentTypes: [EMPLOYMENT_TYPE.FULL_TIME, EMPLOYMENT_TYPE.PART_TIME, EMPLOYMENT_TYPE.CONTRACT],
        genders: [GENDER.MALE, GENDER.FEMALE, GENDER.MEKANIK]
    })
})

router.post("/list", (req, res) => {

    const { search, department, grade, salaryFrom, salaryTo, startDateFrom, startDateTo,
        status, format, employmentType, gender, birthDateFrom, birthDateTo, position, officeCity,
        page, pageSize, sortBy, sortOrder
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

    const allowedSortFields = {
        first_name: 'e.first_name',
        last_name: 'e.last_name',
        salary: 'c.salary',
        grade: 'c.grade',
        start_date: 'c.start_date',
        department: 'd.name',
        position: 'p.name',
        office_city: 'o.city',
        birth_date: 'e.birth_date',
        status: 'c.status'
    }

    const sortField = allowedSortFields[sortBy] || 'e.last_name'
    const sortDirection = sortOrder === SORT_ORDER.DESC ? SORT_ORDER.DESC : SORT_ORDER.ASC
    const orderBy = `ORDER BY ${sortField} ${sortDirection}`

    const baseQuery = `
        FROM employees e
        JOIN contracts c ON c.employee_id = e.id AND c.is_current = 1
        JOIN departments d ON d.id = c.department_id
        JOIN positions p ON p.id = c.position_id
        JOIN offices o ON o.id = c.office_id
        ${where}
        ${orderBy}
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

router.post("/create", (req, res) => {
    const { valid, errors } = validateEmployee(req.body);
    if (!valid) return res.status(400).json({ errors });

    const { first_name, last_name, email, phone, gender, birth_date, salary,
        grade, employment_type, format, status, start_date, department_id,
        position_id, office_id, manager_id
    } = req.body;

    try {
        const employee = db.prepare(`
            INSERT INTO employees (first_name, last_name, email, phone, gender, birth_date)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(first_name, last_name, email, phone, gender, birth_date)

        db.prepare(`
            INSERT INTO contracts (employee_id, position_id, department_id, office_id, 
            manager_id, salary, grade, employment_type, format, status, start_date, is_current)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        `).run(employee.lastInsertRowid, position_id, department_id, office_id ?? null, manager_id ?? null,
            salary, grade, employment_type, format, status ?? STATUS.ACTIVE, start_date);

        res.status(201).json({ id: employee.lastInsertRowid })
    } catch (e) {
        console.log(e)
        if (e.code === `SQLITE_CONSTRAINT_UNIQUE`) {
            return res.status(400).json({ errors: { email: "email already exists" } })
        }
        res.status(500).json({ error: "server error" })
    }
})

router.put("/:id", (req, res) => {
    const { valid, errors } = validateEmployee(req.body)
    if (!valid) return res.status(400).json({ errors });

    const { first_name, last_name, email, phone, gender, birth_date, salary,
        grade, employment_type, format, status, start_date, department_id,
        position_id, office_id, manager_id
    } = req.body;

    try {
        db.prepare(`
            UPDATE employees SET first_name=?, last_name=?, email=?, phone=?, gender=?, birth_date=?
            WHERE id=?
        `).run(first_name, last_name, email, phone, gender, birth_date, req.params.id)

        db.prepare(`
            UPDATE contracts SET salary=?, grade=?, employment_type=?, format=?, 
            status=?, start_date=?, department_id=?, position_id=?, office_id=?
            WHERE employee_id=? AND is_current=1
        `).run(salary, grade, employment_type, format, status, start_date,
            department_id, position_id, office_id ?? null, req.params.id);

        res.json({ success: true })
    } catch (e) {
        if (e.code === `SQLITE_CONSTRAINT_UNIQUE`)
            return res.status(400).json({ errors: { email: "email already exists" } })
        res.status(500).json({ error: "server error" })
    }
})

router.delete("/:id", (req, res) => {
    try {
        db.prepare(`DELETE from contracts WHERE employee_id = ?`).run(req.params.id);
        db.prepare(`DELETE from employees WHERE id = ?`).run(req.params.id);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: "Server error" })
    }


})

router.get('/ids', (req, res) => {
  res.json({
    departments: db.prepare('SELECT id, name FROM departments').all(),
    positions: db.prepare('SELECT id, name FROM positions').all(),
    offices: db.prepare('SELECT id, city FROM offices').all(),
  })
})

export default router;