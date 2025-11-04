import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import type { Application } from '../../declarations'
import type { Services, ServicesData, ServicesPatch, ServicesQuery } from './services.schema'
import { v4 as uuidv4 } from 'uuid'

export interface ServicesParams extends KnexAdapterParams<ServicesQuery> {}

export interface CsvServiceData {
    work_id: string //uuid da construção
    service_code: string //id do serviço ex: 2637259

    tower: string
    floor: string
    apartment: string
    measurement_unit: string
    service_description: string

    wall: string
    thickness: number

    marking_m: number
    fixation_m: number
    elevation_m2: number

    qty_material_m2: number
    qty_model_m2: number
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

export type { Services, ServicesData, ServicesPatch, ServicesQuery }

export interface ServicesParams extends KnexAdapterParams<ServicesQuery> {}

/**
 * Extrai o número do pavimento e a abreviação "PAV" do texto de pavimento.
 * Ex: "26º PAVIMENTO - TORRE A" -> "26º PAV"
 * Ex: "MEZANINO" -> "MEZANINO" (se for diferente do padrão)
 * @param rawFloor O valor de pavimento vindo do CSV (ex: "26º PAVIMENTO - TORRE A").
 * @returns O valor formatado (ex: "26º PAV").
 */
function formatFloor(rawFloor: string): string {
    if (!rawFloor) {
        return '';
    }

    // A Regex busca:
    // 1. (^.*?) : Qualquer caractere no início (não ganancioso)
    // 2. (PAV) : A string "PAV"
    // 3. (?:IMENTO)? : Opcionalmente, a string "IMENTO" (para completar "PAVIMENTO")
    // 4. (.*) : O restante da string até o final.
    const regex = /^(.*PAV(?:IMENTO)?).*$/i;
    const match = rawFloor.trim().match(regex);

    if (match) {
        // match[1] contém a parte que queremos manter (ex: "26º PAVIMENTO")
        // Substituímos "PAVIMENTO" por "PAV" para padronizar.
        return match[1]
            .replace(/PAVIMENTO/i, 'PAV')
            .trim();
    }

    // Retorna o valor original se não encontrar o padrão (ex: "MEZANINO")
    return rawFloor.trim();
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


    async create(data: ServicesData, params?: ServiceParams): Promise<Services>;
    async create(data: ServicesData[], params?: ServiceParams): Promise<Services[]>;
    async create(data: ServicesData | ServicesData[], params?: ServiceParams): Promise<Services | Services[]> {
        return super.create(data as any, params);
    }

    

    async _processImportBulk(data: CsvServiceData[]): Promise<ImportBulkResult> {

        const logger = this.app.get('logger')
        logger.info(`[ImportBulk] Iniciando importação em lote de ${data.length} registros.`)
        const errors: ImportError[] = []
        const validData: ServicesData[] = [] 

        for (let i = 0; i < data.length; i++) {
            const item = data[i]
            const lineNumber = i + 2
            let servicesCreatedFromLine = 0

            // Coleta dos valores do item
            const rawMarking = item.marking_m
            const rawFixation = item.fixation_m
            const rawElevation = item.elevation_m2

            const formattedFloor = formatFloor(item.floor);

            // Criação do array de medições com os valores do item atual
            const measurements: { prefix: string; description: string; value: number }[] = [
                {
                    prefix: 'M',
                    description: 'Marcação',
                    value: rawMarking,
                },
                {
                    prefix: 'F',
                    description: 'Fixação',
                    value: rawFixation,
                },
                {
                    prefix: 'E',
                    description: 'Elevação',
                    value: rawElevation,
                },
            ] 

            //Tentar criar os serviços granulares (M, F, E)
            for (const measurement of measurements) {
                if (measurement.value > 0) {
                    servicesCreatedFromLine++ 

                    const newServiceId = `${measurement.prefix}-${item.service_code}`
                    const formattedValue = measurement.value.toFixed(2).replace('.', ',') 
                    const newServiceDescription = `${measurement.description}: ${formattedValue}` 

                    const serviceData: ServicesData = {
    
                        id: uuidv4(),
                        // Campos de mapeamento direto/constantes
                        work_id: item.work_id,
                        // Versão p/ Supabase
                        //service_type_id: 'e9f32070-1199-4bbf-8dbc-4d006b8aae6c',

                        // Versão p/ Easypanel
                        service_type_id: 'ed940120-14c2-4702-9de9-2a89d4d865fd',
                        tower: item.tower,
                        floor: formattedFloor,
                        apartment: item.apartment,
                        measurement_unit: item.measurement_unit,
                        thickness: item.thickness,
                        stage: item.wall,
                        material_quantity: item.qty_material_m2,
                        worker_quantity: item.qty_model_m2,
                        acronym: measurement.prefix,
                        
                        // Campos transformados (IDs e valores)
                        service_id: newServiceId,             
                        service_description: newServiceDescription, 
                        labor_quantity: measurement.value,    
                        
                        bonus: 0, 
                        is_active: true,
                        is_done: false,
                    };

                    validData.push(serviceData)
                }
            } 

            // VALIDAÇÃO: Pelo menos um tipo de serviço deve ser criado
            if (servicesCreatedFromLine === 0) {
                errors.push({
                    line: lineNumber,
                    header: 'MARCAÇÃO/FIXAÇÃO/ELEVAÇÃO',
                    value: '0',
                    reason:
                        'Nenhum valor de Marcação, Fixação ou Elevação foi encontrado (> 0) para esta linha. O registro original foi ignorado.',
                })
            }
        } 
        
        // ***************************************************************
        // BLOCO DE INSERÇÃO EM LOTE
        // ***************************************************************

        if (errors.length > 0) {
            logger.warn(
                `[ImportBulk] ${errors.length} erros de validação encontrados. Nenhum dado inserido.`,
            )
            return {
                importedCount: 0,
                totalCount: data.length,
                errors: errors,
            }
        }
        if (validData.length > 0) {
            const knex = this.Model // Acesso ao objeto Knex (tabela)
            const tableName = this.options.name // Nome da tabela ('services')
            const batchSize = 1000 // Inserir em lotes de 1000 registros

            try {
                logger.info('[ImportBulk] Dados a serem inseridos:', validData[0]);
                await knex.batchInsert(tableName, validData, batchSize)

                const insertedCount = validData.length
                logger.info(`[ImportBulk] ${insertedCount} registros criados via batchInsert.`)

                return {
                    importedCount: insertedCount,
                    totalCount: data.length,
                    errors: [],
                }
            } catch (e: any) {
                logger.error(`[ImportBulk] Falha crítica no Batch Insert: ${e.message}`, e)
                return {
                    importedCount: 0,
                    totalCount: data.length,
                    errors: [
                        {
                            line: 0,
                            header: 'DB Error',
                            value: 'N/A',
                            reason:
                                e.message || 'Falha desconhecida no banco de dados durante a importação em lote.',
                        },
                    ],
                }
            }
        }
        return { importedCount: 0, totalCount: data.length, errors: [] }
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
