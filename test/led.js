const StripLed = require('../server/api/strip-led')

process.env.STRIPLED_LENGTH = process.env.STRIPLED_LENGTH || 100
StripLed.connect('/dev/cu.usbmodem101')

let frameCount = 0

setInterval(() => {
  frameCount++

  const pixels = []
  for (let i = 0; i < +process.env.STRIPLED_LENGTH; i++) {
    pixels.push(i === (frameCount % 83) ? [255, 0, 0] : [0, 0, 0])
  }

  StripLed.set({ pixels })
}, 50)
