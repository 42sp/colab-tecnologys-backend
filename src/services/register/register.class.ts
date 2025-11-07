// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Register, RegisterData, RegisterPatch, RegisterQuery } from './register.schema'

export type { Register, RegisterData, RegisterPatch, RegisterQuery }

export interface RegisterParams extends KnexAdapterParams<RegisterQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class RegisterService<ServiceParams extends Params = RegisterParams> extends KnexService<
  Register,
  RegisterData,
  RegisterParams,
  RegisterPatch
> {
	async find(params?: unknown): Promise<any> {
		const knex = this.Model;

		const services = await knex('services')
			.leftJoin('tasks', 'services.id', 'tasks.service_id')
			.where('services.is_active', true)
			.where('tasks.id', null)
			.select('services.*');

		const constructions = await knex('constructions')
			.where('is_active', true);

		const profiles = await knex('profiles')

		const serviceTypes = await knex('service_types')

		return {
			services,
			constructions,
			profiles,
			serviceTypes
		}
	}
}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'register'
  }
}
