// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { WaterMelonSyncService } from './water-melon-sync.class'

// Main data model schema
export const waterMelonSyncSchema = {
  $id: 'WaterMelonSync',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    id: { type: 'string' },
    changes: { type: 'object' },
    timestamp: { type: 'number' }
  }
} as const
export type WaterMelonSync = FromSchema<typeof waterMelonSyncSchema>
export const waterMelonSyncValidator = getValidator(waterMelonSyncSchema, dataValidator)
export const waterMelonSyncResolver = resolve<WaterMelonSync, HookContext<WaterMelonSyncService>>({})

export const waterMelonSyncExternalResolver = resolve<WaterMelonSync, HookContext<WaterMelonSyncService>>({})

// Schema for creating new data
export const waterMelonSyncDataSchema = {
  $id: 'WaterMelonSyncData',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    changes: { type: 'object' }
  }
} as const
export type WaterMelonSyncData = FromSchema<typeof waterMelonSyncDataSchema>
export const waterMelonSyncDataValidator = getValidator(waterMelonSyncDataSchema, dataValidator)
export const waterMelonSyncDataResolver = resolve<WaterMelonSyncData, HookContext<WaterMelonSyncService>>({})

// Schema for updating existing data
export const waterMelonSyncPatchSchema = {
  $id: 'WaterMelonSyncPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...waterMelonSyncSchema.properties
  }
} as const
export type WaterMelonSyncPatch = FromSchema<typeof waterMelonSyncPatchSchema>
export const waterMelonSyncPatchValidator = getValidator(waterMelonSyncPatchSchema, dataValidator)
export const waterMelonSyncPatchResolver = resolve<WaterMelonSyncPatch, HookContext<WaterMelonSyncService>>(
  {}
)

// Schema for allowed query properties
export const waterMelonSyncQuerySchema = {
  $id: 'WaterMelonSyncQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
		lastPulledAt: { type: 'number' },
    schemaVersion: { type: 'number' },
    migration: { type: 'string' },
    ...querySyntax({})
  }
} as const
export type WaterMelonSyncQuery = FromSchema<typeof waterMelonSyncQuerySchema>
export const waterMelonSyncQueryValidator = getValidator(waterMelonSyncQuerySchema, queryValidator)
export const waterMelonSyncQueryResolver = resolve<WaterMelonSyncQuery, HookContext<WaterMelonSyncService>>(
  {}
)
