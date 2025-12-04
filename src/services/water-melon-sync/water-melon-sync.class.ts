// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type {
  WaterMelonSync,
  WaterMelonSyncData,
  WaterMelonSyncPatch,
  WaterMelonSyncQuery
} from './water-melon-sync.schema'

export type { WaterMelonSync, WaterMelonSyncData, WaterMelonSyncPatch, WaterMelonSyncQuery }

export interface WaterMelonSyncParams extends KnexAdapterParams<WaterMelonSyncQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class WaterMelonSyncService<ServiceParams extends Params = WaterMelonSyncParams> extends KnexService<
  WaterMelonSync,
  WaterMelonSyncData,
  WaterMelonSyncParams,
  WaterMelonSyncPatch
> {
		async find(params?: unknown): Promise<any> {
			const lastPulledAt = (params as any)?.query?.lastPulledAt || 0;

			const tables = ['services', 'parameters', 'users'];

			const items: string[] = [];
			const lastPulledAtList: number[] = [];

			for (const table of tables) {
				items.push(
					`'${table}', jsonb_build_object(
						'created', COALESCE((
							SELECT jsonb_agg(row_to_json(s))
							FROM ${table} s
							WHERE s.created_at > to_timestamp(?) AND s.deleted_at IS NULL
						), '[]'::jsonb),
						'updated', COALESCE((
							SELECT jsonb_agg(row_to_json(s))
							FROM ${table} s
							WHERE s.updated_at > to_timestamp(?) AND s.created_at <= to_timestamp(?) AND s.deleted_at IS NULL
						), '[]'::jsonb),
						'deleted', COALESCE((
							SELECT jsonb_agg(s.id)
							FROM ${table} s
							WHERE s.deleted_at > to_timestamp(?)
						), '[]'::jsonb)
					)`
				);
				lastPulledAtList.push(lastPulledAt / 1000); // created
				lastPulledAtList.push(lastPulledAt / 1000); // updated
				lastPulledAtList.push(lastPulledAt / 1000); // updated (created_at <=)
				lastPulledAtList.push(lastPulledAt / 1000); // deleted
			}
			const query = `SELECT jsonb_build_object(${items.join(',')}) as changes`;
			const changes = await this.Model.raw(query, lastPulledAtList);

			return {
				changes: changes.rows[0]?.changes || {},
				timestamp: Date.now()
			};
		}

		async create(data?: any, params?: ServiceParams): Promise<any> {
			const { changes } = data;

			if (!changes)
				throw new Error('Changes parameter is required');

			try
			{
				await this.Model.raw('SELECT push(?)', [JSON.stringify(changes)]);

				return {
					success: true,
					timestamp: Date.now()
				};
			}
			catch (error)
			{
				throw new Error(`Sync push failed: ${error instanceof Error ? error.message : String(error)}`);
			}
		}
}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    // paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'water-melon-sync'
  }
}
