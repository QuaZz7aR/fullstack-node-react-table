import {useForm} from 'react-hook-form'
import {useFiltersOptions} from '../hooks/useEmployees'
import type {Employee} from '../types/employee'
import type {EmployeeFormData} from '../types/employee'
import {GENDER} from "../constants/filters.ts";

interface Props {
    initial?: Employee
    onSubmit: (data: EmployeeFormData) => void
    serverErrors?: Record<string, string>
    isLoading?: boolean
}

export default function EmployeeForm({initial, onSubmit, serverErrors = {}, isLoading}: Props) {
    const {data: options} = useFiltersOptions()

    const {register, handleSubmit, formState: {errors}} = useForm<EmployeeFormData>({
        defaultValues: initial ? {
            first_name: initial.first_name,
            last_name: initial.last_name,
            email: initial.email,
            phone: initial.phone ?? '',
            gender: initial.gender,
            birth_date: initial.birth_date,
            salary: initial.salary,
            grade: initial.grade,
            employment_type: initial.employment_type,
            format: initial.format,
            status: initial.status,
            start_date: initial.start_date,
        } : {}
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

            <div>
                <label className="text-sm font-semibold block mb-1">First Name</label>
                <input
                    className="w-full border rounded px-2 py-1 text-sm"
                    {...register('first_name', {
                        required: 'Required',
                        minLength: {value: 2, message: 'Min 2 characters'}
                    })}
                />
                {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
                {serverErrors.first_name && <p className="text-red-500 text-xs mt-1">{serverErrors.first_name}</p>}
            </div>

            <div>
                <label className="text-sm font-semibold block mb-1">Last Name</label>
                <input
                    className="w-full border rounded px-2 py-1 text-sm"
                    {...register('last_name', {
                        required: 'Required',
                        minLength: {value: 2, message: 'Min 2 characters'}
                    })}
                />
                {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
            </div>

            <div>
                <label className="text-sm font-semibold block mb-1">Email</label>
                <input
                    type="email"
                    className="w-full border rounded px-2 py-1 text-sm"
                    {...register('email', {
                        required: 'Required',
                        pattern: {value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email'}
                    })}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">front: {errors.email.message}</p>}
                {serverErrors.email && <p className="text-red-500 text-xs mt-1">back: {serverErrors.email}</p>}
            </div>

            <div>
                <label className="text-sm font-semibold block mb-1">Phone</label>
                <input
                    className="w-full border rounded px-2 py-1 text-sm"
                    {...register('phone')}
                />
            </div>

            <div>
                <label className="text-sm font-semibold block mb-1">Gender</label>
                <select
                    className="w-full border rounded px-2 py-1 text-sm"
                    {...register('gender', {required: 'Required'})}
                >
                    <option value="">Select</option>
                    <option value={GENDER.MALE}>Male</option>
                    <option value={GENDER.FEMALE}>Female</option>
                    <option value={GENDER.MEKANIK}>Mekanik</option>
                </select>
                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
            </div>

            <div>
                <label className="text-sm font-semibold block mb-1">Birth Date</label>
                <input
                    type="date"
                    className="w-full border rounded px-2 py-1 text-sm"
                    {...register('birth_date')}
                />
            </div>

            <div>
                <label className="text-sm font-semibold block mb-1">Department</label>
                <select
                    className="w-full border rounded px-2 py-1 text-sm"
                    {...register('department_id', {required: 'Required', valueAsNumber: true})}
                >
                    <option value="">Select</option>
                    {options?.departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
                {errors.department_id && <p className="text-red-500 text-xs mt-1">{errors.department_id.message}</p>}
            </div>

            <div>
                <label className="text-sm font-semibold block mb-1">Position</label>
                <select
                    className="w-full border rounded px-2 py-1 text-sm"
                    {...register('position_id', {required: 'Required', valueAsNumber: true})}
                >
                    <option value="">Select</option>
                    {options?.positions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                {errors.position_id && <p className="text-red-500 text-xs mt-1">{errors.position_id.message}</p>}
            </div>

            <div>
                <label className="text-sm font-semibold block mb-1">Office</label>
                <select
                    className="w-full border rounded px-2 py-1 text-sm"
                    {...register('office_id', {required: 'Required', valueAsNumber: true})}
                >
                    <option value="">Select</option>
                    {options?.cities.map(c => <option key={c.id} value={c.id}>{c.city}</option>)}
                </select>
                {errors.office_id && <p className="text-red-500 text-xs mt-1">{errors.office_id.message}</p>}
            </div>

            <div>
                <label className="text-sm font-semibold block mb-1">Salary</label>
                <input
                    type="number"
                    className="w-full border rounded px-2 py-1 text-sm"
                    {...register('salary', {
                        required: 'Required',
                        valueAsNumber: true,
                        min: {value: 0, message: 'Must be positive'}
                    })}
                />
                {errors.salary && <p className="text-red-500 text-xs mt-1">{errors.salary.message}</p>}
            </div>

            <div>
                <label className="text-sm font-semibold block mb-1">Grade</label>
                <select
                    className="w-full border rounded px-2 py-1 text-sm"
                    {...register('grade', {required: 'Required'})}
                >
                    <option value="">Select</option>
                    {options?.grades.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                {errors.grade && <p className="text-red-500 text-xs mt-1">{errors.grade.message}</p>}
            </div>

            <div>
                <label className="text-sm font-semibold block mb-1">Employment Type</label>
                <select
                    className="w-full border rounded px-2 py-1 text-sm"
                    {...register('employment_type', {required: 'Required'})}
                >
                    <option value="">Select</option>
                    {options?.employmentTypes.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                {errors.employment_type &&
                    <p className="text-red-500 text-xs mt-1">{errors.employment_type.message}</p>}
            </div>

            <div>
                <label className="text-sm font-semibold block mb-1">Format</label>
                <select
                    className="w-full border rounded px-2 py-1 text-sm"
                    {...register('format', {required: 'Required'})}
                >
                    <option value="">Select</option>
                    {options?.formats.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                {errors.format && <p className="text-red-500 text-xs mt-1">{errors.format.message}</p>}
            </div>

            <div>
                <label className="text-sm font-semibold block mb-1">Status</label>
                <select
                    className="w-full border rounded px-2 py-1 text-sm"
                    {...register('status', {required: 'Required'})}
                >
                    <option value="">Select</option>
                    {options?.statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
            </div>

            <div>
                <label className="text-sm font-semibold block mb-1">Start Date</label>
                <input
                    type="date"
                    className="w-full border rounded px-2 py-1 text-sm"
                    {...register('start_date', {required: 'Required'})}
                />
                {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date.message}</p>}
            </div>

            <button
                type="submit"
                className="w-full bg-green-500 text-white rounded py-2 text-sm font-semibold hover:bg-green-600 disabled:opacity-30 hover:cursor-pointer"
                disabled={isLoading}
            >
                {isLoading ? 'Saving...' : 'Save'}
            </button>

        </form>
    )
}