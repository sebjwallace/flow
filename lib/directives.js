'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Directives = undefined;

var _utils = require('./utils');

var _exr = require('./exr');

var _core = require('./core');

var Directives = exports.Directives = [{
  regex: (0, _exr.GET)('ATTR'),
  method: function method(component, dom, val) {
    var attribute = (0, _utils.getAttribute)(component, val);
    dom.el.setAttribute(attribute.attr, attribute.value);
  }
}, {
  regex: (0, _exr.GET)('DATA'),
  method: function method(component, dom, val) {
    var data = (0, _utils.getDataFromVar)(component, val);
    if (!(0, _utils.applySelector)(dom.el, data)) dom.el.innerHTML = data;
  }
}, {
  regex: (0, _exr.GET)('EVENT'),
  method: function method(component, dom, val) {
    var format = val.replace('!', '').replace(/\s/, '').split(':');
    dom.el[format[0]] = function (e) {
      component[format[1]](component, e);
    };
  }
}, {
  regex: (0, _exr.GET)('IF'),
  method: function method(component, dom, val) {
    var exp = val.replace(/^\?\s+/, '');
    if ((0, _exr.CHECK)(exp, 'DATA')) {
      var data = component.data[(0, _exr.REPLACE)(exp, 'DATA', '')];
      if (!data) dom.el.style.display = 'none';
    }
  }
}, {
  regex: (0, _exr.GET)('FOR'),
  method: function method(component, dom, val, template) {
    var args = val.replace((0, _exr.GET)('FOR'), '').split(/\s+\in\s+/);
    var data = component.data[args[1].replace((0, _exr.GET)('DATA'), '')];
    var temp = args[0].replace((0, _exr.GET)('DATA'), '');
    for (var item in data) {
      component.data[temp] = data[item];
      (0, _core.renderElementArray)(component, dom, (0, _utils.getContent)(template));
    }
    return true;
  }
}];