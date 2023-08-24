import Store from 'store'
import { wrap, randomInt } from 'missing-math'
import Polygon from 'abstractions/Polygon'
import stringToColor from 'utils/string-to-color'
import { randomOf } from 'controllers/Prng'

export default class Creature {
  set renderer (renderer) { this.__renderer = renderer }
  get renderer () { return this.__renderer ?? (Store.renderer.instance ? Store.renderer.instance.current : null) }

  constructor ({
    pattern = {},
    animated = false,
    speed = randomInt(1, 4),
    shape = 'rectangle',
    size = 10,
    sprite = null,
    bounds = [0, 0, window.innerWidth, window.innerHeight],
    position = [
      randomInt(bounds[0], bounds[0] + bounds[2]),
      randomInt(bounds[1], bounds[1] + bounds[3])
    ],
    resolution = this.renderer
      ? this.renderer.getContext('trace').canvas.resolution
      : 1
  } = {}) {
    this.speed = speed
    this.timestamp = Date.now()
    this.animated = animated
    this.size = Array.isArray(size) ? randomOf(size) : size

    this.bounds = bounds
    this.position = position.map(v => Math.floor(v - this.size / 2))
    this.ppos = this.position

    this.seed = position[0] + position[1] + Date.now()
    this.pattern = pattern

    if (sprite) {
      this.sprite = sprite.map(polygon => Polygon.toPath2d(polygon, resolution))
    } else {
      const polygon = Polygon.shape(shape, { size: this.size, resolution })
      this.sprite = Polygon.tamagotchize(polygon, {
        resolution,
        direction: randomOf(['horizontal', 'vertical']),
        slicesLength: randomOf([2, 3, 4]),
        framesLength: 10,
        amt: 0.1
      })
    }

    this.debugColor = stringToColor(this.constructor.name)
  }

  get path () {
    const index = Math.round((Store.raf.frameCount.current + this.seed) / 5) % this.sprite.length
    return this.sprite[index]
  }

  get radius () { return this.size / 2 }
  get center () { return [this.position[0] + this.radius, this.position[1] + this.radius] }
  get orientation () {
    const dx = Math.abs(this.position[0] - this.ppos[0])
    const dy = Math.abs(this.position[1] - this.ppos[1])
    return dx > dy ? 'horizontal' : 'vertical'
  }

  update ({
    speed = this.speed,
    octaves = 4 + (this.seed % 4)
  } = {}) {
    this.ppos = [...this.position]

    const angle = this.renderer.noise(this.seed, null, { octaves })
    const xoff = Math.sin(angle * Math.PI * 2) * speed
    const yoff = Math.cos(angle * Math.PI * 2) * speed

    this.position[0] = wrap(
      this.center[0] + xoff,
      this.bounds[0],
      this.bounds[0] + this.bounds[2]
    ) - this.radius

    this.position[1] = wrap(
      this.center[1] + yoff,
      this.bounds[1],
      this.bounds[1] + this.bounds[3]
    ) - this.radius
  }

  render ({ showStroke = this.SHOW_STROKE } = {}) {
    if (!showStroke) return
    this.renderer.debug(this.center, {
      strokeStyle: this.color,
      path: this.path,
      lineWidth: 2,
      dimensions: [this.size, this.size]
    })
  }

  toJSON () {
    return {
      type: this.constructor.name,
      speed: this.speed,
      size: this.size,
      sprite: this.sprite.map(path => path.toString()),
      pattern: this.pattern.toJson()
    }
  }
}
