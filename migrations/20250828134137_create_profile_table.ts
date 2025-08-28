import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('profile', (table) => {
		table.uuid('id').primary().unique()

		table.string('name', 100)
		table.date('date_of_birth')
		table.string('cpf', 11).unique()
		table.string('registration_code', 50).unique()
		table.string('phone', 20)
		table.text('photo')

		table.string('address', 255)
		table.string('city', 100)
		table.string('state', 2)
		table.string('postcode', 15)

		table.uuid('user_id').notNullable().unique()
		table.foreign('user_id').references('id').inTable('users')

		table.uuid('role_id')
		table.foreign('role_id').references('id').inTable('roles')

		table.boolean('is_active').defaultTo(true)
		table.boolean('is_available').defaultTo(true)

		table.timestamp('created_at').defaultTo(knex.fn.now())
		table.timestamp('updated_at').defaultTo(knex.fn.now())
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('profile')
}
