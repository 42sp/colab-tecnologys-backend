import { TasksServicesService } from "./tasks_services.class"

export const tasksPath = 'tasks_services'

export const tasksServicesMethods: Array<keyof TasksServicesService> = ['find', 'get', 'create', 'patch', 'remove']
