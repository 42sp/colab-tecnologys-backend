// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('constructions', (table) => {
		table.uuid('id').primary().unique()

		table.string('name', 100).notNullable()
		table.string('address').notNullable()
		table.string('city', 50).notNullable()
		table.string('state', 2).notNullable()
		table.string('zip_code', 9)

		table.date('start_date')
		table.date('expected_end_date')

		table.text('description').nullable()

		table.boolean('is_active').defaultTo(true)

		table.timestamp('created_at').defaultTo(knex.fn.now())
		table.timestamp('updated_at').defaultTo(knex.fn.now())

		table.index(['name', 'city', 'state', 'is_active'])
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('constructions')
}
