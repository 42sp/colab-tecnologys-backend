// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { EmployeeService } from './employee.class'

// Main data model schema
export const employeeSchema = Type.Object(
	{
		id: Type.Number(),
		cpf: Type.String(),
		is_active: Type.Boolean(),
		is_available: Type.Boolean(),
		name: Type.String(),
		email: Type.String(),
		phone: Type.String(),
		role_id: Type.String({ format: 'uuid' }),
		date_of_birth: Type.String({ format: 'date' }),
		address: Type.String(),
		city: Type.String(),
		state: Type.String(),
		postcode: Type.String(),
		photo: Type.String(),
	},
	{ $id: 'Employee', additionalProperties: false },
)

export type Employee = Static<typeof employeeSchema>
export const employeeValidator = getValidator(employeeSchema, dataValidator)
export const employeeResolver = resolve<Employee, HookContext<EmployeeService>>({})

export const employeeExternalResolver = resolve<Employee, HookContext<EmployeeService>>({})

// Schema for creating new entries
export const employeeDataSchema = Type.Pick(
	employeeSchema,
	[
		'cpf',
		'name',
		'email',
		'phone',
		'role_id',
		'date_of_birth',
		'address',
		'city',
		'state',
		'postcode',
		'photo',
	],
	{ $id: 'EmployeeData' },
)

export const employeeDataSchemaWithPassword = Type.Intersect(
	[employeeDataSchema, Type.Object({ password: Type.String() })],
	{ $id: 'EmployeeDataFinal' },
)

export type EmployeeData = Static<typeof employeeDataSchemaWithPassword>
export const employeeDataValidator = getValidator(employeeDataSchema, dataValidator)
export const employeeDataResolver = resolve<Employee, HookContext<EmployeeService>>({})


export const employeePatchSchema = Type.Partial(employeeSchema, {
	$id: 'EmployeePatch',
})
export type EmployeePatch = Static<typeof employeePatchSchema>
export const employeePatchValidator = getValidator(employeePatchSchema, dataValidator)
export const employeePatchResolver = resolve<Employee, HookContext<EmployeeService>>({})


export const employeeQueryProperties = Type.Pick(employeeSchema, [
	'id',
	'cpf',
	'is_active',
	'name',
	'email',
])

export const employeeQuerySchema = Type.Intersect(
	[
		querySyntax(employeeQueryProperties),
		Type.Object({}, { additionalProperties: false }),
	],
	{ additionalProperties: false },
)
export type EmployeeQuery = Static<typeof employeeQuerySchema>
export const employeeQueryValidator = getValidator(employeeQuerySchema, queryValidator)
export const employeeQueryResolver = resolve<EmployeeQuery, HookContext<EmployeeService>>({})
