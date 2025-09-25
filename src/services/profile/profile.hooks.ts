import { HookContext } from '../../declarations'

export const saveProfileId = async (context: HookContext) => {
	context.app.service('users').patch(context.params?.user?.id, {
		profile_id: context.result.id,
	})
}
