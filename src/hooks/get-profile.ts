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
     const profile = await app.service('profile').find({
        query: { id: userId, $limit: 1, $select: ['name', 'email', 'photo', 'date_of_birth', 'phone', 'address', 'city', 'state', 'postcode', 'role_id'] }
      });
    //]);

     console.log(profile)

    const roles = await app.service('roles').get(profile.data[0].role_id)


    //const unwrap = (res: any) => (Array.isArray(res) ? res : res?.data ?? []);
    const userData = {...profile.data[0], profileId:user}
   
    // Anexa ao payload de resposta do login
    context.result.meta = {
      profile:{...userData},
      roles
    };

    return context;
}
