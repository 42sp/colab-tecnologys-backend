// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../../declarations'
import { dataValidator, queryValidator } from '../../../validators'
import type { TasksReportService } from './report.class'

// Main data model schema
export const tasksReportSchema = {
  $id: 'TasksReport',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'text'],
  properties: {
    id: { type: 'number' },

    text: { type: 'string' }
  }
} as const
export type TasksReport = FromSchema<typeof tasksReportSchema>
export const tasksReportValidator = getValidator(tasksReportSchema, dataValidator)
export const tasksReportResolver = resolve<TasksReport, HookContext<TasksReportService>>({})

export const tasksReportExternalResolver = resolve<
  TasksReport,
  HookContext<TasksReportService>
>({})

// Schema for creating new data
export const tasksReportDataSchema = {
  $id: 'TasksReportData',
  type: 'object',
  additionalProperties: false,
  required: ['text'],
  properties: {
    ...tasksReportSchema.properties
  }
} as const
export type TasksReportData = FromSchema<typeof tasksReportDataSchema>
export const tasksReportDataValidator = getValidator(tasksReportDataSchema, dataValidator)
export const tasksReportDataResolver = resolve<
  TasksReportData,
  HookContext<TasksReportService>
>({})

// Schema for updating existing data
export const tasksReportPatchSchema = {
  $id: 'TasksReportPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...tasksReportSchema.properties
  }
} as const
export type TasksReportPatch = FromSchema<typeof tasksReportPatchSchema>
export const tasksReportPatchValidator = getValidator(tasksReportPatchSchema, dataValidator)
export const tasksReportPatchResolver = resolve<
  TasksReportPatch,
  HookContext<TasksReportService>
>({})

// Schema for allowed query properties
export const tasksReportQuerySchema = {
  $id: 'TasksReportQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(tasksReportSchema.properties)
  }
} as const
export type TasksReportQuery = FromSchema<typeof tasksReportQuerySchema>
export const tasksReportQueryValidator = getValidator(tasksReportQuerySchema, queryValidator)
export const tasksReportQueryResolver = resolve<
  TasksReportQuery,
  HookContext<TasksReportService>
>({})
