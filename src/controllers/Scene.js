import Store from 'store'

export function setup () {}

export function update () {
  const renderer = Store.renderer.instance.get()

  const debug = Store.renderer.debug.get()
  const now = Date.now()

  renderer.clear()

  Store.renderer.angle.update(angle => angle + (window.ENV.renderer.rotationSpeed || 0))
  renderer.base.style.setProperty('--angle', (Store.renderer.angle.current % 360).toFixed(3) + 'deg')

  for (const creature of Store.population.content.get()) {
    creature.update()
    creature.render({
      showStroke: debug || creature.timestamp + (window.ENV.scene.displayNewCreature || -1) > now
    })
  }
}

export function clear () {
  const renderer = Store.renderer.instance.get()
  if (renderer) renderer.clear(true)
}

export default { setup, update, clear }
