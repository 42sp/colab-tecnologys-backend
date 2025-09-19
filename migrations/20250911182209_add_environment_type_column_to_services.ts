import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.table('services', (table) => {
		table.string('environment_type')
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.table('services', (table) => {
		table.dropColumn('environment_type')
	})
}
