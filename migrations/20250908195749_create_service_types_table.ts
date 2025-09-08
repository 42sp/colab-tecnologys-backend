import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('service_types', (table) => {
		table.uuid('id').primary()

		table.string('service_name', 50).notNullable()
		table.text('service_description')

		table.boolean('is_active').defaultTo(true)

		table.timestamp('created_at').defaultTo(knex.fn.now())
		table.timestamp('updated_at').defaultTo(knex.fn.now())

		table.index('service_name')
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('service_types')
}
