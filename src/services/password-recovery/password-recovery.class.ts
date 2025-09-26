// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'
import type { PasswordRecovery, PasswordRecoveryData } from './password-recovery.schema'
import { BadRequest } from '@feathersjs/errors'

export type { PasswordRecovery, PasswordRecoveryData }

export interface PasswordRecoveryServiceOptions {
	app: Application
}

export interface PasswordRecoveryParams {}

export class PasswordRecoveryService<
	ServiceParams extends PasswordRecoveryParams = PasswordRecoveryParams,
> implements ServiceInterface<PasswordRecovery, PasswordRecoveryData, ServiceParams>
{
	constructor(public options: PasswordRecoveryServiceOptions) {
		this.options = options;
	}

	async create(data: PasswordRecoveryData, params?: ServiceParams): Promise<any>
	async create(data: PasswordRecoveryData | PasswordRecoveryData[], params?: ServiceParams) {
		if (Array.isArray(data)) {
			return Promise.all(data.map((current) => this.create(current, params)))
		}

		if (data.cpf) {
			// [REGRA DE NEGÓCIO] - Primeira etapa: solicitar código de recuperação
			return this.handleCodeRequest(data, params)
		} 

		throw new BadRequest('Invalid payload for password recovery. CPF and Code are expected.')
	}

	private async handleCodeRequest(data: PasswordRecoveryData, params?: ServiceParams) {
		const user = await this.options.app.service('users').find({
			query: { cpf: data.cpf },
		})
		if (!user || !user.data[0]) throw new BadRequest('User Not Found')
			const profile = await this.options.app
		.service("profile")
		.find({
			query: { user_id: user.data[0].id }
		})
		.catch((error) => {
			throw new BadRequest('Profile not Found', error)
		})

		var recoveryCode = this.generateRecoveryCode();

		data.phone = profile.data[0].phone

		return {
			code: recoveryCode.code,
			expiration: recoveryCode.expiration,
			//expiration: new Date(new Date().getTime() + 10 * 60000), // 10 minutos
		}
	}

	private generateRecoveryCode(

	): { code: string; expiration: string } {
		const s = `${new Date(new Date().getTime() + 10 * 60000).toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" }).replace(" ", "T") + "." + String(new Date().getMilliseconds()).padStart(3,"0")}`;
		return { code: this.generateSixDigitCode(), expiration: s } // 10 minutos
	}

	private generateSixDigitCode(): string {
		const code = Math.floor(100000 + Math.random() * 900000).toString();
		return `${code.slice(0, 3)}-${code.slice(3)}`;
	}
}



export const getOptions = (app: Application) => {
	return { app }
}
