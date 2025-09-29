// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ProfileService } from './profile.class'

import { v4 as uuidv4 } from 'uuid'

// Main data model schema
export const profileSchema = {
	$id: 'Profile',
	type: 'object',
	additionalProperties: false,
	required: ['id', 'name', 'email', 'phone', 'role_id'],
	properties: {
		id: { type: 'string', format: 'uuid' },
		name: { type: 'string' },
		date_of_birth: { type: 'string', format: 'date' },
		email: { type: 'string', format: 'email' },
		phone: { type: 'string' },
		photo: { type: 'string' },
		address: { type: 'string' },
		city: { type: 'string' },
		state: { type: 'string' },
		postcode: { type: 'string' },
		user_id: { type: 'string', format: 'uuid' },
		role_id: { type: 'string', format: 'uuid' },
		created_at: { type: 'string', format: 'date-time' },
		updated_at: { type: 'string', format: 'date-time' },
	},
} as const
export type Profile = FromSchema<typeof profileSchema>
export const profileValidator = getValidator(profileSchema, dataValidator)
export const profileResolver = resolve<Profile, HookContext<ProfileService>>({})

export const profileExternalResolver = resolve<Profile, HookContext<ProfileService>>({})

// Schema for creating new data
export const profileDataSchema = {
	$id: 'ProfileData',
	type: 'object',
	additionalProperties: false,
	required: ['id', 'name', 'email', 'phone', 'role_id'],
	properties: {
		...profileSchema.properties,
	},
} as const
export type ProfileData = FromSchema<typeof profileDataSchema>
export const profileDataValidator = getValidator(profileDataSchema, dataValidator)
export const profileDataResolver = resolve<ProfileData, HookContext<ProfileService>>({
	
})

// Schema for updating existing data
export const profilePatchSchema = {
	$id: 'ProfilePatch',
	type: 'object',
	additionalProperties: false,
	required: [],
	properties: {
		...profileSchema.properties,
	},
} as const
export type ProfilePatch = FromSchema<typeof profilePatchSchema>
export const profilePatchValidator = getValidator(profilePatchSchema, dataValidator)
export const profilePatchResolver = resolve<ProfilePatch, HookContext<ProfileService>>({
	updated_at: async () => new Date().toISOString(),
})

// Schema for allowed query properties
export const profileQuerySchema = {
	$id: 'ProfileQuery',
	type: 'object',
	additionalProperties: false,
	properties: {
		...querySyntax(profileSchema.properties),
	},
} as const
export type ProfileQuery = FromSchema<typeof profileQuerySchema>
export const profileQueryValidator = getValidator(profileQuerySchema, queryValidator)
export const profileQueryResolver = resolve<ProfileQuery, HookContext<ProfileService>>({})
