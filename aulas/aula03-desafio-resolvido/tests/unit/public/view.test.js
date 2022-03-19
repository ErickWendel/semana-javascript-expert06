import {
  jest,
  expect,
  describe,
  test,
  beforeEach
} from '@jest/globals'
import {
  JSDOM
} from 'jsdom'

import View from './../../../public/controller/js/view.js'
describe('#View - test suite for presentation layer ', () => {
  const dom = new JSDOM()
  global.document = dom.window.document
  global.window = dom.window

  function makeBtnElement({
    text,
    classList
  } = {
    text: '',
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
    }
  }) {
    return {
      onclick: jest.fn(),
      classList,
      innerText: text
    }
  }

  function makeClassListElement({
    classes
  } = {
    classes: []
  }) {
    const classList = new Set(classes)
    classList.contains = classList.has
    classList.remove = classList.delete

    return classList
  }

  beforeEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()
    jest.spyOn(
      document,
      "getElementById"
    ).mockReturnValue(makeBtnElement())
  })

  test('#changeCommandBtnsVisibility - given hide=true it should add unassigned class and reset onclick', () => {
    const view = new View()
    const btn = makeBtnElement()
    jest.spyOn(
      document,
      "querySelectorAll"
    ).mockReturnValue([btn])
      
    view.changeCommandBtnsVisibility()
    
    expect(btn.classList.add).toHaveBeenCalledWith('unassigned')
    expect(btn.onclick.name).toStrictEqual('onClickReset')
    expect(() => btn.onclick()).not.toThrow()

  })

  test('#changeCommandBtnsVisibility - given hide=false it should remove unassigned class and reset onclick', () => {
    const view = new View()
    const btn = makeBtnElement()
    jest.spyOn(
      document,
      "querySelectorAll"
    ).mockReturnValue([btn])
      
    view.changeCommandBtnsVisibility(false)
    
    expect(btn.classList.add).not.toHaveBeenCalled()
    expect(btn.classList.remove).toHaveBeenCalledWith('unassigned')
    expect(btn.onclick.name).toStrictEqual('onClickReset')
    expect(() => btn.onclick()).not.toThrow()
  })

  test('#onLoad', () => {
    const view = new View()

    jest.spyOn(
      view,
      view.changeCommandBtnsVisibility.name,
    ).mockReturnValue()

    const value = 'ok'
    jest.spyOn(
      view,
      view.onStartClicked.name,
    ).mockReturnValue(value)

    view.onLoad()

    expect(view.changeCommandBtnsVisibility).toHaveBeenCalled()
    expect(view.btnStart.onclick()).toStrictEqual(view.onStartClicked())
  })
  test('#onStartClicked', async () => {
    const view = new View()

    jest.spyOn(
      view,
      view.changeCommandBtnsVisibility.name,
    ).mockReturnValue()

    jest.spyOn(
      view,
      view.toggleBtnStart.name,
    ).mockReturnValue()

    jest.spyOn(
      view,
      view.onBtnClick.name,
    ).mockResolvedValue()

    jest.spyOn(
      view,
      "changeCommandBtnsVisibility",
    ).mockReturnValue()

    jest.spyOn(
      view,
      view.notIsUnassignedButton.name,
    ).mockReturnValue(true)

    jest.spyOn(
      view,
      view.setupBtnAction.name,
    ).mockReturnValue()

    const text = 'Start'
    const btn = makeBtnElement({
      text
    })

    jest.spyOn(
      document,
      "querySelectorAll",
    ).mockReturnValueOnce([btn])


    const eventOnClick = {
      srcElement: btn
    }

    await view.onStartClicked(eventOnClick)

    expect(view.toggleBtnStart).toHaveBeenCalled()
    expect(view.onBtnClick).toHaveBeenCalledWith(text)
    expect(view.changeCommandBtnsVisibility).toHaveBeenCalledWith(false)
    expect(view.notIsUnassignedButton).toHaveBeenNthCalledWith(1, btn)

    const [calls] = view.setupBtnAction.mock.calls[0]
    expect(view.setupBtnAction).toBeCalledTimes(1)
    expect(calls).toStrictEqual(btn)

  })

  test('#setupBtnAction - given start command it should not run', () => {
    const btn = makeBtnElement({
      text: 'start'
    })
    const view = new View()
    view.setupBtnAction(btn)
    const result = btn.onclick()
    const expected = jest.fn()()
    expect(result).toStrictEqual(expected)
  })

  test('#setupBtnAction - given stop command it should setup onStop onclick', () => {
    const view = new View()
    jest.spyOn(
      view,
      view.onStopBtn.name,
    ).mockReturnValue()

    const btn = makeBtnElement({
      text: 'stop'
    })
    view.setupBtnAction(btn)

    expect(btn.onclick.name).toStrictEqual(view.onStopBtn.bind(view).name)
  })

  test('#setupBtnAction - given other command it should setup onCommandClick onclick', () => {
    const view = new View()
    jest.spyOn(
      view,
      view.onCommandClick.name,
    ).mockReturnValue()

    const btn = makeBtnElement({
      text: 'applause'
    })
    view.setupBtnAction(btn)

    expect(btn.onclick.name).toStrictEqual(view.onCommandClick.bind(view).name)
  })

  test('#onCommandClick', async () => {
    const view = new View()
    const text = 'myText'
    const onClickElement = {
      srcElement: makeBtnElement({
        text
      })
    }

    jest.spyOn(
      view,
      view.toggleDisableCommandBtn.name,
    ).mockReturnValue()

    jest.spyOn(
      view,
      view.onBtnClick.name,
    ).mockResolvedValue()

    jest.useFakeTimers()

    await view.onCommandClick(onClickElement)
    jest.advanceTimersByTime(view.DISABLE_BTN_TIMEOUT)

    expect(view.toggleDisableCommandBtn).toHaveBeenNthCalledWith(1, onClickElement.srcElement.classList)
    expect(view.toggleDisableCommandBtn).toHaveBeenNthCalledWith(2, onClickElement.srcElement.classList)
    expect(view.onBtnClick).toHaveBeenCalledWith(text)
  })

  test('#toggleDisableCommandBtn active=true should add hidden class', () => {
    const classListWithoutActiveClass = makeClassListElement()
    const view = new View()
    view.toggleDisableCommandBtn(classListWithoutActiveClass)
    expect(classListWithoutActiveClass.size).toStrictEqual(1)
    expect([...classListWithoutActiveClass.values()]).toStrictEqual(['active'])
  })

  test('#toggleDisableCommandBtn active=false should remove hidden class', () => {
    const cssClass = 'active'
    const classListWithActiveClass = makeClassListElement({
      classes: [cssClass]
    })
    const view = new View()
    view.toggleDisableCommandBtn(classListWithActiveClass)
    expect(classListWithActiveClass.size).toBeFalsy()
    expect(classListWithActiveClass.has(cssClass)).toBeFalsy()
  })

  test('#onStopBtn', async () => {
    const view = new View()
    jest.spyOn(
      view,
      view.toggleBtnStart.name
    ).mockReturnValue()

    jest.spyOn(
      view,
      view.changeCommandBtnsVisibility.name
    ).mockReturnValue()

    jest.spyOn(
      view,
      view.onBtnClick.name
    ).mockResolvedValue()

    const text = 'myBtn'
    const onClickBtnElement = {
      srcElement: makeBtnElement({
        text
      })
    }

    await view.onStopBtn(onClickBtnElement)
    expect(view.toggleBtnStart).toHaveBeenCalledWith(false)
    expect(view.changeCommandBtnsVisibility).toHaveBeenCalledWith(true)
    expect(view.onBtnClick).toHaveBeenCalledWith(text)
  })

  test('#toggleBtnStart given active = true it should add the "hidden" class to btnStart and remove hidden from btnStop', () => {
    const cssClass = 'hidden'
    const btnStart = makeBtnElement({
      classList: makeClassListElement()
    })

    const btnStop = makeBtnElement({
      classList: makeClassListElement({
        classes: [cssClass]
      })
    })
    const view = new View()
    view.btnStart = btnStart
    view.btnStop = btnStop

    view.toggleBtnStart()

    expect(btnStart.classList.has(cssClass)).toBeTruthy()
    expect(btnStop.classList.has(cssClass)).toBeFalsy()

  })

  test('#toggleBtnStart given active = false it should remove the "hidden" class from btnStart and add hidden from btnStop', () => {
    const cssClass = 'hidden'
    const btnStart = makeBtnElement({
      classList: makeClassListElement({
        classes: [cssClass]
      })
    })

    const btnStop = makeBtnElement({
      classList: makeClassListElement()
    })
    const view = new View()
    view.btnStart = btnStart
    view.btnStop = btnStop

    view.toggleBtnStart(false)

    expect(btnStop.classList.has(cssClass)).toBeTruthy()
    expect(btnStart.classList.has(cssClass)).toBeFalsy()

  })

  test('#btnIsActive - should be unassined button if any of the classes are part of ignoreButtons prop', () => {
    const view = new View()
    const cssUnassinedButton = [...view.ignoreButtons.values()]

    const btnStart = makeBtnElement({
      classList: makeClassListElement({
        classes: cssUnassinedButton
      })
    })

    const result = view.notIsUnassignedButton(btnStart)
    expect(result).toBeFalsy()
  })

  test('#btnIsActive - should not be unassined if none of the classes are part of ignoreButtons prop', () => {
    const view = new View()

    const cssClassToIgnoreButton = ['abc']
    const btnStart = makeBtnElement({
      classList: makeClassListElement({
        classes: cssClassToIgnoreButton
      })
    })

    const result = view.notIsUnassignedButton(btnStart)
    expect(result).toBeTruthy()
  })

  test('#configureOnBtnClick', () => {
    const view = new View()
    const fn = jest.fn()
    view.configureOnBtnClick(fn)
    expect(view.onBtnClick).toStrictEqual(fn)
  })

  test('#View.constructor', () => {
    const view = new View()
    const d = document.getElementById()
    expect(view.btnStart).toStrictEqual(d)
    expect(view.btnStop).toStrictEqual(d)
    expect(view.ignoreButtons).toBeInstanceOf(Set)

    expect(view.buttons).toBeInstanceOf(Function)
    expect(view.onBtnClick).toBeInstanceOf(Function)
    expect(view.DISABLE_BTN_TIMEOUT).toStrictEqual(500)
    
    expect(() => view.onBtnClick('test')).not.toThrow()
    // expect(view.btnStop).toBeTruthy()
    // expect(view.btnStart).toBeTruthy()
    // expect(view.onBtnClick).toStrictEqual(fn)
  })

})