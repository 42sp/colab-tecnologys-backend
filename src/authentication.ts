// For more information about this file see https://dove.feathersjs.com/guides/cli/authentication.html
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'

import type { Application } from './declarations'
import { getProfile } from './hooks/get-profile'

/**
 * @openapi
 * /authentication:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Autenticação de usuário
 *     description: Realiza o login do usuário usando CPF e senha, retorna um token JWT
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       201:
 *         description: Autenticação realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "NotAuthenticated"
 *                 message:
 *                   type: string
 *                   example: "Invalid login"
 *                 code:
 *                   type: number
 *                   example: 401
 */

declare module './declarations' {
	interface ServiceTypes {
		authentication: AuthenticationService
	}
}

export const authentication = (app: Application) => {
	const authentication = new AuthenticationService(app)

	authentication.register('jwt', new JWTStrategy())
	authentication.register('local', new LocalStrategy())

	app.use('authentication', authentication)

	app.service('authentication').hooks({
		after: {
		create: [getProfile], 
		},
  });
}
