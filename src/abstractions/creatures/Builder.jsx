import Creature from 'abstractions/Creature'
import Pattern from 'abstractions/Pattern'
import { randomOf } from 'controllers/Prng'

export default class Builder extends Creature {
  get color () {
    return 'white'
  }

  constructor (...params) {
    super(...params)

    this.pattern = new Pattern(
      this.renderer.getContext('trace'),
      this.pattern.string || randomOf(window.ENV.scene.patterns),
      this.pattern.colors || randomOf(window.ENV.scene.palettes)
    )
  }

  render (...args) {
    super.render(...args)

    this.renderer.draw('trace', ctx => {
      ctx.save()
      ctx.translate(this.center[0], this.center[1])
      ctx.clip(this.path)
      this.pattern.fill(ctx, -this.center[0], -this.center[1])
      ctx.restore()
    })
  }
}
