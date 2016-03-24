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

var render = exports.render = function render(component, root) {

  root.innerHTML = '';
  component.root = root;

  var dom = {
    parent: root,
    el: null
  };

  component.setData = function (data) {
    for (var item in data) {
      component.data[item] = data[item];
    }
    render(component, component.root);
  };

  traverse(component, dom, [component.template]);

  if (component.styles) {
    (function () {
      var styles = new _jassJs.JASS.Component(component.styles);
      component.root.className = styles.className();
      component.setStyles = function (set) {
        styles.setStyles(set);
      };
    })();
  }

  if (component.init && !component.rendered) {
    component.rendered = true;
    component.init(component);
  }

  // console.log(root.innerHTML);
};

var traverse = exports.traverse = function traverse(component, dom, template) {

  for (var i = 0; i < template.length; i++) {
    var val = template[i];
    if (typeof val == 'string') {
      if ((0, _utils.applySelector)(dom.el, val)) continue;

      for (var directive in _directives.Directives) {
        if (val.match(_directives.Directives[directive].regex)) {
          var skip = _directives.Directives[directive].method(component, dom, val, template);
          if (skip) i = template.length - 1;
        }
      }

      if ((0, _exr.CHECK)(val, 'TRANS')) val = component.content;
    }
    if (Array.isArray(val)) {
      (0, _core.renderElementArray)(component, dom, val);
    }
  }
};