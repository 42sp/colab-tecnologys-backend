import { hooks as schemaHooks } from '@feathersjs/schema'
import type { Application, HookContext } from '../../declarations'
import { BadRequest, GeneralError, NotFound } from '@feathersjs/errors'

// Função auxiliar para remover propriedades nulas, vazias ou indefinidas
const cleanPatchData = (obj: Record<string, any>): Record<string, any> => {
	const cleaned: Record<string, any> = {}
	for (const key in obj) {
		if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
			cleaned[key] = obj[key]
		}
	}
	return cleaned
}

// Orquestração para PATCH (Atualização Múltipla)
export const patchEmployee = async (context: HookContext) => {
	const { id, data, app, params } = context

	const logger = app.get('logger') || console

	// LOG: Payload Total Recebido
	logger.info('PATCH Employee: Payload Total Recebido:', JSON.stringify(data))

	if (!id) {
		logger.error('PATCH Employee: ID do funcionário ausente no contexto.')
		throw new BadRequest('ID do funcionário é necessário para a atualização.')
	}

	const profileId = id
	let userId: string

	try {
		logger.info(`PATCH Employee: Buscando user_id para profileId: ${profileId}`)

		const profileRecord = await app.service('profile').get(profileId, {
			query: { $select: ['user_id'] },
		})

		if (!profileRecord || !profileRecord.user_id) {
			logger.error(`PATCH Employee: user_id não encontrado para profileId: ${profileId}`)
			throw new NotFound('ID de usuário relacionado não encontrado no perfil.')
		}

		userId = profileRecord.user_id
		logger.info(`PATCH Employee: userId resolvido para: ${userId}`)
	} catch (error: any) {
		logger.error(`Erro na Fase 1 (Resolução do ID) para ID ${id}:`, error.message)
		throw new GeneralError('Falha ao localizar o funcionário para atualização.', {
			originalError: error.message,
		})
	}

	// Lista de campos que SÃO ATUALIZÁVEIS nos respectivos serviços
	const userFieldsToExtract = ['cpf', 'is_active', 'is_available', 'password']
	const profileFieldsToExtract = [
		'name',
		'email',
		'phone',
		'role_id',
		'date_of_birth',
		'address',
		'city',
		'state',
		'postcode',
		'photo',
	]

	const userDataRaw: Record<string, any> = {}
	const profileDataRaw: Record<string, any> = {}

	// 1. Filtrar e extrair APENAS campos do user
	for (const field of userFieldsToExtract) {
		if (data[field] !== undefined) {
			userDataRaw[field] = data[field]
		}
	}

	// 2. Filtrar e extrair APENAS campos do profile
	for (const field of profileFieldsToExtract) {
		if (data[field] !== undefined) {
			profileDataRaw[field] = data[field]
		}
	}

	const userDataToPatch = cleanPatchData(userDataRaw)
	const profileDataToPatch = cleanPatchData(profileDataRaw)

	// LOG: Payloads Filtrados
	logger.info('PATCH Employee: Payload Users Filtrado:', JSON.stringify(userDataToPatch))
	logger.info('PATCH Employee: Payload Profiles Filtrado:', JSON.stringify(profileDataToPatch))

	try {
		const promises = []

		if (Object.keys(userDataToPatch).length > 0) {
			logger.info(`PATCH Employee: Atualizando Users (ID: ${userId}).`)
			promises.push(app.service('users').patch(userId, userDataToPatch, params))
		}

		if (Object.keys(profileDataToPatch).length > 0) {
			logger.info(`PATCH Employee: Atualizando Profile (ID: ${profileId}).`)
			promises.push(app.service('profile').patch(profileId, profileDataToPatch, params))
		}

		await Promise.all(promises)

		logger.info(`PATCH Employee: Re-buscando dados do funcionário ${id}.`)
		const updatedEmployee = await app.service('employee').get(id, params)
		context.result = updatedEmployee

		logger.info(`PATCH Employee: Atualização do funcionário ${id} concluída com sucesso.`)

		return context
	} catch (error: any) {
		logger.error(`Erro durante o PATCH orquestrado para ID ${id}:`, error.message, error.stack)
		throw new GeneralError('Falha ao atualizar funcionário.', { originalError: error.message })
	}
}

export const createEmployee = async (context: HookContext) => {
	const data = context.data
	const app = context.app

	const logger = app.get('logger') || console

	logger.info(`CREATE Employee: Data Recebido (role_id): ${data.role_id}`)
  logger.info(`CREATE Employee: Data Recebido COMPLETO: ${JSON.stringify(data)}`)

	let newUserId: string | number | undefined

	const userData = {
		cpf: data.cpf,
		password: data.password,
	}

	const profileData = {
		name: data.name,
		email: data.email,
		phone: data.phone,
		role_id: data.role_id,
		date_of_birth: data.date_of_birth,
		address: data.address,
		city: data.city,
		state: data.state,
		postcode: data.postcode,
		photo: data.photo || '',
	}

	

	try {
		logger.info('CREATE Employee: Iniciando criação de usuário.')
		const userResult = await app.service('users').create(userData, context.params)
		newUserId = userResult.id
		logger.info(`CREATE Employee: Usuário criado. ID: ${newUserId}`)

		const finalProfilePayload = {
			id: newUserId,
			...profileData,
			user_id: newUserId,
		}

		const profileResult = await app.service('profile').create(finalProfilePayload, context.params)
		logger.info(`CREATE Employee: Perfil criado com sucesso para user_id: ${newUserId}`)

		context.result = {
			...userResult,
			profile: profileResult,
		}
		logger.info(`CREATE Employee: Criação completa. Retornando ID: ${newUserId}`)

		return context
	} catch (error: any) {
		if (newUserId) {
			logger.warn(`CREATE Employee: ROLLBACK acionado. Removendo usuário ${newUserId}.`)
			await app.service('users').remove(newUserId, { ...context.params, internal: true })
		}

		logger.error('Erro durante a criação orquestrada:', error.message, error.stack)
		throw new GeneralError('Falha ao registrar funcionário.', { originalError: error.message })
	}
}

export const sanitizeData = async (context: HookContext) => {
	return context
}