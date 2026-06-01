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

const insertOffice = db.prepare("INSERT INTO offices (city, country) VALUES (?, ?)");

for(const office in offices){
    insertOffice.run(office.city, office,country);
}

db.exec(`
    DELETE FROM contracts;
    DELETE FROM employees;
    DELETE FROM offices;
    DELETE FROM positions;
    DELETE FROM departments;
`);

const insertDepartment = db.prepare("INSERT INTO departments (name) VALUES (?)");

for (const name of departments) {
    insertDepartment.run(name);
}

console.log('departments seeded');