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
			produtivity: await this.calculateReport(),
			resume: await this.calculateResume(),
			progressByFloor: await this.calculateProgressByFloor()
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

	async calculateProgressByFloor(): Promise<any> {
		const knex = this.Model;

		function toPgTimestamp(date: Date | string | null): string {
			if (!date) return '';
			if (typeof date === 'string') {
				return date.split('.')[0].replace('T', ' ').split(' GMT')[0];
			}
			return date.toISOString().replace('T', ' ').split('.')[0];
		}

		const [{ first_date }] = await knex('services').min('created_at as first_date');
		const lastDateRows: { last_date: Date | string | null }[] = await knex('services').select(knex.raw('MAX(GREATEST(updated_at, created_at)) as last_date'));
		const last_date = lastDateRows[0]?.last_date;

		const firstDateStr = toPgTimestamp(first_date);
		const lastDateStr = toPgTimestamp(last_date);

		const result = await knex
			.with('weeks', (qb) => {
				qb.select(
					knex.raw(`generate_series(0, FLOOR(EXTRACT(EPOCH FROM (TIMESTAMP '${lastDateStr}' - TIMESTAMP '${firstDateStr}')) / (7 * 24 * 60 * 60))) + 1 as week_number`)
				);
			})
			.with('services_with_week', (qb) => {
				qb.select(
					'*',
					knex.raw(`FLOOR(EXTRACT(EPOCH FROM (CASE WHEN is_done THEN updated_at ELSE created_at END - TIMESTAMP '${firstDateStr}')) / (7 * 24 * 60 * 60)) + 1 as week_number`)
				).from('services');
			})
			.with('grouped', (qb) => {
				qb.select(
					'week_number',
					'floor',
					knex.raw('SUM(CASE WHEN is_done THEN 1 ELSE 0 END)::decimal as done_count'),
					knex.raw('COUNT(*)::decimal as total_count')
				)
					.from('services_with_week')
					.groupBy('week_number', 'floor');
			})
			.with('all_weeks_floors', (qb) => {
				qb.select('weeks.week_number', 'f.floor')
					.from('weeks')
					.crossJoin(
						knex.raw('(SELECT DISTINCT floor FROM services) as f')
					);
			})
			.with('progress_by_week', (qb) => {
				qb.select(
					'all_weeks_floors.week_number',
					'all_weeks_floors.floor',
					knex.raw('COALESCE(grouped.done_count, 0) as done_count'),
					knex.raw('COALESCE(grouped.total_count, 0) as total_count')
				)
					.from('all_weeks_floors')
					.leftJoin('grouped', function () {
						this.on('grouped.week_number', '=', 'all_weeks_floors.week_number')
							.andOn('grouped.floor', '=', 'all_weeks_floors.floor');
					});
			})
			.with('accumulated', (qb) => {
				qb.select(
					'week_number',
					'floor',
					knex.raw('SUM(done_count) OVER (PARTITION BY floor ORDER BY week_number) as acc_done'),
					knex.raw('MAX(total_count) OVER (PARTITION BY floor) as total')
				)
					.from('progress_by_week');
			})
			.select(
				knex.raw(`'Sem ' || week_number as semana`),
				'floor',
				knex.raw('ROUND(CASE WHEN total > 0 THEN acc_done / total ELSE 0 END, 2) as porcentagem_acumulada')
			)
			.from('accumulated')
			.orderBy('week_number', 'floor');

		return result;
	}
}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'Report'
  }
}
