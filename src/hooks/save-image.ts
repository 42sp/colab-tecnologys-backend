// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'

export const saveImage = async (context: HookContext) => {
	console.log(`Running hook save-image on ${context.path}.${context.method}`)
	console.log('data', context.result.id)

	try {
		const profileService = context.app.service('profile')
		const uploadsService = context.app.service('uploads')

		const userProfile = await profileService.find({
			user: context.params.user,
		  })
		const currentProfile = userProfile.data[0]
		const oldPhoto = currentProfile.photo

		await profileService.patch(
			currentProfile.id,
			{
				photo: context.result.id,
			},
			context.params,
		)

		if (oldPhoto && oldPhoto !== context.result.id) {
			try {
				await uploadsService.remove(oldPhoto, context.params)
			} catch (removeErr) {
				console.error('Error removing image:', removeErr)
			}
		}


	} catch (error) {
		console.error('Error save image avatar:', error)
	}
}
