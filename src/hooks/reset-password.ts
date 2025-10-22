import type { HookContext } from '../declarations'
import { Forbidden } from '@feathersjs/errors'
import bcrypt from 'bcryptjs'

export async function resetPassword(context: HookContext) {
	if (!context.params.provider) {
        return context; 
    }

	console.log(`Running hook reset-password on ${context.path}.${context.method}`)

	const { newPassword, oldPassword } = context.data || {}

	if (newPassword && oldPassword) {
		const { password: currentPassword } = await context.app
			.service('users')
			.get(context.params.user.id)

		const isValid = await bcrypt.compare(oldPassword, currentPassword)
		if (!isValid) throw new Forbidden('Old password is incorrect')

		await context.app.service('users').patch(context.params.user.id, {
			password: newPassword,
		})

		delete context.data.oldPassword
		delete context.data.newPassword
	}

	return context
}
