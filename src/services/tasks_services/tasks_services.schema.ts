import { FromSchema, getValidator, querySyntax, resolve } from "@feathersjs/schema";
import { dataValidator, queryValidator } from "../../validators";
import { HookContext } from "../../declarations";
import { TasksServicesService } from "./tasks_services.class";
import { v4 as uuidv4 } from 'uuid'

export const tasksServicesSchema = {
	$id: 'TasksServices',
	type: 'object',
	additionalProperties: true,
	required: [],
	properties: {},
} as const

export type TasksServices = FromSchema<typeof tasksServicesSchema>
export const tasksServicesValidator = getValidator(tasksServicesSchema, dataValidator)
export const tasksResolver = resolve({})

export const tasksExternalResolver = resolve({})

export const tasksServicesDataSchema = {
	$id: 'TasksServicesData',
	type: 'object',
	additionalProperties: true,
	required: [],
	properties: {
		...tasksServicesSchema.properties,
	},
} as const

export type TasksServicesData = FromSchema<typeof tasksServicesDataSchema>

export const tasksServicesPatchSchema = {
	$id: 'TasksServicesPatch',
	type: 'object',
	additionalProperties: false,
	required: [],
	properties: {
		...tasksServicesSchema.properties,
	},
} as const

export type TasksServicesPatch = FromSchema<typeof tasksServicesPatchSchema>


export const tasksServicesQuerySchema = {
	$id: 'TasksServicesQuery',
	type: 'object',
	additionalProperties: false,
	properties: {
		...querySyntax(tasksServicesSchema.properties),
	},
} as const

export const tasksServicesDataValidator = getValidator(tasksServicesDataSchema, dataValidator)
export const tasksServicesDataResolver = resolve<TasksServicesData, HookContext<TasksServicesService>>({
	id: async () => uuidv4(),

})

export const tasksServicesPatchValidator = getValidator(tasksServicesPatchSchema, dataValidator)
export const tasksPatchResolver = resolve<TasksServicesPatch, HookContext<TasksServicesService>>({
	updated_at: async () => new Date().toISOString(),
})

export type TasksServicesQuery = FromSchema<typeof tasksServicesQuerySchema>
export const tasksServicesQueryValidator = getValidator(tasksServicesQuerySchema, queryValidator)
export const tasksServicesQueryResolver = resolve<TasksServicesQuery, HookContext<TasksServicesService>>({})

export const tasksServicesResolver = resolve<TasksServices, HookContext<TasksServicesService>>({})
export const tasksServicesExternalResolver = resolve<TasksServices, HookContext<TasksServicesService>>({})
export const tasksServicesPatchResolver = resolve<TasksServicesPatch, HookContext<TasksServicesService>>({
	updated_at: async () => new Date().toISOString(),
})

