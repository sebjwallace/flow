"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _jassJs = require('jass-js');

var _directives = require('./directives');

var _utils = require('./utils');

var ATTR = /^[a-z,A-Z,-]+\:\s/;
var ID = /^\#/;
var CLAS = /(^|\s+)\./g;
var DATA = /^\$/;
var EVENT = /^\!/;
var TRANS = /^\>/;
var IF = /^\?\s+/;
var FOR = /^\%\s+/;
var WRAP = /^\[[a-z,A-Z,0-9,-]+\]/;

var Components = [];

var newElement = function newElement(parent, type) {
  var tag = type || 'span';
  if (tag.match(ID) || tag.match(CLAS)) {
    var child = document.createElement('div');
    (0, _utils.applySelector)(child, tag);
  } else var child = document.createElement(tag);
  child.parent = parent;
  parent.appendChild(child);
  return child;
};

var buildComponent = function buildComponent(dom, elementArray) {
  var componentID = (0, _utils.getComponentId)(dom.parent);
  if (Components[componentID]) return Components[componentID];else {
    var component = elementArray[0];
    var injectData = elementArray[1];
    var content = elementArray[elementArray.length - 1];
    var instance = Object.create(component);
    if (component.data) {
      instance.data = JSON.parse(JSON.stringify(component.data));
      for (var data in injectData) {
        instance.data[data] = injectData[data];
      }
    }
    instance.content = content;
    Components[componentID] = instance;
    return instance;
  }
};

var generateElement = function generateElement(obj, dom, elementArray) {
  var tag = elementArray[0];
  var content = elementArray[elementArray.length - 1];
  dom.el = newElement(dom.parent, tag);
  if (typeof content == 'string' && !content.match(TRANS)) dom.el.innerHTML = content;
  dom.parent = dom.el;
  traverse(obj, dom, elementArray);
  dom.parent = dom.parent.parentNode;
};

var buildElement = function buildElement(obj, dom, elementArray) {
  var tag = elementArray[0];
  if ((typeof tag === 'undefined' ? 'undefined' : _typeof(tag)) == 'object') {
    var sub = newElement(dom.parent, 'div');
    var component = buildComponent(dom, elementArray);
    render(component, sub);
    for (var j = 1; j < elementArray.length; j++) {
      (0, _utils.applySelector)(sub, elementArray[j]);
    }
  } else {
    generateElement(obj, dom, elementArray);
  }
};

var render = function render(obj, root) {

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

var traverse = function traverse(obj, dom, node) {

  for (var i = 0; i < node.length; i++) {

    var val = node[i];

    if (typeof val == 'string') {

      if ((0, _utils.applySelector)(dom.el, val)) continue;

      for (var directive in _directives.Directives) {
        if (val.match(_directives.Directives[directive].regex)) _directives.Directives[directive].method(obj, dom, val);
      }

      if (val.match(FOR)) {
        var args = val.replace(FOR, '').split(/\s+\in\s+/);
        var data = obj.data[args[1].replace(DATA, '')];
        var temp = args[0].replace(DATA, '');
        for (var item in data) {
          obj.data[temp] = data[item];
          buildElement(obj, dom, node[node.length - 1]);
        }
        i = node.length;
      } else if (val.match(WRAP)) {
        //  const tag = val.replace(/[\[|\]]/g,'');
        //  const newParent = newElement(dom.parent.parentNode,tag);
        //  newParent.appendChild(dom.parent);
        //  dom.parent = newParent.children[0];
      }
    }

    if (Array.isArray(val)) {
      buildElement(obj, dom, val);
    }
  }
};

var SchemaEngine = function SchemaEngine() {

  this.render = render;
};

exports.default = SchemaEngine;