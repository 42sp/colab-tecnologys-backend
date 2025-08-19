// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import { createUser } from '../../hooks/access/create-user'

import {
  accessDataValidator,
  accessPatchValidator,
  accessQueryValidator,
  accessResolver,
  accessExternalResolver,
  accessDataResolver,
  accessPatchResolver,
  accessQueryResolver
} from './access.schema'

import type { Application } from '../../declarations'
import { AccessService, getOptions } from './access.class'
import { accessPath, accessMethods } from './access.shared'

export * from './access.class'
export * from './access.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const access = (app: Application) => {
  // Register our service on the Feathers application
  app.use(accessPath, new AccessService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: accessMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(accessPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(accessExternalResolver),
        schemaHooks.resolveResult(accessResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(accessQueryValidator), schemaHooks.resolveQuery(accessQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(accessDataValidator), schemaHooks.resolveData(accessDataResolver)],
      patch: [schemaHooks.validateData(accessPatchValidator), schemaHooks.resolveData(accessPatchResolver)],
      remove: []
    },
    after: {
      all: [],
      create: [createUser]
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [accessPath]: AccessService
  }
}
