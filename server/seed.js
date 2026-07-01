import db from "./database.js"
import {EMPLOYMENT_TYPE, FORMAT, GENDER, GRADE, STATUS} from "../client/src/constants/filters.ts";

const departments = [
    'Engineering',
    'Marketing',
    'Sales',
    'HR',
    'Finance',
    'Design',
    'Product',
]

const offices = [
    { city: 'Warsaw', country: 'Poland' },
    { city: 'Berlin', country: 'Germany' },
    { city: 'Amsterdam', country: 'Netherlands' },
    { city: 'Prague', country: 'Czech Republic' },
    { city: FORMAT.REMOTE, country: 'Worldwide' },
]

const positions = [
    { name: "Frontend developer", department: "Engineering" },
    { name: "Backend developer", department: "Engineering" },
    { name: "QA Engineer", department: "Engineering" },
    { name: "Product manager", department: "Product" },
    { name: "UX Designer", department: "Design" },
    { name: "Marketing Manager", department: "Marketing" },
    { name: "Sales Manager", department: "Sales" },
    { name: "HR Manager", department: "HR" },
    { name: "Financial Analyst", department: "Finance" },
    { name: "DevOps Engineer", department: "Engineering" },
]

const firstNames = ['James', 'Oliver', 'Emma', 'Sophia', 'Liam', 'Noah', 'Ava', 'Isabella', 'Lucas', 'Mia', 'Ethan', 'Charlotte', 'Mason', 'Amelia', 'Logan', 'Elijah', 'Aiden', 'Harper', 'Evelyn', 'Abigail', 'Sebastian', 'Jack', 'Owen', 'Daniel', 'Henry']
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Robinson', 'Clark', 'Lewis', 'Walker', 'Hall', 'Allen', 'Young', 'King']

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(from, to) {
    const fromMs = new Date(from).getTime();
    const toMs = new Date(to).getTime();
    const randDate = new Date(fromMs + Math.random() * (toMs - fromMs));
    return randDate.toISOString().split("T")[0];
}

db.exec(`
    DELETE FROM contracts;
    DELETE FROM employees;
    DELETE FROM offices;
    DELETE FROM positions;
    DELETE FROM departments;
`);

const insertDepartment = db.prepare("INSERT INTO departments (name) VALUES (?)");

const insertOffice = db.prepare("INSERT INTO offices (city, country) VALUES (?, ?)");
const getDepId = db.prepare("SELECT id FROM departments WHERE name = ?");

const insertPosition = db.prepare("INSERT INTO positions (name, department_id) VALUES (?, ?)");
const insertEmployee = db.prepare(`
    INSERT INTO employees (first_name, last_name, email, phone, gender, birth_date) 
    VALUES (?, ?, ?, ?, ?, ?)
`);

for (const name of departments) {
    insertDepartment.run(name);
}
console.log('departments seeded');

for (const office of offices) {
    insertOffice.run(office.city, office.country);
}
console.log('offices seeded');

for (const position of positions) {
    const department = getDepId.get(position.department);
    insertPosition.run(position.name, department.id);
}
console.log('positions seeded');

for (let i = 0; i < 200; i++) {
    const first_name = randomItem(firstNames);
    const last_name = randomItem(lastNames);
    const email = `${first_name.toLowerCase()}${last_name.toLowerCase()}${i}@company.com`;
    const phone = `+48${Math.floor(100000000 + Math.random() * 900000000)}`;
    const gender = randomItem([GENDER.MALE, GENDER.FEMALE, GENDER.MEKANIK]);
    const birth_date = randomDate("1980-01-01", "2005-12-31");
    insertEmployee.run(first_name, last_name, email, phone, gender, birth_date);
}
console.log('employees seeded');

const grades = [GRADE.JUNIOR, GRADE.JUNIOR, GRADE.SENIOR, GRADE.LEAD]
const employmentTypes = [EMPLOYMENT_TYPE.FULL_TIME, EMPLOYMENT_TYPE.PART_TIME, EMPLOYMENT_TYPE.CONTRACT]
const formats = [FORMAT.OFFICE, FORMAT.REMOTE, FORMAT.HYBRID]
const statuses = [STATUS.ACTIVE, STATUS.ACTIVE, STATUS.ACTIVE, STATUS.ON_LEAVE, STATUS.FIRED]

const allEmployees = db.prepare("SELECT id FROM employees").all();
const allPositions = db.prepare("SELECT id, department_id FROM positions").all();
const allOffices = db.prepare("SELECT id FROM offices").all();

const insertContract = db.prepare(`INSERT INTO contracts 
    (employee_id, position_id, department_id, office_id, manager_id, salary, grade,
    employment_type, format, status, start_date, end_date, is_current) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

for (const employee of allEmployees) {
    const grade = randomItem(grades);
    const office = randomItem(allOffices);
    const position = randomItem(allPositions);
    const salary = Math.floor(1000 + Math.random() * 2000);

    if (Math.random() < 0.3) {
        const oldStart = randomDate("2018-01-01", "2020-12-31");
        const oldEnd = randomDate("2022-01-01", "2023-12-31");
        insertContract.run(employee.id, position.id, position.department_id, office.id, null, salary - 500,
            randomItem(grades), randomItem(employmentTypes), randomItem(formats), "fired", oldStart, oldEnd, 0
        )
    }

    const startDate = randomDate("2024-01-01", "2025-12-31");
    const status = randomItem(statuses);
    insertContract.run(employee.id, position.id, position.department_id, office.id, null, salary,
        grade, randomItem(employmentTypes), randomItem(formats), status, startDate, null, 1
    )
}

console.log("contracts seeded");