(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.magi = factory());
}(this, (function () { 'use strict';

var defaultTweenSettings = {
  delay: 0,
  duration: 400,
  easing: 'linear',
  transformOrigin: '50% 50% 0'
};

var validTransforms = ['translate', 'translate3d', 'translateX', 'translateY', 'translateZ', 'rotate', 'rotate3d', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scale3d', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY', 'matrix', 'matrix3d', 'perspective'];

function stringContains(str, text) {
  return str.indexOf(text) > -1;
}



var is = {
  arr: function arr(a) {
    return Array.isArray(a);
  },
  obj: function obj(a) {
    return stringContains(Object.prototype.toString.call(a), 'Object');
  },
  str: function str(a) {
    return typeof a === 'string';
  },
  fnc: function fnc(a) {
    return typeof a === 'function';
  },
  und: function und(a) {
    return typeof a === 'undefined';
  },
  hex: function hex(a) {
    return (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a)
    );
  },
  rgb: function rgb(a) {
    return (/^rgb/.test(a)
    );
  },
  hsl: function hsl(a) {
    return (/^hsl/.test(a)
    );
  },
  col: function col(a) {
    return is.hex(a) || is.rgb(a) || is.hsl(a);
  }
};

function getUnit(val) {
  var split = /([+-]?[0-9#.]+)(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(val);
  if (split) return split[2];
}

function getTransformUnit(propName) {
  if (stringContains(propName, 'translate') || propName === 'perspective') return 'px';
  if (stringContains(propName, 'rotate') || stringContains(propName, 'skew')) return 'deg';
}

function cloneObject(o) {
  var clone = {};
  for (var p in o) {
    clone[p] = o[p];
  }return clone;
}

function replaceObjectProps(o1, o2) {
  var o = cloneObject(o1);
  for (var p in o1) {
    o[p] = o2.hasOwnProperty(p) ? o2[p] : o1[p];
  }return o;
}

function stringToHyphens$1(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function rgbToRgba(rgbValue) {
  var rgb = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(rgbValue);
  return rgb ? 'rgba(' + rgb[1] + ',1)' : rgbValue;
}

function hexToRgba(hexValue) {
  var rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  var hex = hexValue.replace(rgx, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });
  var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var r = parseInt(rgb[1], 16);
  var g = parseInt(rgb[2], 16);
  var b = parseInt(rgb[3], 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',1)';
}

function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function hslToRgba(hslValue) {
  var hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hslValue) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(hslValue);
  var h = parseInt(hsl[1]) / 360;
  var s = parseInt(hsl[2]) / 100;
  var l = parseInt(hsl[3]) / 100;
  var a = hsl[4] || 1;
  var r = void 0,
      g = void 0,
      b = void 0;
  if (s === 0) {
    r = g = b = l;
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return 'rgba(' + r * 255 + ',' + g * 255 + ',' + b * 255 + ',' + a + ')';
}

function colorToRgb(val) {
  if (is.rgb(val)) return rgbToRgba(val);
  if (is.hex(val)) return hexToRgba(val);
  if (is.hsl(val)) return hslToRgba(val);
}

function validateValue(val, unit) {
  if (is.col(val)) return colorToRgb(val);
  var originalUnit = getUnit(val);
  var unitLess = originalUnit ? val.substr(0, val.length - originalUnit.length) : val;
  return unit && !/\s/g.test(val) ? unitLess + unit : unitLess;
}

function arrayContains(arr, val) {
  return arr.some(function (a) {
    return a === val;
  });
}

function getPropertieVulue(propName, value) {
  var unit = getUnit(value);
  return validateValue(value, unit || (arrayContains(validTransforms, propName) ? getTransformUnit(propName) : 'px'));
}

function getProperties(tweenSettings, params) {
  var properties = [];
  for (var p in params) {
    if (p === 'transform') {
      var match = [];
      // 将 ‘translateX(10px)’ 这类结构分解为 ‘translateX’ 与 ‘10px’
      var reg = /(\w+)\((.+?)\)/g;
      while ((match = reg.exec(params[p])) !== null) {
        properties.push({ name: match[1], value: match[2].split(/,\s*/) });
      }
    } else {
      if (!tweenSettings.hasOwnProperty(p)) {
        properties.push({ name: stringToHyphens$1(p), value: params[p] });
      }
    }
  }
  return properties.map(function (prop) {
    return {
      name: prop.name,
      value: is.arr(prop.value) ? prop.value.map(function (v) {
        return getPropertieVulue(prop.name, v);
      }) : getPropertieVulue(prop.name, prop.value)
    };
  });
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Magi = function () {
  function Magi() {
    _classCallCheck(this, Magi);

    this.target = undefined;
    this.animates = [];
  }

  _createClass(Magi, [{
    key: '_hasTransitionProps',
    value: function _hasTransitionProps(obj) {
      for (var p in obj) {
        if (!defaultTweenSettings.hasOwnProperty(p)) return true;
      }
      return false;
    }
  }, {
    key: 'init',
    value: function init() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.tweenSettings = replaceObjectProps(defaultTweenSettings, params);
      if (this._hasTransitionProps(params)) this.then(params);
      return this;
    }
  }, {
    key: 'format',
    value: function format(data) {
      var settings = data.tweens;
      var animates = [];
      var transforms = [];
      data.props.forEach(function (prop) {
        var name = prop.name,
            value = prop.value;

        if (arrayContains(validTransforms, name)) {
          transforms.push(name + '(' + (is.arr(value) ? value.join(', ') : value) + ')');
        } else {
          animates.push({
            type: 'style',
            args: [name, value]
          });
        }
      });
      animates.push({
        type: 'style',
        args: ['transform', transforms.join(' ')]
      });
      return {
        animates: animates,
        option: {
          transformOrigin: settings.transformOrigin,
          transition: {
            delay: settings.delay,
            duration: settings.duration,
            timingFunction: settings.easing
          }
        }
      };
    }
  }, {
    key: 'end',
    value: function end() {
      var _this = this;

      return {
        actions: [].concat(_toConsumableArray(this.animates)).map(function (animate) {
          return _this.format(animate);
        })
      };
    }
  }, {
    key: '_includeSameProp',
    value: function _includeSameProp(arr, propName) {
      return arr.some(function (p) {
        return p.name === propName;
      });
    }
  }, {
    key: 'then',
    value: function then(params) {
      var tweenSettings = replaceObjectProps(this.tweenSettings, params);
      var properties$$1 = getProperties(tweenSettings, params);
      if (this.animates.length > 0) {
        var prevProps = this.animates[this.animates.length - 1].props;
        var inheritProps = [];
        var differentProps = [];
        // 过滤已出现的属性
        properties$$1.forEach(function (prop) {
          if (!prevProps.some(function (p) {
            return p.name === prop.name;
          })) differentProps.push(cloneObject(prop));
        });
        // 更新属性值
        prevProps.forEach(function (prop) {
          var findSameProp = false;
          findSameProp = properties$$1.some(function (p) {
            if (p.name === prop.name) {
              inheritProps.push(cloneObject(p));
              return true;
            }
          });
          if (!findSameProp) inheritProps.push(cloneObject(prop));
        });
        this.animates.push({
          props: inheritProps.concat(differentProps),
          tweens: tweenSettings
        });
      } else {
        this.animates.push({
          props: properties$$1,
          tweens: tweenSettings
        });
      }
      return this;
    }
  }]);

  return Magi;
}();

function magi() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return new Magi().init(params);
}

return magi;

})));
