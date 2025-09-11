// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ServicesService } from './services.class'

import { v4 as uuidv4 } from 'uuid'

// Main data model schema
export const servicesSchema = {
	$id: 'Services',
	type: 'object',
	additionalProperties: false,
	required: [
		'id',
		'work_id',
		'service_type_id',
		'measurement_unit',
		'unit_of_measure',
		'material_unit',
	],
	properties: {
		id: { type: 'string', format: 'uuid' },
		work_id: { type: 'string' },
		service_id: { type: 'string' },
		service_type_id: { type: 'string', format: 'uuid' },
		tower: { type: 'string', maxLength: 50 },
		floor: { type: 'string', maxLength: 50 },
		apartment: { type: 'string', maxLength: 50 },
		measurement_unit: { type: 'string', maxLength: 20 },
		service_description: { type: 'string', maxLength: 200 },
		stage: { type: 'string', maxLength: 100 },
		thickness: { type: 'number' },
		labor_quantity: { type: 'number' },
		material_quantity: { type: 'number' },
		worker_quantity: { type: 'integer' },
		bonus: { type: 'number', default: 1 },
		unit_of_measure: { type: 'string', maxLength: 20 },
		material_unit: { type: 'string', maxLength: 20 },
		is_active: { type: 'boolean', default: true },
		is_done: { type: 'boolean', default: false },
		created_at: { type: 'string', format: 'date-time' },
		updated_at: { type: 'string', format: 'date-time' },
		acronym: { type: 'string', maxLength: 2},
		environment_type: { type: 'string', maxLength: 50},
	},
} as const
export type Services = FromSchema<typeof servicesSchema>
export const servicesValidator = getValidator(servicesSchema, dataValidator)
export const servicesResolver = resolve<Services, HookContext<ServicesService>>({})

export const servicesExternalResolver = resolve<Services, HookContext<ServicesService>>({})

// Schema for creating new data
export const servicesDataSchema = {
	$id: 'ServicesData',
	type: 'object',
	additionalProperties: false,
	required: ['service_type_id', 'work_id', 'acronym'],
	properties: {
		...servicesSchema.properties,
	},
} as const
export type ServicesData = FromSchema<typeof servicesDataSchema>
export const servicesDataValidator = getValidator(servicesDataSchema, dataValidator)
export const servicesDataResolver = resolve<ServicesData, HookContext<ServicesService>>({
	id: async () => uuidv4(),
})

// Schema for updating existing data
export const servicesPatchSchema = {
	$id: 'ServicesPatch',
	type: 'object',
	additionalProperties: false,
	required: [],
	properties: {
		...servicesSchema.properties,
	},
} as const
export type ServicesPatch = FromSchema<typeof servicesPatchSchema>
export const servicesPatchValidator = getValidator(servicesPatchSchema, dataValidator)
export const servicesPatchResolver = resolve<ServicesPatch, HookContext<ServicesService>>({
	updated_at: async () => new Date().toISOString(),
})

// Schema for allowed query properties
export const servicesQuerySchema = {
	$id: 'ServicesQuery',
	type: 'object',
	additionalProperties: false,
	properties: {
		...querySyntax(servicesSchema.properties),
	},
} as const
export type ServicesQuery = FromSchema<typeof servicesQuerySchema>
export const servicesQueryValidator = getValidator(servicesQuerySchema, queryValidator)
export const servicesQueryResolver = resolve<ServicesQuery, HookContext<ServicesService>>({})
