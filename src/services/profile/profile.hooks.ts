import { HookContext } from '../../declarations'

export const saveProfileId = async (context: HookContext) => {
	context.app.service('users').patch(context.data.id, {
		profile_id: context.data.id,
	})
}
