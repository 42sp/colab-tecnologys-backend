// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { processProfileFindQuery } from './profile.hooks'


import {
	profileDataValidator,
	profilePatchValidator,
	profileQueryValidator,
	profileResolver,
	profileExternalResolver,
	profileDataResolver,
	profilePatchResolver,
	profileQueryResolver,
} from './profile.schema'

import type { Application } from '../../declarations'
import { ProfileService, getOptions } from './profile.class'
import { profilePath, profileMethods } from './profile.shared'
import { saveProfileId } from './profile.hooks'
import { BadRequest, Forbidden } from '@feathersjs/errors'

export * from './profile.class'
export * from './profile.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const profile = (app: Application) => {
	// Register our service on the Feathers application
	app.use(profilePath, new ProfileService(getOptions(app)), {
		// A list of all methods this service exposes externally
		methods: profileMethods,
		// You can add additional custom events to be sent to clients here
		events: [],
	})
	// Initialize hooks
	app.service(profilePath).hooks({
		around: {
			all: [
				authenticate('jwt'),
				schemaHooks.resolveExternal(profileExternalResolver),
				schemaHooks.resolveResult(profileResolver),
			],
		},
		before: {
			all: [
				schemaHooks.validateQuery(profileQueryValidator),
				schemaHooks.resolveQuery(profileQueryResolver),
			],
			find: [
				processProfileFindQuery,
			],
			get: [],
			create: [

				// Depois valida o payload final
				schemaHooks.validateData(profileDataValidator),
				schemaHooks.resolveData(profileDataResolver),

				// Duplicidade
				async (context) => {
					const dataArray = Array.isArray(context.data) ? context.data : [context.data]
					for (const data of dataArray) {
						if (!data) continue
						const existing = await context.app.service('profile').find({
							query: { $or: [{ name: data.name }, { email: data.email }, { phone: data.phone }] },
							paginate: false,
						})
						if (existing.length > 0) throw new BadRequest(`Funcionário ${data.name} já registrado`)
					}
					return context
				},
			],
			patch: [
				schemaHooks.validateData(profilePatchValidator),
				schemaHooks.resolveData(profilePatchResolver),
			],
			remove: [],
		},
		after: {
			all: [],
			create: [saveProfileId],
		},
		error: {
			all: [],
		},
	})
}

// Add this service to the service type index
declare module '../../declarations' {
	interface ServiceTypes {
		[profilePath]: ProfileService
	}
}
