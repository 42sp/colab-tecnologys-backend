// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
/**
 * @openapi
 * /tasks_services:
 *   get:
 *     tags:
 *       - Tasks Services
 *     summary: Listar serviços de tarefas
 *     description: Retorna lista de serviços associados a tarefas
 *     responses:
 *       200:
 *         description: Lista de serviços de tarefas retornada com sucesso
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
 *                     type: object
 *                     description: Objeto dinâmico com propriedades variáveis
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   post:
 *     tags:
 *       - Tasks Services
 *     summary: Criar novo serviço de tarefa
 *     description: Cria uma nova associação entre tarefa e serviço
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Objeto com propriedades dinâmicas
 *             example:
 *               task_id: "uuid-da-tarefa"
 *               service_id: "uuid-do-servico"
 *     responses:
 *       201:
 *         description: Serviço de tarefa criado com sucesso
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /tasks_services/{id}:
 *   get:
 *     tags:
 *       - Tasks Services
 *     summary: Buscar serviço de tarefa por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Serviço de tarefa encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   patch:
 *     tags:
 *       - Tasks Services
 *     summary: Atualizar serviço de tarefa
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Propriedades a serem atualizadas
 *     responses:
 *       200:
 *         description: Serviço de tarefa atualizado
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   delete:
 *     tags:
 *       - Tasks Services
 *     summary: Deletar serviço de tarefa
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Serviço de tarefa deletado com sucesso
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

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
