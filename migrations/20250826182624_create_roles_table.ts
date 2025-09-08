import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('roles', (table) => {
		table.uuid('id').primary()

		table.string('role_name', 50).notNullable()
		table.text('role_description')

		table.integer('hierarchy_level').notNullable().defaultTo(0)

		table.boolean('is_active').defaultTo(true)

		table.timestamp('created_at').defaultTo(knex.fn.now())
		table.timestamp('updated_at').defaultTo(knex.fn.now())

		table.index(['role_name', 'hierarchy_level'])
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('roles')
}
