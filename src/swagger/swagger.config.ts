import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Colab TecnoLogys API',
			version: '1.0.0',
			description:
				'Backend API para aplicações Web e Mobile - Gestão de Obras, Funcionários, Tarefas e Serviços',
			contact: {
				name: 'TecnoLogys',
			},
		},
		servers: [
			{
				url: 'http://localhost:3030',
				description: 'Servidor de Desenvolvimento',
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
					description: 'Autenticação JWT. Use o token retornado pelo endpoint /authentication',
				},
			},
			responses: {
				UnauthorizedError: {
					description: 'Token de autenticação ausente ou inválido',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									name: { type: 'string', example: 'NotAuthenticated' },
									message: { type: 'string', example: 'Not authenticated' },
									code: { type: 'number', example: 401 },
								},
							},
						},
					},
				},
				BadRequestError: {
					description: 'Requisição inválida',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									name: { type: 'string', example: 'BadRequest' },
									message: { type: 'string', example: 'Invalid request' },
									code: { type: 'number', example: 400 },
								},
							},
						},
					},
				},
				NotFoundError: {
					description: 'Recurso não encontrado',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									name: { type: 'string', example: 'NotFound' },
									message: { type: 'string', example: 'Resource not found' },
									code: { type: 'number', example: 404 },
								},
							},
						},
					},
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},
	apis: [
		'./src/authentication.ts',
		'./src/services/**/*.ts',
		'./src/swagger/schemas.ts',
		'./src/swagger/routes-docs.ts',
	],
}

export const swaggerSpec = swaggerJsdoc(options)
