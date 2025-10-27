import { KnexAdapterOptions, KnexAdapterParams, KnexService } from "@feathersjs/knex"
import type { Params } from "@feathersjs/feathers"
import { TasksServices, TasksServicesData, TasksServicesPatch, TasksServicesQuery } from "./tasks_services.schema"
import { Application } from "@feathersjs/express"

export interface TasksServicesParams extends KnexAdapterParams<TasksServicesQuery> {}

export class TasksServicesService<ServiceParams extends Params = TasksServicesParams> extends KnexService<
	TasksServices,
	TasksServicesData,
	TasksServicesParams,
	TasksServicesPatch
> {
	async find(params?: TasksServicesParams): Promise<any> {
		const query = this.createQuery(params)
			.leftJoin('services', 'tasks.service_id', '=', 'services.id')
			.select(
				'tasks.id',
				'tasks.service_id',
				'tasks.worker_id',
				'tasks.approver_id',
				'tasks.status',
				'tasks.completion_date',
				'tasks.task_percentage',
				'tasks.created_at',
				'tasks.updated_at',
				'services.id as service_id_full',
				'services.work_id as service_work_id',
				'services.service_id as service_service_id',
				'services.tower as service_tower',
				'services.apartment as service_apartment',
				'services.floor as service_floor',
				'services.stage as service_stage',
				'services.measurement_unit as service_measurement_unit',
				'services.service_description as service_description',
				'services.thickness as service_thickness',
				'services.labor_quantity as service_labor_quantity',
				'services.material_quantity as service_material_quantity',
				'services.worker_quantity as service_worker_quantity',
				'services.bonus as service_bonus',
				'services.unit_of_measure as service_unit_of_measure',
				'services.material_unit as service_material_unit',
				'services.acronym as service_acronym',
				'services.environment_type as service_environment_type',
				'services.is_active as service_is_active',
				'services.is_done as service_is_done'
			)

		return await query
	}

	async get(id: string, params?: TasksServicesParams): Promise<any> {
		const query = this.createQuery(params)
			.leftJoin('services', 'tasks.service_id', '=', 'services.id')
			.where('tasks.id', id)
			.select(
				'tasks.id',
				'tasks.service_id',
				'tasks.worker_id',
				'tasks.approver_id',
				'tasks.status',
				'tasks.completion_date',
				'tasks.task_percentage',
				'tasks.created_at',
				'tasks.updated_at',
				'services.id as service_id_full',
				'services.work_id as service_work_id',
				'services.service_id as service_service_id',
				'services.tower as service_tower',
				'services.apartment as service_apartment',
				'services.floor as service_floor',
				'services.stage as service_stage',
				'services.measurement_unit as service_measurement_unit',
				'services.service_description as service_description',
				'services.thickness as service_thickness',
				'services.labor_quantity as service_labor_quantity',
				'services.material_quantity as service_material_quantity',
				'services.worker_quantity as service_worker_quantity',
				'services.bonus as service_bonus',
				'services.unit_of_measure as service_unit_of_measure',
				'services.material_unit as service_material_unit',
				'services.acronym as service_acronym',
				'services.environment_type as service_environment_type',
				'services.is_active as service_is_active',
				'services.is_done as service_is_done'
			)
			.first()

		return query
	}
}

export const getOptions = (app: Application): KnexAdapterOptions => {
	return {
		// paginate: app.get('paginate'),
		paginate: false,
		Model: app.get('postgresqlClient'),
		name: 'tasks',
	}
}