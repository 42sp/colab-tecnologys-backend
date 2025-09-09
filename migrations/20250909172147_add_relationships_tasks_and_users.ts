import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.table('tasks', (table) => {
		table.foreign('service_id').references('id').inTable('services').onDelete('SET NULL')
		table.foreign('worker_id').references('id').inTable('users').onDelete('SET NULL')
		table.foreign('approver_id').references('id').inTable('users').onDelete('SET NULL')
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.table('tasks', (table) => {
		table.dropForeign('service_id')
		table.dropForeign('worker_id')
		table.dropForeign('approver_id')
	})
}
