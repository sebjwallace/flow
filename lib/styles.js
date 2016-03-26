'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var events = {};

var setEvent = function setEvent(event, fn) {
  if (!events[event]) events[event] = [];
  events[event].push(fn);
};

var triggerEvent = function triggerEvent(event) {
  events[event].forEach(function (e) {
    e();
  });
};

var nestings = [];

var compile = function compile(styles, component, naked) {
  var css = '';
  styles.map(function (style) {
    var id = style[0];
    if (!naked) css += '.' + component.key + ' ' + id + '{';
    style.map(function (attr, i) {
      if (i == 0) return;
      if (Array.isArray(attr)) {
        if (attr[0].match(/^\*$/)) css += compile([attr], component, true);else if (attr[0].match(/^\>\s+/)) {
          attr[0] = style[0] + attr[0].replace('>', '');
          nestings.push(attr);
        } else if (attr[0].match(/^\!/)) {
          (function () {
            var event = attr[0].replace('!', '');
            var morph = attr.slice();
            morph[0] = style[0];
            var scope = document.getElementsByClassName(component.key)[0];
            var el = scope.querySelectorAll(style[0])[0];
            var isTrigger = attr[1].match(/^\@/);
            if (isTrigger) el[event] = function () {
              triggerEvent(attr[1]);
            };else el[event] = function () {
              component.setStyles([morph]);
            };
          })();
        } else if (attr[0].match(/^\@/)) {
          (function () {
            var binding = attr[0].replace(/^\@/, '');
            var morph = attr.slice();
            morph[0] = style[0];
            setEvent(attr[0], function () {
              component.setStyles([morph]);
            });
          })();
        } else css += compile([attr], component);
        return;
      } else {
        css += attr.replace(/\s+/, ':') + ';';
      }
    });
    if (!naked) css += '}';
  });
  return css;
};

var renderCSS = exports.renderCSS = function renderCSS(styles, component) {
  var css = '';
  css += compile(styles, component);
  if (nestings.length > 0) {
    css += compile(nestings, component);
    nestings = [];
  }
  mount(css, component);
};

var mount = function mount(cssString, component) {
  var id = 'rs-' + component.key + cssString.length;
  var mounted = document.getElementById(id);
  if (!mounted) {
    var stylesContainer = document.getElementById('--rendered-styles');
    mounted = document.createElement('style');
    mounted.id = id;
    stylesContainer.appendChild(mounted);
  }
  mounted.innerHTML = cssString;
};