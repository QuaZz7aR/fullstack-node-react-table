import db from "./database.js"

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
    { city: 'Remote', country: 'Worldwide' },
]

const positions = [
    { name: "Frontent developer", department: "Engineering" },
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
const insertEmployee = db.prepare(`INSERT INTO employees (first_name, last_name, email, phone, gender, birth_date) 
    VALUES (?, ?, ?, ?, ?, ?)`);

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
    insertPosition.run(position.name, department.id)
}
console.log('positions seeded');

for (let i = 0; i < 200; i++) {
    const first_name = randomItem(firstNames);
    const last_name = randomItem(lastNames);
    const email = `${first_name.toLowerCase()}${last_name.toLowerCase()}${i}@company.com`;
    const phone = `+48${Math.floor(100000000 + Math.random() * 900000000)}`;
    const gender = randomItem(["male", "female"]);
    const birth_date = randomDate("1980-01-01", "2005-12-31");
    insertEmployee.run(first_name, last_name, email, phone, gender, birth_date);
}
console.log('employees seeded');