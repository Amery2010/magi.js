# Magi.js [![npm version](https://badge.fury.io/js/magi.js.svg)](https://badge.fury.io/js/magi.js) ![size](http://img.badgesize.io/Amery2010/magi.js/master/magi.js.svg?style=flat&color=18FF92)

> *Magi.js* 一款轻量级的适用于微信小程序的 JavaScript 动画引擎。使用“黑科技”来突破微信小程序 `wx.createAnimation` 实现上局限性，然你像使用 css transition 那样自由使用 JavaScript 动画。

### 特点

* 轻量级，4kb 的大小完全不用担心它对你的项目造成负担
* 更友好的 API，接近于传统动画引擎的 API 形态，便于容易理解与快速开发
* 更强大的内置支持，支持所有可用于动画变换的 CSS 属性，并内置大量的缓动函数
* 支持链式调用，通过链式调用，你可以很方便的生成指定的动画序列
* 支持任何有效的属性单位，例如 `rpx、rem`

## 用法

```bash
$ npm install magi.js

或

$ yarn add magi.js
```

或者手动 [下载](https://github.com/Amery/magi.js/archive/master.zip) ，然后将 `magi.js` 复制到你的项目目录下。

```javascript
var magi = require('magi.js')

或

import magi from 'magi.js'
```

你可以像这样编写你的动画函数：

```javascript
magi({
  duration: 1000,
  easing: 'ease',
  scale: [2, 2],
  rotate: '0.125turn'
}).then({
  duration: 600,
  width: '400rpx',
  translate: [-100, -100],
  easing: 'easeOutCirc'
})
```

**注意**：`magi.js` 与微信小程序中的 `wx.createAnimation` 类似，最后需要通过动画实例的 end 方法导出动画数据并传递给组件的 animation 属性。

```html
<view animation="{{animationData}}" style="background:red;height:100rpx;width:100rpx"></view>
```

```javascript
var anima = magi({
  duration: 1000,
  easing: 'ease',
  scale: [2, 2],
  rotate: '0.125turn'
})

this.setData({
  animationData: anima.end()
})
```

# API

## 动画属性

| 类型 | 示例
| --- | ---
| CSS | `width`, `opacity`, `backgroundColor` ...
| Transforms | `translateX`, `rotate`, `scale` ...

### CSS

任何可以用于动画的 CSS 属性：

```javascript
magi({
  left: '80%', // 像左移动到 80% 的位置
  opacity: 0.8, // 将 opacity 的值动画变换为 0.8
  backgroundColor: '#FFF' // 将背景色动画变换为 #FFF
})
```

### CSS transform 属性

有效的 CSS transform 属性：

```javascript
magi({
  translateX: 250, // 将 translateX 属性动画变换为 250px
  scale: 2, // 将 scale 属性动画变换为 2
  rotate: '1turn' // 将 rotation 属性动画变换为 1 turn
})
```

### 动画序列

使用 then 函数连接每一步动画：

```javascript
magi({
  duration: 800,
  easing: 'ease'
}).then({
  duration: 600,
  width: '300rpx',
  translate: [-200, -100],
}).then({
  rotate: '45dge',
  easing: 'easeOutCirc'
})
```

## 缓动函数

`easing` 参数既可以接受字符串也可以接受自定义的 Bézier 曲线坐标（数组）

| 类型 | 示例 | 说明
| --- | --- | ---
| String | `'easeOutExpo'` | 内置的函数名称
| `Array` | [0.81, -0.41, 0.33, 1.26] | 自定义的 Bézier 曲线坐标（[x1, y1, x2, y2]）

### 内置的函数

| In | Out | InOut
| --- | --- | ---
| easeIn | easeOut | easeInOut
| easeInQuad | easeOutQuad | easeInOutQuad
| easeInCubic | easeOutCubic | easeInOutCubic
| easeInQuart | easeOutQuart | easeInOutQuart
| easeInQuint | easeOutQuint | easeInOutQuint
| easeInSine | easeOutSine | easeInOutSine
| easeInExpo | easeOutExpo | easeInOutExpo
| easeInCirc | easeOutCirc | easeInOutCirc
| easeInBack | easeOutBack | easeInOutBack
| easeInElastic | easeOutElastic | easeInOutElastic

用法：

```javascript
magi({
  translateX: 100,
  easing: 'easeOutExpo'
});
```

### 自定义的 Bézier 曲线

使用一个包含 4 个坐标的 `Array` 来定义 Bézier 曲线：


```javascript
magi({
  translateX: 100,
  easing: [0.81, -0.41, 0.33, 1.26]
});
```
自定义 Bézier 曲线坐标生成器 <https://matthewlein.com/ceaser/>

====

[MIT License](LICENSE.md). © 2018 [Amery2010](https://xiangfa.org/).

`magi.js` 的 API 以及文档借鉴了 [Anime](https://github.com/juliangarnier/anime) , 缓动函数源于 [BezierEasing](https://github.com/gre/bezier-easing)
