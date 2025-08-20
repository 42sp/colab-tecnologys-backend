// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('users', (table) => {
		table.string('id').notNullable()

		table.string('email').unique()
		table.string('password')

		table.foreign('id').references('id').inTable('access').onDelete('CASCADE')
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('users')
}
