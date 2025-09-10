import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.table('services', (table) => {
		table.foreign('service_type_id').references('id').inTable('service_types')
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.table('services', (table) => {
		table.dropForeign('service_type_id')
	})
}
