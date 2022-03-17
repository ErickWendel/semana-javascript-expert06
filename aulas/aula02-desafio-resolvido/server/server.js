import {
  createServer
} from 'http'
import {
  handler
} from './routes.js'

// fix: faz com que a instancia seja unica
export default () => createServer(handler)