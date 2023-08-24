// TODO map remote position on screen and spawn creatures at correct start pos
// TODO add temp name display when a creature spawns (create a UID for each creature)
// TODO add fps meter and tick count
// TODO check for memleaks
// TODO add pokedex page for interactive cartel
// TODO sound
// TODO creature builder for workshops

import Store from 'store'
import { render } from 'utils/jsx'
import { writable } from 'utils/state'

import { buildCache } from 'abstractions/Pattern'

import App from 'components/App'
import Splashscreen from 'components/Splashscreen'

import Gamepad from 'controllers/Gamepad'
import Ghost from 'controllers/Ghost'
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

  if (window.ENV.buildPatternCache) {
    const progress = writable('0%')
    const splashscreen = render(<Splashscreen text={progress} />, document.body).components[0]
    const { target, generator } = buildCache(
      Store.renderer.instance.current.state.contexts.get('trace'),
      window.ENV.scene.patterns,
      window.ENV.scene.palettes
    )

    let i = 0
    while (!generator.next().done && i++ <= target) {
      progress.set((i / target * 100).toFixed(0) + '%')
      await new Promise(window.setTimeout)
    }

    splashscreen.destroy()
  }

  WebSocketServer.open(window.ENV.remoteWebSocketServer)

  Scene.setup()
  Store.raf.frameCount.subscribe(Scene.update)

  if (window.ENV.ghostRemote) Ghost.start()

  WebSocketServer.emitter.on('creature', data => {
    Population.add(data)
  })

  Raf.start()

  if (window.ENV.ticksBeforeRefresh) {
    console.log(`Refreshing in ${window.ENV.ticksBeforeRefresh} ticks !`)
    Store.raf.frameCount.subscribe(frameCount => {
      if (frameCount < window.ENV.ticksBeforeRefresh) return
      window.location.reload()
    })
  }
})()

Gamepad.on(window.ENV.gamepad.mapping.clear, () => {
  Population.clear()
  Scene.clear()
})

window.onresize = () => window.location.reload()

Hotkey('w', () => Store.renderer.debug.update(state => !state))
Hotkey('p', () => Store.raf.isRunning.update(state => !state))
