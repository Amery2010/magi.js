import { defaultTweenSettings, validTransforms } from './defaults'
import { is } from './utils/base'
import { replaceObjectProps } from './utils/objects'
import { getProperties } from './utils/properties'
import { arrayContains } from './utils/arrays'
import { getValue } from './utils/values'

class Magi {
  constructor () {
    this.target = undefined
    this.animates = []
  }
  _hasTransitionProps (obj) {
    for (let p in obj) {
      if (!defaultTweenSettings.hasOwnProperty(p)) return true
    }
    return false
  }
  init (params = {}) {
    this.tweenSettings = replaceObjectProps(defaultTweenSettings, params)
    if (this._hasTransitionProps(params)) this.then(params)
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
  end () {
    return {
      actions: [ ...this.actions ].map(anima => {
        return this.format(anima)
      })
    }
  }
  then (params) {
    const tweenSettings = replaceObjectProps(this.tweenSettings, params)
    const animates = getProperties(tweenSettings, params)
    console.log(animates)
    return this
  }
}

export default function magi (params = {}) {
  return new Magi().init(params)
}
