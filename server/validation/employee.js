export function validateEmployee(data) {
  const errors = {}

  if (!data.first_name || data.first_name.trim().length < 2) {
    errors.first_name = 'First name must be at least 2 characters'
  }

  if (!data.last_name || data.last_name.trim().length < 2) {
    errors.last_name = 'Last name must be at least 2 characters'
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email'
  }

  if (!data.gender || !['male', 'female'].includes(data.gender)) {
    errors.gender = 'Gender must be male or female'
  }

  if (!data.salary || isNaN(data.salary) || data.salary < 0) {
    errors.salary = 'Salary must be a positive number'
  }

  if (!data.department_id || isNaN(data.department_id)) {
    errors.department_id = 'Department is required'
  }

  if (!data.position_id || isNaN(data.position_id)) {
    errors.position_id = 'Position is required'
  }

  if (!data.start_date || !/^\d{4}-\d{2}-\d{2}$/.test(data.start_date)) {
    errors.start_date = 'Start date must be in YYYY-MM-DD format'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}