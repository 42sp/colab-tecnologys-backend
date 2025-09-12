// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app'

describe('services service', () => {
	it('registered the service', () => {
		const service = app.service('services')

		assert.ok(service, 'Registered the service')
	})
})
