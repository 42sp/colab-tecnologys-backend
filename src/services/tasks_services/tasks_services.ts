// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
	tasksServicesDataValidator,
	tasksServicesPatchValidator,
	tasksServicesQueryValidator,
	tasksServicesResolver,
	tasksServicesExternalResolver,
	tasksServicesDataResolver,
	tasksServicesPatchResolver,
	tasksServicesQueryResolver,
} from './tasks_services.schema'

import type { Application } from '../../declarations'
import { TasksServicesService, getOptions } from './tasks_services.class'
import { tasksPath, tasksServicesMethods } from './tasks_services.shared'
import { retrieveTask } from '../../hooks/retrieve-task'
import { filterRole } from '../../hooks/filter-role'

export * from './tasks_services.class'
export * from './tasks_services.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const tasksServices = (app: Application) => {
	// Register our service on the Feathers application
	app.use(tasksPath, new TasksServicesService(getOptions(app)), {
		// A list of all methods this service exposes externally
		methods: tasksServicesMethods,
		// You can add additional custom events to be sent to clients here
		events: [],
	})
	// Initialize hooks
	app.service(tasksPath).hooks({
		around: {
			all: [
				authenticate('jwt'),
				schemaHooks.resolveExternal(tasksServicesExternalResolver),
				schemaHooks.resolveResult(tasksServicesResolver),
			],
		},
		before: {
			all: [
				schemaHooks.validateQuery(tasksServicesQueryValidator),
				schemaHooks.resolveQuery(tasksServicesQueryResolver),
			],
			find: [filterRole],
			get: [],
			create: [
				schemaHooks.validateData(tasksServicesDataValidator),
				schemaHooks.resolveData(tasksServicesDataResolver),
			],
			patch: [
				schemaHooks.validateData(tasksServicesPatchValidator),
				schemaHooks.resolveData(tasksServicesPatchResolver),
			],
			remove: [],
		},
		after: {
			all: [retrieveTask],
		},
		error: {
			all: [],
		},
	})
}

// Add this service to the service type index
declare module '../../declarations' {
	interface ServiceTypes {
		[tasksPath]: TasksServicesService
	}
}
