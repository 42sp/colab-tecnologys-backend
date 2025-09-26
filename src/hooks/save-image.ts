// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'
import { BadRequest } from '@feathersjs/errors'

export const saveImage = async (context: HookContext) => {
	console.log(`Running hook save-image on ${context.path}.${context.method}`)
	console.log('upload id', context.result?.id)

	try {
		if (!context.params.user?.id) throw new BadRequest()
		const profilesResult = await context.app
			.service('profile')
			.find({ query: { user_id: context.params.user?.id }, paginate: false })
			.catch(() => null)

		const currentProfile = Array.isArray(profilesResult) ? profilesResult[0] : null
		const oldPhoto = currentProfile.photo as string

		await context.app
			.service('profile')
			.patch(currentProfile.id, { photo: context.result.id }, context.params)

		if (oldPhoto && oldPhoto !== context.result.id) {
			try {
				await context.app.service('uploads').remove(oldPhoto, context.params)
			} catch (removeErr) {
				console.error('Error removing previous upload:', removeErr)
			}
		}
	} catch (error) {
		console.error('Error save image avatar:', error)
	}
	return context
}
