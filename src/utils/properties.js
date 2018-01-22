import { is } from './base'
import { cloneObject, mergeObjects } from './objects'

export function normalizePropertyTweens (prop, tweenSettings) {
  let settings = cloneObject(tweenSettings)
  if (!is.obj(prop) || is.arr(prop)) prop = {value: prop}
  return mergeObjects(prop, settings)
}

export function getProperties (tweenSettings, params) {
  let properties = []
  for (let p in params) {
    if (!tweenSettings.hasOwnProperty(p)) {
      properties.push({
        name: p,
        tweens: normalizePropertyTweens(params[p], tweenSettings)
      })
    }
  }
  return properties
}

export default {
  normalizePropertyTweens,
  getProperties
}
