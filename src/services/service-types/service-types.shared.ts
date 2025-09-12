// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
	ServiceTypes,
	ServiceTypesData,
	ServiceTypesPatch,
	ServiceTypesQuery,
	ServiceTypesService,
} from './service-types.class'

export type { ServiceTypes, ServiceTypesData, ServiceTypesPatch, ServiceTypesQuery }

export type ServiceTypesClientService = Pick<
	ServiceTypesService<Params<ServiceTypesQuery>>,
	(typeof serviceTypesMethods)[number]
>

export const serviceTypesPath = 'service-types'

export const serviceTypesMethods: Array<keyof ServiceTypesService> = [
	'find',
	'get',
	'create',
	'patch',
	'remove',
]

export const serviceTypesClient = (client: ClientApplication) => {
	const connection = client.get('connection')

	client.use(serviceTypesPath, connection.service(serviceTypesPath), {
		methods: serviceTypesMethods,
	})
}

// Add this service to the client service type index
declare module '../../client' {
	interface ServiceTypes {
		[serviceTypesPath]: ServiceTypesClientService
	}
}
