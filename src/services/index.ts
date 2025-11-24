import { waterMelonSyncUnallowed } from './water-melon-sync-unallowed/water-melon-sync-unallowed'
import { waterMelonSync } from './water-melon-sync/water-melon-sync'
import { register } from './register/register'
import { tasksReport } from './report/report'
import { employee } from './employee/employee'
import { constructions } from './constructions/constructions'
import { tasks } from './tasks/tasks'
import { serviceTypes } from './service-types/service-types'
import { services as jobs } from './services/services'
import { passwordRecovery } from './password-recovery/password-recovery'
import { roles } from './roles/roles'
import { uploads } from './uploads/uploads'
import { profile } from './profile/profile'
import { users } from './users/users'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'
import { tasksServices } from './tasks_services/tasks_services'

export const services = (app: Application) => {
  app.configure(waterMelonSyncUnallowed)
  app.configure(waterMelonSync)
  app.configure(register)
  app.configure(tasksReport)
  app.configure(employee)
  app.configure(constructions)
  app.configure(tasks)
  app.configure(serviceTypes)
  app.configure(jobs)
  app.configure(passwordRecovery)
  app.configure(roles)
  app.configure(uploads)
  app.configure(profile)
  app.configure(users)
  app.configure(tasksServices)
}
