import {
  expect,
  describe,
  test,
  jest,
  beforeEach
} from '@jest/globals'

import fs from 'fs'
import fsPromises from 'fs/promises'
import childProcess from 'child_process'

import stream from 'stream'
import streamsAsync from 'stream/promises'
const {
  PassThrough,
  Writable,
} = stream

import Throttle from 'throttle'
import {
  Service
} from '../../../server/service.js'
import TestUtil from '../_util/testUtil.js'
import config from '../../../server/config.js'
const {
  dir: {
    fxDirectory,
    publicDirectory
  },
  constants: {
    fallbackBitRate,
    bitRateDivisor
  }
} = config

describe('#Service - test suite for core processing', () => {
  const getSpawnResponse = ({
    stdout = '',
    stderr = '',
    stdin = () => {}
  }) => ({
    stdout: TestUtil.generateReadableStream([stdout]),
    stderr: TestUtil.generateReadableStream([stderr]),
    stdin: TestUtil.generateWritableStream(stdin),
  })

  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  test('#createFileStream', () => {
    const currentReadable = TestUtil.generateReadableStream(['abc'])

    jest.spyOn(
      fs,
      fs.createReadStream.name
    ).mockReturnValue(currentReadable)

    const service = new Service()
    const myFile = 'file.mp3'
    const result = service.createFileStream(myFile)

    expect(result).toStrictEqual(currentReadable)
    expect(fs.createReadStream).toHaveBeenCalledWith(myFile)
  })

  test('#getFileInfo', async () => {
    jest.spyOn(
      fsPromises,
      fsPromises.access.name
    ).mockResolvedValue()

    const currentSong = 'mySong.mp3'
    const service = new Service()
    const result = await service.getFileInfo(currentSong)
    const expectedResult = {
      type: '.mp3',
      name: `${publicDirectory}/${currentSong}`
    }

    expect(result).toStrictEqual(expectedResult)
  })

  test('#getFileStream', async () => {
    const currentReadable = TestUtil.generateReadableStream(['abc'])
    const currentSong = `mySong.mp3`
    const currentSongFullPath = `${publicDirectory}/${currentSong}`

    const fileInfo = {
      type: '.mp3',
      name: currentSongFullPath
    }

    const service = new Service()
    jest
      .spyOn(
        service,
        service.getFileInfo.name
      )
      .mockResolvedValue(fileInfo)

    jest
      .spyOn(
        service,
        service.createFileStream.name
      )
      .mockReturnValue(currentReadable)

    const result = await service.getFileStream(currentSong)
    const expectedResult = {
      type: fileInfo.type,
      stream: currentReadable
    }
    expect(result).toStrictEqual(expectedResult)
    expect(service.createFileStream).toHaveBeenCalledWith(
      fileInfo.name
    )

    expect(service.getFileInfo).toHaveBeenCalledWith(
      currentSong
    )

  })

  test('#removeClientStream', () => {
    const service = new Service()
    jest.spyOn(
      service.clientStreams,
      service.clientStreams.delete.name
    ).mockReturnValue()
    const mockId = '1'
    service.removeClientStream(mockId)

    expect(service.clientStreams.delete).toHaveBeenCalledWith(mockId)
  })

  test('#createClientStream', () => {
    const service = new Service()
    jest.spyOn(
      service.clientStreams,
      service.clientStreams.set.name
    ).mockReturnValue()

    const {
      id,
      clientStream
    } = service.createClientStream()

    expect(id.length).toBeGreaterThan(0)
    expect(clientStream).toBeInstanceOf(PassThrough)
    expect(service.clientStreams.set).toHaveBeenCalledWith(id, clientStream)
  })

  test('#stopStreamming - existing throttleTransform', () => {
    const service = new Service()
    service.throttleTransform = new Throttle(1)

    jest.spyOn(
      service.throttleTransform,
      "end",
    ).mockReturnValue()

    service.stopStreamming()
    expect(service.throttleTransform.end).toHaveBeenCalled()
  })

  test('#stopStreamming - non existing throttleTransform', () => {
    const service = new Service()
    expect(() => service.stopStreamming()).not.toThrow()
  })

  test('#broadCast - it should write only for active client streams', () => {
    const service = new Service()
    const onData = jest.fn()
    const client1 = TestUtil.generateWritableStream(onData)
    const client2 = TestUtil.generateWritableStream(onData)
    jest.spyOn(
      service.clientStreams,
      service.clientStreams.delete.name
    )

    service.clientStreams.set('1', client1)
    service.clientStreams.set('2', client2)
    client2.end()

    const writable = service.broadCast()
    // vai mandar somente para o client1 pq o outro desconectou
    writable.write('Hello World')

    expect(writable).toBeInstanceOf(Writable)
    expect(service.clientStreams.delete).toHaveBeenCalled()
    expect(onData).toHaveBeenCalledTimes(1)
  })

  test('#getBitRate - it should return the bitRate as string', async () => {
    const song = 'mySong'
    const service = new Service()

    const spawnResponse = getSpawnResponse({
      stdout: '  1k  '
    })
    jest.spyOn(
      service,
      service._executeSoxCommand.name
    ).mockReturnValue(spawnResponse)

    const bitRatePromise = service.getBitRate(song)

    const result = await bitRatePromise
    expect(result).toStrictEqual('1000')
    expect(service._executeSoxCommand).toHaveBeenCalledWith(['--i', '-B', song])
  })

  test('#getBitRate - when an error ocurr it should get the fallbackBitRate', async () => {
    const song = 'mySong'
    const service = new Service()

    const spawnResponse = getSpawnResponse({
      stderr: 'error!'
    })
    jest.spyOn(
      service,
      service._executeSoxCommand.name
    ).mockReturnValue(spawnResponse)

    const bitRatePromise = service.getBitRate(song)

    const result = await bitRatePromise
    expect(result).toStrictEqual(fallbackBitRate)
    expect(service._executeSoxCommand).toHaveBeenCalledWith(['--i', '-B', song])
  })

  test('#_executeSoxCommand - it should call the sox command', async () => {
    const service = new Service()
    const spawnResponse = getSpawnResponse({
      stdout: '1k'
    })
    jest.spyOn(
      childProcess,
      childProcess.spawn.name
    ).mockReturnValue(spawnResponse)

    const args = ['myArgs']
    const result = service._executeSoxCommand(args)
    expect(childProcess.spawn).toHaveBeenCalledWith('sox', args)
    expect(result).toStrictEqual(spawnResponse)
  })

  test('#startStreamming - it should call the sox command', async () => {
    const currentSong = 'mySong.mp3'
    const service = new Service()
    service.currentSong = currentSong
    const currentReadable = TestUtil.generateReadableStream(['abc'])
    const expectedResult = 'ok'
    const writableBroadCaster = TestUtil.generateWritableStream(() => {})

    jest.spyOn(
      service,
      service.getBitRate.name
    ).mockResolvedValue(fallbackBitRate)

    jest.spyOn(
      streamsAsync,
      streamsAsync.pipeline.name
    ).mockResolvedValue(expectedResult)

    jest.spyOn(
      fs,
      fs.createReadStream.name
    ).mockReturnValue(currentReadable)

    jest.spyOn(
      service,
      service.broadCast.name
    ).mockReturnValue(writableBroadCaster)

    const expectedThrottle = fallbackBitRate / bitRateDivisor
    const result = await service.startStreamming()

    expect(service.currentBitRate).toEqual(expectedThrottle)
    expect(result).toEqual(expectedResult)
    expect(service.getBitRate).toHaveBeenCalledWith(currentSong)
    expect(fs.createReadStream).toHaveBeenCalledWith(currentSong)
    expect(streamsAsync.pipeline).toHaveBeenCalledWith(
      currentReadable,
      service.throttleTransform,
      service.broadCast()
    )

  })
  test('#mergeAudioStreams', async () => {
    const currentFx = 'fx.mp3'
    const service = new Service()
    const currentReadable = TestUtil.generateReadableStream(['abc'])
    const spawnResponse = getSpawnResponse({
      stdout: '1k',
      stdin: 'myFx'
    })

    jest.spyOn(
      service,
      service._executeSoxCommand.name
    ).mockReturnValue(spawnResponse)

    jest.spyOn(
      streamsAsync,
      streamsAsync.pipeline.name
    ).mockResolvedValue()

    const result = service.mergeAudioStreams(currentFx, currentReadable)

    const [call1, call2] = streamsAsync.pipeline.mock.calls
    
    const [readableCall, stdinCall] = call1
    expect(readableCall).toStrictEqual(currentReadable)
    expect(stdinCall).toStrictEqual(spawnResponse.stdin)

    const [stdoutCall, transformStream] = call2
    expect(stdoutCall).toStrictEqual(spawnResponse.stdout)
    expect(transformStream).toBeInstanceOf(PassThrough)
    
    expect(result).toBeInstanceOf(PassThrough)

  })
  test('#appendFxStream', async () => {
    const currentFx = 'fx.mp3'
    const service = new Service()
    service.throttleTransform = new PassThrough()
    service.currentReadable = TestUtil.generateReadableStream(['abc'])

    const mergedthrottleTransformMock = new PassThrough()
    const expectedFirstCallResult = 'ok1'
    const expectedSecondCallResult = 'ok2'
    const writableBroadCaster = TestUtil.generateWritableStream(() => {})

    jest.spyOn(
        streamsAsync,
        streamsAsync.pipeline.name
      )
      .mockResolvedValueOnce(expectedFirstCallResult)
      .mockResolvedValueOnce(expectedSecondCallResult)

    jest.spyOn(
      service,
      service.broadCast.name
    ).mockReturnValue(writableBroadCaster)

    jest.spyOn(
      service,
      service.mergeAudioStreams.name
    ).mockReturnValue(mergedthrottleTransformMock)

    jest.spyOn(
      mergedthrottleTransformMock,
      "removeListener"
    ).mockReturnValue()


    jest.spyOn(
      service.throttleTransform,
      "pause"
    )

    jest.spyOn(
        service.currentReadable,
        "unpipe"
      )
      .mockImplementation()

    service.appendFxStream(currentFx)


    expect(service.throttleTransform.pause).toHaveBeenCalled()
    expect(service.currentReadable.unpipe)
      .toHaveBeenCalledWith(service.throttleTransform)

    service.throttleTransform.emit('unpipe')

    const [call1, call2] = streamsAsync.pipeline.mock.calls
    const [resultCall1, resultCall2] = streamsAsync.pipeline.mock.results


    const [throttleTransformCall1, broadCastCall1] = call1
    expect(throttleTransformCall1).toBeInstanceOf(Throttle)
    expect(broadCastCall1).toStrictEqual(writableBroadCaster)

    const [result1, result2] = await Promise.all([resultCall1.value, resultCall2.value])

    expect(result1).toStrictEqual(expectedFirstCallResult)
    expect(result2).toStrictEqual(expectedSecondCallResult)

    const [mergedStreamCall2, throttleTransformCall2] = call2
    expect(mergedStreamCall2).toStrictEqual(mergedthrottleTransformMock)
    expect(throttleTransformCall2).toBeInstanceOf(Throttle)
    expect(service.currentReadable.removeListener).toHaveBeenCalled()
  })


  test('#readFxByName - it should return the song', async () => {
    const service = new Service()
    const inputFx = 'song01'
    const fxOnDisk = 'SONG01.mp3'
    jest.spyOn(
      fsPromises,
      fsPromises.readdir.name,
    ).mockResolvedValue([fxOnDisk])

    const path = await service.readFxByName(inputFx)
    const expectedPath = `${fxDirectory}/${fxOnDisk}`

    expect(path).toStrictEqual(expectedPath)
    expect(fsPromises.readdir).toHaveBeenCalledWith(fxDirectory)
  })

  test('#readFxByName - it should reject when song wasnt found', async () => {
    const service = new Service()
    const inputFx = 'song01'
    jest.spyOn(
      fsPromises,
      fsPromises.readdir.name,
    ).mockResolvedValue([])

    expect(service.readFxByName(inputFx)).rejects.toEqual(`the song ${inputFx} wasn't found!`)
    expect(fsPromises.readdir).toHaveBeenCalledWith(fxDirectory)
  })

})