// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app'

describe('water-melon-sync service', () => {
  it('registered the service', () => {
    const service = app.service('water-melon-sync')

    assert.ok(service, 'Registered the service')
  })
})
