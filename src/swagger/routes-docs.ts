/**
 * @openapi
 * /profile:
 *   get:
 *     tags:
 *       - Profile
 *     summary: Listar perfis
 *     responses:
 *       200:
 *         description: Lista de perfis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   post:
 *     tags:
 *       - Profile
 *     summary: Criar perfil
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - role_id
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               role_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Perfil criado com sucesso
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /profile/{id}:
 *   get:
 *     tags:
 *       - Profile
 *     summary: Buscar perfil por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Perfil encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   patch:
 *     tags:
 *       - Profile
 *     summary: Atualizar perfil
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               photo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado
 *
 * /employee:
 *   get:
 *     tags:
 *       - Employee
 *     summary: Listar funcionários
 *     description: Retorna lista consolidada de usuários e perfis (funcionários)
 *     responses:
 *       200:
 *         description: Lista de funcionários
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Employee'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   post:
 *     tags:
 *       - Employee
 *     summary: Criar funcionário
 *     description: Cria usuário e perfil simultaneamente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmployeeCreate'
 *     responses:
 *       201:
 *         description: Funcionário criado com sucesso
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /roles:
 *   get:
 *     tags:
 *       - Roles
 *     summary: Listar roles/permissões
 *     responses:
 *       200:
 *         description: Lista de roles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Role'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   post:
 *     tags:
 *       - Roles
 *     summary: Criar nova role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role_name
 *               - role_description
 *               - hierarchy_level
 *             properties:
 *               role_name:
 *                 type: string
 *               role_description:
 *                 type: string
 *               hierarchy_level:
 *                 type: number
 *     responses:
 *       201:
 *         description: Role criada
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /roles/{id}:
 *   get:
 *     tags:
 *       - Roles
 *     summary: Buscar role por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Role encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *   patch:
 *     tags:
 *       - Roles
 *     summary: Atualizar role
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Role atualizada
 *
 * /service-types:
 *   get:
 *     tags:
 *       - Service Types
 *     summary: Listar tipos de serviço
 *     responses:
 *       200:
 *         description: Lista de tipos de serviço
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ServiceType'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   post:
 *     tags:
 *       - Service Types
 *     summary: Criar tipo de serviço
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - service_name
 *               - service_description
 *             properties:
 *               service_name:
 *                 type: string
 *               service_description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tipo de serviço criado
 *
 * /service-types/{id}:
 *   get:
 *     tags:
 *       - Service Types
 *     summary: Buscar tipo de serviço por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Tipo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceType'
 *   patch:
 *     tags:
 *       - Service Types
 *     summary: Atualizar tipo de serviço
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Tipo atualizado
 */

export {}
