import { v4 as uuidv4 } from 'uuid'
import { GeneralError } from '@feathersjs/errors'
import type { HookContext } from '../declarations'

export const createProfileAfterUser = async (context: HookContext): Promise<HookContext> => {
  const { data, result: user, app } = context

  try {
    console.log('👤 [HOOK] Executando createProfileAfterUser...')

    // 🔹 Log do data original enviado pelo frontend
    console.log('🔹 context.data (dados originais enviados pelo frontend):', data)

    // 🔹 Log do result do usuário criado pelo UsersService
    console.log('🔹 context.result (usuário criado, antes do profile):', user)

    // 🔹 Verifica se password ainda está presente em result
    if ('password' in user) {
      console.warn('⚠️ Atenção: password encontrado no result do usuário!', user.password)
    } else {
      console.log('✅ Nenhum password encontrado no result do usuário.')
    }

    // 🔹 Criar payload apenas com campos permitidos para profile
    const { password, ...cleanUser } = user as any // remove password caso exista
    const profilePayload = {
      id: uuidv4(),
      user_id: cleanUser.id,
      name: cleanUser.name,
      email: cleanUser.email,
      phone: cleanUser.phone,
      date_of_birth: cleanUser.date_of_birth,
      photo: cleanUser.photo,
      address: cleanUser.address,
      city: cleanUser.city,
      state: cleanUser.state,
      postcode: cleanUser.postcode,
      role_id: cleanUser.roleId,
    }

    console.log('📄 [HOOK] Payload final enviado para PROFILE:', profilePayload)

    const profile = await app.service('profile').create(profilePayload)
    console.log('✅ [HOOK] Perfil criado com sucesso:', profile.id)

    // 🔹 Retorna somente dados públicos + profile
    context.result = {
      id: cleanUser.id,
      name: cleanUser.name,
      email: cleanUser.email,
      profile,
    }

    return context
  } catch (error: any) {
    console.error('❌ [HOOK] Erro ao criar perfil:', error)
    throw new GeneralError('Erro ao criar o perfil vinculado ao usuário', {
      original: error.message,
    })
  }
}
