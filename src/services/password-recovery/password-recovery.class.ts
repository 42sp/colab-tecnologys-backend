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
		console.log( 'PasswordRecoveryService.create: data', data )
		if (data.cpf && !data.phone) {
			// [REGRA DE NEGÓCIO] - Primeira etapa: solicitar código de recuperação
			console.log( 'PasswordRecoveryService.create: recoveryPassword' )
			return this.recoveryPassword(data, params)
		} else if (data.phone && data.cpf) {
			return this.signUp(data, params)
		} else {
			throw new BadRequest('Invalid payload for password recovery. CPF or Phone are expected.')

		}
	}

	private async recoveryPassword(data: PasswordRecoveryData, params?: ServiceParams) {
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

		console.log( 'PasswordRecoveryService.recoveryPassword: expiration date', recoveryCode.expiration, 'code:', recoveryCode.code )

		return {
			code: recoveryCode.code,
			expiration: recoveryCode.expiration,
			phone: data.phone,
			userId:user.data[0].id
			//expiration: new Date(new Date().getTime() + 10 * 60000), // 10 minutos
		}
	}

	private async signUp(data: PasswordRecoveryData, params?: ServiceParams) {
		var recoveryCode = this.generateRecoveryCode();

		data.phone = data.phone

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
