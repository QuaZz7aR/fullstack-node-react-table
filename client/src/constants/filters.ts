export const SORT_ORDER = {
    ASC: 'asc',
    DESC: 'desc',
} as const

export type SortOrder = typeof SORT_ORDER[keyof typeof SORT_ORDER]

export const GENDER = {
    MALE: 'male',
    FEMALE: 'female',
    MEKANIK: 'mekanik'
} as const

export const GRADE = {
    JUNIOR: 'junior',
    MIDDLE: 'middle',
    SENIOR: 'senior',
    LEAD: 'lead',
} as const

export const STATUS = {
    ACTIVE: 'active',
    ON_LEAVE: 'on_leave',
    FIRED: 'fired',
} as const

export const FORMAT = {
    OFFICE: 'office',
    REMOTE: 'remote',
    HYBRID: 'hybrid',
} as const

export const EMPLOYMENT_TYPE = {
    FULL_TIME: 'full-time',
    PART_TIME: 'part-time',
    CONTRACT: 'contract',
} as const