(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Schema = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _utils = require('./utils');

var Components = [];

var clean = function clean() {
  Components = [];
};

exports.clean = clean;
var setComponent = function setComponent(componentID, component) {
  Components[componentID] = component;
};

var getComponent = function getComponent(componentID) {
  return Components[componentID];
};

var getComponentId = function getComponentId(el, key) {
  return (0, _utils.getElementPath)(el) + el.children.length;
};

var formatData = function formatData(schema, data) {
  var formatted = undefined;
  if (Array.isArray(data)) formatted = [];else formatted = {};
  for (var item in data) {
    formatted[item] = (0, _utils.getDataFromVar)(schema, data[item]);
  }
  return formatted;
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
var buildComponent = function buildComponent(dom, elementArray, parentComponent) {
  var componentID = getComponentId(dom.parent);
  var component = getComponent(componentID);
  if (component) return component;else {
    var schema = elementArray[0];
    var injectData = formatData(parentComponent, elementArray[1]);
    var content = (0, _utils.getContent)(elementArray);
    var instance = instanciateComponent(schema, injectData);
    instance.content = content;
    setComponent(componentID, instance);
    return instance;
  }
};
exports.buildComponent = buildComponent;

},{"./utils":12}],2:[function(require,module,exports){
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
  var content = (0, _utils.getContent)(elementArray, component);

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
    var subComponent = (0, _component.buildComponent)(dom, elementArray, component);
    (0, _renderer.render)(subComponent, subElement);
    for (var j = 1; j < elementArray.length; j++) {
      (0, _utils.applySelector)(subElement, elementArray[j]);
    }
  } else {
    buildElement(component, dom, elementArray);
  }
};
exports.renderElementArray = renderElementArray;

},{"./component":1,"./element":4,"./exr":6,"./renderer":9,"./utils":12}],3:[function(require,module,exports){
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
    var domEvent = format[0];
    var event = format[1];
    var params = event.match(/\([\$a-z,A-Z.]+\)/);
    event = event.replace(/\([\$a-z,A-Z.]+\)/, '');
    if (params) {
      params = params[0].replace(/\(|\)/g, '').split(',');
      for (var param in params) {
        params[param] = (0, _utils.getDataFromVar)(component, params[param]);
      }
    }
    if (domEvent.match(/[0-9]/)) {
      dom.el.addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;
        if (key == domEvent) {
          var args = [component, e];
          args = args.concat(params);
          component[event].apply(undefined, args);
        }
      });
    } else {
      dom.el[domEvent] = function (e) {
        var args = [component, e];
        args = args.concat(params);
        component[event].apply(undefined, args);
      };
    }
  }
}, {
  regex: /^[a-z,A-Z]+\(\)/,
  method: function method(component, dom, val) {
    dom.el[val.replace(/\(\)/, '')]();
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
      component.data['$'] = item;
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

},{"./core":2,"./exr":6,"./utils":12}],4:[function(require,module,exports){
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
  parent.appendChild(child);
  return child;
};
exports.newDomElement = newDomElement;

},{"./exr":6,"./utils":12}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _renderer = require('./renderer');

var _component = require('./component');

var _model = require('./model');

var _route = require('./route');

var cssContainer = document.createElement('div');
cssContainer.id = '--rendered-styles';
document.body.appendChild(cssContainer);

var Schema = {};
Schema.engine = _renderer.render;
Schema.clean = _component.clean;
Schema.model = _model.model;

(0, _route.startRoute)();

