/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - cpf
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do usuário
 *         cpf:
 *           type: string
 *           description: CPF do usuário (apenas dígitos)
 *           example: "12345678901"
 *         name:
 *           type: string
 *           description: Nome do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *         phone:
 *           type: string
 *           description: Telefone do usuário
 *         roleId:
 *           type: string
 *           format: uuid
 *           description: ID da role do usuário
 *         profile_id:
 *           type: string
 *           format: uuid
 *           description: ID do perfil associado
 *         is_active:
 *           type: boolean
 *           description: Indica se o usuário está ativo
 *         is_available:
 *           type: boolean
 *           description: Indica se o usuário está disponível
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Data de atualização
 *
 *     UserCreate:
 *       type: object
 *       required:
 *         - cpf
 *         - password
 *       properties:
 *         cpf:
 *           type: string
 *           example: "12345678901"
 *         password:
 *           type: string
 *           format: password
 *           example: "senhaSegura123"
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         roleId:
 *           type: string
 *           format: uuid
 *
 *     Profile:
 *       type: object
 *       required:
 *         - name
 *         - phone
 *         - role_id
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           description: Nome completo
 *         date_of_birth:
 *           type: string
 *           format: date
 *           description: Data de nascimento
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         photo:
 *           type: string
 *           description: URL da foto
 *         address:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         postcode:
 *           type: string
 *         user_id:
 *           type: string
 *           format: uuid
 *         role_id:
 *           type: string
 *           format: uuid
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     Construction:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - city
 *         - state
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           maxLength: 100
 *           description: Nome da obra
 *         address:
 *           type: string
 *           description: Endereço da obra
 *         city:
 *           type: string
 *           maxLength: 50
 *         state:
 *           type: string
 *           maxLength: 2
 *           example: "SP"
 *         zip_code:
 *           type: string
 *           maxLength: 9
 *         start_date:
 *           type: string
 *           format: date
 *           description: Data de início da obra
 *         expected_end_date:
 *           type: string
 *           format: date
 *           description: Data prevista de término
 *         description:
 *           type: string
 *           description: Descrição da obra
 *         is_active:
 *           type: boolean
 *           default: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *         finished_at:
 *           type: string
 *           format: date-time
 *
 *     Task:
 *       type: object
 *       required:
 *         - service_id
 *         - completion_date
 *         - task_percentage
 *         - worker_id
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         service_id:
 *           type: string
 *           format: uuid
 *           description: ID do serviço associado
 *         worker_id:
 *           type: string
 *           format: uuid
 *           description: ID do trabalhador
 *         approver_id:
 *           type: string
 *           format: uuid
 *           description: ID do aprovador
 *         status:
 *           type: string
 *           enum: [pending, in_progress, completed, approved, rejected]
 *           default: pending
 *         completion_date:
 *           type: string
 *           format: date
 *         task_percentage:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Percentual de conclusão
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *         worker_name:
 *           type: string
 *         construction_name:
 *           type: string
 *         construction_address:
 *           type: string
 *         service_tower:
 *           type: string
 *         service_apartment:
 *           type: string
 *         service_floor:
 *           type: string
 *         service_stage:
 *           type: string
 *         service_type:
 *           type: string
 *
 *     Service:
 *       type: object
 *       required:
 *         - work_id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         work_id:
 *           type: string
 *           description: ID da obra
 *         service_id:
 *           type: string
 *         service_type_id:
 *           type: string
 *           format: uuid
 *         tower:
 *           type: string
 *           maxLength: 50
 *         floor:
 *           type: string
 *           maxLength: 50
 *         apartment:
 *           type: string
 *           maxLength: 50
 *         measurement_unit:
 *           type: string
 *           maxLength: 20
 *         service_description:
 *           type: string
 *           maxLength: 200
 *         stage:
 *           type: string
 *           maxLength: 100
 *         thickness:
 *           type: number
 *         labor_quantity:
 *           type: number
 *           description: Quantidade de mão de obra
 *         material_quantity:
 *           type: number
 *           description: Quantidade de material
 *         worker_quantity:
 *           type: number
 *           description: Quantidade de trabalhadores
 *         bonus:
 *           type: number
 *           default: 1
 *         unit_of_measure:
 *           type: string
 *           maxLength: 20
 *         material_unit:
 *           type: string
 *           maxLength: 20
 *         is_active:
 *           type: boolean
 *           default: true
 *         is_done:
 *           type: boolean
 *           default: false
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *         acronym:
 *           type: string
 *           maxLength: 2
 *         environment_type:
 *           type: string
 *           maxLength: 50
 *
 *     Role:
 *       type: object
 *       required:
 *         - role_name
 *         - role_description
 *         - hierarchy_level
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         role_name:
 *           type: string
 *           description: Nome da role
 *         role_description:
 *           type: string
 *           description: Descrição da role
 *         hierarchy_level:
 *           type: number
 *           description: Nível hierárquico
 *         is_active:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     ServiceType:
 *       type: object
 *       required:
 *         - service_name
 *         - service_description
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         service_name:
 *           type: string
 *           maxLength: 50
 *         service_description:
 *           type: string
 *         is_active:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     Employee:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         cpf:
 *           type: string
 *         is_active:
 *           type: boolean
 *         is_available:
 *           type: boolean
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         role_id:
 *           type: string
 *           format: uuid
 *         date_of_birth:
 *           type: string
 *           format: date
 *         address:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         postcode:
 *           type: string
 *         photo:
 *           type: string
 *
 *     EmployeeCreate:
 *       type: object
 *       required:
 *         - cpf
 *         - name
 *         - email
 *         - phone
 *         - role_id
 *         - password
 *       properties:
 *         cpf:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         role_id:
 *           type: string
 *           format: uuid
 *         password:
 *           type: string
 *           format: password
 *         date_of_birth:
 *           type: string
 *           format: date
 *         address:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         postcode:
 *           type: string
 *         photo:
 *           type: string
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: Token JWT para autenticação
 *         authentication:
 *           type: object
 *           properties:
 *             strategy:
 *               type: string
 *               example: "local"
 *         user:
 *           $ref: '#/components/schemas/User'
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - strategy
 *         - cpf
 *         - password
 *       properties:
 *         strategy:
 *           type: string
 *           example: "local"
 *           description: Estratégia de autenticação
 *         cpf:
 *           type: string
 *           example: "12345678901"
 *         password:
 *           type: string
 *           format: password
 *           example: "senhaSegura123"
 *
 *     PaginatedResponse:
 *       type: object
 *       properties:
 *         total:
 *           type: number
 *           description: Total de registros
 *         limit:
 *           type: number
 *           description: Limite de registros por página
 *         skip:
 *           type: number
 *           description: Número de registros pulados
 *         data:
 *           type: array
 *           items: {}
 */

export {}
