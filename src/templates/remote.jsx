import { render } from 'utils/jsx'

import Remote from 'components/Remote'

import Raf from 'controllers/Raf'
import Sound from 'controllers/Sound'
import WebSocketServer from 'controllers/WebSocketServer'
import Gamepad from 'controllers/Gamepad'

/// #if DEVELOPMENT
require('webpack-hot-middleware/client?reload=true')
  .subscribe(({ reload }) => reload && window.location.reload())
/// #endif

;(async () => {
  render(<Remote />, document.body)

  Raf.start()
  WebSocketServer.open()

  Gamepad.bind()
  Gamepad.on('keypress', () => {
    Sound.load()
    WebSocketServer.send('gamepad:keypress')
  })
})()
