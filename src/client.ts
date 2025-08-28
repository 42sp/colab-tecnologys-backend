// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import type { TransportConnection, Application } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
import type { AuthenticationClientOptions } from '@feathersjs/authentication-client'

import { uploadsClient } from './services/uploads/uploads.shared'
export type { Uploads, UploadsData, UploadsQuery, UploadsPatch } from './services/uploads/uploads.shared'

import { uploadClient } from './services/upload/upload.shared'
export type { Upload, UploadData, UploadQuery, UploadPatch } from './services/upload/upload.shared'

import { accessClient } from './services/access/access.shared'
export type { Access, AccessData, AccessQuery, AccessPatch } from './services/access/access.shared'

import { jobsClient } from './services/jobs/jobs.shared'
export type { Jobs, JobsData, JobsQuery, JobsPatch } from './services/jobs/jobs.shared'

import { tasksClient } from './services/tasks/tasks.shared'
export type { Tasks, TasksData, TasksQuery, TasksPatch } from './services/tasks/tasks.shared'

import { userClient } from './services/users/users.shared'
export type { User, UserData, UserQuery, UserPatch } from './services/users/users.shared'

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

  client.configure(userClient)
  client.configure(tasksClient)
  client.configure(jobsClient)
  client.configure(accessClient)
  client.configure(uploadClient)
  client.configure(uploadsClient)
  return client
}
