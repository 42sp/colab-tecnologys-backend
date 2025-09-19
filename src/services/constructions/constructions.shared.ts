// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
	Constructions,
	ConstructionsData,
	ConstructionsPatch,
	ConstructionsQuery,
	ConstructionsService,
} from './constructions.class'

export type { Constructions, ConstructionsData, ConstructionsPatch, ConstructionsQuery }

export type ConstructionsClientService = Pick<
	ConstructionsService<Params<ConstructionsQuery>>,
	(typeof constructionsMethods)[number]
>

export const constructionsPath = 'constructions'

export const constructionsMethods: Array<keyof ConstructionsService> = [
	'find',
	'get',
	'create',
	'patch',
	'remove',
]

export const constructionsClient = (client: ClientApplication) => {
	const connection = client.get('connection')

	client.use(constructionsPath, connection.service(constructionsPath), {
		methods: constructionsMethods,
	})
}

// Add this service to the client service type index
declare module '../../client' {
	interface ServiceTypes {
		[constructionsPath]: ConstructionsClientService
	}
}
