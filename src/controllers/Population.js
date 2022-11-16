import Store from 'store'
import { radians } from 'missing-math'

import Creature from 'abstractions/Creature'
import Builder from 'abstractions/creatures/Builder'
import Restorer from 'abstractions/creatures/Restorer'
import Shifter from 'abstractions/creatures/Shifter'

const CREATURES = { Builder, Restorer, Shifter }

export function create ({ type, ...params } = {}) {
  return new (CREATURES[type] || Creature)(params)
}

export function add (creature) {
  // Interpret non-creature inputs as creature parameters (used by ws)
  if (!(creature instanceof Creature)) creature = create(creature)

  // Always spawn new creatures at bottom of the screen, compensating for an
  // eventual screen angle
  const theta = radians(Store.renderer.angle.get() - 360 + 90)
  const { width, height } = Store.renderer.instance.current.props
  creature.position = [
    (width / 2) + Math.sin(theta) * (width * 0.4),
    (height / 2) + Math.cos(theta) * (height * 0.4)
  ]

  Store.population.content.update(population => {
    population.push(creature)
    if (population.length > Store.population.maxLength.current) population.shift()
  }, true)
}

export function clear () {
  Store.population.content.set([])
}

export default {
  add,
  clear,
  create
}
