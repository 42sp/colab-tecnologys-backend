import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.table('services', (table) => {
		table.foreign('work_id').references('id').inTable('constructions').onDelete('SET NULL')
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.table('services', (table) => {
		table.dropForeign('work_id')
	})
}
