// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ConstructionsService } from './constructions.class'

import { v4 as uuidv4 } from 'uuid'

// Main data model schema
export const constructionsSchema = {
	$id: 'Constructions',
	type: 'object',
	additionalProperties: false,
	required: ['name', 'address', 'city', 'state'],
	properties: {
		id: { type: 'string', format: 'uuid' },
		name: { type: 'string', maxLength: 100 },
		address: { type: 'string' },
		city: { type: 'string', maxLength: 50 },
		state: { type: 'string', maxLength: 2 },
		zip_code: { type: 'string', maxLength: 9 },
		start_date: { type: 'string', format: 'date' },
		expected_end_date: { type: 'string', format: 'date' },
		description: { type: 'string' },
		is_active: { type: 'boolean', default: true },
		created_at: { type: 'string', format: 'date-time' },
		updated_at: { type: 'string', format: 'date-time' },
		status: { type: 'string'}
	},
} as const
export type Constructions = FromSchema<typeof constructionsSchema>
export const constructionsValidator = getValidator(constructionsSchema, dataValidator)
export const constructionsResolver = resolve<Constructions, HookContext<ConstructionsService>>({})

export const constructionsExternalResolver = resolve<
	Constructions,
	HookContext<ConstructionsService>
>({})

// Schema for creating new data
export const constructionsDataSchema = {
	$id: 'ConstructionsData',
	type: 'object',
	additionalProperties: false,
	required: ['name', 'address', 'city', 'state'],
	properties: {
		...constructionsSchema.properties,
	},
} as const
export type ConstructionsData = FromSchema<typeof constructionsDataSchema>
export const constructionsDataValidator = getValidator(constructionsDataSchema, dataValidator)
export const constructionsDataResolver = resolve<
	ConstructionsData,
	HookContext<ConstructionsService>
>({
	id: async () => uuidv4(),
})

// Schema for updating existing data
export const constructionsPatchSchema = {
	$id: 'ConstructionsPatch',
	type: 'object',
	additionalProperties: false,
	required: [],
	properties: {
		...constructionsSchema.properties,
	},
} as const
export type ConstructionsPatch = FromSchema<typeof constructionsPatchSchema>
export const constructionsPatchValidator = getValidator(constructionsPatchSchema, dataValidator)
export const constructionsPatchResolver = resolve<
	ConstructionsPatch,
	HookContext<ConstructionsService>
>({})

// Schema for allowed query properties
export const constructionsQuerySchema = {
  $id: 'ConstructionsQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(constructionsSchema.properties),
  },
} as const;

export type ConstructionsQuery = FromSchema<typeof constructionsQuerySchema>
export const constructionsQueryValidator = getValidator(constructionsQuerySchema, queryValidator)
export const constructionsQueryResolver = resolve<
	ConstructionsQuery,
	HookContext<ConstructionsService>
>({})
