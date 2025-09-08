// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type {
  ServiceTypes,
  ServiceTypesData,
  ServiceTypesPatch,
  ServiceTypesQuery
} from './service-types.schema'

export type { ServiceTypes, ServiceTypesData, ServiceTypesPatch, ServiceTypesQuery }

export interface ServiceTypesParams extends KnexAdapterParams<ServiceTypesQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class ServiceTypesService<ServiceParams extends Params = ServiceTypesParams> extends KnexService<
  ServiceTypes,
  ServiceTypesData,
  ServiceTypesParams,
  ServiceTypesPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'service-types'
  }
}
