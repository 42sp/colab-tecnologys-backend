// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('tasks', (table) => {
		table.uuid('id').primary().unique()
		table.uuid('service_id').nullable()
		table.uuid('worker_id').nullable()
		table.uuid('approver_id').nullable()
		table
			.string('status', 20)
			.notNullable()
			.defaultTo('pending')
			.checkIn(['pending', 'in_progress', 'completed', 'approved', 'rejected'])
		table.date('completion_date')
		table.decimal('task_percentage', 5, 2)
		table.timestamp('created_at').defaultTo(knex.fn.now())
		table.timestamp('updated_at').defaultTo(knex.fn.now())

		table.index(['service_id', 'worker_id', 'approver_id', 'completion_date'])
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('tasks')
}
