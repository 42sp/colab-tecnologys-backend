// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  TasksReport,
  TasksReportData,
  TasksReportPatch,
  TasksReportQuery,
  TasksReportService
} from './report.class'

export type { TasksReport, TasksReportData, TasksReportPatch, TasksReportQuery }

export type TasksReportClientService = Pick<
  TasksReportService<Params<TasksReportQuery>>,
  (typeof tasksReportMethods)[number]
>

export const tasksReportPath = 'tasks/report'

export const tasksReportMethods: Array<keyof TasksReportService> = [
  'find',
  'get',
  'create',
  'patch',
  'remove'
]

export const tasksReportClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(tasksReportPath, connection.service(tasksReportPath), {
    methods: tasksReportMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [tasksReportPath]: TasksReportClientService
  }
}
