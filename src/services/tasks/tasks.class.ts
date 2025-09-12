// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Tasks, TasksData, TasksPatch, TasksQuery } from './tasks.schema'

export type { Tasks, TasksData, TasksPatch, TasksQuery }

export interface TasksParams extends KnexAdapterParams<TasksQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class TasksService<ServiceParams extends Params = TasksParams> extends KnexService<
	Tasks,
	TasksData,
	TasksParams,
	TasksPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
	return {
		paginate: app.get('paginate'),
		Model: app.get('postgresqlClient'),
		name: 'tasks',
	}
}
