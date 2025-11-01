// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Paginated, Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
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
			production: await this.calculateProduction((params as any).query),
			resume: await this.calculateResume(),
			progressByFloor: await this.calculateProgressByFloor(),
			productivityByUser: await this.calculateProductivityByUser((params as any).query),
		};

		return result;
	}

	async calculateProduction(params: {
		period: 'day' | 'week' | 'month',
		worker_id?: string,
		periodProduction?: 'week' | 'month'
	}): Promise<any> {
		const knex = this.Model

		let dateFormat: string;
		let groupByClause: string;

		if (params.periodProduction === 'week') {
			dateFormat = "TO_CHAR(DATE_TRUNC('week', t.completion_date), 'YYYY-MM-DD')";
			groupByClause = "DATE_TRUNC('week', t.completion_date), s.floor";
		} else {
			dateFormat = "TO_CHAR(t.completion_date, 'YYYY-MM')";
			groupByClause = "TO_CHAR(t.completion_date, 'YYYY-MM'), s.floor";
		}

		const result = await knex('tasks as t')
			.select(
				knex.raw(`${dateFormat} as periodo`),
				's.floor',
				knex.raw('SUM(worker_quantity) as total_worker_quantity')
			)
			.join('services as s', 't.service_id', 's.id')
			.join('profiles as p', 'p.id', 't.worker_id')
			.whereNotNull('t.completion_date')
			.where('s.is_done', true)
			.groupByRaw(groupByClause)
			.orderByRaw(groupByClause)

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

	async calculateProductivityByUser(params: { period: 'day' | 'week' | 'month', worker_id?: string }) {
		const knex = this.Model;

		let periodSelect: string;
		switch (params.period) {
			case 'day':
				periodSelect = `DATE(completion_date)`;
				break;
			case 'week':
				periodSelect = `DATE_TRUNC('week', completion_date)`;
				break;
			case 'month':
				periodSelect = `DATE_TRUNC('month', completion_date)`;
				break;
			default:
				throw new Error('Invalid period');
		}

		type Row = {
			worker_id: string;
			worker_name: string;
			service_floor: string;
			period: string | Date;
			completed_tasks: string | number;
		};
		let query = knex('tasks')
			.select(
				'worker_id',
				'worker_name',
				'service_floor',
				knex.raw(`${periodSelect} as period`),
				knex.raw('COUNT(*) as completed_tasks')
			)
			.whereIn('status', ['completed', 'approved'])
			.whereNotNull('completion_date');

		if (params.worker_id) {
			query = query.where('worker_id', params.worker_id);
		}

		const rows: Row[] = await query
			.groupBy('worker_id', 'worker_name', 'service_floor', knex.raw(periodSelect))
			.orderBy('period', 'asc');

		function getISOWeek(date: Date): string {
			const tmp = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
			tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
			const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
			const weekNo = Math.ceil((((tmp.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
			return `${tmp.getUTCFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
		}

		const allPeriodsSet = new Set<string>();
		const mesesAbrev = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
		rows.forEach((row) => {
			let label: string;
			if (params.period === 'week') {
				const d = new Date(row.period as string);
				const tmp = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
				tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
				const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
				const weekNo = Math.ceil((((tmp.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
				label = `Sem ${weekNo}`;
			} else if (params.period === 'day') {
				const d = new Date(row.period as string);
				label = String(d.getUTCDate());
			} else if (params.period === 'month') {
				const d = new Date(row.period as string);
				label = mesesAbrev[d.getUTCMonth()];
			} else {
				label = row.period instanceof Date ? row.period.toISOString().slice(0, 10) : String(row.period).slice(0, 10);
			}
			allPeriodsSet.add(label);
		});
		let labels: string[];
		if (params.period === 'day') {
			labels = Array.from(allPeriodsSet).map(Number).sort((a, b) => a - b).map(String);
		} else if (params.period === 'week') {
			labels = Array.from(allPeriodsSet)
				.map(l => ({ l, n: parseInt(l.replace(/\D/g, ''), 10) }))
				.sort((a, b) => a.n - b.n)
				.map(obj => obj.l);
		} else {
			labels = Array.from(allPeriodsSet).sort();
		}

		const userMap: Record<string, { worker_name: string, floor: string, data: Record<string, number> }> = {};
		rows.forEach((row) => {
			let label: string;
			if (params.period === 'week') {
				const d = new Date(row.period as string);
				const tmp = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
				tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
				const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
				const weekNo = Math.ceil((((tmp.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
				label = `Sem ${weekNo}`;
			} else if (params.period === 'day') {
				const d = new Date(row.period as string);
				label = String(d.getUTCDate());
			} else if (params.period === 'month') {
				const d = new Date(row.period as string);
				label = mesesAbrev[d.getUTCMonth()];
			} else {
				label = row.period instanceof Date ? row.period.toISOString().slice(0, 10) : String(row.period).slice(0, 10);
			}
			if (!userMap[row.worker_id]) {
				userMap[row.worker_id] = {
					worker_name: row.worker_name,
					floor: row.service_floor || '',
					data: {}
				};
			}
			userMap[row.worker_id].data[label] = Number(row.completed_tasks);
		});

		const datasets = Object.entries(userMap).map(([worker_id, user]) => {
			return {
				data: labels.map(label => user.data[label] || 0),
				label: user.worker_name || worker_id,
				active: true,
			};
		});

		const result = {
			labels,
			datasets
		};

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
