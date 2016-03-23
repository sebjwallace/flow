'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.traverse = exports.render = undefined;

var _jassJs = require('jass-js');

var _directives = require('./directives');

var _core = require('./core');

var _utils = require('./utils');

var _exr = require('./exr');

var render = exports.render = function render(obj, root) {

  root.innerHTML = '';
  obj.root = root;

  var dom = {};
  dom.parent = root;
  dom.el = null;

  obj.setData = function (data) {
    for (var item in data) {
      obj.data[item] = data[item];
    }
    render(obj, obj.root);
  };

  traverse(obj, dom, [obj.template]);

  if (obj.styles) {
    (function () {
      var styles = new _jassJs.JASS.Component(obj.styles);
      obj.root.className = styles.className();
      obj.setStyles = function (set) {
        styles.setStyles(set);
      };
    })();
  }

  if (obj.init && !obj.rendered) {
    obj.rendered = true;
    obj.init(obj);
  }

  // console.log(root.innerHTML);
};

var traverse = exports.traverse = function traverse(obj, dom, node) {

  for (var i = 0; i < node.length; i++) {
    var val = node[i];
    if (typeof val == 'string') {
      if ((0, _utils.applySelector)(dom.el, val)) continue;

      for (var directive in _directives.Directives) {
        if (val.match(_directives.Directives[directive].regex)) {
          var skip = _directives.Directives[directive].method(obj, dom, val, node);
          if (skip) i = node.length - 1;
        }
      }

      if ((0, _exr.CHECK)(val, 'TRANS')) val = obj.content;
    }
    if (Array.isArray(val)) {
      (0, _core.buildElement)(obj, dom, val);
    }
  }
};