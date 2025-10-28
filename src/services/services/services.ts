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

export * from './services.class'
export * from './services.schema'

export const services = (app: Application) => {
	app.use(servicesPath, new ServicesService(getOptions(app), app), {
		methods: servicesMethods,
		events: [],
	})

	// Initialize hooks
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
			find: [
				async (context) => {
					console.log('[BACKEND/FIND] Query recebida:', context.params.query)
					const query = context.params.query || {}
					const workId = query.work_id

					if (!workId) {
						throw new Error('O work_id da construção deve ser fornecido para listar os serviços.')
					}
					console.log('[BACKEND/FIND] work_id recebido:', context.params.query?.work_id)

					const towerFilter = query.tower
					const floorFilter = query.floor
					const acronymFilter = query.acronym
					const quickSearch = query.$search

					if (towerFilter && towerFilter !== 'all') {
						query.tower = towerFilter
						console.log(`[BACKEND/FIND] Aplicando filtro de Torre: ${towerFilter}`)
					} else {
						delete query.tower
					}

					if (floorFilter && floorFilter !== 'all') {
						query.floor = floorFilter
						console.log(`[BACKEND/FIND] Aplicando filtro de Pavimento: ${floorFilter}`)
					} else {
						delete query.floor
					}

					if (acronymFilter && acronymFilter !== 'all') {
						query.acronym = acronymFilter
						console.log(`[BACKEND/FIND] Aplicando filtro de Classificação: ${acronymFilter}`)
					} else {
						delete query.acronym
					}

					if (quickSearch && typeof quickSearch === 'string') {
						const likeSearch = { $like: `%${quickSearch}%` }
						delete query.$search 
						query.$or = [
							{ service_id: likeSearch },
							{ tower: likeSearch },
							{ floor: likeSearch },
							{ apartment: likeSearch }, 
							{ measurement_unit: likeSearch},
							{ stage: likeSearch },
						]
						console.log(`[BACKEND/FIND] Aplicando Busca Rápida: ${quickSearch}`)
					}

					context.params.query = query
					console.log('[BACKEND/FIND] Query Final:', context.params.query)

					return context
				},
			],
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
