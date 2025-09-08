// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'
import type { PasswordRecovery, PasswordRecoveryData } from './password-recovery.schema'
import { BadRequest } from '@feathersjs/errors'

import jwt, { Algorithm } from 'jsonwebtoken'
import { configAuthentication } from '../../configuration'
import { app } from '../../app'
import { error } from 'console'

export type { PasswordRecovery, PasswordRecoveryData }

export interface PasswordRecoveryServiceOptions {
	app: Application
}

export interface PasswordRecoveryParams {}

export class PasswordRecoveryService<
	ServiceParams extends PasswordRecoveryParams = PasswordRecoveryParams,
> implements ServiceInterface<PasswordRecovery, PasswordRecoveryData, ServiceParams>
{
	constructor(public options: PasswordRecoveryServiceOptions) {}

	async create(data: PasswordRecoveryData, params?: ServiceParams): Promise<any>
	async create(data: PasswordRecoveryData | PasswordRecoveryData[], params?: ServiceParams) {
		if (Array.isArray(data)) {
			return Promise.all(data.map((current) => this.create(current, params)))
		}

		if (data.cpf && !data.code) {
			// [REGRA DE NEGÓCIO] - Primeira etapa: solicitar código de recuperação
			return this.handleCodeRequest(data, params)
		} else if (data.cpf && data.code) {
			// [REGRA DE NEGÓCIO] - Segunda etapa: validar código e retornar JWT
			return this.handleCodeValidation(data, params)
		}

		throw new BadRequest('Invalid payload for password recovery. CPF and Code are expected.')
	}

	private async handleCodeRequest({ cpf }: PasswordRecoveryData, params?: ServiceParams) {
		const user = await app.service('users').find({
			query: { cpf },
		})
		if (!user || !user.data[0]) throw new BadRequest('User Not Found')

		// [REGRA DE NEGÓCIO] - Gerar código de recuperação
		// [REGRA DE NEGÓCIO] - Enviar código por SMS

		return {
			code: '123456',
			userId: user.data[0].id,
		}
	}

	private async handleCodeValidation({ cpf, code }: PasswordRecoveryData, params?: ServiceParams) {
		if (code != '123456') throw new BadRequest('Incorrect verification code')
		// [REGRA DE NEGÓCIO] - Validar código no banco de dados
		// [REGRA DE NEGÓCIO] - Verificar se o código não expirou
		// [REGRA DE NEGÓCIO] - Marcar código como usado

		const user = await app
			.service('users')
			.find({
				query: { cpf },
				paginate: false,
			})
			.catch((error) => {
				throw new BadRequest('User not Found', error)
			})

		const profile = await app
			.service('profile')
			.find({
				query: { id: user[0].id },
				paginate: false,
			})
			.catch((error) => {
				throw new BadRequest('Profile not Found', error)
			})

		const token = await this.generateJwtToken(user[0].id)

		return {
			accessToken: token,
			userId: user[0].id,
			phone: profile[0].phone,
		}
	}

	private async generateJwtToken(userId: string): Promise<string> {
		const { secret, jwtOptions } = configAuthentication

		const payload = {
			code: '123456',
			sub: userId,
			aud: jwtOptions.audience,
		}

		return jwt.sign(payload, secret, {
			expiresIn: '20m',
			algorithm: jwtOptions.algorithm as Algorithm,
		})
	}

	private async generateRecoveryCode(
		cpf: string,
		userId: string,
	): Promise<{ code: string; createdAt: Date }> {
		// [REGRA DE NEGÓCIO] - Gerar código aleatório e definir data de expiração
		return { code: '123456', createdAt: new Date() }
	}

	private async sendSmsCode(phoneNumber: string, code: string): Promise<void> {
		// [REGRA DE NEGÓCIO] - Integrar com serviço de SMS
	}
}

export const getOptions = (app: Application) => {
	return { app }
}
