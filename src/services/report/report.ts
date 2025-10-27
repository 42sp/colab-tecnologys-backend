// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
/**
 * @openapi
 * /tasks/report:
 *   get:
 *     tags:
 *       - Tasks Report
 *     summary: Listar relatórios de tarefas
 *     description: Retorna lista de relatórios de tarefas
 *     responses:
 *       200:
 *         description: Lista de relatórios retornada com sucesso
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
 *                     properties:
 *                       id:
 *                         type: number
 *                       text:
 *                         type: string
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   post:
 *     tags:
 *       - Tasks Report
 *     summary: Criar novo relatório
 *     description: Cria um novo relatório de tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: Texto do relatório
 *     responses:
 *       201:
 *         description: Relatório criado com sucesso
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /tasks/report/{id}:
 *   get:
 *     tags:
 *       - Tasks Report
 *     summary: Buscar relatório por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Relatório encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 text:
 *                   type: string
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   patch:
 *     tags:
 *       - Tasks Report
 *     summary: Atualizar relatório
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Relatório atualizado
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   delete:
 *     tags:
 *       - Tasks Report
 *     summary: Deletar relatório
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Relatório deletado com sucesso
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  tasksReportDataValidator,
  tasksReportPatchValidator,
  tasksReportQueryValidator,
  tasksReportResolver,
  tasksReportExternalResolver,
  tasksReportDataResolver,
  tasksReportPatchResolver,
  tasksReportQueryResolver
} from './report.schema'

import type { Application } from '../../declarations'
import { TasksReportService, getOptions } from './report.class'
import { tasksReportPath, tasksReportMethods } from './report.shared'

export * from './report.class'
export * from './report.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const tasksReport = (app: Application) => {
  // Register our service on the Feathers application
  app.use(tasksReportPath, new TasksReportService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: tasksReportMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(tasksReportPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(tasksReportExternalResolver),
        schemaHooks.resolveResult(tasksReportResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(tasksReportQueryValidator),
        schemaHooks.resolveQuery(tasksReportQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(tasksReportDataValidator),
        schemaHooks.resolveData(tasksReportDataResolver)
      ],
      patch: [
        schemaHooks.validateData(tasksReportPatchValidator),
        schemaHooks.resolveData(tasksReportPatchResolver)
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [tasksReportPath]: TasksReportService
  }
}
