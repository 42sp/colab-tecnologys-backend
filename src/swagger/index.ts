import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './swagger.config'
import type { Application } from '../declarations'

export const setupSwagger = (app: Application) => {
	// Configurar Swagger UI usando raw express
	// @ts-ignore - Acessando instância express interna do Feathers
	const expressApp = app as any

	expressApp.use('/api-docs', swaggerUi.serve)
	expressApp.get('/api-docs', swaggerUi.setup(swaggerSpec, {
		explorer: true,
		customSiteTitle: 'Colab TecnoLogys API Docs',
		customCss: '.swagger-ui .topbar { background-color: #2c3e50; }',
		swaggerOptions: {
			persistAuthorization: true,
			displayRequestDuration: true,
			docExpansion: 'none',
			filter: true,
			showExtensions: true,
			showCommonExtensions: true,
		},
	}))
}
