// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { WaterMelonSyncUnallowedService } from './water-melon-sync-unallowed.class'

// Main data model schema
export const waterMelonSyncUnallowedSchema = {
  $id: 'WaterMelonSyncUnallowed',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'text'],
  properties: {
    id: { type: 'number' },

    text: { type: 'string' }
  }
} as const
export type WaterMelonSyncUnallowed = FromSchema<typeof waterMelonSyncUnallowedSchema>
export const waterMelonSyncUnallowedValidator = getValidator(waterMelonSyncUnallowedSchema, dataValidator)
export const waterMelonSyncUnallowedResolver = resolve<
  WaterMelonSyncUnallowed,
  HookContext<WaterMelonSyncUnallowedService>
>({})

export const waterMelonSyncUnallowedExternalResolver = resolve<
  WaterMelonSyncUnallowed,
  HookContext<WaterMelonSyncUnallowedService>
>({})

// Schema for creating new data
export const waterMelonSyncUnallowedDataSchema = {
  $id: 'WaterMelonSyncUnallowedData',
  type: 'object',
  additionalProperties: false,
  required: ['text'],
  properties: {
    ...waterMelonSyncUnallowedSchema.properties
  }
} as const
export type WaterMelonSyncUnallowedData = FromSchema<typeof waterMelonSyncUnallowedDataSchema>
export const waterMelonSyncUnallowedDataValidator = getValidator(
  waterMelonSyncUnallowedDataSchema,
  dataValidator
)
export const waterMelonSyncUnallowedDataResolver = resolve<
  WaterMelonSyncUnallowedData,
  HookContext<WaterMelonSyncUnallowedService>
>({})

// Schema for updating existing data
export const waterMelonSyncUnallowedPatchSchema = {
  $id: 'WaterMelonSyncUnallowedPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...waterMelonSyncUnallowedSchema.properties
  }
} as const
export type WaterMelonSyncUnallowedPatch = FromSchema<typeof waterMelonSyncUnallowedPatchSchema>
export const waterMelonSyncUnallowedPatchValidator = getValidator(
  waterMelonSyncUnallowedPatchSchema,
  dataValidator
)
export const waterMelonSyncUnallowedPatchResolver = resolve<
  WaterMelonSyncUnallowedPatch,
  HookContext<WaterMelonSyncUnallowedService>
>({})

// Schema for allowed query properties
export const waterMelonSyncUnallowedQuerySchema = {
  $id: 'WaterMelonSyncUnallowedQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(waterMelonSyncUnallowedSchema.properties)
  }
} as const
export type WaterMelonSyncUnallowedQuery = FromSchema<typeof waterMelonSyncUnallowedQuerySchema>
export const waterMelonSyncUnallowedQueryValidator = getValidator(
  waterMelonSyncUnallowedQuerySchema,
  queryValidator
)
export const waterMelonSyncUnallowedQueryResolver = resolve<
  WaterMelonSyncUnallowedQuery,
  HookContext<WaterMelonSyncUnallowedService>
>({})
