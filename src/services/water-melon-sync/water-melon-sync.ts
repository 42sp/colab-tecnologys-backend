// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  waterMelonSyncDataValidator,
  waterMelonSyncPatchValidator,
  waterMelonSyncQueryValidator,
  waterMelonSyncResolver,
  waterMelonSyncExternalResolver,
  waterMelonSyncDataResolver,
  waterMelonSyncPatchResolver,
  waterMelonSyncQueryResolver
} from './water-melon-sync.schema'

import type { Application } from '../../declarations'
import { WaterMelonSyncService, getOptions } from './water-melon-sync.class'
import { waterMelonSyncPath, waterMelonSyncMethods } from './water-melon-sync.shared'

export * from './water-melon-sync.class'
export * from './water-melon-sync.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const waterMelonSync = (app: Application) => {
  // Register our service on the Feathers application
  app.use(waterMelonSyncPath, new WaterMelonSyncService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: waterMelonSyncMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(waterMelonSyncPath).hooks({
    around: {
      all: [
        // authenticate('jwt'),
        schemaHooks.resolveExternal(waterMelonSyncExternalResolver),
        schemaHooks.resolveResult(waterMelonSyncResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(waterMelonSyncQueryValidator),
        schemaHooks.resolveQuery(waterMelonSyncQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(waterMelonSyncDataValidator),
        schemaHooks.resolveData(waterMelonSyncDataResolver)
      ],
      patch: [
        schemaHooks.validateData(waterMelonSyncPatchValidator),
        schemaHooks.resolveData(waterMelonSyncPatchResolver)
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
    [waterMelonSyncPath]: WaterMelonSyncService
  }
}
