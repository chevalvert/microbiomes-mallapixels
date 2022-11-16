const { SerialPort } = require('serialport')
const logger = require('../utils/logger')
const hexToRgb = require('hex-to-rgb')

let port
const log = logger({ color: 'red', prefix: '[STRIPLED]' })

module.exports = {
  connect: async function (path, { blink = true } = {}) {
    if (!port) {
      port = new SerialPort({
        path,
        baudRate: 115200,
        autoOpen: false
      })
    }

    port.on('error', error => {
      log(error.message)
    })

    await port.open()

    port.on('open', async () => {
      // Blink to validate connection
      for (const color of [[255, 0, 0], [0, 255, 0], [0, 0, 255], [0, 0, 0]]) {
        await new Promise(resolve => setTimeout(resolve, 20))
        this.set({
          pixels: new Array(+process.env.STRIPLED_LENGTH).fill(color)
        })
      }
    })
  },

  set: ({
    pixels = [],
    offset = 0,
    length = +process.env.STRIPLED_LENGTH
  } = {}) => {
    if (!port) return log('The port is not open')

    offset = parseInt(offset)

    const payload = []
    for (let i = 0; i < length; i++) {
      const pixel = pixels[i - offset] || [0, 0, 0]
      payload.push(Array.isArray(pixel) ? pixel : hexToRgb(pixel))
    }

    port.write(Buffer.from(payload.flat()))
  }
}
