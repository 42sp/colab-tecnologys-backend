// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'
import type { Uploads, UploadsData, UploadsPatch, UploadsQuery } from './uploads.schema'

export type { Uploads, UploadsData, UploadsPatch, UploadsQuery }

export interface UploadsServiceOptions {
  app: Application
}

export interface UploadsParams extends Params<UploadsQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class UploadsService<ServiceParams extends UploadsParams = UploadsParams>
  implements ServiceInterface<Uploads, UploadsData, ServiceParams, UploadsPatch>
{
  constructor(public options: UploadsServiceOptions) {}

  async find(_params?: ServiceParams): Promise<Uploads[]> {
    return []
  }

  async get(id: Id, _params?: ServiceParams): Promise<Uploads> {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    }
  }

  async create(data: UploadsData, params?: ServiceParams): Promise<Uploads>
  async create(data: UploadsData[], params?: ServiceParams): Promise<Uploads[]>
  async create(data: UploadsData | UploadsData[], params?: ServiceParams): Promise<Uploads | Uploads[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)))
    }

    return {
      id: 0,
      ...data
    }
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(id: NullableId, data: UploadsData, _params?: ServiceParams): Promise<Uploads> {
    return {
      id: 0,
      ...data
    }
  }

  async patch(id: NullableId, data: UploadsPatch, _params?: ServiceParams): Promise<Uploads> {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<Uploads> {
    return {
      id: 0,
      text: 'removed'
    }
  }
}



export const getOptions = (app: Application) => {
  
  return { app }
}
