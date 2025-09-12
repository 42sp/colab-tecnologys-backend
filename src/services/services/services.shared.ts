// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
	Services,
	ServicesData,
	ServicesPatch,
	ServicesQuery,
	ServicesService,
} from './services.class'

export type { Services, ServicesData, ServicesPatch, ServicesQuery }

export type ServicesClientService = Pick<
	ServicesService<Params<ServicesQuery>>,
	(typeof servicesMethods)[number]
>

export const servicesPath = 'services'

export const servicesMethods: Array<keyof ServicesService> = [
	'find',
	'get',
	'create',
	'patch',
	'remove',
]

export const servicesClient = (client: ClientApplication) => {
	const connection = client.get('connection')

	client.use(servicesPath, connection.service(servicesPath), {
		methods: servicesMethods,
	})
}

// Add this service to the client service type index
declare module '../../client' {
	interface ServiceTypes {
		[servicesPath]: ServicesClientService
	}
}
