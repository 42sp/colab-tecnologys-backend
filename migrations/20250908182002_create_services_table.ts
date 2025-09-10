// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('services', (table) => {
		table.uuid('id').primary().unique()

		table.string('work_id')
		table.string('service_id')

		table.uuid('service_type_id')

		table.string('tower', 50)
		table.string('floor', 50)
		table.string('apartment', 50)
		table.string('measurement_unit', 20)
		table.string('service_description', 200)

		table.string('stage', 100).nullable()
		table.decimal('thickness', 10, 2).nullable()
		table.decimal('labor_quantity', 15, 3).defaultTo(0)
		table.decimal('material_quantity', 15, 3).defaultTo(0)
		table.integer('worker_quantity').defaultTo(0)
		table.decimal('bonus', 15, 2).defaultTo(0)
		table.string('unit_of_measure', 20)
		table.string('material_unit', 20)
		table.boolean('is_active').defaultTo(true)
		table.boolean('is_done').defaultTo(false)

		table.timestamp('created_at').defaultTo(knex.fn.now())
		table.timestamp('updated_at').defaultTo(knex.fn.now())

		table.index(['work_id', 'is_active', 'is_done'])
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('services')
}
