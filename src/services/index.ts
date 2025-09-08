import { serviceTypes } from './service-types/service-types'
import { services as jobs } from './services/services'
import { passwordRecovery } from './password-recovery/password-recovery'
import { roles } from './roles/roles'
import { uploads } from './uploads/uploads'
import { profile } from './profile/profile'
import { users } from './users/users'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(serviceTypes)
  app.configure(jobs)
  app.configure(passwordRecovery)
  app.configure(roles)
  app.configure(uploads)
  app.configure(profile)
  app.configure(users)
  // All services will be registered here
}
