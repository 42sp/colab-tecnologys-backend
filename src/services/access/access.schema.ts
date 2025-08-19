// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { AccessService } from './access.class'

// Main data model schema
export const accessSchema = {
  $id: 'Access',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'registration_code', 'number', 'name', 'password', 'role', 'phoneNumber', 'email', 'cep', 'address', 'city', 'state', 'photo', 'isActive', 'isAvailable', 'area', 'levelAccess', 'workGroup', 'createdAt', 'updatedAt'],
  properties: {
    id: { type: 'string' },

    registration_code: { type: 'string' },
    number: { type: 'number' },
    name: { type: 'string' },
    password: { type: 'string' },
    role: { type: 'string' },
    phoneNumber: { type: 'string' },
    email: { type: 'string' },
    cep: { type: 'string' },
    address: { type: 'string' },
    city: { type: 'string' },
    state: { type: 'string' },
    photo: { type: 'string' },
    isActive: { type: 'boolean' },
    isAvailable: { type: 'boolean' },
    area: { type: 'string' },
    levelAccess: { type: 'string' },
    workGroup: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
  }
} as const
export type Access = FromSchema<typeof accessSchema>
export const accessValidator = getValidator(accessSchema, dataValidator)
export const accessResolver = resolve<Access, HookContext<AccessService>>({})

export const accessExternalResolver = resolve<Access, HookContext<AccessService>>({})

// Schema for creating new data
export const accessDataSchema = {
  $id: 'AccessData',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'registration_code', 'number', 'name', 'password', 'role', 'phoneNumber', 'email', 'cep', 'address', 'city', 'state', 'photo', 'isActive', 'isAvailable', 'area', 'levelAccess', 'workGroup', 'createdAt', 'updatedAt'],
  properties: {
    ...accessSchema.properties
  }
} as const
export type AccessData = FromSchema<typeof accessDataSchema>
export const accessDataValidator = getValidator(accessDataSchema, dataValidator)
export const accessDataResolver = resolve<AccessData, HookContext<AccessService>>({})

// Schema for updating existing data
export const accessPatchSchema = {
  $id: 'AccessPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...accessSchema.properties
  }
} as const
export type AccessPatch = FromSchema<typeof accessPatchSchema>
export const accessPatchValidator = getValidator(accessPatchSchema, dataValidator)
export const accessPatchResolver = resolve<AccessPatch, HookContext<AccessService>>({})

// Schema for allowed query properties
export const accessQuerySchema = {
  $id: 'AccessQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(accessSchema.properties)
  }
} as const
export type AccessQuery = FromSchema<typeof accessQuerySchema>
export const accessQueryValidator = getValidator(accessQuerySchema, queryValidator)
export const accessQueryResolver = resolve<AccessQuery, HookContext<AccessService>>({})
