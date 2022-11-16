import Builder from 'abstractions/creatures/Builder'
import Pattern from 'abstractions/Pattern'
import randomOf from 'utils/array-random'

export default class Restorer extends Builder {
  get color () {
    return '#ff528c'
  }

  constructor (params) {
    super(params)

    // This is a small trick to exploit the Pattern caching system, allowing
    // multiple caches of the same pattern by defining different redundant patterns
    const pattern = this.pattern.string || randomOf(['R', 'RR', 'RRR', 'RRRR'])

    this.pattern = new Pattern(
      this.renderer.getContext('trace'),
      pattern,
      [
        ...new Array(90).fill('black'),
        ...new Array(10).fill('transparent')
      ]
    )
  }
}
