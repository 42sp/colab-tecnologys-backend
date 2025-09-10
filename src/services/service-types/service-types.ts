// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  serviceTypesDataValidator,
  serviceTypesPatchValidator,
  serviceTypesQueryValidator,
  serviceTypesResolver,
  serviceTypesExternalResolver,
  serviceTypesDataResolver,
  serviceTypesPatchResolver,
  serviceTypesQueryResolver
} from './service-types.schema'

import type { Application } from '../../declarations'
import { ServiceTypesService, getOptions } from './service-types.class'
import { serviceTypesPath, serviceTypesMethods } from './service-types.shared'

export * from './service-types.class'
export * from './service-types.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const serviceTypes = (app: Application) => {
  // Register our service on the Feathers application
  app.use(serviceTypesPath, new ServiceTypesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: serviceTypesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(serviceTypesPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(serviceTypesExternalResolver),
        schemaHooks.resolveResult(serviceTypesResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(serviceTypesQueryValidator),
        schemaHooks.resolveQuery(serviceTypesQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(serviceTypesDataValidator),
        schemaHooks.resolveData(serviceTypesDataResolver)
      ],
      patch: [
        schemaHooks.validateData(serviceTypesPatchValidator),
        schemaHooks.resolveData(serviceTypesPatchResolver)
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
    [serviceTypesPath]: ServiceTypesService
  }
}
