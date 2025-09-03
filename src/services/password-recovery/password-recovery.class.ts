// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'
import type {
	PasswordRecovery,
	PasswordRecoveryData,
	PasswordRecoveryPatch,
	PasswordRecoveryQuery,
} from './password-recovery.schema'

export type { PasswordRecovery, PasswordRecoveryData, PasswordRecoveryPatch, PasswordRecoveryQuery }

export interface PasswordRecoveryServiceOptions {
	app: Application
}

export interface PasswordRecoveryParams extends Params<PasswordRecoveryQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class PasswordRecoveryService<
	ServiceParams extends PasswordRecoveryParams = PasswordRecoveryParams,
> implements
		ServiceInterface<PasswordRecovery, PasswordRecoveryData, ServiceParams, PasswordRecoveryPatch>
{
	constructor(public options: PasswordRecoveryServiceOptions) {}

	async create(data: PasswordRecoveryData, params?: ServiceParams): Promise<PasswordRecovery>
	async create(data: PasswordRecoveryData[], params?: ServiceParams): Promise<PasswordRecovery[]>
	async create(
		data: PasswordRecoveryData | PasswordRecoveryData[],
		params?: ServiceParams,
	): Promise<PasswordRecovery | PasswordRecovery[]> {
		if (Array.isArray(data)) {
			return Promise.all(data.map((current) => this.create(current, params)))
		}
		return data
	}
}

export const getOptions = (app: Application) => {
	return { app }
}
