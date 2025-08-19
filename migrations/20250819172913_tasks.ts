// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tasks', table => {
    table.increments('id')

    table.string('id_service')
    table.date('date_performed_service')
    table.date('date_launched_service')
    table.float('percentage')
    table.string('worker')
    table.integer('registration_code')
    table.integer('number')
    table.string('approver_id')

    table.foreign('id_service').references('id_service').inTable('jobs')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tasks')
}
