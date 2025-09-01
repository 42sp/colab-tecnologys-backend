// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { RolesService } from './roles.class'

import { v4 as uuidv4 } from 'uuid'

// Main data model schema
export const rolesSchema = {
	$id: 'Roles',
	type: 'object',
	additionalProperties: false,
	required: ['id', 'role_name', 'role_description', 'hierarchy_level'],
	properties: {
		id: { type: 'string', format: 'uuid' },
		role_name: { type: 'string' },
		role_description: { type: 'string' },
		hierarchy_level: { type: 'number' },
		is_active: { type: 'boolean' },
		created_at: { type: 'string', format: 'date-time' },
		updated_at: { type: 'string', format: 'date-time' },
	},
} as const
export type Roles = FromSchema<typeof rolesSchema>
export const rolesValidator = getValidator(rolesSchema, dataValidator)
export const rolesResolver = resolve<Roles, HookContext<RolesService>>({})

export const rolesExternalResolver = resolve<Roles, HookContext<RolesService>>({})

// Schema for creating new data
export const rolesDataSchema = {
	$id: 'RolesData',
	type: 'object',
	additionalProperties: false,
	required: ['role_name', 'role_description', 'hierarchy_level'],
	properties: {
		...rolesSchema.properties,
	},
} as const
export type RolesData = FromSchema<typeof rolesDataSchema>
export const rolesDataValidator = getValidator(rolesDataSchema, dataValidator)
export const rolesDataResolver = resolve<RolesData, HookContext<RolesService>>({
	id: async () => uuidv4(),
})

// Schema for updating existing data
export const rolesPatchSchema = {
	$id: 'RolesPatch',
	type: 'object',
	additionalProperties: false,
	required: [],
	properties: {
		...rolesSchema.properties,
	},
} as const
export type RolesPatch = FromSchema<typeof rolesPatchSchema>
export const rolesPatchValidator = getValidator(rolesPatchSchema, dataValidator)
export const rolesPatchResolver = resolve<RolesPatch, HookContext<RolesService>>({
	updated_at: async () => new Date().toISOString(),
})

// Schema for allowed query properties
export const rolesQuerySchema = {
	$id: 'RolesQuery',
	type: 'object',
	additionalProperties: false,
	properties: {
		...querySyntax(rolesSchema.properties),
	},
} as const
export type RolesQuery = FromSchema<typeof rolesQuerySchema>
export const rolesQueryValidator = getValidator(rolesQuerySchema, queryValidator)
export const rolesQueryResolver = resolve<RolesQuery, HookContext<RolesService>>({})
