import {
  expect,
  describe,
  test,
  jest,
  beforeEach
} from '@jest/globals'

import Controller from '../../../public/controller/js/controller.js'

describe('#Controller - test suite for controller calls', () => {
  const deps = {
    view: {
      configureOnBtnClick: jest.fn(),
      onLoad: jest.fn(),
    },
    service: {
      makeRequest: jest.fn().mockResolvedValue()
    }
  }

  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
    
  })

  test('#onLoad', () => {
    const controller = new Controller(deps)
    controller.onLoad()
    jest.spyOn(
      controller.commandReceived,
      controller.commandReceived.bind.name,
    )

    const [call] = deps.view.configureOnBtnClick.mock.lastCall

    expect(call.name).toStrictEqual(controller.commandReceived.bind(controller).name)
    expect(deps.view.onLoad).toHaveBeenCalled()
  })

  test('#commandReceived', async () => {
    const controller = new Controller(deps)
    const data = 'hey there'
    await controller.commandReceived(data)

    const expectedCall = {
      command: data
    }
    expect(deps.service.makeRequest).toHaveBeenCalledWith(expectedCall)
  })

  test('#initialize', () => {

    jest.spyOn(
      Controller.prototype,
      Controller.prototype.onLoad.name,
    ).mockReturnValue()

  
    const controller = Controller.initialize(deps)
    const controllerContructor = new Controller(deps)

    expect(Controller.prototype.onLoad).toHaveBeenCalled()
    expect(controller).toStrictEqual(controllerContructor)
  })

})