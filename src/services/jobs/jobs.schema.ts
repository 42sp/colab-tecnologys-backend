// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { JobsService } from './jobs.class'

// Main data model schema
export const jobsSchema = {
  $id: 'Jobs',
  type: 'object',
  additionalProperties: false,
  required: [
    'id',
    'id_service',
    'tower',
    'floor_number',
    'floor',
    'apartment',
    'classification',
    'service',
    'service_type',
    'wall',
    'thickness',
    'mdo_quantity',
    'material_quantity',
    'worker_quantity',
    'bonus',
    'unit_of_measure',
    'unit_of_material',
    'active'
  ],
  properties: {
    id: { type: 'number' },

    id_service: { type: 'string' },
    tower: { type: 'number' },
    floor_number: { type: 'number' },
    floor: { type: 'string' },
    apartment: { type: 'number' },
    classification: { type: 'string' },
    service: { type: 'string' },
    service_type: { type: 'string' },
    wall: { type: 'string' },
    thickness: { type: 'number' },
    mdo_quantity: { type: 'number' },
    material_quantity: { type: 'number' },
    worker_quantity: { type: 'number' },
    bonus: { type: 'number' },
    unit_of_measure: { type: 'string' },
    unit_of_material: { type: 'string' },
    active: { type: 'boolean' }
  }
} as const
export type Jobs = FromSchema<typeof jobsSchema>
export const jobsValidator = getValidator(jobsSchema, dataValidator)
export const jobsResolver = resolve<Jobs, HookContext<JobsService>>({})

export const jobsExternalResolver = resolve<Jobs, HookContext<JobsService>>({})

// Schema for creating new data
export const jobsDataSchema = {
  $id: 'JobsData',
  type: 'object',
  additionalProperties: false,
  required: [
    'id_service',
    'tower',
    'floor_number',
    'floor',
    'apartment',
    'classification',
    'service',
    'service_type',
    'wall',
    'thickness',
    'mdo_quantity',
    'material_quantity',
    'worker_quantity',
    'bonus',
    'unit_of_measure',
    'unit_of_material',
    'active'
  ],
  properties: {
    ...jobsSchema.properties
  }
} as const
export type JobsData = FromSchema<typeof jobsDataSchema>
export const jobsDataValidator = getValidator(jobsDataSchema, dataValidator)
export const jobsDataResolver = resolve<JobsData, HookContext<JobsService>>({})

// Schema for updating existing data
export const jobsPatchSchema = {
  $id: 'JobsPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...jobsSchema.properties
  }
} as const
export type JobsPatch = FromSchema<typeof jobsPatchSchema>
export const jobsPatchValidator = getValidator(jobsPatchSchema, dataValidator)
export const jobsPatchResolver = resolve<JobsPatch, HookContext<JobsService>>({})

// Schema for allowed query properties
export const jobsQuerySchema = {
  $id: 'JobsQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(jobsSchema.properties)
  }
} as const
export type JobsQuery = FromSchema<typeof jobsQuerySchema>
export const jobsQueryValidator = getValidator(jobsQuerySchema, queryValidator)
export const jobsQueryResolver = resolve<JobsQuery, HookContext<JobsService>>({})
