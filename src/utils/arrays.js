import { is } from './base'

export function arrayContains (arr, val) {
  return arr.some(a => a === val)
}

export function toArray (o) {
  if (is.arr(o)) return o
  return [o]
}

export function filterArray (arr, callback) {
  const len = arr.length
  const thisArg = arguments.length >= 2 ? arguments[1] : void 0
  let result = []
  for (let i = 0; i < len; i++) {
    if (i in arr) {
      const val = arr[i]
      if (callback.call(thisArg, val, i, arr)) {
        result.push(val)
      }
    }
  }
  return result
}
