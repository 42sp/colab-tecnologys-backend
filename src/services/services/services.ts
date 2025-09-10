// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  servicesDataValidator,
  servicesPatchValidator,
  servicesQueryValidator,
  servicesResolver,
  servicesExternalResolver,
  servicesDataResolver,
  servicesPatchResolver,
  servicesQueryResolver
} from './services.schema'

import type { Application } from '../../declarations'
import { ServicesService, getOptions } from './services.class'
import { servicesPath, servicesMethods } from './services.shared'

export * from './services.class'
export * from './services.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const services = (app: Application) => {
  // Register our service on the Feathers application
  app.use(servicesPath, new ServicesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: servicesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(servicesPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(servicesExternalResolver),
        schemaHooks.resolveResult(servicesResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(servicesQueryValidator),
        schemaHooks.resolveQuery(servicesQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(servicesDataValidator),
        schemaHooks.resolveData(servicesDataResolver)
      ],
      patch: [
        schemaHooks.validateData(servicesPatchValidator),
        schemaHooks.resolveData(servicesPatchResolver)
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
    [servicesPath]: ServicesService
  }
}
