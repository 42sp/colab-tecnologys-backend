import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('users', (table) => {
		table.uuid('id').primary().unique()

		table.string('cpf', 11).notNullable().unique()
		table.string('password').notNullable()

		table.uuid('role_id')
		table.foreign('role_id').references('id').inTable('roles')

		table.uuid('profile_id').unique()

		table.boolean('is_active').defaultTo(true)
		table.boolean('is_available').defaultTo(true)

		table.timestamp('created_at').defaultTo(knex.fn.now())
		table.timestamp('updated_at').defaultTo(knex.fn.now())
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('users')
}
