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
  var DATA = /^\@/;
  var EVENT = /^\!/;
  var TRANS = /^\>/;

  var level = 0;

  var render = function render(obj, root, trans) {

    root.innerHTML = '';
    obj.root = root;
    var parent = root;
    var el = null;

    // for(var item in obj){
    //   if(typeof obj[item] == 'function')
    //     obj[item] = (arguments) => { obj[item](arguments).bind(obj); }
    // }

    if (obj.styles) {
      var styles = new _jassJs.JASS.Component(obj.styles);
      obj.root.className = styles.className();
    }

    obj.setData = function (data) {
      for (var item in data) {
        obj.data[item] = data[item];
      }
      render(obj, obj.root, obj.trans);
    };

    var newElement = function newElement(obj, parent, type) {
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

    var traverse = function traverse(node) {

      for (var i = 0; i < node.length; i++) {

        var val = node[i];

        if (typeof val == 'string') {

          if (applySelector(el, val)) continue;

          if (val.match(ATTR)) el.setAttribute([val.match(/^[a-z,A-Z,-]+/)[0]], val.replace(ATTR, ''));else if (val.match(DATA)) {
            var _data = obj.data[val.replace(DATA, '')];
            if (Array.isArray(_data)) {
              val = _data;el.innerHTML = '';
            } else el.innerHTML = _data;
          } else if (val.match(EVENT)) {
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
          var tag = val[0];
          var content = val[val.length - 1];
          if ((typeof tag === 'undefined' ? 'undefined' : _typeof(tag)) == 'object') {
            var component = tag;
            var sub = newElement(obj, parent, 'div');
            var componentID = getComponentId(parent);
            //  console.log(componentID);
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
            el = newElement(obj, parent, tag);
            if (typeof content == 'string' && !content.match(TRANS)) el.innerHTML = content;
            parent = el;
            traverse(val);
            parent = parent.parent;
          }
        }
      }
    };
    traverse([obj.template]);
    // console.log(root.innerHTML);
  };

  this.render = render;
};

exports.default = SchemaEngine;