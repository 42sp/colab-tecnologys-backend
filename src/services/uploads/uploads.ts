// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'

import {
	uploadsDataValidator,
	uploadsPatchValidator,
	uploadsQueryValidator,
	uploadsResolver,
	uploadsExternalResolver,
	uploadsDataResolver,
	uploadsPatchResolver,
	uploadsQueryResolver,
} from './uploads.schema'

import type { Application } from '../../declarations'
import { UploadsService } from './uploads.class'
import { uploadsPath } from './uploads.shared'
import { saveImage } from '../../hooks/save-image'

export * from './uploads.class'
export * from './uploads.schema'

const blobService = require('feathers-blob')
const fs = require('fs-blob-store')
const blobStorage = fs('./images')

// A configure function that registers the service and its hooks via `app.configure`
export const uploads = (app: Application) => {
	app.use(
		uploadsPath,
		function (_req, _res, next) {
			next()
		},
		blobService({ Model: blobStorage }),
	)
	// Initialize hooks
	app.service(uploadsPath).hooks({
		around: {
			all: [
				authenticate('jwt'),
				schemaHooks.resolveExternal(uploadsExternalResolver),
				schemaHooks.resolveResult(uploadsResolver),
			],
		},
		before: {
			all: [
				schemaHooks.validateQuery(uploadsQueryValidator),
				schemaHooks.resolveQuery(uploadsQueryResolver),
			],
			find: [],
			get: [],
			create: [
				schemaHooks.validateData(uploadsDataValidator),
				schemaHooks.resolveData(uploadsDataResolver),
			],
			patch: [
				schemaHooks.validateData(uploadsPatchValidator),
				schemaHooks.resolveData(uploadsPatchResolver),
			],
			remove: [],
		},
		after: {
			create: [saveImage],
		},
		error: {
			all: [],
		},
	})
}

// Add this service to the service type index
declare module '../../declarations' {
	interface ServiceTypes {
		[uploadsPath]: UploadsService
	}
}
