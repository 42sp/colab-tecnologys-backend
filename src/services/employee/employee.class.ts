// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'
import type { Employee, EmployeeData, EmployeePatch, EmployeeQuery } from './employee.schema'

export type { Employee, EmployeeData, EmployeePatch, EmployeeQuery }

export interface EmployeeServiceOptions {
	app: Application
}

export interface EmployeeParams extends Params<EmployeeQuery> {}

export class EmployeeService<ServiceParams extends EmployeeParams = EmployeeParams>
	implements ServiceInterface<Employee, EmployeeData, ServiceParams, EmployeePatch>
{
	constructor(public options: EmployeeServiceOptions) {}

	async find(_params?: ServiceParams): Promise<Employee[]> {
		return []
	}

	async get(id: Id, _params?: ServiceParams): Promise<Employee> {
		return {
			id: id as number,
			cpf: '000.000.000-00',
			is_active: true,
			is_available: true,
			name: 'Funcionario Mock',
			email: 'mock@example.com',
			phone: '999999999',
			role_id: '0cc1e385-a2b4-4b3a-b1c4-014d9d1016b5',
			date_of_birth: '2000-01-01',
			address: 'Rua Mock',
			city: 'Cidade Mock',
			state: 'ST',
			postcode: '00000000',
			photo: '',
		}
	}

	async create(data: EmployeeData, params?: ServiceParams): Promise<Employee>
	async create(data: EmployeeData[], params?: ServiceParams): Promise<Employee[]>
	async create(
		data: EmployeeData | EmployeeData[],
		params?: ServiceParams,
	): Promise<Employee | Employee[]> {
		return data as any as Employee | Employee[]
	}

	async patch(id: NullableId, data: EmployeePatch, _params?: ServiceParams): Promise<Employee> {
		return { id: id as any, ...data } as Employee
	}

	async remove(id: NullableId, _params?: ServiceParams): Promise<Employee> {
		return {
			id: id as number,
			cpf: '000.000.000-00',
			is_active: true,
			is_available: true,
			name: 'Funcionario Mock',
			email: 'mock@example.com',
			phone: '999999999',
			role_id: '0cc1e385-a2b4-4b3a-b1c4-014d9d1016b5',
			date_of_birth: '2000-01-01',
			address: 'Rua Mock',
			city: 'Cidade Mock',
			state: 'ST',
			postcode: '00000000',
			photo: '',
		}
	}
}

export const getOptions = (app: Application) => {
	return { app }
}
