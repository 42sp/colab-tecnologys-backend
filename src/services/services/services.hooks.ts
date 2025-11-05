import { HookContext } from '../../declarations'

// Hook para Paginação Condicional
export const conditionalPagination = async (context: HookContext) => {
	const query = context.params.query || {}
	const hasPaginationParams = query.$limit !== undefined || query.$skip !== undefined
	//console.log('PAGINATION HOOK INICIADO.')

	if (hasPaginationParams) {
		context.params.paginate = {
			default: 10,
			max: 100,
		}
		console.log('[PAGINATION] Ativada condicionalmente.')
	} else {
		context.params.paginate = false
		//console.log('[PAGINATION] Mantida desativada.')
	}
	return context
}

// Hook para Validação e Filtros
export const applyFindFilters = async (context: HookContext) => {
	//console.log('[BACKEND/FIND] Query recebida:', context.params.query)
	const query = context.params.query || {}
	const workId = query.work_id
	const searchTerm = query.$search as string | undefined
	delete query.$search

	if (!workId) {
		throw new Error('O work_id da construção deve ser fornecido para listar os serviços.')
	}

	//console.log(`[BACKEND HOOK] Paginação recebida: $limit=${query.$limit}, $skip=${query.$skip}`)

	const towerFilter = query.tower
	const floorFilter = query.floor
	const acronymFilter = query.acronym

	if (towerFilter && towerFilter !== 'all') {
		query.tower = towerFilter
	} else {
		delete query.tower
	}

	if (floorFilter && floorFilter !== 'all') {
		query.floor = floorFilter
	} else {
		delete query.floor
	}

	if (acronymFilter && acronymFilter !== 'all') {
		query.acronym = acronymFilter
	} else {
		delete query.acronym
	}

	if (searchTerm && searchTerm.trim().length > 0) {
		const likeSearch = { $like: `%${searchTerm}%` }
		query.$or = [
			{ service_id: likeSearch },
			{ tower: likeSearch },
			{ floor: likeSearch },
			{ apartment: likeSearch },
			{ measurement_unit: likeSearch },
			{ service_description: likeSearch },
		]
	}

	context.params.query = query
	return context
}
