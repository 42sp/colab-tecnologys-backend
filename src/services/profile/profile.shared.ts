// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
	Profile,
	ProfileData,
	ProfilePatch,
	ProfileQuery,
	ProfileService,
} from './profile.class'

export type { Profile, ProfileData, ProfilePatch, ProfileQuery }

export type ProfileClientService = Pick<
	ProfileService<Params<ProfileQuery>>,
	(typeof profileMethods)[number]
>

export const profilePath = 'profile'

export const profileMethods: Array<keyof ProfileService> = [
	'find',
	'get',
	'create',
	'patch',
	'remove',
]

export const profileClient = (client: ClientApplication) => {
	const connection = client.get('connection')

	client.use(profilePath, connection.service(profilePath), {
		methods: profileMethods,
	})
}

// Add this service to the client service type index
declare module '../../client' {
	interface ServiceTypes {
		[profilePath]: ProfileClientService
	}
}
