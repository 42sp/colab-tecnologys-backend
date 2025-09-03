import { HookContext } from '../../declarations'
import { BadRequest } from '@feathersjs/errors'

export async function PasswordRecovery(context: HookContext) {
	const { cpf, password, code } = context.data

	if (code != '123456') throw new BadRequest('Incorrect verification code')

	const user = await context.app.service('users').find({
		query: { cpf },
	})

	if (!user.data || user.data.length === 0) throw new BadRequest('User of this CPF not found')

	if (password.length < 6) throw new BadRequest('Password requirements not met')

	await context.app.service('users').patch(user.data[0].id, {
		password: password,
	})

	context.result = { success: true, message: 'Password updated successfully' }
	return context
}
