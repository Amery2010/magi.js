import { validTransforms } from '../defaults'
import { is, getUnit, getTransformUnit } from './base'
import { stringToHyphens } from './strings'
import { validateValue } from './values'
import { arrayContains } from './arrays'

export function getPropertieVulue (propName, value) {
  const unit = getUnit(value)
  return validateValue(value, unit || (arrayContains(validTransforms, propName) ? getTransformUnit(propName) : 'px'))
}

export function getProperties (tweenSettings, params) {
  let properties = []
  for (let p in params) {
    if (p === 'transform') {
      let match = []
      // 将 ‘translateX(10px)’ 这类结构分解为 ‘translateX’ 与 ‘10px’
      const reg = /(\w+)\((.+?)\)/g
      while ((match = reg.exec(params[p])) !== null) {
        properties.push({ name: match[1], value: match[2].split(/,\s*/) })
      }
    } else {
      if (!tweenSettings.hasOwnProperty(p)) {
        properties.push({ name: stringToHyphens(p), value: params[p] })
      }
    }
  }
  return properties.map(prop => {
    return {
      name: prop.name,
      value: is.arr(prop.value)
        ? prop.value.map(v => getPropertieVulue(prop.name, v))
        : getPropertieVulue(prop.name, prop.value)
    }
  })
}

export default {
  getProperties
}
