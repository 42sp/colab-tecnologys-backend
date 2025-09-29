// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'

export const saveProfile = async (context: HookContext) => {
  console.log(`Running hook save-profile on ${context.path}.${context.method}`)

  console.log('User created with ID:', context.result, context.data, context.data.id)

  const profile = await context.app.service('profile').create({
    id: context.data.id,
    user_id: context.data.id,
    name: context.params.data.name,
    email: context.params.data.email,
    phone: context.params.data.phone,
    role_id: context.params.data.roleId
  })

  console.log('Profile created with ID:', profile.id)

  context.params.data = { ...context.params.data, profile_id: profile.id }

  return context
}
