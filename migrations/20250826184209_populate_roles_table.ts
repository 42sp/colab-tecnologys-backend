import type { Knex } from 'knex'
import { v4 as uuidv4 } from 'uuid'

export async function up(knex: Knex): Promise<void> {
	await knex('roles').insert([
		{
			id: uuidv4(),
			role_name: 'admin',
			role_description: 'Acesso total ao sistema',
			hierarchy_level: 100,
			is_active: true,
		},
		{
			id: uuidv4(),
			role_name: 'worker',
			role_description: 'Acesso básico ao sistema',
			hierarchy_level: 10,
			is_active: true,
		},
		{
			id: uuidv4(),
			role_name: 'oficial',
			role_description: 'Acesso moderado ao sistema',
			hierarchy_level: 50,
			is_active: true,
		},
	])
}

export async function down(knex: Knex): Promise<void> {
	await knex('roles').whereIn('role_name', ['admin', 'worker', 'oficial']).del()
}
