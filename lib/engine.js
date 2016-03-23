"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _renderer = require("./renderer");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SchemaEngine = function SchemaEngine() {
  _classCallCheck(this, SchemaEngine);

  this.render = _renderer.render;
};

exports.default = SchemaEngine;