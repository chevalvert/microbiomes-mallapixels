import { render } from 'utils/jsx'

import Remote from 'components/Remote'

import Raf from 'controllers/Raf'
import WebSocketServer from 'controllers/WebSocketServer'
import Gamepad from 'controllers/Gamepad'

/// #if DEVELOPMENT
require('webpack-hot-middleware/client?reload=true')
  .subscribe(({ reload }) => reload && window.location.reload())
/// #endif

;(async () => {
  render(<Remote />, document.body)

  Raf.start()
  Gamepad.bind()
  WebSocketServer.open()
})()
