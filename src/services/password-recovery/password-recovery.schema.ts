// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { PasswordRecoveryService } from './password-recovery.class'

// Main data model schema
export const passwordRecoverySchema = {
	$id: 'PasswordRecovery',
	type: 'object',
	additionalProperties: false,
	required: ['cpf', 'password', 'code'],
	properties: {
		cpf: { type: 'string' },
		password: { type: 'string' },
		code: { type: 'string' },
	},
} as const
export type PasswordRecovery = FromSchema<typeof passwordRecoverySchema>
export const passwordRecoveryValidator = getValidator(passwordRecoverySchema, dataValidator)
export const passwordRecoveryResolver = resolve<
	PasswordRecovery,
	HookContext<PasswordRecoveryService>
>({})

export const passwordRecoveryExternalResolver = resolve<
	PasswordRecovery,
	HookContext<PasswordRecoveryService>
>({})

// Schema for creating new data
export const passwordRecoveryDataSchema = {
	$id: 'PasswordRecoveryData',
	type: 'object',
	additionalProperties: false,
	required: ['code', 'cpf', 'password'],
	properties: {
		...passwordRecoverySchema.properties,
	},
} as const
export type PasswordRecoveryData = FromSchema<typeof passwordRecoveryDataSchema>
export const passwordRecoveryDataValidator = getValidator(passwordRecoveryDataSchema, dataValidator)
export const passwordRecoveryDataResolver = resolve<
	PasswordRecoveryData,
	HookContext<PasswordRecoveryService>
>({})

// Schema for updating existing data
export const passwordRecoveryPatchSchema = {
	$id: 'PasswordRecoveryPatch',
	type: 'object',
	additionalProperties: false,
	required: [],
	properties: {
		...passwordRecoverySchema.properties,
	},
} as const
export type PasswordRecoveryPatch = FromSchema<typeof passwordRecoveryPatchSchema>
export const passwordRecoveryPatchValidator = getValidator(
	passwordRecoveryPatchSchema,
	dataValidator,
)
export const passwordRecoveryPatchResolver = resolve<
	PasswordRecoveryPatch,
	HookContext<PasswordRecoveryService>
>({})

// Schema for allowed query properties
export const passwordRecoveryQuerySchema = {
	$id: 'PasswordRecoveryQuery',
	type: 'object',
	additionalProperties: false,
	properties: {
		...querySyntax(passwordRecoverySchema.properties),
	},
} as const
export type PasswordRecoveryQuery = FromSchema<typeof passwordRecoveryQuerySchema>
export const passwordRecoveryQueryValidator = getValidator(
	passwordRecoveryQuerySchema,
	queryValidator,
)
export const passwordRecoveryQueryResolver = resolve<
	PasswordRecoveryQuery,
	HookContext<PasswordRecoveryService>
>({})
