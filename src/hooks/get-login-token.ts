// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import { profile } from 'console'
import type { HookContext } from '../declarations'

export const getLoginToken = async (context: HookContext) => {
  console.log(`Running hook get-login-token on ${context.path}.${context.method}`)

	console.log(context.params.data)
  const { cpf, password } = context.params.data


  const auth = await context.app.service('authentication').create({
    strategy: 'local',
    cpf: cpf,
    password: password
  });

  context.result = { ...context.result, accessToken: auth.accessToken, profile_id: context.params.data.profile_id, meta:auth.meta }

  //console.log('Authentication successful, accessToken:', auth)

  return context
}
