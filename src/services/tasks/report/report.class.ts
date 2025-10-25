// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Paginated, Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../../declarations'
import type {
  TasksReport,
  TasksReportData,
  TasksReportPatch,
  TasksReportQuery
} from './report.schema'

export type { TasksReport, TasksReportData, TasksReportPatch, TasksReportQuery }

export interface TasksReportParams extends KnexAdapterParams<TasksReportQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class TasksReportService<
  ServiceParams extends Params = TasksReportParams
> extends KnexService<
  TasksReport,
  TasksReportData,
  TasksReportParams,
  TasksReportPatch
> {
	async find(params?: unknown): Promise<any> {
		const result = {
			Report: await this.calculateReport(),
			Resume: await this.calculateResume()
		};

		return result;
	}

	async calculateReport(): Promise<any> {
		const knex = this.Model

		const result = await knex('tasks as t')
			.select(
				knex.raw("TO_CHAR(t.completion_date, 'YYYY-MM') as ano_mes"),
				's.floor',
				knex.raw('SUM(worker_quantity) as total_worker_quantity')
			)
			.join('services as s', 't.service_id', 's.id')
			.join('profiles as p', 'p.id', 't.worker_id')
			.groupByRaw("TO_CHAR(t.completion_date, 'YYYY-MM'), s.floor")
			.orderByRaw("TO_CHAR(t.completion_date, 'YYYY-MM'), s.floor")

		return result
	}

	async calculateResume(): Promise<any> {
		const knex = this.Model;

		const completedActivity = await knex('services')
			.select(
				knex.raw('count(*) as total_completed_activities')
			)
			.where('is_done', true);

		const totalCompletedActivities = Number(completedActivity[0]?.total_completed_activities);

		const floorActivityRows = await knex('services')
			.select('floor')
			.count('* as total_activities')
			.groupBy('floor')
			.havingRaw('count(*) > 0');

		const activitiesPerFloorCount = floorActivityRows.length;

		// const progressByFloor = await knex('services')
		// 	.select('floor')
		// 	.count('* as total_in_progress')
		// 	.where('is_done', false)
		// 	.groupBy('floor');


		return {
			totalCompletedActivities,
			activitiesPerFloorCount
		}
	}
}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'Report'
  }
}
