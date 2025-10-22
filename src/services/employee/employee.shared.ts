// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Employee, EmployeeData, EmployeePatch, EmployeeQuery, EmployeeService } from './employee.class'

export type { Employee, EmployeeData, EmployeePatch, EmployeeQuery }

export type EmployeeClientService = Pick<
  EmployeeService<Params<EmployeeQuery>>,
  (typeof employeeMethods)[number]
>

export const employeePath = 'employee'

export const employeeMethods: Array<keyof EmployeeService> = ['find', 'get', 'create', 'patch', 'remove']

export const employeeClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(employeePath, connection.service(employeePath), {
    methods: employeeMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [employeePath]: EmployeeClientService
  }
}
