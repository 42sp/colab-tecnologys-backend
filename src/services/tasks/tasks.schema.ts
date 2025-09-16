// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { TasksService } from './tasks.class'

import { v4 as uuidv4 } from 'uuid'
import { query } from 'winston'

// Main data model schema
export const tasksSchema = {
	$id: 'Tasks',
	type: 'object',
	additionalProperties: false,
	required: [
		'service_id',
		'completion_date',
		'task_percentage',
		'worker_id',
		'status',
		'worker_name',
		'construction_name',
	],
	properties: {
		id: { type: 'string', format: 'uuid' },
		service_id: { type: 'string', format: 'uuid' },
		worker_id: { type: 'string', format: 'uuid' },
		approver_id: { type: 'string', format: 'uuid' },
		status: {
			type: 'string',
			enum: ['pending', 'in_progress', 'completed', 'approved', 'rejected'],
			default: 'pending',
		},
		completion_date: { type: 'string', format: 'date' },
		task_percentage: { type: 'number', minimum: 0, maximum: 100 },
		created_at: { type: 'string', format: 'date-time' },
		updated_at: { type: 'string', format: 'date-time' },

		worker_name: { type: 'string' },
		construction_name: { type: 'string' },
		construction_address: { type: 'string' },
		service_tower: { type: 'string' },
		service_apartment: { type: 'string' },
		service_floor: { type: 'string' },
		service_stage: { type: 'string' },
		service_type: { type: 'string' },
	},
} as const
export type Tasks = FromSchema<typeof tasksSchema>
export const tasksValidator = getValidator(tasksSchema, dataValidator)
export const tasksResolver = resolve<Tasks, HookContext<TasksService>>({})

export const tasksExternalResolver = resolve<Tasks, HookContext<TasksService>>({})

// Schema for creating new data
export const tasksDataSchema = {
	$id: 'TasksData',
	type: 'object',
	additionalProperties: false,
	required: ['service_id', 'worker_id', 'completion_date', 'task_percentage', 'status'],
	properties: {
		...tasksSchema.properties,
	},
} as const
export type TasksData = FromSchema<typeof tasksDataSchema>
export const tasksDataValidator = getValidator(tasksDataSchema, dataValidator)
export const tasksDataResolver = resolve<TasksData, HookContext<TasksService>>({
	id: async () => uuidv4(),
	worker_name: async (_, data, context) => {
		const profile = await context.app
			.service('profile')
			.find({ query: { user_id: data.worker_id }, paginate: false })
		if (!profile) throw new Error('Worker not found')
		return profile[0].name
	},
	construction_name: async (_, data, context) => {
		const service = await context.app.service('services').get(data.service_id)
		if (!service) throw new Error('Service not found')
		if (service.work_id === null) return 'Obra temporária'

		const construction = await context.app.service('constructions').get(service.work_id)
		if (!construction) throw new Error('Construction not found')

		return construction.name
	},
	construction_address: async (_, data, context) => {
		const service = await context.app.service('services').get(data.service_id)
		if (!service) throw new Error('Service not found')
		if (service.work_id === null) return 'Endereço temporário, 1234'

		const construction = await context.app.service('constructions').get(service.work_id)
		if (!construction) throw new Error('Construction not found')

		return construction.address
	},
	service_tower: async (_, data, context) => {
		const service = await context.app.service('services').get(data.service_id)
		if (!service) throw new Error('Service not found')
		return service.tower
	},
	service_apartment: async (_, data, context) => {
		const service = await context.app.service('services').get(data.service_id)
		if (!service) throw new Error('Service not found')
		return service.apartment
	},
	service_floor: async (_, data, context) => {
		const service = await context.app.service('services').get(data.service_id)
		if (!service) throw new Error('Service not found')
		return service.floor
	},
	service_stage: async (_, data, context) => {
		const service = await context.app.service('services').get(data.service_id)
		if (!service) throw new Error('Service not found')
		return service.stage
	},
	service_type: async (_, data, context) => {
		const service = await context.app.service('services').get(data.service_id)
		if (!service) throw new Error('Service not found')

		console.log('Service fetched:', service)

		const serviceType = await context.app.service('service-types').get(service.service_type_id)
		if (!serviceType) throw new Error('Service type not found')

		return serviceType.service_name
	},
})

// Schema for updating existing data
export const tasksPatchSchema = {
	$id: 'TasksPatch',
	type: 'object',
	additionalProperties: false,
	required: [],
	properties: {
		...tasksSchema.properties,
	},
} as const
export type TasksPatch = FromSchema<typeof tasksPatchSchema>
export const tasksPatchValidator = getValidator(tasksPatchSchema, dataValidator)
export const tasksPatchResolver = resolve<TasksPatch, HookContext<TasksService>>({
	updated_at: async () => new Date().toISOString(),
})

// Schema for allowed query properties
export const tasksQuerySchema = {
	$id: 'TasksQuery',
	type: 'object',
	additionalProperties: false,
	properties: {
		...querySyntax(tasksSchema.properties),
	},
} as const
export type TasksQuery = FromSchema<typeof tasksQuerySchema>
export const tasksQueryValidator = getValidator(tasksQuerySchema, queryValidator)
export const tasksQueryResolver = resolve<TasksQuery, HookContext<TasksService>>({
	worker_id: async (_value, _data, context) => {
		if (!context.params.user?.id) throw new Error('Unauthorized')
		return context.params.user.id
	},
})
