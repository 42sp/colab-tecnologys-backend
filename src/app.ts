// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
const fs = require('fs');
!fs.existsSync('images') && fs.mkdirSync('images');
import { feathers } from '@feathersjs/feathers'
import express, {
	rest,
	json,
	urlencoded,
	cors,
	serveStatic,
	notFound,
	errorHandler,
} from '@feathersjs/express'
import 'dotenv/config'
import configuration from '@feathersjs/configuration'
import socketio from '@feathersjs/socketio'

import type { Application } from './declarations'
import { configAuthentication, configurationValidator } from './configuration'
import { logger } from './logger'
import { logError } from './hooks/log-error'
import { postgresql } from './postgresql'
import { services } from './services/index'
import { channels } from './channels'
import { authentication } from './authentication'

var serveIndex = require('serve-index')

const app: Application = express(feathers())

// Load app configuration
app.configure(configuration(configurationValidator))
app.use(cors())
app.use(json({ limit: '50mb' }))
app.use(urlencoded({ limit: '50mb', extended: true }))
// Host the public folder
app.use('/', serveStatic(app.get('public')))

app.use('/images', serveIndex('images'))
app.use('/images', serveStatic('images'))


// Configure services and real-time functionality
app.configure(rest())
app.configure(
	socketio({
		cors: {
			origin: app.get('origins'),
		},
	}),
)
app.configure(postgresql)
app.set('authentication', configAuthentication)
app.configure(authentication)
app.configure(services)
app.configure(channels)

// Configure a middleware for 404s and the error handler
app.use(notFound())
app.use(errorHandler({ logger }))

// Register hooks that run on all service methods
app.hooks({
	around: {
		all: [logError],
	},
	before: {},
	after: {},
	error: {},
})
// Register application setup and teardown hooks here
app.hooks({
	setup: [],
	teardown: [],
})

export { app }
