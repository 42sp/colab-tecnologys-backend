import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable('profiles', (table) => {
		table.uuid('role_id').nullable()
	})

	await knex.raw(`
    UPDATE profiles
    SET role_id = users.role_id
    FROM users
    WHERE profiles.user_id = users.id
  `)

	await knex.schema.alterTable('users', (table) => {
		table.dropColumn('role_id')
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable('users', (table) => {
		table.uuid('role_id').nullable()
	})

	await knex.raw(`
    UPDATE users
    SET role_id = profiles.role_id
    FROM profiles
    WHERE profiles.user_id = users.id
  `)

	await knex.schema.alterTable('profiles', (table) => {
		table.dropColumn('role_id')
	})
}
