import { randomOf } from 'controllers/Prng'

const CACHE = new Map()

// TODO: preload all needed patterns at launch to avoid temporary freezes during runtime
export default class Pattern {
  constructor (ctx, string = 'T', colors = []) {
    this.ctx = ctx

    this.string = string
    this.pattern = this.string.split('')

    this.colors = colors

    this.uid = string + '__' + colors.join('_')

    this.canvas = CACHE.get(this.uid)
    if (!this.canvas) {
      const u = ctx.canvas.resolution || 1

      this.canvas = document.createElement('canvas')
      this.canvas.width = ctx.canvas.width * u
      this.canvas.height = ctx.canvas.height * u
      const context = this.canvas.getContext('2d')
      context.imageSmoothingEnabled = false

      for (let i = 0; i < context.canvas.width; i++) {
        for (let j = 0; j < context.canvas.height; j++) {
          context.fillStyle = this.#getColor(i, j)
          context.fillRect(i * u, j * u, u, u)
        }
      }

      CACHE.set(this.uid, this.canvas)
    }
  }

  isEmpty () {
    return !this.colors.filter(c => !['black', 'transparent', '#000000'].includes(c)).length
  }

  fill (ctx, i = 0, j = 0, width = this.canvas.width, height = this.canvas.height) {
    ctx.drawImage(this.canvas, i, j, width, height)
  }

  strip (length = 10) {
    const pixels = []
    for (let i = 0; i < length; i++) {
      let color = this.#getColor(i, 0)
      if (color === 'white') color = '#ffffff'
      if (color === 'black') color = '#000000'
      if (color === 'transparent') color = '#000000'
      pixels.push(color)
    }
    return pixels
  }

  #getColor (i, j) {
    // To avoid discrepencies in same signature pattern on different width
    // canvases, we use a hardcoded cols value
    // For better looking patterns, we always use odd number of cols
    const cols = 1337 // this.ctx.canvas.width + (this.ctx.canvas.width % 2 === 0 ? 1 : 0)
    const index = i + j * cols
    const next = this.pattern[index % this.pattern.length]

    // Decode next symbol
    if (next === 'R') return randomOf(this.colors)
    if (next === 'T') return 'transparent'
    return this.colors[next % this.colors.length] || 'black'
  }

  toJson () {
    return {
      string: this.string,
      colors: this.colors
    }
  }
}
