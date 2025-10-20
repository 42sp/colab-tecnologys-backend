// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
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
                //saveProfile,
                //saveProfileId, 
                //getLoginToken
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