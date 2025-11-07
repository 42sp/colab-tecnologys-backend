// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'
import express from '@feathersjs/express'
import type { Request, Response, NextFunction } from 'express'
import { json } from 'express'
import {
	servicesDataValidator,
	servicesPatchValidator,
	servicesQueryValidator,
	servicesResolver,
	servicesExternalResolver,
	servicesDataResolver,
	servicesPatchResolver,
	servicesQueryResolver,
} from './services.schema'
import { CsvServiceData } from './services.class'
import type { Application } from '../../declarations'
import { ServicesService, getOptions } from './services.class'
import { servicesPath, servicesMethods } from './services.shared'
import { conditionalPagination, applyFindFilters } from './services.hooks'

export * from './services.class'
export * from './services.schema'

export const services = (app: Application) => {
	app.use(servicesPath, new ServicesService(getOptions(app), app), {
		methods: servicesMethods,
		events: [],
	})

	app.service(servicesPath).hooks({
		around: {
			all: [
				authenticate('jwt'),
				//schemaHooks.resolveExternal(servicesExternalResolver),
				//schemaHooks.resolveResult(servicesResolver),
			],
		},
		before: {
			all: [
				//schemaHooks.validateQuery(servicesQueryValidator),
				//schemaHooks.resolveQuery(servicesQueryResolver),
			],
			find: [applyFindFilters, conditionalPagination],
			get: [],
			create: [
				//schemaHooks.validateData(servicesDataValidator),
				//schemaHooks.resolveData(servicesDataResolver),
				async (context) => {
					const isBulkImport =
						Array.isArray(context.data) && context.data.some((d) => d.work_id && d.service_code)

					if (isBulkImport) {
						const serviceInstance = context.service as ServicesService<any>
						const result = await serviceInstance._processImportBulk(
							context.data as unknown as CsvServiceData[],
						)

						context.result = result as any
					}
				},
			],
			patch: [
				schemaHooks.validateData(servicesPatchValidator),
				schemaHooks.resolveData(servicesPatchResolver),
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
		[servicesPath]: ServicesService
	}
}
