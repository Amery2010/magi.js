import { defaultTweenSettings, validTransforms } from './defaults'
import { is } from './utils/base'
import { replaceObjectProps, cloneObject } from './utils/objects'
import { getProperties, hasTransitionProps } from './utils/properties'
import { arrayContains } from './utils/arrays'

class Magi {
  constructor () {
    this.animates = []
  }
  init (params = {}) {
    this.tweenSettings = replaceObjectProps(defaultTweenSettings, params)
    if (hasTransitionProps(params)) this.then(params)
    return this
  }
  then (params) {
    const tweenSettings = replaceObjectProps(this.tweenSettings, params)
    const properties = getProperties(tweenSettings, params)
    if (this.animates.length > 0) {
      const prevProps = this.animates[this.animates.length - 1].props
      const inheritProps = []
      const differentProps = []
      // 过滤已出现的属性
      properties.forEach(prop => {
        if (!prevProps.some(p => p.name === prop.name)) {
          differentProps.push(cloneObject(prop))
        }
      })
      // 更新属性值
      prevProps.forEach(prop => {
        let findSameProp = false
        findSameProp = properties.some(p => {
          if (p.name === prop.name) {
            inheritProps.push(cloneObject(p))
            return true
          }
        })
        if (!findSameProp) inheritProps.push(cloneObject(prop))
      })
      this.animates.push({
        props: inheritProps.concat(differentProps),
        tweens: tweenSettings
      })
    } else {
      this.animates.push({
        props: properties,
        tweens: tweenSettings
      })
    }
    return this
  }
  format (data) {
    const settings = data.tweens
    const animates = []
    const transforms = []
    data.props.forEach(prop => {
      const { name, value } = prop
      if (arrayContains(validTransforms, name)) {
        transforms.push(`${name}(${is.arr(value) ? value.join(', ') : value})`)
      } else {
        animates.push({
          type: 'style',
          args: [name, value]
        })
      }
    })
    animates.push({
      type: 'style',
      args: ['transform', transforms.join(' ')]
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
      actions: [ ...this.animates ].map(animate => {
        return this.format(animate)
      })
    }
  }
}

export default function magi (params) {
  return new Magi().init(params)
}
