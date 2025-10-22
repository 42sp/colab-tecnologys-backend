// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  employeeDataValidator,
  employeePatchValidator,
  employeeQueryValidator,
  employeeResolver,
  employeeExternalResolver,
  employeeDataResolver,
  employeePatchResolver,
  employeeQueryResolver
} from './employee.schema'

import type { Application } from '../../declarations'
import { EmployeeService, getOptions } from './employee.class'
import { employeePath, employeeMethods } from './employee.shared'
import { createEmployee, patchEmployee } from './employee.hooks'  

export * from './employee.class'
export * from './employee.schema'


export const employee = (app: Application) => {

  app.use(employeePath, new EmployeeService(getOptions(app)), {

    methods: employeeMethods,

    events: []
  })

  app.service(employeePath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(employeeExternalResolver),
        schemaHooks.resolveResult(employeeResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(employeeQueryValidator),
        schemaHooks.resolveQuery(employeeQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(employeeDataValidator),
        schemaHooks.resolveData(employeeDataResolver),
      ],
      patch: [
        schemaHooks.validateData(employeePatchValidator),
        schemaHooks.resolveData(employeePatchResolver),
        patchEmployee
      ],
      remove: []
    },
    after: {
      all: [],
      create: [createEmployee]
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [employeePath]: EmployeeService
  }
}
