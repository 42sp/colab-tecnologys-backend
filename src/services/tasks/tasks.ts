// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
/**
 * @openapi
 * /tasks:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Listar tarefas
 *     description: Retorna lista de tarefas cadastradas
 *     responses:
 *       200:
 *         description: Lista de tarefas retornada com sucesso
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
 *                     $ref: '#/components/schemas/Task'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Criar nova tarefa
 *     description: Cadastra uma nova tarefa no sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - service_id
 *               - worker_id
 *               - completion_date
 *               - task_percentage
 *               - status
 *             properties:
 *               service_id:
 *                 type: string
 *                 format: uuid
 *               worker_id:
 *                 type: string
 *                 format: uuid
 *               completion_date:
 *                 type: string
 *                 format: date
 *               task_percentage:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed, approved, rejected]
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /tasks/{id}:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Buscar tarefa por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Tarefa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   patch:
 *     tags:
 *       - Tasks
 *     summary: Atualizar tarefa
 *     description: Atualiza dados de uma tarefa existente (ex. status, percentual de conclusão)
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
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed, approved, rejected]
 *               task_percentage:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *               approver_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   delete:
 *     tags:
 *       - Tasks
 *     summary: Deletar tarefa
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Tarefa deletada com sucesso
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
	tasksDataValidator,
	tasksPatchValidator,
	tasksQueryValidator,
	tasksResolver,
	tasksExternalResolver,
	tasksDataResolver,
	tasksPatchResolver,
	tasksQueryResolver,
} from './tasks.schema'

import type { Application } from '../../declarations'
import { TasksService, getOptions } from './tasks.class'
import { tasksPath, tasksMethods } from './tasks.shared'
import { retrieveTask } from '../../hooks/retrieve-task'
import { filterRole } from '../../hooks/filter-role'

export * from './tasks.class'
export * from './tasks.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const tasks = (app: Application) => {
	// Register our service on the Feathers application
	app.use(tasksPath, new TasksService(getOptions(app)), {
		// A list of all methods this service exposes externally
		methods: tasksMethods,
		// You can add additional custom events to be sent to clients here
		events: [],
	})
	// Initialize hooks
	app.service(tasksPath).hooks({
		around: {
			all: [
				authenticate('jwt'),
				schemaHooks.resolveExternal(tasksExternalResolver),
				schemaHooks.resolveResult(tasksResolver),
			],
		},
		before: {
			all: [
				schemaHooks.validateQuery(tasksQueryValidator),
				schemaHooks.resolveQuery(tasksQueryResolver),
			],
			find: [filterRole],
			get: [],
			create: [
				schemaHooks.validateData(tasksDataValidator),
				schemaHooks.resolveData(tasksDataResolver),
			],
			patch: [
				schemaHooks.validateData(tasksPatchValidator),
				schemaHooks.resolveData(tasksPatchResolver),
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
		[tasksPath]: TasksService
	}
}
