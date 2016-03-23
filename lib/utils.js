'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDataFromVar = exports.getComponentId = exports.getElementPath = exports.applySelector = exports.getAttribute = undefined;

var _exr = require('./exr.js');

var getAttribute = exports.getAttribute = function getAttribute(obj, val) {
  var attr = val.match(/^[a-z,A-Z,-]+/)[0];
  var value = (0, _exr.REPLACE)(val, 'ATTR', '');
  if ((0, _exr.CHECK)(value, 'DATA')) {
    value = getDataFromVar(obj, value);
  }
  return { value: value, attr: attr };
};

var applySelector = exports.applySelector = function applySelector(el, val) {
  if (typeof val != 'string') return false;
  if ((0, _exr.CHECK)(val, 'ID')) el.id = (0, _exr.REPLACE)(val, 'ID', '');else if ((0, _exr.CHECK)(val, 'CLAS')) el.className = (0, _exr.REPLACE)(val, 'CLAS', ' ');else return false;
  return true;
};

var getElementPath = exports.getElementPath = function getElementPath(el) {
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

var getComponentId = exports.getComponentId = function getComponentId(el) {
  return getElementPath(el) + el.children.length;
};

var getDataFromVar = exports.getDataFromVar = function getDataFromVar(obj, value) {
  var prop = (0, _exr.REPLACE)(value, 'DATA', '');
  var data = null;
  if (prop.match(/\./)) {
    var path = prop.split(/\./);
    data = obj.data[path[0]][path[1]];
  } else data = obj.data[prop];
  return data;
};