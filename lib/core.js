'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.$ = $;

var vdom = require('virtual-dom');
var h = vdom.h;

var ajax = require('./ajax');
var $ajax = exports.$ajax = ajax;

var grid = require('./flexboxGrid');
grid.mount();

function DOM() {

  var _tree = vdom.h('#root', '');
  var _rootNode = vdom.create(_tree);
  document.body.appendChild(_rootNode);

  function _update(newTree) {
    var patches = vdom.diff(_tree, newTree);
    _rootNode = vdom.patch(_rootNode, patches);
    _tree = newTree;
  }
  return {
    render: function render(newTree) {
      _update(newTree);
    },
    update: function update() {
      _update(_tree);
    }
  };
}
var vDOM = new DOM();

window.onresize = function () {
  vDOM.update();
};

function isArray(arr) {
  return Array.isArray(arr);
}

function isObject(obj) {
  return !Array.isArray(obj) && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) == 'object';
}

function parseArgs(args) {
  return Array.prototype.slice.call(args);
}

function toArray(obj) {
  var arr = [];
  for (var i in obj) {
    arr.push(obj[i]);
  }return arr;
}

function parseUnits(args) {
  var args = parseArgs(args);
  var unit = 'px';
  if (typeof args[args.length - 1] == 'string') unit = args.splice(args.length - 1);
  return args.map(function (arg) {
    return arg += unit + ' ';
  });
}

function getInputType(input) {
  if (!input) return 'NULL';
  if (typeof input == 'function') return 'NULL';
  if (input.window) if (input.window = window.window) return 'NULL';
  if (typeof input == 'string') return 'TAG';
  if (input.type) if (input.type == 'vNodeChain') return 'CHAIN';
  if (Array.isArray(input)) return 'DATA';
  if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) == 'object') {
    if (Object.keys(input).length > 0) return 'DATA';
  }
}

