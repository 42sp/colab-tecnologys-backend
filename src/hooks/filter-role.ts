// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'

export const filterRole = async (context: HookContext) => {
  console.log(`Running hook filter-role on ${context.path}.${context.method}`)
  console.log('data', context.result, context.data, context.params)
  const role_id = (await context.app.service('profile').get(context.params.user.id)).role_id
  const level = (await context.app.service('roles').get(role_id)).hierarchy_level

  if (Number(level) <= 49) {
   context.params.query = { worker_id: context.params.user.id }
  }

  return context
}
