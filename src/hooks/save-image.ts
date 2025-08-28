// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'

export const saveImage = async (context: HookContext) => {
  console.log(`Running hook save-image on ${context.path}.${context.method}`)
  console.log('data', context.result.id)

  context.app.service("upload").create({
     text: context.result.id
  })

}
