// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'
import { BadRequest } from '@feathersjs/errors'

export const saveImage = async (context: HookContext) => {
	console.log(`Running hook save-image on ${context.path}.${context.method}`)
	console.log('data', context.result.id, context.params, context.data)

	try {
		const profileService = context.app.service('profile')

		await profileService.patch(
			context.params.user.id,
			{
				photo: context.result.id,
			},
			context.params,
		)

	} catch (error) {
		console.error('Error save image avatar:', error)
	}

	context.result = { contentType: context.result.contentType, photo: context.result.id,  }

	return context
}
