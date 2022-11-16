import { localStored, readable, writable } from 'utils/state'

const Store = {
  renderer: {
    instance: undefined, // Will be set by <App> when mounted
    debug: localStored(false, 'debug'),
    angle: writable(0),

    layers: readable({
      trace: {
        resolution: 1 / window.ENV.renderer.scale,
        roundTo: window.ENV.renderer.scale,
        clear: false,
        style: {
          backgroundColor: 'black'
        }
      },
      creatures: {
        resolution: 1 / window.ENV.renderer.scale,
        roundTo: window.ENV.renderer.scale,
        clear: true,
        style: {
          mixBlendMode: 'color'
        }
      },
      debug: {
        resolution: 1,
        roundTo: window.ENV.renderer.scale,
        clear: true
      }
    })
  },

  // Public store for the Population controller
  population: {
    maxLength: readable(window.ENV.population.maxLength),
    content: writable([])
  },

  creatures: {
    types: readable({
      champignon: 'Builder',
      bactérie: 'Shifter',
      virus: 'Restorer'
    }),
    behaviors: readable({
      bactérie: {
        'digestive minus': { speed: 1, size: [10, 20, 20, 20] },
        'défensive mesurée': { speed: 2, size: [50, 50, 60, 70, 75] },
        'pathogène magnifique': { speed: 4, size: [100, 150] }
      },
      virus: {
        'dormant rabougri': { speed: 1, size: [10, 20, 20, 20] },
        'messager moyen': { speed: 2, size: [50, 50, 60, 70, 75] },
        'infectieux ogre': { speed: 4, size: [100, 150] }
      },
      champignon: {
        'sédentaire microscopique': { speed: 1, size: [10, 20, 20, 20] },
        'curieux commun': { speed: 2, size: [50, 50, 60, 70, 75] },
        'colonisateur mammouth': { speed: 4, size: [100, 150] }
      }
    })
  },

  // Public store for the RAF controller
  raf: {
    fps: readable(window.ENV.renderer.fps || 60),
    isRunning: writable(true),
    frameCount: writable(0)
  }
}

window.Store = Store
export default Store
