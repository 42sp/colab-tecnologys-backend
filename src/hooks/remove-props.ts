// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'

export const removeProps = async (context: HookContext) => {
  console.log(`Running hook remove-props on ${context.path}.${context.method}`)

    if (context.data) {

      const keysToKeep = ['cpf', 'password']; 

      context.params = { ...context.params, data: context.data };

      const objects = Object.fromEntries(
        Object.entries(context.data).filter(([key]) => keysToKeep.includes(key))
      );

      context.data = objects;

    }
    return context;

}
