// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Upload, UploadData, UploadPatch, UploadQuery } from './upload.schema'

export type { Upload, UploadData, UploadPatch, UploadQuery }

export interface UploadParams extends KnexAdapterParams<UploadQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class UploadService<ServiceParams extends Params = UploadParams> extends KnexService<
  Upload,
  UploadData,
  UploadParams,
  UploadPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'upload'
  }
}
