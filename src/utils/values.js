import { is } from './base'

export function getValue (value) {
  if (is.arr(value)) return value.map(v => parseFloat(v))
  return [parseFloat(value)]
}
