// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { TasksService } from './tasks.class'

import { v4 as uuidv4 } from 'uuid'
import { BadRequest } from '@feathersjs/errors'

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
	updated_at: async () => `${new Date(new Date().getTime()).toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" }).replace(" ", "T") + "." + String(new Date().getMilliseconds()).padStart(3,"0")}`,
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
	
})
