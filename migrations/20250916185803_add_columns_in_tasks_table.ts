import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable('tasks', (table) => {
		table.string('worker_name').nullable()
		table.string('construction_name').nullable()
		table.string('construction_address').nullable()
		table.string('service_tower').nullable()
		table.string('service_apartment').nullable()
		table.string('service_floor').nullable()
		table.string('service_stage').nullable()
		table.string('service_type').nullable()
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable('tasks', (table) => {
		table.dropColumn('worker_name')
		table.dropColumn('construction_name')
		table.dropColumn('construction_address')
		table.dropColumn('service_tower')
		table.dropColumn('service_apartment')
		table.dropColumn('service_floor')
		table.dropColumn('service_stage')
		table.dropColumn('service_type')
	})
}
