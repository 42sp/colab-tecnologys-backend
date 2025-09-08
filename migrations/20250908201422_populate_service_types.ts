import { Knex } from 'knex'
import { v4 as uuidv4 } from 'uuid'

export async function up(knex: Knex): Promise<void> {
	await knex('service_types').insert([
		{
			id: uuidv4(),
			service_name: 'Fundação',
			service_description: 'Serviços de fundação e estruturas de base',
			is_active: true,
		},
		{
			id: uuidv4(),
			service_name: 'Estrutura',
			service_description: 'Estrutura metálica, concreto armado e lajes',
			is_active: true,
		},
		{
			id: uuidv4(),
			service_name: 'Alvenaria',
			service_description: 'Vedação, paredes e divisórias em alvenaria',
			is_active: true,
		},
	])
}

export async function down(knex: Knex): Promise<void> {
	await knex('service_types')
		.whereIn('service_name', ['Fundação', 'Estrutura', 'Alvenaria'])
		.delete()
}
