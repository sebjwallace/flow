'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildComponent = exports.isComponent = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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

var isComponent = exports.isComponent = function isComponent(tag) {
  if ((typeof tag === 'undefined' ? 'undefined' : _typeof(tag)) == 'object') return true;else return false;
};

var buildComponent = exports.buildComponent = function buildComponent(dom, elementArray) {
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