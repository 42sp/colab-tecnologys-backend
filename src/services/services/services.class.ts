// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Services, ServicesData, ServicesPatch, ServicesQuery } from './services.schema'

export type { Services, ServicesData, ServicesPatch, ServicesQuery }

export interface ServicesParams extends KnexAdapterParams<ServicesQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class ServicesService<ServiceParams extends Params = ServicesParams> extends KnexService<
  Services,
  ServicesData,
  ServicesParams,
  ServicesPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'services'
  }
}
