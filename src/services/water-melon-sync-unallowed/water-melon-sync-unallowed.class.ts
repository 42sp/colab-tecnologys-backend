// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type {
  WaterMelonSyncUnallowed,
  WaterMelonSyncUnallowedData,
  WaterMelonSyncUnallowedPatch,
  WaterMelonSyncUnallowedQuery
} from './water-melon-sync-unallowed.schema'

export type {
  WaterMelonSyncUnallowed,
  WaterMelonSyncUnallowedData,
  WaterMelonSyncUnallowedPatch,
  WaterMelonSyncUnallowedQuery
}

export interface WaterMelonSyncUnallowedParams extends KnexAdapterParams<WaterMelonSyncUnallowedQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class WaterMelonSyncUnallowedService<
  ServiceParams extends Params = WaterMelonSyncUnallowedParams
> extends KnexService<
  WaterMelonSyncUnallowed,
  WaterMelonSyncUnallowedData,
  WaterMelonSyncUnallowedParams,
  WaterMelonSyncUnallowedPatch
> {
	async find(params?: unknown): Promise<any> {
		const lastPulledAt = (params as any)?.query?.lastPulledAt || 0;

		const changes = await this.Model.raw(`
			SELECT jsonb_build_object(
				'parameters', jsonb_build_object(
					'created', COALESCE((
						SELECT jsonb_agg(row_to_json(p))
						FROM parameters p
						WHERE p.created_at > to_timestamp(?) AND p.deleted_at IS NULL
					), '[]'::jsonb),
					'updated', COALESCE((
						SELECT jsonb_agg(row_to_json(p))
						FROM parameters p
						WHERE p.updated_at > to_timestamp(?) AND p.created_at <= to_timestamp(?) AND p.deleted_at IS NULL
					), '[]'::jsonb),
					'deleted', COALESCE((
						SELECT jsonb_agg(p.id)
						FROM parameters p
						WHERE p.deleted_at > to_timestamp(?)
					), '[]'::jsonb)
				)
			) as changes
		`, [
			lastPulledAt / 1000, // parameters created
			lastPulledAt / 1000, // parameters updated
			lastPulledAt / 1000, // parameters updated (created_at <=)
			lastPulledAt / 1000  // parameters deleted
		]);


		return {
			changes: changes.rows[0]?.changes || {},
			timestamp: Date.now()
		};
	}
}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'water-melon-sync-unallowed'
  }
}
