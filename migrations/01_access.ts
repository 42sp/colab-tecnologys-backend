// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('access', (table) => {
		table.string('id').primary()

		table.integer('registration_code').unique()
		table.integer('number').unique()
		table.string('name').notNullable().unique()
		table.string('password').notNullable()
		table.string('role')
		table.string('phoneNumber')
		table.string('email').unique().notNullable()
		table.string('cep')
		table.string('address')
		table.string('city')
		table.string('state')
		table.string('photo')
		table.boolean('isActive')
		table.boolean('isAvailable')
		table.string('area')
		table.string('levelAccess')
		table.string('workGroup')
		table.timestamp('createdAt').defaultTo(knex.fn.now())
		table.timestamp('updatedAt').defaultTo(knex.fn.now())
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('access')
}
