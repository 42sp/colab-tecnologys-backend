// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
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

import type { Application } from '../../../declarations'
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
declare module '../../../declarations' {
  interface ServiceTypes {
    [tasksReportPath]: TasksReportService
  }
}
