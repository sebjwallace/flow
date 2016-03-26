'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.traverse = exports.render = undefined;

var _jassJs = require('jass-js');

var _directives = require('./directives');

var _styles = require('./styles');

var _core = require('./core');

var _utils = require('./utils');

var _exr = require('./exr');

var render = exports.render = function render(component, root) {

  // the top most root (parent component) must be cleared on rerender
  root.innerHTML = '';
  component.root = root;

  // a key is used for style scope
  if (!component.key) component.key = (0, _utils.generateKey)(8);
  component.root.className = component.key;

  // dom object keeps track of dom parent/child relationships during traversal
  var dom = {
    parent: root,
    el: null
  };

  // attach setData to the schema object
  component.setData = function (data) {
    for (var item in data) {
      component.data[item] = data[item];
    }
    render(component, component.root);
  };
  component.setStyles = function (styles) {
    (0, _styles.renderCSS)(styles, component);
  };

  traverse(component, dom, [component.template]);

  var css = (0, _styles.renderCSS)(component.styles, component);
  if (component.styles && !component.renderedCSS) component.renderedCSS = true;

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