import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.table('users', (table) => {
		table.uuid('role_id')
		table.foreign('role_id').references('id').inTable('roles')

		table.uuid('profile_id').unique()
		table.foreign('profile_id').references('id').inTable('profiles')

		table.boolean('is_active').defaultTo(true)
		table.boolean('is_available').defaultTo(true)
	})
	await knex.raw(`
    UPDATE users 
    SET role_id = profiles.role_id
    FROM profiles 
    WHERE users.id = profiles.user_id
  `)
	await knex.schema.table('profiles', (table) => {
		table.dropColumn('role_id')
		table.dropColumn('is_active')
		table.dropColumn('is_available')
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.table('profiles', (table) => {
		table.uuid('role_id').references('id').inTable('roles').onDelete('SET NULL')
		table.boolean('is_active').defaultTo(true)
		table.boolean('is_available').defaultTo(true)
	})
	await knex.raw(`
    UPDATE profiles 
    SET role_id = users.role_id
    FROM users 
    WHERE profiles.user_id = users.id
		`)
	await knex.schema.table('users', (table) => {
		table.dropColumn('role_id')
		table.dropColumn('profile_id')
		table.dropColumn('is_active')
		table.dropColumn('is_available')
	})
}
