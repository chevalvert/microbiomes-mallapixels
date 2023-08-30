/* global APP */
import { localStored, readable, writable } from 'utils/state'

const Store = {
  renderer: {
    instance: undefined, // Will be set by <App> when mounted
    debug: localStored(false, 'debug'),

    layers: readable({
      trace: {
        resolution: 1 / APP.renderer.scale,
        roundTo: APP.renderer.scale,
        clear: false,
        style: {
          backgroundColor: 'black'
        }
      },

      creatures: {
        resolution: 1 / APP.renderer.scale,
        roundTo: APP.renderer.scale,
        clear: true
      },

      contours: {
        resolution: 1,
        roundTo: APP.renderer.scale,
        clear: true
      },

      text: {
        resolution: 1,
        clear: true
      }
    })
  },

  // Public store for the Population controller
  population: {
    maxLength: readable(APP.population.maxLength),
    initialTypeDistribution: readable(APP.population.initialTypeDistribution),
    initialSizeDistribution: readable(APP.population.initialSizeDistribution),
    content: writable([])
  },

  creatures: {
    types: readable({
      builder: 'Builder',
      shifter: 'Shifter',
      restorer: 'Restorer'
    }),
    behaviors: readable({
      // TODO small = circle, medium = rect, large = blob
      shifter: {
        small: { speed: 1, size: [10, 15, 15, 20, 20] },
        medium: { speed: 2, size: [30, 50, 50, 60, 70] },
        large: { speed: 4, size: [80, 100, 125] }
      },
      restorer: {
        small: { speed: 1, size: [10, 15, 15, 20, 20] },
        medium: { speed: 2, size: [50, 30, 50, 60, 70, 70] },
        large: { speed: 4, size: [80, 100, 125] }
      },
      builder: {
        small: { speed: 1, size: [10, 15, 15, 20, 20] },
        medium: { speed: 2, size: [50, 30, 50, 60, 70, 70] },
        large: { speed: 4, size: [80, 100, 125] }
      }
    })
  },

  // Public store for the RAF controller
  raf: {
    fps: readable(APP.renderer.fps || 60),
    isRunning: writable(true),
    frameCount: writable(0)
  }
}

window.Store = Store
export default Store
