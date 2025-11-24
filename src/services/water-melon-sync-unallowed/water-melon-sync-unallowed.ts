// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  waterMelonSyncUnallowedDataValidator,
  waterMelonSyncUnallowedPatchValidator,
  waterMelonSyncUnallowedQueryValidator,
  waterMelonSyncUnallowedResolver,
  waterMelonSyncUnallowedExternalResolver,
  waterMelonSyncUnallowedDataResolver,
  waterMelonSyncUnallowedPatchResolver,
  waterMelonSyncUnallowedQueryResolver
} from './water-melon-sync-unallowed.schema'

import type { Application } from '../../declarations'
import { WaterMelonSyncUnallowedService, getOptions } from './water-melon-sync-unallowed.class'
import {
  waterMelonSyncUnallowedPath,
  waterMelonSyncUnallowedMethods
} from './water-melon-sync-unallowed.shared'

export * from './water-melon-sync-unallowed.class'
export * from './water-melon-sync-unallowed.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const waterMelonSyncUnallowed = (app: Application) => {
  // Register our service on the Feathers application
  app.use(waterMelonSyncUnallowedPath, new WaterMelonSyncUnallowedService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: waterMelonSyncUnallowedMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(waterMelonSyncUnallowedPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(waterMelonSyncUnallowedExternalResolver),
        schemaHooks.resolveResult(waterMelonSyncUnallowedResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(waterMelonSyncUnallowedQueryValidator),
        schemaHooks.resolveQuery(waterMelonSyncUnallowedQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(waterMelonSyncUnallowedDataValidator),
        schemaHooks.resolveData(waterMelonSyncUnallowedDataResolver)
      ],
      patch: [
        schemaHooks.validateData(waterMelonSyncUnallowedPatchValidator),
        schemaHooks.resolveData(waterMelonSyncUnallowedPatchResolver)
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
    [waterMelonSyncUnallowedPath]: WaterMelonSyncUnallowedService
  }
}
