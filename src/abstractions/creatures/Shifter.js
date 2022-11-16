import { randomOf } from 'controllers/Prng'
import Creature from 'abstractions/Creature'
import Pattern from 'abstractions/Pattern'

export default class Shifter extends Creature {
  get color () {
    return 'white'
  }

  constructor ({
    direction = randomOf([[-1, 0], [1, 0], [0, 1], [0, -1]]),
    ...params
  } = {}) {
    super(params)
    this.direction = direction
    this.SHOW_STROKE = true
    this.pattern = new Pattern(this.renderer.getContext('trace'))
  }

  update () {
    super.update()
    if (Math.random() > 0.9) {
      this.direction = randomOf([[-1, 0], [1, 0], [0, 1], [0, -1]])
    }
  }

  render (...args) {
    super.render(...args)

    this.renderer.draw('trace', ctx => {
      ctx.save()
      ctx.translate(this.center[0], this.center[1])
      ctx.clip(this.path)
      ctx.drawImage(
        ctx.canvas,
        this.position[0] / ctx.canvas.resolution,
        this.position[1] / ctx.canvas.resolution,
        this.size / ctx.canvas.resolution,
        this.size / ctx.canvas.resolution,
        this.direction[0] - this.radius,
        this.direction[1] - this.radius,
        this.size,
        this.size
      )
      ctx.restore()
    })
  }
}
