(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Schema = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _utils = require('./utils');

var Components = [];

var setComponent = function setComponent(componentID, component) {
  Components[componentID] = component;
};

var getComponent = function getComponent(componentID) {
  return Components[componentID];
};

var getComponentId = function getComponentId(el, key) {
  return (0, _utils.getElementPath)(el) + el.children.length;
};

var instanciateComponent = function instanciateComponent(schema, injectData) {
  var instance = Object.create(schema);
  if (schema.data) {
    instance.data = JSON.parse(JSON.stringify(schema.data));
    for (var data in injectData) {
      instance.data[data] = injectData[data];
    }
  }
  return instance;
};

var isComponent = function isComponent(tag) {
  if (typeof tag == 'object') return true;else return false;
};

exports.isComponent = isComponent;
var buildComponent = function buildComponent(dom, elementArray) {
  var componentID = getComponentId(dom.parent);
  var component = getComponent(componentID);
  if (component) return component;else {
    var schema = elementArray[0];
    var injectData = elementArray[1];
    var content = (0, _utils.getContent)(elementArray);
    var instance = instanciateComponent(schema, injectData);
    instance.content = content;
    setComponent(componentID, instance);
    return instance;
  }
};
exports.buildComponent = buildComponent;

},{"./utils":9}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _exr = require('./exr');

var _utils = require('./utils');

var _component = require('./component');

var _element = require('./element');

var _renderer = require('./renderer');

var buildElement = function buildElement(component, dom, elementArray) {
  var tag = (0, _utils.getTag)(elementArray);
  var content = (0, _utils.getContent)(elementArray);

  dom.el = (0, _element.newDomElement)(dom.parent, tag);
  dom.el.innerHTML = (0, _utils.validateContent)(content);

  dom.parent = dom.el;
  (0, _renderer.traverse)(component, dom, elementArray);
  dom.parent = dom.parent.parentNode;
};

var renderElementArray = function renderElementArray(component, dom, elementArray) {
  var tag = (0, _utils.getTag)(elementArray);
  if ((0, _component.isComponent)(tag)) {
    var subElement = (0, _element.newDomElement)(dom.parent, 'div');
    var subComponent = (0, _component.buildComponent)(dom, elementArray, component.key);
    (0, _renderer.render)(subComponent, subElement);
    for (var j = 1; j < elementArray.length; j++) {
      (0, _utils.applySelector)(subElement, elementArray[j]);
    }
  } else {
    buildElement(component, dom, elementArray);
  }
};
exports.renderElementArray = renderElementArray;

},{"./component":1,"./element":4,"./exr":6,"./renderer":7,"./utils":9}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _utils = require('./utils');

var _exr = require('./exr');

var _core = require('./core');

var Directives = [{
  regex: (0, _exr.GET)('ATTR'),
  method: function method(component, dom, val) {
    var attribute = (0, _utils.getAttribute)(component, val);
    dom.el.setAttribute(attribute.attr, attribute.value);
  }
}, {
  regex: (0, _exr.GET)('DATA'),
  method: function method(component, dom, val) {
    var data = (0, _utils.getDataFromVar)(component, val);
    if (!(0, _utils.applySelector)(dom.el, data)) dom.el.innerHTML = data;
  }
}, {
  regex: (0, _exr.GET)('EVENT'),
  method: function method(component, dom, val) {
    var format = val.replace('!', '').replace(/\s/, '').split(':');
    dom.el[format[0]] = function (e) {
      component[format[1]](component, e);
    };
  }
}, {
  regex: (0, _exr.GET)('IF'),
  method: function method(component, dom, val) {
    var exp = val.replace(/^\?\s+/, '');
    if ((0, _exr.CHECK)(exp, 'DATA')) {
      var data = component.data[(0, _exr.REPLACE)(exp, 'DATA', '')];
      if (!data) dom.el.style.display = 'none';
    }
  }
}, {
  regex: (0, _exr.GET)('FOR'),
  method: function method(component, dom, val, template) {
    var args = val.replace((0, _exr.GET)('FOR'), '').split(/\s+\in\s+/);
    var data = component.data[args[1].replace((0, _exr.GET)('DATA'), '')];
    var temp = args[0].replace((0, _exr.GET)('DATA'), '');
    for (var item in data) {
      component.data[temp] = data[item];
      (0, _core.renderElementArray)(component, dom, (0, _utils.getContent)(template));
    }
    return true;
  }
}];

