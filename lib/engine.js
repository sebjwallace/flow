"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _renderer = require('./renderer');

var cssContainer = document.createElement('div');
cssContainer.id = '--rendered-styles';
document.body.appendChild(cssContainer);

var Schema = {};
Schema.engine = _renderer.render;

exports.default = Schema;