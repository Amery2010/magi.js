import { is } from './base'

export function cloneObject (o) {
  let clone = {}
  for (let p in o) clone[p] = o[p]
  return clone
}

export function replaceObjectProps (o1, o2) {
  let o = cloneObject(o1)
  for (let p in o1) o[p] = o2.hasOwnProperty(p) ? o2[p] : o1[p]
  return o
}

export function mergeObjects (o1, o2) {
  let o = cloneObject(o1)
  for (let p in o2) o[p] = is.und(o1[p]) ? o2[p] : o1[p]
  return o
}

export default {
  cloneObject,
  replaceObjectProps,
  mergeObjects
}
