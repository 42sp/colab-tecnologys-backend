// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'

export const getLoginToken = async (context: HookContext) => {
  console.log(`Running hook get-login-token on ${context.path}.${context.method}`)

  const { cpf, password } = context.params.data

  console.log('Authenticating', context.params.data)

  const { user, accessToken } = await context.app.service('authentication').create({
    strategy: 'local',
    cpf: cpf,
    password: password
  });

  context.result = { ...context.result, accessToken: accessToken, profile_id: context.params.data.profile_id }

  console.log('Authentication successful, accessToken:', context.result)

  return context
}
