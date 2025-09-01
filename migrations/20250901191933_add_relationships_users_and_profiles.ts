import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.table('users', (table) => {
		table.foreign('profile_id').references('id').inTable('profiles')
	})
	await knex.schema.table('profiles', (table) => {
		table.foreign('user_id').references('id').inTable('users')
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.table('users', (table) => {
		table.dropForeign('profile_id')
	})
	await knex.schema.table('profiles', (table) => {
		table.dropForeign('user_id')
	})
}
