// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax, queryProperties } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { UsersService } from './users.class'

import { v4 as uuidv4 } from 'uuid'
import { passwordHash } from '@feathersjs/authentication-local'
import { isValidCPF } from './users.utils'
import { BadRequest } from '@feathersjs/errors'

// Main data model schema
export const usersSchema = {
	$id: 'Users',
	type: 'object',
	additionalProperties: false,
	required: ['id', 'cpf', 'password', 'role_id'],
	properties: {
		id: { type: 'string', format: 'uuid' },
		cpf: { type: 'string' },
		password: { type: 'string' },
		profile_id: { type: 'string', format: 'uuid' },
		role_id: { type: 'string', format: 'uuid' },
		is_active: { type: 'boolean' },
		is_available: { type: 'boolean' },
		created_at: { type: 'string', format: 'date-time' },
		updated_at: { type: 'string', format: 'date-time' },
	},
} as const
export type Users = FromSchema<typeof usersSchema>
export const usersValidator = getValidator(usersSchema, dataValidator)
export const usersResolver = resolve<Users, HookContext<UsersService>>({})

export const usersExternalResolver = resolve<Users, HookContext<UsersService>>({
	password: async () => undefined,
})

// Schema for creating new data
export const usersDataSchema = {
	$id: 'UsersData',
	type: 'object',
	additionalProperties: false,
	required: ['cpf', 'password', 'role_id'],
	properties: {
		...usersSchema.properties,
	},
} as const
export type UsersData = FromSchema<typeof usersDataSchema>
export const usersDataValidator = getValidator(usersDataSchema, dataValidator)
export const usersDataResolver = resolve<UsersData, HookContext<UsersService>>({
	id: async () => uuidv4(),
	password: passwordHash({ strategy: 'local' }),
	cpf: async (value) => {
		if (!value) throw new BadRequest('CPF is required')

		const cpfDigits = value.replace(/\D/g, '')
		if (!isValidCPF(cpfDigits)) throw new BadRequest('CPF is invalid')

		return cpfDigits
	},
})

// Schema for updating existing data
export const usersPatchSchema = {
	$id: 'UsersPatch',
	type: 'object',
	additionalProperties: false,
	required: [],
	properties: {
		...usersSchema.properties,
	},
} as const
export type UsersPatch = FromSchema<typeof usersPatchSchema>
export const usersPatchValidator = getValidator(usersPatchSchema, dataValidator)
export const usersPatchResolver = resolve<UsersPatch, HookContext<UsersService>>({
	password: passwordHash({ strategy: 'local' }),
	updated_at: async () => new Date().toISOString(),
	cpf: async (value) => {
		if (value) {
			const cpfDigits = value.replace(/\D/g, '')
			if (!isValidCPF(cpfDigits)) throw new BadRequest('CPF is invalid')

			return cpfDigits
		}
	},
})

// Schema for allowed query properties
export const usersQuerySchema = {
	$id: 'UsersQuery',
	type: 'object',
	additionalProperties: false,
	properties: {
		...querySyntax(usersSchema.properties),
	},
} as const
export type UsersQuery = FromSchema<typeof usersQuerySchema>
export const usersQueryValidator = getValidator(usersQuerySchema, queryValidator)
export const usersQueryResolver = resolve<UsersQuery, HookContext<UsersService>>({
	id: async (value, _, context) => {
		if (context.params.user) {
			return context.params.user.id
		}
		return value
	},
})
