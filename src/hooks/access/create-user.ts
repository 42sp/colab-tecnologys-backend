import type { HookContext } from '../../declarations'
import { BadRequest } from '@feathersjs/errors'

export const createUser = async (context: HookContext) => {
  // Este hook é executado após criar um registro em 'access'
  const { app, result } = context

  try {
    // Extrai os dados necessários do registro de acesso criado
    const { id, email, password } = result

    // Verifica se os dados necessários existem
    if (!id || !email || !password) {
      throw new BadRequest('Dados incompletos para criação de usuário')
    }

    // Cria um usuário correspondente
    await app.service('users').create({
      id,      // Usa o mesmo ID para manter a relação
      email,   // Usa o mesmo email
      password // Usa a mesma senha
    })

    // Retorna o resultado original para manter a consistência da API
    return context
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    throw error
  }
}
