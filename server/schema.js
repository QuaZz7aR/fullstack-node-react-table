import db from "./database.js"

db.exec(`
    CREATE TABLE IF NOT EXISTS departments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS positions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        department_id INTEGER REFERENCES departments(id)
    );

    CREATE TABLE IF NOT EXISTS offices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city TEXT NOT NULL,
        country TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS employees(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT,
        gender TEXT CHECK(gender IN('male', 'female')),
        birth_date TEXT
    );

    CREATE TABLE IF NOT EXISTS contracts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER NOT NULL REFERENCES employees(id),
        position_id INTEGER REFERENCES positions(id),
        department_id INTEGER REFERENCES departments(id),
        office_id INTEGER REFERENCES offices(id),
        manager_id INTEGER REFERENCES employees(id),
        salary REAL NOT NULL,
        grade TEXT CHECK(grade IN('junior', 'middle', 'senior', 'lead')),
        employment_type TEXT CHECK(employment_type IN('full-time', 'part-time', 'contract')),
        format TEXT CHECK(format IN('office', 'remote', 'hybrid')),
        status TEXT CHECK(status IN('active', 'on_leave', 'fired')),
        start_date TEXT NOT NULL,
        end_date TEXT,
        is_current INTEGER DEFAULT 1 CHECK(is_current IN(0, 1))
    );
`);

console.log('Tables created');