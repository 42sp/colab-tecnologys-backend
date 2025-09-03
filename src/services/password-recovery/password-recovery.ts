// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
	passwordRecoveryDataValidator,
	passwordRecoveryQueryValidator,
	passwordRecoveryResolver,
	passwordRecoveryExternalResolver,
	passwordRecoveryDataResolver,
	passwordRecoveryQueryResolver,
} from './password-recovery.schema'

import type { Application } from '../../declarations'
import { PasswordRecoveryService, getOptions } from './password-recovery.class'
import { passwordRecoveryPath, passwordRecoveryMethods } from './password-recovery.shared'
import { PasswordRecovery } from './password-recovery.hooks'

export * from './password-recovery.class'
export * from './password-recovery.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const passwordRecovery = (app: Application) => {
	// Register our service on the Feathers application
	app.use(passwordRecoveryPath, new PasswordRecoveryService(getOptions(app)), {
		// A list of all methods this service exposes externally
		methods: passwordRecoveryMethods,
		// You can add additional custom events to be sent to clients here
		events: [],
	})
	// Initialize hooks
	app.service(passwordRecoveryPath).hooks({
		around: {
			all: [
				authenticate('jwt'),
				schemaHooks.resolveExternal(passwordRecoveryExternalResolver),
				schemaHooks.resolveResult(passwordRecoveryResolver),
			],
		},
		before: {
			all: [
				schemaHooks.validateQuery(passwordRecoveryQueryValidator),
				schemaHooks.resolveQuery(passwordRecoveryQueryResolver),
			],

			create: [
				schemaHooks.validateData(passwordRecoveryDataValidator),
				schemaHooks.resolveData(passwordRecoveryDataResolver),
				PasswordRecovery,
			],
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
		[passwordRecoveryPath]: PasswordRecoveryService
	}
}
