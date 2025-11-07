import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { Knex } from 'knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import type { Application } from '../../declarations'
import type { Services, ServicesData, ServicesPatch, ServicesQuery } from './services.schema'
import { v4 as uuidv4 } from 'uuid'

export interface ServicesParams extends KnexAdapterParams<ServicesQuery> {}

export interface CsvServiceData {
	work_id: string // Não vem do CSV, mas é injetado pelo sistema
	service_code: string // ← CSV: 'ID'

	tower: string // ← CSV: 'TORRE'
	floor: string // ← CSV: 'PAV'
	apartment: string // ← CSV: 'APTO'
	measurement_unit: string // ← CSV: 'UNIDADE DE MEDIÇÃO'
	service_type_name: string // Mapeia o 'SERVIÇO' do CSV (Estrutura, Alvenaria, Fundação)
	service_description: string

	wall: string // ← CSV: 'PAREDE'
	thickness: number // ← CSV: 'ESPESSURA'

	qty_exec: number // ← CSV: 'QTO EXE'

	qty_material_m2: number // ← CSV: 'QTO MAT (m²)'
	qty_model_m2: number // ← CSV: 'QTO MOD (m²)'

	acronym: string // ← CSV: 'ACRONYM'
}

interface ImportError {
	line: number
	header: string
	value: string | number
	reason: string
}

interface ImportBulkResult {
	importedCount: number
	totalCount: number
	errors: ImportError[]
}

const SERVICE_TYPE_IDS = {
	ESTRUTURA: 'cf5cf0b3-f412-4834-9136-401f713f0ac1',
	ALVENARIA: 'e9f32070-1199-4bbf-8dbc-4d006b8aae6c',
	FUNDACAO: 'f50e06aa-4515-4e38-8ddf-3de72abadf50',
}

export type { Services, ServicesData, ServicesPatch, ServicesQuery }

export interface ServicesParams extends KnexAdapterParams<ServicesQuery> {}

/**
 * Mapeia o nome do serviço para o ID correspondente, garantindo normalização.
 * @param rawServiceName O nome do serviço vindo do CSV (ex: "Alvenaria", "FUNDAÇÃO").
 * @returns O service_type_id (UUID) ou null se não for encontrado.
 */
function mapServiceTypeToId(rawServiceName: string | null | undefined): string | null {
	if (!rawServiceName) return null
	let name = rawServiceName.trim().toUpperCase()

	name = name
		.replace(/Ç/g, 'C')
		.replace(/Ã/g, 'A')
		.replace(/Ô/g, 'O')
		.replace(/[^A-Z\s]/g, '')
	name = name.replace(/\s+/g, '')

	if (name === 'ESTRUTURA') {
		return SERVICE_TYPE_IDS.ESTRUTURA
	}
	if (name === 'ALVENARIA') {
		return SERVICE_TYPE_IDS.ALVENARIA
	}
	if (name === 'FUNDACAO') {
		return SERVICE_TYPE_IDS.FUNDACAO
	} // console.error(`[ImportBulk] Tipo de Serviço inválido (após normalização): "${rawServiceName}" -> "${name}"`);
	return null
}

/**
 * Extrai o número do pavimento e a abreviação "PAV" do texto de pavimento.
 * @param rawFloor O valor de pavimento vindo do CSV (ex: "26º PAVIMENTO - TORRE A").
 * @returns O valor formatado (ex: "26º PAV").
 */
function formatFloor(rawFloor: string): string {
	if (!rawFloor) {
		return ''
	}

	const regex = /^(.*PAV(?:IMENTO)?).*$/i
	const match = rawFloor.trim().match(regex)

	if (match) {
		return match[1].replace(/PAVIMENTO/i, 'PAV').trim()
	}

	return rawFloor.trim()
}

export class ServicesService<ServiceParams extends Params = ServicesParams> extends KnexService<
	Services,
	ServicesData,
	ServicesParams,
	ServicesPatch
