// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
/**
 * @openapi
 * /constructions:
 *   get:
 *     tags:
 *       - Constructions
 *     summary: Listar obras
 *     description: Retorna lista de obras cadastradas com suporte a filtros e paginação
 *     parameters:
 *       - in: query
 *         name: $limit
 *         schema:
 *           type: number
 *         description: Limite de registros por página
 *       - in: query
 *         name: $skip
 *         schema:
 *           type: number
 *         description: Número de registros a pular
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filtro por status
 *     responses:
 *       200:
 *         description: Lista de obras retornada com sucesso
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
 *                     $ref: '#/components/schemas/Construction'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   post:
 *     tags:
 *       - Constructions
 *     summary: Criar nova obra
 *     description: Cadastra uma nova obra no sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - city
 *               - state
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *                 maxLength: 50
 *               state:
 *                 type: string
 *                 maxLength: 2
 *               zip_code:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               expected_end_date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Obra criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Construction'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /constructions/{id}:
 *   get:
 *     tags:
 *       - Constructions
 *     summary: Buscar obra por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Obra encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Construction'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   patch:
 *     tags:
 *       - Constructions
 *     summary: Atualizar obra
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
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               description:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *               finished_at:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Obra atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Construction'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   delete:
 *     tags:
 *       - Constructions
 *     summary: Deletar obra
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Obra deletada com sucesso
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

import { authenticate } from '@feathersjs/authentication'
import { applyFiltersAndLike } from '../../hooks/applyFiltersAndLike';
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
import { setNow } from 'feathers-hooks-common';

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
			find: [applyFiltersAndLike()],
			get: [],
			create: [
				schemaHooks.validateData(constructionsDataValidator),
				schemaHooks.resolveData(constructionsDataResolver),
			],
			patch: [
				schemaHooks.validateData(constructionsPatchValidator),
				schemaHooks.resolveData(constructionsPatchResolver),
				setNow('updated_at'),
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
