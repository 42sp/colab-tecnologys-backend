// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { RegisterService } from './register.class'

// Main data model schema
export const registerSchema = {
  $id: 'Register',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'text'],
  properties: {
    id: { type: 'number' },

    text: { type: 'string' }
  }
} as const
export type Register = FromSchema<typeof registerSchema>
export const registerValidator = getValidator(registerSchema, dataValidator)
export const registerResolver = resolve<Register, HookContext<RegisterService>>({})

export const registerExternalResolver = resolve<Register, HookContext<RegisterService>>({})

// Schema for creating new data
export const registerDataSchema = {
  $id: 'RegisterData',
  type: 'object',
  additionalProperties: false,
  required: ['text'],
  properties: {
    ...registerSchema.properties
  }
} as const
export type RegisterData = FromSchema<typeof registerDataSchema>
export const registerDataValidator = getValidator(registerDataSchema, dataValidator)
export const registerDataResolver = resolve<RegisterData, HookContext<RegisterService>>({})

// Schema for updating existing data
export const registerPatchSchema = {
  $id: 'RegisterPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...registerSchema.properties
  }
} as const
export type RegisterPatch = FromSchema<typeof registerPatchSchema>
export const registerPatchValidator = getValidator(registerPatchSchema, dataValidator)
export const registerPatchResolver = resolve<RegisterPatch, HookContext<RegisterService>>({})

// Schema for allowed query properties
export const registerQuerySchema = {
  $id: 'RegisterQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(registerSchema.properties)
  }
} as const
export type RegisterQuery = FromSchema<typeof registerQuerySchema>
export const registerQueryValidator = getValidator(registerQuerySchema, queryValidator)
export const registerQueryResolver = resolve<RegisterQuery, HookContext<RegisterService>>({})
