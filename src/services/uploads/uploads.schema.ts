// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { UploadsService } from './uploads.class'

// Main data model schema
export const uploadsSchema = {
  $id: 'Uploads',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
   
  }
} as const
export type Uploads = FromSchema<typeof uploadsSchema>
export const uploadsValidator = getValidator(uploadsSchema, dataValidator)
export const uploadsResolver = resolve<Uploads, HookContext<UploadsService>>({})

export const uploadsExternalResolver = resolve<Uploads, HookContext<UploadsService>>({})

// Schema for creating new data
export const uploadsDataSchema = {
  $id: 'UploadsData',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    ...uploadsSchema.properties
  }
} as const
export type UploadsData = FromSchema<typeof uploadsDataSchema>
export const uploadsDataValidator = getValidator(uploadsDataSchema, dataValidator)
export const uploadsDataResolver = resolve<UploadsData, HookContext<UploadsService>>({})

// Schema for updating existing data
export const uploadsPatchSchema = {
  $id: 'UploadsPatch',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    ...uploadsSchema.properties
  }
} as const
export type UploadsPatch = FromSchema<typeof uploadsPatchSchema>
export const uploadsPatchValidator = getValidator(uploadsPatchSchema, dataValidator)
export const uploadsPatchResolver = resolve<UploadsPatch, HookContext<UploadsService>>({})

// Schema for allowed query properties
export const uploadsQuerySchema = {
  $id: 'UploadsQuery',
  type: 'object',
  additionalProperties: true,
  properties: {
    ...querySyntax(uploadsSchema.properties)
  }
} as const
export type UploadsQuery = FromSchema<typeof uploadsQuerySchema>
export const uploadsQueryValidator = getValidator(uploadsQuerySchema, queryValidator)
export const uploadsQueryResolver = resolve<UploadsQuery, HookContext<UploadsService>>({})
