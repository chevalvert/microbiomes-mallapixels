import Population from 'controllers/Population'
import { randomInt } from 'missing-math'
import WebSocketServer from 'controllers/WebSocketServer'

let timer
let isRunning = false

WebSocketServer.content.subscribe(reset)

function tick () {
  const next = randomInt(window.ENV.ghostRemote[0], window.ENV.ghostRemote[1])
  timer = window.setTimeout(() => {
    const creature = Population.createRandomCreature()
    WebSocketServer.send('creature', creature.toJSON())
    Population.add(creature)
    tick()
  }, next)
}

export function start () {
  if (isRunning) return
  isRunning = true
  tick()
}

export function reset () {
  if (!isRunning) return
  stop()
  start()
}

export function stop () {
  isRunning = false
  window.clearTimeout(timer)
}

export default { start, reset, stop }
