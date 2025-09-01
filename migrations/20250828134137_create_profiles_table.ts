import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('profiles', (table) => {
		table.uuid('id').primary().notNullable().unique()

		table.uuid('user_id').notNullable().unique()

		table.string('name', 100)
		table.string('email', 255)
		table.date('date_of_birth')
		table.string('registration_code', 50).unique()
		table.string('phone', 20)
		table.text('photo')

		table.string('address', 255)
		table.string('city', 100)
		table.string('state', 2)
		table.string('postcode', 15)

		table.timestamp('created_at').defaultTo(knex.fn.now())
		table.timestamp('updated_at').defaultTo(knex.fn.now())
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('profiles')
}