exports['default'] = Schema;
module.exports = exports['default'];

},{"./component":1,"./model":8,"./renderer":9,"./route":10}],6:[function(require,module,exports){
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

var _utils = require('./utils');

var _route = require('./route');

var filters = {
  '==': function _(filterArray, component) {

    var f = filterArray.map(function (filter) {
      return (0, _utils.getDataFromVar)(component, filter);
    });

    if (f[1] == f[2]) return f[3];else if (f.length > 4) return f[4];
  },
  '/|': function _(filterArray, component) {
    var exp = filterArray[1];
    var match = (0, _route.matchRoute)(exp);
    if (!match) return false;
    var pa = (0, _utils.getDataFromVar)(component, filterArray[2]);
    var pb = (0, _utils.getDataFromVar)(component, filterArray[3]);
    if (pa != pb) return true;
  },
  '#/?': function _(filterArray) {
    var expected = filterArray[1];
    var r = filterArray[2];
    var uri = (0, _route.currentHash)().replace(/\#|\//g, '');
    if (expected == uri) return r;
  }
};

var driveFilters = function driveFilters(component, filterArray, dom) {
  var token = filterArray[0];
  if (filters[token]) return filters[token](filterArray, component, dom);else return filterArray;
};
exports.driveFilters = driveFilters;

},{"./route":10,"./utils":12}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _renderer = require('./renderer');

var models = [];
var events = [];
var history = [];

var model = function model(name, _model) {
  _model.data = null;
  _model.name = name;
  _model.listeners = [];
  models[name] = _model;
  for (var method in _model) {
    if (!events[method]) events[method] = [];
    if (method != 'init' || method != 'save' || method != 'load') events[method].push(_model);
  }
  if (_model.init) _model.data = _model.init(_model.data);
};

exports.model = model;
var attach = function attach(modelName, component) {
  models[modelName].listeners.push(component);
  return models[modelName].data;
};

exports.attach = attach;
var dispatch = function dispatch(action) {
  events[action.type].forEach(function (model) {
    var data = model[action.type](model.data, action, model);
    model.data = data;
    history.push(data);
    if (!model.listeners) return;
    model.listeners.forEach(function (listener) {
      listener.models[model.name](model.data);
      (0, _renderer.render)(listener, listener.root);
    });
  });
};
exports.dispatch = dispatch;

},{"./renderer":9}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _directives = require('./directives');

var _filters = require('./filters');

var _styles = require('./styles');

var _core = require('./core');

var _utils = require('./utils');

var _exr = require('./exr');

var _model = require('./model');

var _route = require('./route');

var render = function render(component, root) {

  // the top most root (parent component) must be cleared on rerender
  root.innerHTML = '';
  component.root = root;

  // a key is used for style scope
  if (!component.key) component.key = (0, _utils.generateKey)(4);
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
  component.emit = function (action) {
    (0, _model.dispatch)(action);
  };

  if (!component.rendered) {
    component.models = {};

    var _loop = function (data) {
      var val = component.data[data];
      if (typeof val != 'string') return 'continue';
      if (val[0] == '@') {
        var modelName = val.replace('@', '');
        component.data[data] = (0, _model.attach)(modelName, component);
        component.models[modelName] = function (incomming) {
          component.data[data] = incomming;
        };
      }
    };

    for (var data in component.data) {
      var _ret = _loop(data);

      if (_ret === 'continue') continue;
    }
    if (component.boot) component.boot(component);
    if (component.route) (0, _route.addRoute)(component.route, component);
  }

  if (typeof component.template == 'function') traverse(component, dom, [component.template(component)]);else traverse(component, dom, [component.template]);

  if (component.styles) (0, _styles.renderCSS)(component.styles, component);

  if (component.init && !component.rendered) {
    component.rendered = true;
    component.init(component);
  }

  component.rendered = true;

  // console.log(root.innerHTML);
};

exports.render = render;
var traverse = function traverse(component, dom, template) {

  for (var i = 0; i < template.length; i++) {
    var val = template[i];

    if (typeof val == 'function') {
      val = val(component);
    }
    if (Array.isArray(val)) {
      val = (0, _filters.driveFilters)(component, val, dom);
      if (val == true) return;
    }

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

},{"./core":2,"./directives":3,"./exr":6,"./filters":7,"./model":8,"./route":10,"./styles":11,"./utils":12}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _renderer = require('./renderer');

var routes = {};
var route = '';

var addRoute = function addRoute(exp, component) {
  routes[exp] = component;
};

exports.addRoute = addRoute;
var startRoute = function startRoute() {
  route = window.location.hash;

  window.onhashchange = function () {
    route = window.location.hash;

    for (var exp in routes) {
      if (matchRoute(exp)) {
        var component = routes[exp];
        (0, _renderer.render)(component, component.root);
      }
    }
  };
};

exports.startRoute = startRoute;
var matchRoute = function matchRoute(exp) {
  var reex = new RegExp(exp);
  if (route.match(reex)) return true;
};

exports.matchRoute = matchRoute;
var currentHash = function currentHash() {
  if (route == '' || route == '#') return '#';else return route;
};
exports.currentHash = currentHash;

},{"./renderer":9}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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
  // const attr = val.replace(/\s+/,'&').split('&')[0];
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
  if (typeof value != 'string') return value;
  var prop = (0, _exrJs.REPLACE)(value, 'DATA', '');
  if (prop == value) return value;
  var data = null;
  if (prop.match(/\./) && prop !== undefined) {
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
var getContent = function getContent(elementArray, component) {
  var content = elementArray[elementArray.length - 1];
  if (typeof content == 'function') return content(component);else return content;
};

exports.getContent = getContent;
var validateContent = function validateContent(content) {
  if (typeof content == 'string' && !(0, _exrJs.CHECK)(content, 'TRANS')) return content;else return '';
};
exports.validateContent = validateContent;

},{"./exr.js":6}]},{},[5])(5)
});