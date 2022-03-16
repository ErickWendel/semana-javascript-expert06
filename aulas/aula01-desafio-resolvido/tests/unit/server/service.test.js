import {
  expect,
  describe,
  test,
  jest,
  beforeEach
} from '@jest/globals'

import fs from 'fs'
import fsPromises from 'fs/promises'

import {
  Service
} from '../../../server/service.js'
import TestUtil from '../_util/testUtil.js'
import config from '../../../server/config.js'
const {
  dir: {
    publicDirectory
  },
} = config

describe('#Service - test suite for core processing', () => {
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

})