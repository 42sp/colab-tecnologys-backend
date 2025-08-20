import { access } from './access/access'
import { jobs } from './jobs/jobs'
import { tasks } from './tasks/tasks'
import { user } from './users/users'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
	app.configure(access)
	app.configure(jobs)
	app.configure(tasks)
	app.configure(user)
	// All services will be registered here
}
