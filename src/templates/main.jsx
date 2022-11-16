import Store from 'store'
import { render } from 'utils/jsx'

import App from 'components/App'

import Gamepad from 'controllers/Gamepad'
import Hotkey from 'controllers/Hotkey'
import Population from 'controllers/Population'
import Raf from 'controllers/Raf'
import Scene from 'controllers/Scene'
import WebSocketServer from 'controllers/WebSocketServer'

/// #if DEVELOPMENT
require('webpack-hot-middleware/client?reload=true')
  .subscribe(({ reload }) => reload && window.location.reload())
/// #endif

;(async () => {
  Gamepad.bind()
  render(<App />, document.body)

  WebSocketServer.open(window.ENV.remoteWebSocketServer)

  Scene.setup()
  Store.raf.frameCount.subscribe(Scene.update)

  WebSocketServer.emitter.on('creature', data => {
    Population.add(data)
  })

  Raf.start()
})()

Gamepad.on(window.ENV.gamepad.mapping.clear, () => {
  Population.clear()
  Scene.clear()
})

window.onresize = () => window.location.reload()

Hotkey('w', () => Store.renderer.debug.update(state => !state))
Hotkey('p', () => Store.raf.isRunning.update(state => !state))
