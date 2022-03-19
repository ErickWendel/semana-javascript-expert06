import {
  expect,
  describe,
  test,
  jest,
  beforeEach
} from '@jest/globals'

import Service from '../../../public/controller/js/service.js'

describe('#Service - test suite for service calls', () => {

  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()

  })

  test('#makeRequest', async () => {
    const url = 'localhost:3000'
    const controller = new Service({
      url
    })
    const jsonResult =  jest.fn().mockResolvedValue()
    global.fetch = jest.fn().mockResolvedValue({ json: jsonResult })

    const data = {
      test: 123
    }
    await controller.makeRequest(data)

    expect(global.fetch).toHaveBeenCalledWith(url, {
      method: 'POST',
      body: JSON.stringify(data)
    })

    expect(jsonResult).toHaveBeenCalled()
  })

})