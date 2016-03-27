'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var events = {};
var nestings = [];

var setEvent = function setEvent(event, fn) {
  if (!events[event]) events[event] = [];
  events[event].push(fn);
};

var triggerEvent = function triggerEvent(event) {
  events[event].forEach(function (e) {
    e();
  });
};

var directives = {
  '!': function _(arr, id, component) {
    var event = arr[0].replace('!', '');
    var morph = cloneSwitch(arr, id);
    var el = component.root.querySelectorAll(id)[0];
    var isTrigger = arr[1].match(/^\@/);
    if (isTrigger) el[event] = function () {
      triggerEvent(arr[1]);
    };else el[event] = function () {
      component.setStyles([morph]);
    };
    return '';
  },
  '@': function _(arr, id, component) {
    var binding = arr[0].replace(/^\@/, '');
    var morph = cloneSwitch(arr, id);
    setEvent(arr[0], function () {
      component.setStyles([morph]);
    });
    return '';
  },
  '>': function _(arr, id) {
    arr[0] = id + arr[0].replace('>', '');
    nestings.push(arr);
    return '';
  },
  'DEFAULT': function DEFAULT(arr, id, component) {
    return compile([arr], component);
  }
};

var cloneSwitch = function cloneSwitch(arr, selector) {
  var morph = arr.slice();
  morph[0] = selector;
  return morph;
};

var isInclude = function isInclude(test) {
  return test.match(/^\*$/);
};

var compile = function compile(styles, component, naked) {
  var css = '';
  styles.map(function (style) {
    var id = style[0];
    if (!naked) css += '.' + component.key + ' ' + id + '{';
    style.map(function (attr, i) {
      if (i == 0) return;
      var token = attr[0][0];
      if (Array.isArray(attr)) {
        if (isInclude(token)) css += compile([attr], component, true);else (directives[token] || directives['DEFAULT'])(attr, id, component);
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