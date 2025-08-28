// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { UploadService } from './upload.class'

// Main data model schema
export const uploadSchema = {
  $id: 'Upload',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {

  }
} as const
export type Upload = FromSchema<typeof uploadSchema>
export const uploadValidator = getValidator(uploadSchema, dataValidator)
export const uploadResolver = resolve<Upload, HookContext<UploadService>>({})

export const uploadExternalResolver = resolve<Upload, HookContext<UploadService>>({})

// Schema for creating new data
export const uploadDataSchema = {
  $id: 'UploadData',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    ...uploadSchema.properties
  }
} as const
export type UploadData = FromSchema<typeof uploadDataSchema>
export const uploadDataValidator = getValidator(uploadDataSchema, dataValidator)
export const uploadDataResolver = resolve<UploadData, HookContext<UploadService>>({})

// Schema for updating existing data
export const uploadPatchSchema = {
  $id: 'UploadPatch',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    ...uploadSchema.properties
  }
} as const
export type UploadPatch = FromSchema<typeof uploadPatchSchema>
export const uploadPatchValidator = getValidator(uploadPatchSchema, dataValidator)
export const uploadPatchResolver = resolve<UploadPatch, HookContext<UploadService>>({})

// Schema for allowed query properties
export const uploadQuerySchema = {
  $id: 'UploadQuery',
  type: 'object',
  additionalProperties: true,
  properties: {
    ...querySyntax(uploadSchema.properties)
  }
} as const
export type UploadQuery = FromSchema<typeof uploadQuerySchema>
export const uploadQueryValidator = getValidator(uploadQuerySchema, queryValidator)
export const uploadQueryResolver = resolve<UploadQuery, HookContext<UploadService>>({})