> {
	app: Application

	constructor(options: KnexAdapterOptions, app: Application) {
		super(options)
		this.app = app
	}

	async create(data: ServicesData, params?: ServiceParams): Promise<Services>
	async create(data: ServicesData[], params?: ServiceParams): Promise<Services[]>
	async create(
		data: ServicesData | ServicesData[],
		params?: ServiceParams,
	): Promise<Services | Services[]> {
		return super.create(data as any, params)
	}

	/**
	 * Processa a importação em lote de dados de CSV usando Transação Manual (SELECT -> UPDATE/INSERT)
	 */
	async _processImportBulk(data: CsvServiceData[]): Promise<ImportBulkResult> {
		const logger = this.app.get('logger')
		logger.info(`[ImportBulk] Iniciando importação em lote de ${data.length} registros.`)
		const errors: ImportError[] = []
		const validData: ServicesData[] = []
		let totalUpdated = 0
		let totalInserted = 0

		for (let i = 0; i < data.length; i++) {
			const item = data[i]
			const lineNumber = i + 2

			const rawExecution = item.qty_exec
			const executionAcronym = item.acronym?.trim()?.toUpperCase()
			const serviceTypeId = mapServiceTypeToId(item.service_type_name)

			const formattedFloor = formatFloor(item.floor)

			if (!serviceTypeId) {
				errors.push({
					line: lineNumber,
					header: 'SERVIÇO',
					value: item.service_type_name || 'N/A',
					reason:
						'Tipo de Serviço inválido (deve ser Estrutura, Alvenaria ou Fundação). O registro foi ignorado.',
				})
				continue
			}

			if (['M', 'F', 'E'].includes(executionAcronym) && rawExecution > 0) {
				const newServiceId = item.service_code
				const newServiceDescription = item.service_description

				const serviceData: ServicesData = {
					id: uuidv4(),
					work_id: item.work_id,
					service_type_id: serviceTypeId,
					tower: item.tower,
					floor: formattedFloor,
					apartment: item.apartment,
					measurement_unit: item.measurement_unit,
					thickness: item.thickness,
					stage: item.wall,
					material_quantity: item.qty_material_m2,
					worker_quantity: item.qty_model_m2,
					acronym: executionAcronym,
					service_id: newServiceId,
					service_description: newServiceDescription,
					labor_quantity: rawExecution,
					bonus: 0,
					is_active: true,
					is_done: false,
				}

				validData.push(serviceData)
			} else {
				errors.push({
					line: lineNumber,
					header: 'ACRONYM / QTO_EXE',
					value: `${executionAcronym || 'N/A'} / ${rawExecution}`,
					reason:
						'Acrônimo inválido (deve ser M, F ou E) ou Quantidade de Execução (QTO_EXE) é zero. O registro foi ignorado.',
				})
			}
		}
		if (errors.length > 0) {
			logger.warn(`[ImportBulk] ${errors.length} erros de validação encontrados.`)
			return { importedCount: 0, totalCount: data.length, errors: errors }
		} // **********************************
		// BLOCO DE TRANSAÇÃO: SELECT -> UPSERT
		// **********************************

		if (validData.length === 0) {
			return { importedCount: 0, totalCount: data.length, errors: [] }
		}

		const knex = this.Model.client

		try {
			await knex.transaction(async (trx: Knex.Transaction) => {
				logger.info(
					`[ImportBulk] Iniciando transação para processar ${validData.length} registros.`,
				)
				for (const item of validData) {
					// 1. Tenta encontrar o registro pelo par service_id / work_id
					const existing = await trx(this.options.name)
						.where({
							service_id: item.service_id,
							work_id: item.work_id,
						})
						.first()
						// FOR UPDATE bloqueia a linha para evitar problemas de concorrência (race conditions)
						.forUpdate()

					// Prepara os dados para atualização (tudo exceto o ID primário, que já existe)
					const updateData = { ...item }
					delete updateData.id

					if (existing) {
						// Se encontrado: UPDATE
						await trx(this.options.name).where('id', existing.id).update(updateData)

						totalUpdated++
						logger.debug(
							`[ImportBulk] UPDATE (Conflito): service_id ${item.service_id} (Work: ${item.work_id}) atualizado.`,
						)
					} else {
						// Se não encontrado: INSERT
						await trx(this.options.name).insert(item)
						totalInserted++
						logger.debug(
							`[ImportBulk] INSERT: service_id ${item.service_id} (Work: ${item.work_id}) inserido.`,
						)
					}
				}
			})

			const totalAffected = totalInserted + totalUpdated

			logger.info(
				`[ImportBulk] Importação concluída na transação. Total afetado: ${totalAffected}. Inseridos: ${totalInserted}, Atualizados: ${totalUpdated}.`,
			)

			return {
				importedCount: totalAffected,
				totalCount: data.length,
				errors: [],
			}
		} catch (e: any) {
			logger.error(`[ImportBulk] Erro fatal na transação SELECT/UPSERT: ${e.message}`, e)

			return {
				importedCount: 0,
				totalCount: data.length,
				errors: [
					{
						line: 1,
						header: 'DB_FATAL_TRANSACTION',
						value: 'N/A',
						reason: `Erro na transação: ${e.message}. Todos os dados foram revertidos.`,
					},
				],
			}
		}
	}
}

export const getOptions = (app: Application): KnexAdapterOptions => {
	return {
		paginate: false,
		Model: app.get('postgresqlClient'),
		name: 'services',
		multi: ['create'],
	}
}
