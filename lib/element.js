'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newDomElement = undefined;

var _exr = require('./exr');

var _utils = require('./utils');

var newDomElement = exports.newDomElement = function newDomElement(parent, type) {
  var tag = type || 'span';
  if ((0, _exr.CHECK)(tag, 'ID') || (0, _exr.CHECK)(tag, 'CLAS')) {
    var child = document.createElement('div');
    (0, _utils.applySelector)(child, tag);
  } else var child = document.createElement(tag);
  // child.parent = parent;
  parent.appendChild(child);
  return child;
};