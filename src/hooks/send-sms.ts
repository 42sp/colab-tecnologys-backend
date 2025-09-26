// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import axios from 'axios'
import type { HookContext } from '../declarations'
import { env } from 'process'

export const sendSms = async (context: HookContext) => {
  console.log(`Running hook send-sms on ${context.path}.${context.method}`)

  if (!context.data.phone) {
    console.log('No phone number provided, skipping SMS sending.')
    return context
  }

  const url = env.SMS_URL as string
  const apiKey = env.SMS_API_KEY
  const body = {
    "content": `Seu código de acesso é ${context.result.code}`,
    "encrypted": false,
    "from": "+5513996901046",
    "to": `+55${context.data.phone}`,
  }

  try {
    const response = await axios.post(url, body, {
      headers: {
        'x-api-Key': apiKey,
        'Content-Type': 'application/json'
      }
    })
    console.log('SMS enviado:', response.data)
  } catch (error) {
    console.error('Erro ao enviar SMS:', error)
  }
}
