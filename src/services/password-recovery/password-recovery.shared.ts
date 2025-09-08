// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
	PasswordRecovery,
	PasswordRecoveryData,
	PasswordRecoveryService,
} from './password-recovery.class'

export type { PasswordRecovery, PasswordRecoveryData }

// Como não temos queries, usamos Params sem tipo específico
export type PasswordRecoveryClientService = Pick<
	PasswordRecoveryService<Params>,
	(typeof passwordRecoveryMethods)[number]
>

export const passwordRecoveryPath = 'password-recovery'

export const passwordRecoveryMethods = ['create'] as const

export const passwordRecoveryClient = (client: ClientApplication) => {
	const connection = client.get('connection')

	client.use(passwordRecoveryPath, connection.service(passwordRecoveryPath), {
		methods: passwordRecoveryMethods,
	})
}

// Add this service to the client service type index
declare module '../../client' {
	interface ServiceTypes {
		[passwordRecoveryPath]: PasswordRecoveryClientService
	}
}
