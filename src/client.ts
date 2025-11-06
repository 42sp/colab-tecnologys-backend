// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import type { TransportConnection, Application } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
import type { AuthenticationClientOptions } from '@feathersjs/authentication-client'

import { tasksReportClient } from './services/report/report.shared'
export type {
  TasksReport,
  TasksReportData,
  TasksReportQuery,
  TasksReportPatch

} from './services/report/report.shared'


import { employeeClient } from './services/employee/employee.shared'
export type {
  Employee,
  EmployeeData,
  EmployeeQuery,
  EmployeePatch
} from './services/employee/employee.shared'

import { constructionsClient } from './services/constructions/constructions.shared'
export type {
  Constructions,
  ConstructionsData,
  ConstructionsQuery,
  ConstructionsPatch
} from './services/constructions/constructions.shared'

import { tasksClient } from './services/tasks/tasks.shared'
export type { Tasks, TasksData, TasksQuery, TasksPatch } from './services/tasks/tasks.shared'

import { serviceTypesClient } from './services/service-types/service-types.shared'
export type {
  ServiceTypes as JobsTypes,
  ServiceTypesData,
  ServiceTypesQuery,
  ServiceTypesPatch
} from './services/service-types/service-types.shared'

import { servicesClient } from './services/services/services.shared'
export type {
  Services,
  ServicesData,
  ServicesQuery,
  ServicesPatch
} from './services/services/services.shared'

import { passwordRecoveryClient } from './services/password-recovery/password-recovery.shared'
export type {
  PasswordRecovery,
  PasswordRecoveryData
} from './services/password-recovery/password-recovery.shared'

import { rolesClient } from './services/roles/roles.shared'
export type { Roles, RolesData, RolesQuery, RolesPatch } from './services/roles/roles.shared'

import { uploadsClient } from './services/uploads/uploads.shared'
export type { Uploads, UploadsData, UploadsQuery, UploadsPatch } from './services/uploads/uploads.shared'

import { profileClient } from './services/profile/profile.shared'
export type { Profile, ProfileData, ProfileQuery, ProfilePatch } from './services/profile/profile.shared'

import { usersClient } from './services/users/users.shared'
export type { Users, UsersData, UsersQuery, UsersPatch } from './services/users/users.shared'


export interface Configuration {
  connection: TransportConnection<ServiceTypes>
}

export interface ServiceTypes {}

export type ClientApplication = Application<ServiceTypes, Configuration>

/**
 * Returns a typed client for the colab-tecnologys-backend app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = <Configuration = any,>(
  connection: TransportConnection<ServiceTypes>,
  authenticationOptions: Partial<AuthenticationClientOptions> = {}
) => {
  const client: ClientApplication = feathers()

  client.configure(connection)
  client.configure(authenticationClient(authenticationOptions))
  client.set('connection', connection)

  client.configure(usersClient)
  client.configure(profileClient)
  client.configure(uploadsClient)
  client.configure(rolesClient)
  client.configure(passwordRecoveryClient)
  client.configure(servicesClient)
  client.configure(serviceTypesClient)
  client.configure(tasksClient)
  client.configure(constructionsClient)
  client.configure(employeeClient)
  client.configure(tasksReportClient)
  return client
}
