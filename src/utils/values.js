import { is, getUnit } from './base'
import { colorToRgb } from './colors'

export function getValue (value) {
  if (is.arr(value)) return value.map(v => parseFloat(v))
  return [parseFloat(value)]
}

export function validateValue (val, unit) {
  if (is.col(val)) return colorToRgb(val)
  const originalUnit = getUnit(val)
  const unitLess = originalUnit ? val.substr(0, val.length - originalUnit.length) : val
  return unit && !/\s/g.test(val) ? unitLess + unit : unitLess
}
