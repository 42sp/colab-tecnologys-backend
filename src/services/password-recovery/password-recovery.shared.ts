// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
	PasswordRecovery,
	PasswordRecoveryData,
	PasswordRecoveryPatch,
	PasswordRecoveryQuery,
	PasswordRecoveryService,
} from './password-recovery.class'

export type { PasswordRecovery, PasswordRecoveryData, PasswordRecoveryPatch, PasswordRecoveryQuery }

export type PasswordRecoveryClientService = Pick<
	PasswordRecoveryService<Params<PasswordRecoveryQuery>>,
	(typeof passwordRecoveryMethods)[number]
>

export const passwordRecoveryPath = 'password-recovery'

export const passwordRecoveryMethods: Array<keyof PasswordRecoveryService> = ['create']

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
