// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Access, AccessData, AccessPatch, AccessQuery } from './access.schema'

export type { Access, AccessData, AccessPatch, AccessQuery }

export interface AccessParams extends KnexAdapterParams<AccessQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class AccessService<ServiceParams extends Params = AccessParams> extends KnexService<
  Access,
  AccessData,
  AccessParams,
  AccessPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'access'
  }
}