var driveDirectives = function driveDirectives(val, dom, component, template) {
  var skipped = false;
  Directives.forEach(function (directive) {
    if (val.match(directive.regex)) {
      var skip = directive.method(component, dom, val, template);
      if (skip) skipped = true;
    }
  });
  return skipped;
};
exports.driveDirectives = driveDirectives;

},{"./core":2,"./exr":6,"./utils":9}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _exr = require('./exr');

var _utils = require('./utils');

var newDomElement = function newDomElement(parent, type) {
  var tag = type || 'span';
  if ((0, _exr.CHECK)(tag, 'ID') || (0, _exr.CHECK)(tag, 'CLAS')) {
    var child = document.createElement('div');
    (0, _utils.applySelector)(child, tag);
  } else var child = document.createElement(tag);
  // child.parent = parent;
  parent.appendChild(child);
  return child;
};
exports.newDomElement = newDomElement;

},{"./exr":6,"./utils":9}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _renderer = require('./renderer');

var cssContainer = document.createElement('div');
cssContainer.id = '--rendered-styles';
document.body.appendChild(cssContainer);

var Schema = {};
Schema.engine = _renderer.render;

exports['default'] = Schema;
module.exports = exports['default'];

},{"./renderer":7}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var EXRs = {
  ATTR: /^[a-z,A-Z,-]+\:\s/,
  ID: /^\#/,
  CLAS: /(^|\s+)\./g,
  DATA: /^\$/,
  EVENT: /^\!/,
  TRANS: /^\>/,
  IF: /^\?\s+/,
  FOR: /^\%\s+/,
  WRAP: /^\[[a-z,A-Z,0-9,-]+\]/
};

var CHECK = function CHECK(test, expression) {
  return test.match(EXRs[expression]);
};

exports.CHECK = CHECK;
var REPLACE = function REPLACE(val, expression, replacement) {
  return val.replace(EXRs[expression], replacement);
};

exports.REPLACE = REPLACE;
var GET = function GET(expression) {
  return EXRs[expression];
};
exports.GET = GET;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _directives = require('./directives');

var _styles = require('./styles');

var _core = require('./core');

var _utils = require('./utils');

var _exr = require('./exr');

var render = function render(component, root) {

  // the top most root (parent component) must be cleared on rerender
  root.innerHTML = '';
  component.root = root;

  // a key is used for style scope
  if (!component.key) component.key = (0, _utils.generateKey)(8);
  component.root.className = component.key;

  // dom object keeps track of dom parent/child relationships during traversal
  var dom = {
    parent: root,
    el: null
  };

  // attach setData to the schema object
  component.setData = function (data) {
    for (var item in data) {
      component.data[item] = data[item];
    }
    render(component, component.root);
  };
  component.setStyles = function (styles) {
    (0, _styles.renderCSS)(styles, component);
  };

  traverse(component, dom, [component.template]);

  if (component.styles) (0, _styles.renderCSS)(component.styles, component);

  if (component.init && !component.rendered) {
    component.rendered = true;
    component.init(component);
  }

  // console.log(root.innerHTML);
};

exports.render = render;
var traverse = function traverse(component, dom, template) {

  for (var i = 0; i < template.length; i++) {
    var val = template[i];
    if (typeof val == 'string') {
      if ((0, _utils.applySelector)(dom.el, val)) continue;

      var skip = (0, _directives.driveDirectives)(val, dom, component, template);
      if (skip) i = template.length - 1;

      if ((0, _exr.CHECK)(val, 'TRANS')) val = component.content;
    }
    if (Array.isArray(val)) {
      (0, _core.renderElementArray)(component, dom, val);
    }
  }
};
exports.traverse = traverse;

},{"./core":2,"./directives":3,"./exr":6,"./styles":8,"./utils":9}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var events = {};
var nestings = [];

var setEvent = function setEvent(event, fn) {
  if (!events[event]) events[event] = [];
  events[event].push(fn);
};

var triggerEvent = function triggerEvent(event) {
  events[event].forEach(function (e) {
    e();
  });
};

