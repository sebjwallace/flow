'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.traverse = exports.render = undefined;

var _directives = require('./directives');

var _filters = require('./filters');

var _styles = require('./styles');

var _core = require('./core');

var _utils = require('./utils');

var _exr = require('./exr');

var _model = require('./model');

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
  component.emit = function (action) {
    (0, _model.dispatch)(action);
  };

  if (!component.rendered) {
    component.models = {};

    var _loop = function _loop(data) {
      var val = component.data[data];
      if (typeof val != 'string') return 'continue';
      if (val[0] == '@') {
        var modelName = val.replace('@', '');
        component.data[data] = (0, _model.attach)(modelName, component);
        component.models[modelName] = function (incomming) {
          component.data[data] = incomming;
        };
      }
    };

    for (var data in component.data) {
      var _ret = _loop(data);

      if (_ret === 'continue') continue;
    }
    if (component.boot) component.boot(component);
  }

  if (typeof component.template == 'function') traverse(component, dom, [component.template(component)]);else traverse(component, dom, [component.template]);

  if (component.styles) (0, _styles.renderCSS)(component.styles, component);

  if (component.init && !component.rendered) {
    component.rendered = true;
    component.init(component);
  }

  component.rendered = true;

  // console.log(root.innerHTML);
};

var traverse = exports.traverse = function traverse(component, dom, template) {

  for (var i = 0; i < template.length; i++) {
    var _val = template[i];

    if (typeof _val == 'function') {
      _val = _val(component);
    }
    if (Array.isArray(_val)) {
      _val = (0, _filters.driveFilters)(component, _val);
    }

    if (typeof _val == 'string') {
      if ((0, _utils.applySelector)(dom.el, _val)) continue;

      var skip = (0, _directives.driveDirectives)(_val, dom, component, template);
      if (skip) i = template.length - 1;

      if ((0, _exr.CHECK)(_val, 'TRANS')) _val = component.content;
    }

    if (Array.isArray(_val)) {
      (0, _core.renderElementArray)(component, dom, _val);
    }
  }
};