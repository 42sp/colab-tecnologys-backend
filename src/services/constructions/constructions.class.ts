// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type {
	Constructions,
	ConstructionsData,
	ConstructionsPatch,
	ConstructionsQuery,
} from './constructions.schema'

export type { Constructions, ConstructionsData, ConstructionsPatch, ConstructionsQuery }

export interface ConstructionsParams extends KnexAdapterParams<ConstructionsQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class ConstructionsService<
	ServiceParams extends Params = ConstructionsParams,
> extends KnexService<Constructions, ConstructionsData, ConstructionsParams, ConstructionsPatch> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
	return {
		paginate: app.get('paginate'),
		Model: app.get('postgresqlClient'),
		name: 'constructions',
	}
}
