import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable('services', (table) => {
		table.decimal('worker_quantity', 15, 4).defaultTo(0).alter()
	})
}


export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable('services', function (table) {
		table.integer('worker_quantity').defaultTo(0).alter()
	  });
}

