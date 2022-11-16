import { Component } from 'utils/jsx'
import { writable } from 'utils/state'

import Gamepad from 'controllers/Gamepad'
import Renderer from 'components/Renderer'
import WebSocketServer from 'controllers/WebSocketServer'

export default class App extends Component {
  beforeRender () {
    this.handleShutdown = this.handleShutdown.bind(this)

    this.state = {
      isShutingDown: writable(false),
      shutdownTimer: null
    }
  }

  template (props, state) {
    const vmin = Math.min(window.innerWidth, window.innerHeight) - window.ENV.renderer.padding
    return (
      <main
        id='App'
        class='app'
        store-class-is-shuting-down={state.isShutingDown}
        style={`
          --shutdown-delay: ${window.ENV.shutdownDelay}ms;
          --offset-x: ${(window.ENV.renderer.offset || [])[0] || 0};
          --offset-y: ${(window.ENV.renderer.offset || [])[1] || 0};
        `}
      >
        <Renderer width={vmin} height={vmin} />
        <div ref={this.ref('shutdown')} class='app__shutdown'>
          <div>Appuyer de nouveau<br />pour éteindre</div>
        </div>
      </main>
    )
  }

  afterMount () {
    Gamepad.on(window.ENV.gamepad.mapping.shutdown, this.handleShutdown)
  }

  handleShutdown () {
    // Restart animation
    this.refs.shutdown.style.animation = 'none'
    void this.refs.shutdown.offsetHeight // eslint-disable-line no-void
    this.refs.shutdown.style.animation = null

    if (this.state.isShutingDown.current) {
      this.refs.shutdown.innerHTML = '<div>Extinction en cours…</div>'
      this.log('Shuting down for good…')
      WebSocketServer.send('shutdown')
      return
    }

    this.state.isShutingDown.set(true)
    this.state.shutdownTimer = window.setTimeout(() => {
      this.state.isShutingDown.set(false)
    }, window.ENV.shutdownDelay)
  }
}
