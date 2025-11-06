// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Listar usuários
 *     description: Retorna lista de usuários cadastrados
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                 limit:
 *                   type: number
 *                 skip:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   post:
 *     tags:
 *       - Users
 *     summary: Criar novo usuário
 *     description: Registra um novo usuário no sistema
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Buscar usuário por ID
 *     description: Retorna um usuário específico
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   patch:
 *     tags:
 *       - Users
 *     summary: Atualizar usuário
 *     description: Atualiza dados de um usuário existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
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
 *               password:
 *                 type: string
 *                 format: password
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   delete:
 *     tags:
 *       - Users
 *     summary: Deletar usuário
 *     description: Remove um usuário do sistema
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'

import {
    usersDataValidator,
    usersPatchValidator,
    usersQueryValidator,
    usersResolver,
    usersExternalResolver,
    usersDataResolver,
    usersPatchResolver,
    usersQueryResolver,
} from './users.schema'

import type { Application } from '../../declarations'
import { UsersService, getOptions } from './users.class'
import { usersPath, usersMethods } from './users.shared'
import { saveProfile } from '../../hooks/save-profile'
import { getLoginToken } from '../../hooks/get-login-token'
import { removeProps } from '../../hooks/remove-props'
import { saveProfileId } from '../profile/profile.hooks'
import { resetPassword } from '../../hooks/reset-password'





export * from './users.class'
export * from './users.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const users = (app: Application) => {
    // Register our service on the Feathers application
    app.use(usersPath, new UsersService(getOptions(app)), {
        // A list of all methods this service exposes externally
        methods: usersMethods,
        // You can add additional custom events to be sent to clients here
        events: [],
    })
    // Initialize hooks
    app.service(usersPath).hooks({
        around: {
            all: [
                schemaHooks.resolveExternal(usersExternalResolver),
                schemaHooks.resolveResult(usersResolver),
            ],
            find: [authenticate('jwt')],
            get: [authenticate('jwt')],
            create: [],
            update: [authenticate('jwt')],
            patch: [authenticate('jwt')],
            remove: [authenticate('jwt')],
        },
        before: {
            all: [
                schemaHooks.validateQuery(usersQueryValidator),
                schemaHooks.resolveQuery(usersQueryResolver),
            ],
            find: [],
            get: [],
            create: [
                removeProps,
                schemaHooks.validateData(usersDataValidator),
                schemaHooks.resolveData(usersDataResolver),
            ],
            patch: [
                resetPassword,
                schemaHooks.validateData(usersPatchValidator),
                schemaHooks.resolveData(usersPatchResolver),
            ],
            remove: [],
        },
        after: {
            all: [],
            create: [ 
                saveProfile,
                saveProfileId, 
                getLoginToken
            ],
        },
        error: {
            all: [],
        },
    })
}

// Add this service to the service type index
declare module '../../declarations' {
    interface ServiceTypes {
        [usersPath]: UsersService
    }
}