'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateContent = exports.getContent = exports.getTag = exports.getDataFromVar = exports.getElementPath = exports.applySelector = exports.getAttribute = exports.generateKey = undefined;

var _exr = require('./exr.js');

var generateKey = exports.generateKey = function generateKey(length) {
  var key = '';
  var chars = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
  for (var i = 0; i < length; i++) {
    key += chars[Math.floor(Math.random() * (chars.length - 1) + 1)];
  }
  return key;
};

var getAttribute = exports.getAttribute = function getAttribute(obj, val) {
  var attr = val.match(/^[a-z,A-Z,-]+/)[0];
  // const attr = val.replace(/\s+/,'&').split('&')[0];
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

var getDataFromVar = exports.getDataFromVar = function getDataFromVar(obj, value) {
  if (typeof value != 'string') return value;
  var prop = (0, _exr.REPLACE)(value, 'DATA', '');
  if (prop == value) return value;
  var data = null;
  if (prop.match(/\./) && prop !== undefined) {
    var path = prop.split(/\./);
    data = obj.data[path[0]][path[1]];
  } else data = obj.data[prop];
  return data;
};

var getTag = exports.getTag = function getTag(elementArray) {
  return elementArray[0];
};

var getContent = exports.getContent = function getContent(elementArray, component) {
  var content = elementArray[elementArray.length - 1];
  if (typeof content == 'function') return content(component);else return content;
};

var validateContent = exports.validateContent = function validateContent(content) {
  if (typeof content == 'string' && !(0, _exr.CHECK)(content, 'TRANS')) return content;else return '';
};