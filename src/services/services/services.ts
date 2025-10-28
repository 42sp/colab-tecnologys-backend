// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
/**
 * @openapi
 * /services:
 *   get:
 *     tags:
 *       - Services
 *     summary: Listar serviços
 *     description: Retorna lista de serviços cadastrados para uma obra específica
 *     parameters:
 *       - in: query
 *         name: work_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da obra
 *       - in: query
 *         name: $limit
 *         schema:
 *           type: number
 *       - in: query
 *         name: $skip
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Lista de serviços retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                 limit:
 *                   type: number
 *                 skip:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Service'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   post:
 *     tags:
 *       - Services
 *     summary: Criar novo serviço
 *     description: Cadastra um novo serviço ou importa múltiplos serviços via CSV
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/Service'
 *               - type: array
 *                 items:
 *                   type: object
 *                 description: Importação em lote via CSV
 *     responses:
 *       201:
 *         description: Serviço(s) criado(s) com sucesso
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /services/{id}:
 *   get:
 *     tags:
 *       - Services
 *     summary: Buscar serviço por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Serviço encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   patch:
 *     tags:
 *       - Services
 *     summary: Atualizar serviço
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_active:
 *                 type: boolean
 *               is_done:
 *                 type: boolean
 *               labor_quantity:
 *                 type: number
 *               material_quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Serviço atualizado com sucesso
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   delete:
 *     tags:
 *       - Services
 *     summary: Deletar serviço
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Serviço deletado com sucesso
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

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
				/*async (context) => {
					console.log('[BACKEND/FIND] Query recebida:', context.params.query);
                    console.log('[BACKEND/FIND] work_id recebido:', context.params.query?.work_id);

					const workId = context.params.query?.work_id

					if (!workId) {
						throw new Error('O work_id da construção deve ser fornecido para listar os serviços.')
					}

					return context
				},*/
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
