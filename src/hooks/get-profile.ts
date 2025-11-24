// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'

export const getProfile = async (context: HookContext) => {
  console.log(`Running hook get-profile on ${context.path}.${context.method}`)

   // Garante que é o create do /authentication
    if (context.path !== 'authentication' || context.method !== 'create') return context;

    const { app, result } = context;
    if (!result?.accessToken) return context;

    // Decodifica o token para obter o userId (sub)
    const payload = await app.service('authentication').verifyAccessToken(result.accessToken);
    const userId = payload?.sub as string | undefined;
    if (!userId) return context;

    // Busque apenas o que precisa — evite expor campos sensíveis
    const user = await app.service('users').get(userId, {
      query: { $select: ['id'] }
    });

    // Exemplos de dados extras vindos de outros services
    //const [profile] = await Promise.all([
		const users = await app.service('users').find({
			query: { id: userId, $limit: 1, $select: ['id', 'name', 'email', 'phone', 'role_id'] }
		});
    //]);

     console.log(users)

    // let roles = null;
    // const roleId = users.data[0]?.role_id;
    // if (roleId) {
    //   roles = await app.service('roles').get(roleId);
    // }


    //const unwrap = (res: any) => (Array.isArray(res) ? res : res?.data ?? []);
    const userData = {...users.data[0], profileId:user}
    // Anexa ao payload de resposta do login
    context.result.meta = {
      profile:{...userData},
      // roles
    };

    return context;
}