function $(tag, attributes, children) {

  /**********************************
  * Private Methods
  **********************************/

  function _extend(abstracts) {
    abstracts.forEach(function (abstract) {
      var vNode = abstract.vNode();
      for (var prop in vNode.properties) {
        if (prop != 'style') _attributes[prop] = vNode.properties[prop];
      }
      var styles = vNode.properties.style;
      if (styles) {
        if (!_attributes.style) _attributes.style = {};
        for (var style in styles) {
          _attributes['style'][style] = styles[style];
        }
      }
      var abstractChildren = abstract.getChildren();
      for (var child in abstractChildren) {
        _children.push(abstractChildren[child]);
      }
    });
  }

  function _addAttribute(attr, value) {
    _attributes[attr] = value;
  }

  function _addStyle(attr, value) {
    if (!_attributes.style) _attributes.style = {};
    _attributes.style[attr] = value;
  }

  function addClass(name) {
    if (!_attributes.className) _attributes.className = '';
    _attributes.className += name + ' ';
  }

  function addChild(child) {
    _children.push(child);
  }

  function parseRGBA(rgba) {
    rgba = parseArgs(rgba);
    if (rgba.length == 3) return 'rgb(' + rgba.join(',') + ')';else if (rgba.length == 4) return 'rgba(' + rgba.join(',') + ')';
  }

  function parseColor(color) {
    if ((typeof color === 'undefined' ? 'undefined' : _typeof(color)) == 'object') color = color.rgbString();
    return color;
    return color;
  }

  function createHook(callback) {
    var Hook = function Hook() {};
    Hook.prototype.hook = function (node) {
      callback(node);
    };
    return new Hook();
  }

  function replaceDomNode(vNodeChain) {
    var vNode = vNodeChain.vNode();
    var el = vdom.create(vNode);
    domElement.innerHTML = '';
    domElement.removeAttribute('style');
    domElement.appendChild(el);
  }

  function onReturn() {
    return chain;
  }

  /**********************************
  * Private State
  **********************************/

  var _attributes = attributes || {};
  var _children = children || [];
  var domElement = null;
  var _container = null;
  var _onload = function onload() {};

  var _data = null;
  var _mediaSize = '';

  var _chainState = null;

  /**********************************
  * Initialize State
  **********************************/

  var type = getInputType(tag);

  if (type == 'DATA') {
    _data = tag;
    tag = null;
    _chainState = 'DATA';
  } else if (type == 'CHAIN') {
    tag = 'DIV';
    var abstracts = parseArgs(arguments);
    _extend(abstracts);
    _chainState = 'ELEMENT';
  } else if (type == 'NULL') {
    tag = 'DIV';
    _chainState = 'ERROR';
  } else if (type == 'TAG') {
    if (isArray(attributes)) _children.concat(attributes);
  }

  /*================================
  * CHAIN or Public Methods
  ================================*/

  var chain = {

    type: 'vNodeChain',

    pipe: function pipe(fn) {
      _data = fn(_data);
      return onReturn();
    },

    /**********************************
    * Attributes
    **********************************/

    attr: function attr(_attr, val) {
      _addAttribute(_attr, val);
      return onReturn();
    },
    attribute: function attribute(attr, val) {
      _addAttribute(attr, val);
      return onReturn();
    },
    addAttribute: function addAttribute(attr, val) {
      _addAttribute(attr, val);
      return onReturn();
    },
    id: function id(_id) {
      _addAttribute('id', _id);
      return onReturn();
    },
    class: function _class(className) {
      addClass(className);
      return onReturn();
    },
    src: function src(path) {
      _addAttribute('src', path);
      return onReturn();
    },
    href: function href(path) {
      _addAttribute('href', path);
      return onReturn();
    },
    placeholder: function placeholder(text) {
      _addAttribute('placeholder', text);
      return onReturn();
    },
    value: function value(_value) {
      _addAttribute('value', _value);
      return onReturn();
    },

    /**********************************
    * Children
    **********************************/

    text: function text(_text) {
      addChild(_text);
      return onReturn();
    },
    children: function children() {
      var args = parseArgs(arguments);
      args = args.map(function (arg) {
        return arg.vNode();
      });
      addChild(args);
      return onReturn();
    },
    columns: function columns() {
      _addStyle('display', 'flex');
      _addStyle('flex-direction', 'row');
      if (arguments) parseArgs(arguments).forEach(function (child) {
        addChild(child.vNode());
      });
      return onReturn();
    },
    rows: function rows() {
      _addStyle('display', 'flex');
      _addStyle('flex-direction', 'column');
      if (arguments) parseArgs(arguments).forEach(function (child) {
        addChild(child.vNode());
      });
      return onReturn();
    },

    /**********************************
    * Events
    **********************************/

    event: function event(_event, fn, params) {
      if (typeof fn == 'string') {
        _addAttribute(_event, function () {
          $action.push(fn, params).call();
        });
        return onReturn();
      }
      if (getInputType(fn) == 'CHAIN') {
        _addAttribute(_event, function (mouseEvent) {
          var styles = fn.vNode().properties.style;
          for (var style in styles) {
            mouseEvent.target.style[style] = styles[style];
          }
        });
        return onReturn();
      }
      _addAttribute(_event, fn);
      return onReturn();
    },
    onchange: function onchange(fn, params) {
      chain.event('onchange', fn, params);
      return onReturn();
    },
    onclick: function onclick(fn, params) {
      chain.event('onclick', fn, params);
      return onReturn();
    },
    ondbclick: function ondbclick(fn, params) {
      chain.event('ondbclick', fn, params);
      return onReturn();
    },
    onmouseenter: function onmouseenter(fn, params) {
      chain.event('onmouseenter', fn, params);
      return onReturn();
    },
    onmouseleave: function onmouseleave(fn, params) {
      chain.event('onmouseleave', fn, params);
      return onReturn();
    },
    onkeypress: function onkeypress(fn, params) {
      chain.event('onkeypress', fn, params);
      return onReturn();
    },
    onkeydown: function onkeydown(fn, params) {
      chain.event('onkeydown', fn, params);
      return onReturn();
    },
    onkeyup: function onkeyup(fn, params) {
      chain.event('onkeyup', fn, params);
      return onReturn();
    },
    onfocus: function onfocus(fn, params) {
      chain.event('onfocus', fn, params);
      return onReturn();
    },
    onblur: function onblur(fn, params) {
      chain.event('onblur', fn, params);
      return onReturn();
    },
    onload: function onload(fn) {
      _onload = fn;
      return onReturn();
    },
    action: function action(handler, vNode) {
      $action.pull(handler, function () {
        if (typeof vNode == 'function') {
          vNode = vNode.apply(this, arguments);
        }
        var styles = vNode.vNode().properties.style;
        for (var style in styles) {
          domElement.style[style] = styles[style];
        }
      });
      return onReturn();
    },

    /**********************************
    * Styles
    **********************************/

    style: function style(attr, value) {
      _addStyle(attr, value);
      return onReturn();
    },
    addStyle: function addStyle(attr, value) {
      _addStyle(attr, value);
      return onReturn();
    },
    position: function position(_position) {
      _addStyle('position', _position);
      return onReturn();
    },
    display: function display(_display) {
      _addStyle('display', _display);
      return onReturn();
    },
    hide: function hide() {
      _addStyle('display', 'none');
      return onReturn();
    },
    show: function show() {
      _addStyle('display', 'block');
      return onReturn();
    },
    left: function left(attr, value, unit) {
      unit = 'px' || unit;
      _addStyle(attr + '-left', value + unit);
      return onReturn();
    },
    right: function right(attr, value, unit) {
      unit = 'px' || unit;
      _addStyle(attr + '-right', value + unit);
      return onReturn();
    },
    top: function top(attr, value, unit) {
      unit = 'px' || unit;
      _addStyle(attr + '-top', value + unit);
      return onReturn();
    },
    bottom: function bottom(attr, value, unit) {
      unit = 'px' || unit;
      _addStyle(attr + '-bottom', value + unit);
      return onReturn();
    },
    color: function color(_color) {
      if (arguments.length > 2) _color = parseRGBA(arguments);
      _color = parseColor(_color);
      _addStyle('color', _color);
      return onReturn();
    },
    background: function background(color) {
      if (arguments.length > 2) color = parseRGBA(arguments);
      color = parseColor(color);
      _addStyle('background-color', color);
      return onReturn();
    },
    opacity: function opacity(value) {
      _addStyle('opacity', value);
      return onReturn();
    },

    height: function height(_height, unit) {
      if (unit) _height = _height + unit;else if (!isNaN(_height)) _height = _height + 'px';
      _addStyle('height', _height);
      return onReturn();
    },
    width: function width(_width, unit) {
      if (unit) _width = _width + unit;else if (!isNaN(_width)) _width = _width + 'px';
      _addStyle('width', _width);
      return onReturn();
    },
    size: function size() {
      var sizes = parseUnits(arguments);
      _addStyle('height', sizes[0]);
      if (sizes.length > 1) _addStyle('width', sizes[1]);
      return onReturn();
    },
    padding: function padding() {
      var padding = parseUnits(arguments).join('');
      _addStyle('padding', padding);
      return onReturn();
    },
    margin: function margin(attr, value) {
      var margin = parseUnits(arguments).join('');
      _addStyle('margin', margin);
      return onReturn();
    },
    offset: function offset(side, measure, unit) {
      unit = 'px' || unit;
      _addStyle('margin-' + side, '-' + measure + unit);
      return onReturn();
    },
    border: function border(size, style, color) {
      if (typeof size == 'string') _addStyle('border', size);else _addStyle('border', size + 'px ' + style + ' ' + parseColor(color));
      return onReturn();
    },
    font: function font(attr, value, unit) {
      unit = unit || ' ';
      _addStyle('font-' + attr, value + unit);
      return onReturn();
    },
    textAlign: function textAlign(align) {
      _addStyle('text-align', align);
      return onReturn();
    },
    letter: function letter(attr, val, unit) {
      unit = unit || 'em';
      _addStyle('letter-' + attr, val + unit);
      return onReturn();
    },
    letterSpacing: function letterSpacing(space) {
      _addStyle('letter-spacing', space + 'px');
      return onReturn();
    },
    transition: function transition(styles, duration) {
      if (!duration) {
        duration = styles;
        styles = 'all';
      }
      _addStyle('transition', styles + ' ' + duration + 's');
      return onReturn();
    },
    uppercase: function uppercase() {
      _addStyle('text-transform', 'uppercase');
      return onReturn();
    },
    overflow: function overflow(val) {
      _addStyle('overflow', val);
      return onReturn();
    },
    hover: function hover(vNodeChain) {
      chain.event('onmouseleave', $(chain));
      chain.event('onmouseenter', vNodeChain);
      return onReturn();
    },
    max: function max(attr, value, unit) {
      unit = unit || 'px';
      _addStyle('max-' + attr, value + unit);
      return onReturn();
    },
    min: function min(attr, value, unit) {
      unit = unit || 'px';
      _addStyle('min-' + attr, value + unit);
      return onReturn();
    },
    media: function media(operator, width, vNodeChain) {
      if (operator == '>') {
        if (window.outerWidth > width) _extend([vNodeChain]);
      } else if (operator == '<') {
        if (window.outerWidth < width) _extend([vNodeChain]);
      }
      return onReturn();
    },

    /**********************************
    * Flex
    **********************************/

    flex: function flex(value) {
      _addStyle('flex', value);
      return onReturn();
    },
    centered: function centered() {
      _container = h('div', {
        style: {
          height: '100%',
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center'
        }
      });
      return onReturn();
    },
    justify: function justify(align) {
      if (align == 'start' || align == 'end') align = 'flex-' + align;
      _addStyle('justify-content', align);
      return onReturn();
    },
    order: function order(_order) {
      _addStyle('order', _order);
      return onReturn();
    },
    shrink: function shrink(_shrink) {
      _addStyle('flex-shrink', _shrink);
      return onReturn();
    },
    grow: function grow(_grow) {
      _addStyle('flex-grow', _grow);
      return onReturn();
    },
    wrap: function wrap(reverse) {
      if (reverse) _addStyle('flex-wrap', 'wrap-reverse');else _addStyle('flex-wrap', 'wrap');
      return onReturn();
    },
    align: function align(_align) {
      if (_align == 'start' || _align == 'end') _align = 'flex-' + _align;
      _addStyle('align-self', _align);
      return onReturn();
    },
    items: function items(align) {
      if (align == 'start' || align == 'end') align = 'flex-' + align;
      _addStyle('align-items', align);
      return onReturn();
    },
    content: function content(align) {
      if (align == 'start' || align == 'end') align = 'flex-' + align;
      _addStyle('align-content', align);
      return onReturn();
    },
    start: function start() {
      return chain.align('flex-start');
    },
    end: function end() {
      return chain.align('flex-end');
    },
    baseline: function baseline() {
      return chain.align('baseline');
    },
    stretch: function stretch() {
      return chain.align('stretch');
    },

    /**********************************
    * Grid
    **********************************/

    xs: function xs(size) {
      if (size) addClass('col-xs-' + size);
      _mediaSize = 'xs';
      return onReturn();
    },
    sm: function sm(size) {
      if (size) addClass('col-sm-' + size);
      _mediaSize = 'sm';
      return onReturn();
    },
    md: function md(size) {
      if (size) addClass('col-md-' + size);
      _mediaSize = 'md';
      return onReturn();
    },
    lg: function lg(size) {
      if (size) addClass('col-lg-' + size);
      _mediaSize = 'lg';
      return onReturn();
    },

    /**********************************
    * Data
    **********************************/

    if: function _if(condition, vNode) {
      if (condition == true) _extend([vNode]);
      return onReturn();
    },
    filter: function filter(fn) {
      if (isObject(_data)) {
        var newObj = {};
        Object.keys(_data).filter(function (key) {
          if (fn(_data[key], key)) newObj[key] = _data[key];
        });
        _data = newObj;
        return onReturn();
      }
      _data = _data.filter(fn);
      return onReturn();
    },
    filterMap: function filterMap(data, filter, map) {
      data = data.filter(filter);
      chain.map(data, map);
      return onReturn();
    },
    map: function map(data, fn) {
      if (typeof data == 'function' && !fn) {
        if (isObject(_data)) {
          Object.keys(_data).map(function (key) {
            _data[key] = data(_data[key], key);
          });
          return onReturn();
        }
        _data = _data.map(data);
        return onReturn();
      }
      var appending = data.map(function (item, i) {
        return fn(item, i).vNode();
      });
      addChild(appending);
      return onReturn();
    },
    mapToText: function mapToText(data, fn) {
      var text = data.map(function (item, i) {
        return fn(item, i);
      }).join('');
      addChild(text);
      return onReturn();
    },
    toText: function toText(data) {
      if (!data) data = _data;
      return $().text(data.toString()).vNode();
    },

    /**********************************
    * Modifiers
    **********************************/

    contain: function contain(containerTag) {
      tag = containerTag;
      var data = _data;
      if (isObject(data)) data = toArray(data);
      _children = data.map(function (child) {
        if (getInputType(child) != 'CHAIN') return chain.toText(child);
        return child.vNode();
      });
      return onReturn();
    },
    extend: function extend() {
      var abstracts = parseArgs(arguments);
      _extend(abstracts);
      return onReturn();
    },

    /**********************************
    * DOM Operators
    **********************************/

    removeStyles: function removeStyles() {
      if (domElement) domElement.removeAttribute('style');
      _attributes.style = {};
      return onReturn();
    },
    click: function click() {
      domElement.click();
      return onReturn();
    },
    remove: function remove() {
      domElement.style.display = 'none';
      domElement.innerHTML = '';
      if (domElement.parent) domElement.parent.removeChild(domElement);
    },

    /**********************************
    * Renderers
    **********************************/

    vNode: function vNode() {
      if (_data) chain.contain();
      var vNode = h(tag, _attributes, _children);
      if (_container) {
        _container.children.push(vNode);
        vNode = _container;
      }
      var onloadHook = createHook(function (node) {
        domElement = node;
        _onload(node);
      });
      vNode.properties['onloadHook'] = onloadHook;
      return vNode;
    },

    /**********************************
    * Getters
    **********************************/

    domNode: function domNode() {
      return domElement;
    },
    getChildren: function getChildren() {
      return _children;
    },
    getAttributes: function getAttributes() {
      return _attributes;
    },
    getStyles: function getStyles() {
      return _attributes.style;
    },
    getChainState: function getChainState() {
      return _chainState;
    },
    getTag: function getTag() {
      return tag;
    },
    data: function data() {
      return _data;
    },

    /**********************************
    * Render
    **********************************/

    render: function render() {
      if (_data && !tag) chain.contain();
      var vNode = chain.vNode();
      vDOM.render(vNode);
      return onReturn();
    }
  };

  return chain;
}

var actions = [];

var $action = exports.$action = {

  push: function push(handler, params) {
    if (!Array.isArray(params)) params = [params];
    return function () {
      actions[handler].forEach(function (action) {
        action.apply(this, params);
      });
    };
  },
  pull: function pull(handler, fn) {
    if (!actions[handler]) actions[handler] = [];
    actions[handler].push(fn);
  },
  getActions: function getActions(handler) {
    return actions[handler];
  },
  removeAllActions: function removeAllActions(handler) {
    actions = [];
  }

};

var Color = require("color");

var $color = exports.$color = function $color(color) {
  if (arguments.length == 3) return Color().rgb(parseArgs(arguments));
  return Color(color);
};