// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'

export const saveImage = async (context: HookContext) => {
	console.log(`Running hook save-image on ${context.path}.${context.method}`)
	console.log('data', context.result.id)

	try {
		const profileService = context.app.service('profile')

		const userProfile = await profileService.find({
			user: context.params.user,
		  })
		const currentProfile = userProfile.data[0]

		await profileService.patch(
			currentProfile.id,
			{
				photo: context.result.id,
			},
			context.params,
		)

	} catch (error) {
		console.error('Error save image avatar:', error)
	}
}
