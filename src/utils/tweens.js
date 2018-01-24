import { is } from './base'
import easings from '../easings'

export function normalizeEasing (val) {
  if (is.arr(val)) return `cubic-bezier(${val.join(', ')})`
  return easings.hasOwnProperty(val)
    ? `cubic-bezier(${easings[val].join(', ')})` : val
}
