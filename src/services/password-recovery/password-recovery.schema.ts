// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator } from '../../validators'
import type { PasswordRecoveryService } from './password-recovery.class'

// Main data model schema
export const passwordRecoverySchema = {
	$id: 'PasswordRecovery',
	type: 'object',
	additionalProperties: false,
	required: ['cpf', 'code'],
	properties: {
		cpf: { type: 'string' },
		code: { type: 'string' },
		phone: { type: 'string' },
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
	required: ['cpf'],
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
