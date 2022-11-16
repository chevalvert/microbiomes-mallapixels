import WebSocket from 'reconnectingwebsocket'
import { writable } from 'utils/state'
import Emitter from 'tiny-emitter'

export default ({
  emitter: new Emitter(),
  content: writable({}),
  isClosed: writable(true),
  send: function (event, data = {}) {
    this.socket.send(JSON.stringify({ event, data }))
  },
  open: function (url = window.location.origin.replace('http', 'ws').replace(/(#.*)$/, '')) {
    this.socket = new WebSocket(url)
    this.socket.onopen = () => this.isClosed.set(false)
    this.socket.onclose = () => this.isClosed.set(true)
    this.socket.onmessage = message => {
      try {
        const { event, data } = JSON.parse(message.data)
        this.emitter.emit(event, data)
      } catch (error) {
        console.warn(error)
      }
    }
    return this
  }
})
