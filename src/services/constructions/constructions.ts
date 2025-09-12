// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
	constructionsDataValidator,
	constructionsPatchValidator,
	constructionsQueryValidator,
	constructionsResolver,
	constructionsExternalResolver,
	constructionsDataResolver,
	constructionsPatchResolver,
	constructionsQueryResolver,
} from './constructions.schema'

import type { Application } from '../../declarations'
import { ConstructionsService, getOptions } from './constructions.class'
import { constructionsPath, constructionsMethods } from './constructions.shared'

export * from './constructions.class'
export * from './constructions.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const constructions = (app: Application) => {
	// Register our service on the Feathers application
	app.use(constructionsPath, new ConstructionsService(getOptions(app)), {
		// A list of all methods this service exposes externally
		methods: constructionsMethods,
		// You can add additional custom events to be sent to clients here
		events: [],
	})
	// Initialize hooks
	app.service(constructionsPath).hooks({
		around: {
			all: [
				authenticate('jwt'),
				schemaHooks.resolveExternal(constructionsExternalResolver),
				schemaHooks.resolveResult(constructionsResolver),
			],
		},
		before: {
			all: [
				schemaHooks.validateQuery(constructionsQueryValidator),
				schemaHooks.resolveQuery(constructionsQueryResolver),
			],
			find: [],
			get: [],
			create: [
				schemaHooks.validateData(constructionsDataValidator),
				schemaHooks.resolveData(constructionsDataResolver),
			],
			patch: [
				schemaHooks.validateData(constructionsPatchValidator),
				schemaHooks.resolveData(constructionsPatchResolver),
			],
			remove: [],
		},
		after: {
			all: [],
		},
		error: {
			all: [],
		},
	})
}

// Add this service to the service type index
declare module '../../declarations' {
	interface ServiceTypes {
		[constructionsPath]: ConstructionsService
	}
}
