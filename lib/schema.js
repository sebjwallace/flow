"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _jassJs = require('jass-js');

var SchemaEngine = function SchemaEngine() {

  var store = [];

  var HREF = /^\href:\s+/;
  var ID = /^\#/;
  var CLAS = /^\./;
  var DATA = /^\@/;
  var EVENT = /^\!/;
  var TRANS = /^\>/;

  var level = 0;

  var render = function render(obj, root, trans) {

    root.innerHTML = '';
    obj.root = root;
    var parent = root;
    var el = null;
    var stack = [];

    obj.setData = function (data) {
      for (var item in data) {
        obj.data[item] = data[item];
      }
      render(obj, obj.root, obj.trans);
    };

    var newElement = function newElement(parent, type) {
      var tag = type || 'span';
      var child = document.createElement(tag);
      child.parent = el;
      parent.appendChild(child);
      return child;
    };

    var traverse = function traverse(node) {

      for (var i = 0; i < node.length; i++) {

        var prop = i;
        var val = node[i];

        if (typeof val == 'string') {

          if (val.match(HREF)) el.href = val.replace(HREF, '');else if (val.match(ID)) el.id = val.replace(ID, '');else if (val.match(CLAS)) el.className = val.replace(CLAS, '');else if (val.match(DATA)) el.innerHTML = obj.data[val.replace(DATA, '')];else if (val.match(EVENT)) {
            var format = val.replace('!', '').replace(/\s/, '').split(':');
            el[format[0]] = function (e) {
              obj[format[1]](obj, e);
            };
          } else if (val.match(TRANS)) {
            val = trans;
            obj.trans = trans;
          }
        }

        if (Array.isArray(val)) {
          if (_typeof(val[0]) == 'object') {
            var sub = newElement(parent);
            if (store[el]) {
              render(store[el], sub, val[val.length - 1]);
            } else {
              var instance = Object.create(val[0]);
              instance.data = JSON.parse(JSON.stringify(val[0].data));
              for (var j = 1; j < val.length - 1; j++) {
                var keyVal = val[j].replace(/\s+/g, '').split(':');
                instance.data[keyVal[0]] = keyVal[1];
              }
              store[el] = instance;
              var styles = new _jassJs.JASS.Component(obj.styles);
              obj.root.className = styles.className();
              render(instance, sub, val[val.length - 1]);
            }
          } else {
            el = newElement(parent, val[0]);
            var content = val[val.length - 1];
            if (typeof content == 'string' && !content.match(TRANS)) el.innerHTML = val[val.length - 1];
            parent = el;
            stack[level] = el;
            level++;
            traverse(val);
            level--;
            parent = stack[level].parent;
          }
        }
      }
    };

    traverse([obj.template]);
  };

  this.render = render;
};

exports.default = SchemaEngine;