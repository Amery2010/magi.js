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

var validTransforms = ['translate', 'translate3d', 'translateX', 'translateY', 'translateZ', 'rotate', 'rotate3d', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scale3d', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY', 'matrix', 'matrix3d'];

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

function mergeObjects(o1, o2) {
  var o = cloneObject(o1);
  for (var p in o2) {
    o[p] = is.und(o1[p]) ? o2[p] : o1[p];
  }return o;
}

function normalizePropertyTweens(prop, tweenSettings) {
  var settings = cloneObject(tweenSettings);
  if (!is.obj(prop) || is.arr(prop)) prop = { value: prop };
  return mergeObjects(prop, settings);
}

function getProperties(tweenSettings, params) {
  var properties = [];
  for (var p in params) {
    if (!tweenSettings.hasOwnProperty(p)) {
      properties.push({
        name: p,
        tweens: normalizePropertyTweens(params[p], tweenSettings)
      });
    }
  }
  return properties;
}

function arrayContains(arr, val) {
  return arr.some(function (a) {
    return a === val;
  });
}

function getValue(value) {
  if (is.arr(value)) return value.map(function (v) {
    return parseFloat(v);
  });
  return [parseFloat(value)];
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Magi = function () {
  function Magi() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Magi);

    this.tweenSettings = replaceObjectProps(defaultTweenSettings, params);
    var animates = getProperties(this.tweenSettings, params);
    this.actions = [];
    if (animates.length > 0) {
      this.add(params);
    }
  }

  _createClass(Magi, [{
    key: 'init',
    value: function init() {
      return this;
    }
  }, {
    key: 'format',
    value: function format(animas) {
      var settings = animas[0].tweens;
      var animates = [].concat(_toConsumableArray(animas)).map(function (prop, idx) {
        var name = prop.name;
        var value = prop.tweens.value;
        if (arrayContains(validTransforms, name)) {
          return {
            type: name,
            args: getValue(value)
          };
        } else {
          return {
            type: 'style',
            args: [name, is.str(value) ? value : value + 'px']
          };
        }
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
    key: 'export',
    value: function _export() {
      var _this = this;

      return {
        actions: [].concat(_toConsumableArray(this.actions)).map(function (anima) {
          return _this.format(anima);
        })
      };
    }
  }, {
    key: 'add',
    value: function add(params) {
      var tweenSettings = replaceObjectProps(this.tweenSettings, params);
      var animates = getProperties(tweenSettings, params);
      if (this.actions.length > 0) {
        var inheritAnimates = [].concat(_toConsumableArray(this.actions[this.actions.length - 1]));
        var diffAnimate = [];
        animates.forEach(function (prop) {
          var diff = true;
          inheritAnimates.forEach(function (p) {
            if (p.name === prop.name) {
              diff = false;
              p.tweens.value = prop.tweens.value;
            }
          });
          if (diff) diffAnimate.push(prop);
        });
        this.actions.push(diffAnimate.concat(inheritAnimates));
      } else {
        this.actions.push(animates);
      }
      return this;
    }
  }]);

  return Magi;
}();

function magi() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return new Magi(params).init();
}

return magi;

})));
