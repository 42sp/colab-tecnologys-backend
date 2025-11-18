// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  WaterMelonSync,
  WaterMelonSyncData,
  WaterMelonSyncPatch,
  WaterMelonSyncQuery,
  WaterMelonSyncService
} from './water-melon-sync.class'

export type { WaterMelonSync, WaterMelonSyncData, WaterMelonSyncPatch, WaterMelonSyncQuery }

export type WaterMelonSyncClientService = Pick<
  WaterMelonSyncService<Params<WaterMelonSyncQuery>>,
  (typeof waterMelonSyncMethods)[number]
>

export const waterMelonSyncPath = 'water-melon-sync'

export const waterMelonSyncMethods: Array<keyof WaterMelonSyncService> = [
  'find',
  'get',
  'create',
  'patch',
  'remove'
]

export const waterMelonSyncClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(waterMelonSyncPath, connection.service(waterMelonSyncPath), {
    methods: waterMelonSyncMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [waterMelonSyncPath]: WaterMelonSyncClientService
  }
}
