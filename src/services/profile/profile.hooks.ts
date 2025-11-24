import { HookContext } from '../../declarations'

export const saveProfileId = async (context: HookContext) => {
	context.app.service('users').patch(context.data.id, {
		// profile_id: context.data.id,
	})
}

export const processProfileFindQuery = async (context: HookContext) => {
    const query = context.params.query;

    if (query) {
        if (query.name) {
            query.name = { $ilike: query.name };
        }

    }

    return context;
};

export const composeUserProfile = async (context: HookContext) => {
    if (!context.result || !context.result.id) {
        return context;
    }

    const profile = context.result;

    try {
        const userData = await context.app.service('users').get(profile.user_id, {
            query: { $select: ['id', 'cpf', 'is_active', 'is_available', 'profile_id'] }
        });

		//console.log("DADOS DO USUÁRIO ENCONTRADOS:", userData);

        context.result = {
            ...profile,
            ...userData,
            id: profile.id
        };

		//console.log("DADOS APOS JUNTAR:", context.result);

    } catch (error) {
        console.error("Erro ao compor User/Profile:", error);
    }

    return context;
};