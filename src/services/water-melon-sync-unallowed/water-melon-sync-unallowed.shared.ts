// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  WaterMelonSyncUnallowed,
  WaterMelonSyncUnallowedData,
  WaterMelonSyncUnallowedPatch,
  WaterMelonSyncUnallowedQuery,
  WaterMelonSyncUnallowedService
} from './water-melon-sync-unallowed.class'

export type {
  WaterMelonSyncUnallowed,
  WaterMelonSyncUnallowedData,
  WaterMelonSyncUnallowedPatch,
  WaterMelonSyncUnallowedQuery
}

export type WaterMelonSyncUnallowedClientService = Pick<
  WaterMelonSyncUnallowedService<Params<WaterMelonSyncUnallowedQuery>>,
  (typeof waterMelonSyncUnallowedMethods)[number]
>

export const waterMelonSyncUnallowedPath = 'water-melon-sync-unallowed'

export const waterMelonSyncUnallowedMethods: Array<keyof WaterMelonSyncUnallowedService> = [
  'find',
  'get',
  'create',
  'patch',
  'remove'
]

export const waterMelonSyncUnallowedClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(waterMelonSyncUnallowedPath, connection.service(waterMelonSyncUnallowedPath), {
    methods: waterMelonSyncUnallowedMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [waterMelonSyncUnallowedPath]: WaterMelonSyncUnallowedClientService
  }
}
