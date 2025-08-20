// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('jobs', (table) => {
		table.increments('id')

		table.string('id_service').unique()
		table.integer('tower')
		table.integer('floor_number')
		table.string('floor')
		table.integer('apartment')
		table.string('classification')
		table.string('service')
		table.string('service_type')
		table.string('wall')
		table.integer('thickness')
		table.integer('mdo_quantity')
		table.integer('material_quantity')
		table.integer('worker_quantity')
		table.integer('bonus')
		table.string('unit_of_measure')
		table.string('unit_of_material')
		table.boolean('active')
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('jobs')
}
