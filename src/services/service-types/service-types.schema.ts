// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ServiceTypesService } from './service-types.class'

import { v4 as uuidv4 } from 'uuid'

// Main data model schema
export const serviceTypesSchema = {
	$id: 'ServiceTypes',
	type: 'object',
	additionalProperties: false,
	required: ['id', 'service_name', 'service_description'],
	properties: {
		id: { type: 'string', format: 'uuid' },
		service_name: { type: 'string', maxLength: 50 },
		service_description: { type: 'string' },
		is_active: { type: 'boolean' },
		created_at: { type: 'string', format: 'date-time' },
		updated_at: { type: 'string', format: 'date-time' },
	},
} as const
export type ServiceTypes = FromSchema<typeof serviceTypesSchema>
export const serviceTypesValidator = getValidator(serviceTypesSchema, dataValidator)
export const serviceTypesResolver = resolve<ServiceTypes, HookContext<ServiceTypesService>>({})

export const serviceTypesExternalResolver = resolve<ServiceTypes, HookContext<ServiceTypesService>>(
	{},
)

// Schema for creating new data
export const serviceTypesDataSchema = {
	$id: 'ServiceTypesData',
	type: 'object',
	additionalProperties: false,
	required: ['service_name', 'service_description'],
	properties: {
		...serviceTypesSchema.properties,
	},
} as const
export type ServiceTypesData = FromSchema<typeof serviceTypesDataSchema>
export const serviceTypesDataValidator = getValidator(serviceTypesDataSchema, dataValidator)
export const serviceTypesDataResolver = resolve<ServiceTypesData, HookContext<ServiceTypesService>>(
	{
		id: async () => uuidv4(),
	},
)

// Schema for updating existing data
export const serviceTypesPatchSchema = {
	$id: 'ServiceTypesPatch',
	type: 'object',
	additionalProperties: false,
	required: [],
	properties: {
		...serviceTypesSchema.properties,
	},
} as const
export type ServiceTypesPatch = FromSchema<typeof serviceTypesPatchSchema>
export const serviceTypesPatchValidator = getValidator(serviceTypesPatchSchema, dataValidator)
export const serviceTypesPatchResolver = resolve<
	ServiceTypesPatch,
	HookContext<ServiceTypesService>
>({})

// Schema for allowed query properties
export const serviceTypesQuerySchema = {
	$id: 'ServiceTypesQuery',
	type: 'object',
	additionalProperties: false,
	properties: {
		...querySyntax(serviceTypesSchema.properties),
	},
} as const
export type ServiceTypesQuery = FromSchema<typeof serviceTypesQuerySchema>
export const serviceTypesQueryValidator = getValidator(serviceTypesQuerySchema, queryValidator)
export const serviceTypesQueryResolver = resolve<
	ServiceTypesQuery,
	HookContext<ServiceTypesService>
>({})
