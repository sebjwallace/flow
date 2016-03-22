"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _jassJs = require('jass-js');

var SchemaEngine = function SchemaEngine() {

  var components = [];

  var ATTR = /^[a-z,A-Z,-]+\:\s/;
  var ID = /^\#/;
  var CLAS = /(^|\s+)\./g;
  var DATA = /^\$/;
  var EVENT = /^\!/;
  var TRANS = /^\>/;
  var IF = /^\?\s+/;
  var FOR = /^\%\s+/;
  var WRAP = /^\[[a-z,A-Z,0-9,-]+\]/;

  var render = function render(obj, root, trans) {

    root.innerHTML = '';
    obj.root = root;

    var dom = {};
    dom.parent = root;
    dom.el = null;

    obj.setData = function (data) {
      for (var item in data) {
        obj.data[item] = data[item];
      }
      render(obj, obj.root, obj.trans);
    };

    var newElement = function newElement(parent, type) {
      var tag = type || 'span';
      if (tag.match(ID)) {
        var child = document.createElement('div');
        child.id = tag.replace(ID, '');
      } else if (tag.match(CLAS)) {
        var child = document.createElement('div');
        child.className = tag.replace(CLAS, '');
      } else {
        var child = document.createElement(tag);
      }
      child.parent = parent;
      parent.appendChild(child);
      return child;
    };

    var buildElement = function buildElement(obj, dom, val) {
      var tag = val[0];
      var content = val[val.length - 1];
      if ((typeof tag === 'undefined' ? 'undefined' : _typeof(tag)) == 'object') {
        var component = tag;
        var sub = newElement(dom.parent, 'div');
        var componentID = getComponentId(dom.parent);
        if (components[componentID]) render(components[componentID], sub, content);else {
          var instance = Object.create(component);
          if (component.data) {
            instance.data = JSON.parse(JSON.stringify(component.data));
            for (var data in val[1]) {
              instance.data[data] = val[1][data];
            }
          }
          components[componentID] = instance;
          render(instance, sub, content);
        }
        for (var j = 1; j < val.length; j++) {
          applySelector(sub, val[j]);
        }
      } else {
        dom.el = newElement(dom.parent, tag);
        if (typeof content == 'string' && !content.match(TRANS)) dom.el.innerHTML = content;
        dom.parent = dom.el;
        traverse(val);
        dom.parent = dom.parent.parent;
      }
    };

    var applySelector = function applySelector(el, val) {
      if (typeof val != 'string') return false;
      if (val.match(ID)) el.id = val.replace(ID, '');else if (val.match(CLAS)) el.className = val.replace(CLAS, ' ');else return false;
      return true;
    };

    var getElementPath = function getElementPath(el) {
      var path = el.nodeName;
      var current = el;
      var parent = el.parentNode;
      while (parent) {
        for (var child in parent.children) {
          if (parent.children[child] == current) path = parent.nodeName + '[' + child + ']' + '/' + path;
        }
        current = parent;
        parent = parent.parentNode;
      }
      return path;
    };

    var getComponentId = function getComponentId(el) {
      return getElementPath(el) + el.children.length;
    };

    var getDataFromVar = function getDataFromVar(obj, value) {
      var prop = value.replace(DATA, '');
      var data = null;
      if (prop.match(/\./)) {
        var path = prop.split(/\./);
        data = obj.data[path[0]][path[1]];
      } else data = obj.data[prop];
      return data;
    };

    var traverse = function traverse(node) {

      for (var i = 0; i < node.length; i++) {

        var val = node[i];

        if (typeof val == 'string') {

          if (applySelector(dom.el, val)) continue;

          if (val.match(ATTR)) {
            var attr = val.match(/^[a-z,A-Z,-]+/)[0];
            var value = val.replace(ATTR, '');
            if (value.match(DATA)) {
              value = getDataFromVar(obj, value);
            }
            dom.el.setAttribute(attr, value);
          } else if (val.match(DATA)) {
            var data = getDataFromVar(obj, val);
            if (Array.isArray(data)) {
              val = data;dom.el.innerHTML = '';
            } else dom.el.innerHTML = data;
          } else if (val.match(EVENT)) {
            var format = val.replace('!', '').replace(/\s/, '').split(':');
            dom.el[format[0]] = function (e) {
              obj[format[1]](obj, e);
            };
          } else if (val.match(TRANS)) {
            val = trans;
            obj.trans = trans;
          } else if (val.match(IF)) {
            var exp = val.replace(IF, '');
            if (exp.match(DATA)) {
              var _data = obj.data[exp.replace(DATA, '')];
              if (!_data) dom.el.style.display = 'none';
            }
          } else if (val.match(FOR)) {
            var args = val.replace(FOR, '').split(/\s+\in\s+/);
            var _data2 = obj.data[args[1].replace(DATA, '')];
            var temp = args[0].replace(DATA, '');
            for (var item in _data2) {
              obj.data[temp] = _data2[item];
              buildElement(obj, dom, node[node.length - 1]);
            }
            i = node.length;
          } else if (val.match(WRAP)) {
            var tag = val.replace(/[\[|\]]/g, '');
            var newParent = newElement(dom.parent.parent, tag);
            newParent.appendChild(dom.parent);
            dom.parent = newParent.children[0];
          }
        }

        if (Array.isArray(val)) {
          buildElement(obj, dom, val);
        }
      }
    };
    traverse([obj.template]);

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

  this.render = render;
};

exports.default = SchemaEngine;