"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _renderer = require('./renderer');

var _component = require('./component');

var _model = require('./model');

var cssContainer = document.createElement('div');
cssContainer.id = '--rendered-styles';
document.body.appendChild(cssContainer);

var Schema = {};
Schema.engine = _renderer.render;
Schema.clean = _component.clean;
Schema.model = _model.model;

exports.default = Schema;