export function stringContains (str, text) {
  return str.indexOf(text) > -1
}

export function stringToHyphens (str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

export const is = {
  arr: a => Array.isArray(a),
  obj: a => stringContains(Object.prototype.toString.call(a), 'Object'),
  str: a => typeof a === 'string',
  fnc: a => typeof a === 'function',
  und: a => typeof a === 'undefined',
  hex: a => /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a),
  rgb: a => /^rgb/.test(a),
  hsl: a => /^hsl/.test(a),
  col: a => (is.hex(a) || is.rgb(a) || is.hsl(a))
}

export function getUnit (val) {
  const split = /([+-]?[0-9#.]+)(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(val)
  if (split) return split[2]
}

export function getTransformUnit (propName) {
  if (stringContains(propName, 'translate') || propName === 'perspective') return 'px'
  if (stringContains(propName, 'rotate') || stringContains(propName, 'skew')) return 'deg'
}
