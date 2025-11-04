// For more information about this file see https://dove.feathersjs.com/guides/cli/typescript.html
import { HookContext as FeathersHookContext, NextFunction } from '@feathersjs/feathers'
import { Application as FeathersApplication } from '@feathersjs/express'
import { ApplicationConfiguration } from './configuration'
import { Users } from './client'

export type { NextFunction }

interface Logger {
    info: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
    debug: (...args: any[]) => void;
}

// The types for app.get(name) and app.set(name)
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Configuration extends ApplicationConfiguration {
	logger: Logger;
}

// A mapping of service names to types. Will be extended in service files.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ServiceTypes {}

// The application instance type that will be used everywhere else
export type Application = FeathersApplication<ServiceTypes, Configuration>

// The context for hook functions - can be typed with a service class
export type HookContext<S = any> = FeathersHookContext<Application, S>



// Add the user as an optional property to all params
declare module '@feathersjs/feathers' {
	interface Params {
		user?: Users
        searchTerm?: string
	}
	
}