var directives = {
  '!': function _(arr, id, component) {
    var event = arr[0].replace('!', '');
    var morph = cloneSwitch(arr, id);
    var el = component.root.querySelectorAll(id)[0];
    var isTrigger = arr[1].match(/^\@/);
    if (isTrigger) el[event] = function () {
      triggerEvent(arr[1]);
    };else el[event] = function () {
      component.setStyles([morph]);
    };
    return '';
  },
  '@': function _(arr, id, component) {
    var binding = arr[0].replace(/^\@/, '');
    var morph = cloneSwitch(arr, id);
    setEvent(arr[0], function () {
      component.setStyles([morph]);
    });
    return '';
  },
  '>': function _(arr, id) {
    arr[0] = id + arr[0].replace('>', '');
    nestings.push(arr);
    return '';
  },
  'DEFAULT': function DEFAULT(arr, id, component) {
    return compile([arr], component);
  }
};

var cloneSwitch = function cloneSwitch(arr, selector) {
  var morph = arr.slice();
  morph[0] = selector;
  return morph;
};

var isInclude = function isInclude(test) {
  return test.match(/^\*$/);
};

var compile = function compile(styles, component, naked) {
  var css = '';
  styles.map(function (style) {
    var id = style[0];
    if (!naked) css += '.' + component.key + ' ' + id + '{';
    style.map(function (attr, i) {
      if (i == 0) return;
      var token = attr[0][0];
      if (Array.isArray(attr)) {
        if (isInclude(token)) css += compile([attr], component, true);else (directives[token] || directives['DEFAULT'])(attr, id, component);
        return;
      } else {
        css += attr.replace(/\s+/, ':') + ';';
      }
    });
    if (!naked) css += '}';
  });
  return css;
};

var renderCSS = function renderCSS(styles, component) {
  var css = '';
  css += compile(styles, component);
  if (nestings.length > 0) {
    css += compile(nestings, component);
    nestings = [];
  }
  mount(css, component);
};

exports.renderCSS = renderCSS;
var mount = function mount(cssString, component) {
  var id = 'rs-' + component.key + cssString.length;
  var mounted = document.getElementById(id);
  if (!mounted) {
    var stylesContainer = document.getElementById('--rendered-styles');
    mounted = document.createElement('style');
    mounted.id = id;
    stylesContainer.appendChild(mounted);
  }
  mounted.innerHTML = cssString;
};

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _exrJs = require('./exr.js');

var generateKey = function generateKey(length) {
  var key = '';
  var chars = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
  for (var i = 0; i < length; i++) {
    key += chars[Math.floor(Math.random() * (chars.length - 1) + 1)];
  }
  return key;
};

exports.generateKey = generateKey;
var getAttribute = function getAttribute(obj, val) {
  var attr = val.match(/^[a-z,A-Z,-]+/)[0];
  var value = (0, _exrJs.REPLACE)(val, 'ATTR', '');
  if ((0, _exrJs.CHECK)(value, 'DATA')) {
    value = getDataFromVar(obj, value);
  }
  return { value: value, attr: attr };
};

exports.getAttribute = getAttribute;
var applySelector = function applySelector(el, val) {
  if (typeof val != 'string') return false;
  if ((0, _exrJs.CHECK)(val, 'ID')) el.id = (0, _exrJs.REPLACE)(val, 'ID', '');else if ((0, _exrJs.CHECK)(val, 'CLAS')) el.className = (0, _exrJs.REPLACE)(val, 'CLAS', ' ');else return false;
  return true;
};

exports.applySelector = applySelector;
var getElementPath = function getElementPath(el) {
  var path = el.nodeName;
  var current = el;
  var parent = el.parentNode;
  while (parent) {
    for (var child in parent.children) {
      if (parent.children[child] == current) path = parent.nodeName + '[' + child + ']' + '/' + path;
    }
    current = parent;
    parent = parent.parentNode;
  }
  return path;
};

exports.getElementPath = getElementPath;
var getDataFromVar = function getDataFromVar(obj, value) {
  var prop = (0, _exrJs.REPLACE)(value, 'DATA', '');
  var data = null;
  if (prop.match(/\./)) {
    var path = prop.split(/\./);
    data = obj.data[path[0]][path[1]];
  } else data = obj.data[prop];
  return data;
};

exports.getDataFromVar = getDataFromVar;
var getTag = function getTag(elementArray) {
  return elementArray[0];
};

exports.getTag = getTag;
var getContent = function getContent(elementArray) {
  return elementArray[elementArray.length - 1];
};

exports.getContent = getContent;
var validateContent = function validateContent(content) {
  if (typeof content == 'string' && !(0, _exrJs.CHECK)(content, 'TRANS')) return content;else return '';
};
exports.validateContent = validateContent;

},{"./exr.js":6}]},{},[5])(5)
});