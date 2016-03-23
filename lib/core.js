'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildElement = exports.generateElement = exports.buildComponent = exports.newElement = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _exr = require('./exr');

var _utils = require('./utils');

var _renderer = require('./renderer');

var Components = [];

var newElement = exports.newElement = function newElement(parent, type) {
  var tag = type || 'span';
  if ((0, _exr.CHECK)(tag, 'ID') || (0, _exr.CHECK)(tag, 'CLAS')) {
    var child = document.createElement('div');
    (0, _utils.applySelector)(child, tag);
  } else var child = document.createElement(tag);
  child.parent = parent;
  parent.appendChild(child);
  return child;
};

var buildComponent = exports.buildComponent = function buildComponent(dom, elementArray) {
  var componentID = (0, _utils.getComponentId)(dom.parent);
  if (Components[componentID]) return Components[componentID];else {
    var component = elementArray[0];
    var injectData = elementArray[1];
    var content = elementArray[elementArray.length - 1];
    var instance = Object.create(component);
    if (component.data) {
      instance.data = JSON.parse(JSON.stringify(component.data));
      for (var data in injectData) {
        instance.data[data] = injectData[data];
      }
    }
    instance.content = content;
    Components[componentID] = instance;
    return instance;
  }
};

var generateElement = exports.generateElement = function generateElement(obj, dom, elementArray) {
  var tag = elementArray[0];
  var content = elementArray[elementArray.length - 1];
  dom.el = newElement(dom.parent, tag);
  if (typeof content == 'string' && !(0, _exr.CHECK)(content, 'TRANS')) dom.el.innerHTML = content;
  dom.parent = dom.el;
  (0, _renderer.traverse)(obj, dom, elementArray);
  dom.parent = dom.parent.parentNode;
};

var buildElement = exports.buildElement = function buildElement(obj, dom, elementArray) {
  var tag = elementArray[0];
  if ((typeof tag === 'undefined' ? 'undefined' : _typeof(tag)) == 'object') {
    var sub = newElement(dom.parent, 'div');
    var component = buildComponent(dom, elementArray);
    (0, _renderer.render)(component, sub);
    for (var j = 1; j < elementArray.length; j++) {
      (0, _utils.applySelector)(sub, elementArray[j]);
    }
  } else {
    generateElement(obj, dom, elementArray);
  }
};