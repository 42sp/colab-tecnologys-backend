import { HookContext } from '../../declarations'

export const saveProfileId = async (context: HookContext) => {
	context.app.service('users').patch(context.data.id, {
		profile_id: context.data.id,
	})
}

export const processProfileFindQuery = async (context: HookContext) => {
    const query = context.params.query;

    if (query) {
        // --- 1. FILTRO DE PESQUISA POR NOME ($like) ---
        if (query.name) {
            // Usa $ilike para pesquisa insensível a maiúsculas/minúsculas no PostgreSQL
            // A string '%Termo%' já está vindo do frontend, então apenas a envolvemos no operador.
            query.name = { $ilike: query.name };
        }

        // --- 2. FILTRO POR CARGO (role_id) ---
        // Se query.role_id for fornecido, a busca por igualdade (role_id: 'UUID')
        // deve funcionar por padrão no Feathers/Knex, mas mantemos o código
        // para garantir que ele esteja sendo passado. Não é necessário $eq, pois é o padrão.
        // if (query.role_id) { ... }
    }

    return context;
};