import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
	await knex.schema.table('services', (table) => {
		table.string('acronym', 2)
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.table('services', (table) => {
		table.dropColumn('acronym')
	})
}

