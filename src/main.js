import { defaultTweenSettings, validTransforms } from './defaults'
import { is } from './utils/base'
import { replaceObjectProps } from './utils/objects'
import { getProperties } from './utils/properties'
import { arrayContains, filterArray } from './utils/arrays'
import { getValue } from './utils/values'

class Magi {
  constructor (params = {}) {
    this.tweenSettings = replaceObjectProps(defaultTweenSettings, params)
    const animates = getProperties(this.tweenSettings, params)
    this.actions = []
    if (animates.length > 0) {
      this.add(params)
    }
  }
  init () {
    return this
  }
  format (animas) {
    const settings = animas[0].tweens
    const animates = [ ...animas ].map((prop, idx) => {
      const name = prop.name
      const value = prop.tweens.value
      if (arrayContains(validTransforms, name)) {
        return {
          type: name,
          args: getValue(value)
        }
      } else {
        return {
          type: 'style',
          args: [name, is.str(value) ? value : value + 'px']
        }
      }
    })
    return {
      animates,
      option: {
        transformOrigin: settings.transformOrigin,
        transition: {
          delay: settings.delay,
          duration: settings.duration,
          timingFunction: settings.easing
        }
      }
    }
  }
  export () {
    return {
      actions: [ ...this.actions ].map(anima => {
        return this.format(anima)
      })
    }
  }
  add (params) {
    const tweenSettings = replaceObjectProps(this.tweenSettings, params)
    const animates = getProperties(tweenSettings, params)
    if (this.actions.length > 0) {
      const inheritAnimates = [ ...this.actions[this.actions.length - 1] ]
      const diffAnimate = []
      animates.forEach(prop => {
        let diff = true
        inheritAnimates.forEach(p => {
          if (p.name === prop.name) {
            diff = false
            p.tweens.value = prop.tweens.value
          }
        })
        if (diff) diffAnimate.push(prop)
      })
      this.actions.push(diffAnimate.concat(inheritAnimates))
    } else {
      this.actions.push(animates)
    }
    return this
  }
}

export default function magi (params = {}) {
  return new Magi(params).init()
}
