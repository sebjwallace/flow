'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.driveDirectives = undefined;

var _utils = require('./utils');

var _exr = require('./exr');

var _core = require('./core');

var Directives = [{
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
    var domEvent = format[0];
    var event = format[1];
    var params = event.match(/\([\$a-z,A-Z.]+\)/);
    event = event.replace(/\([\$a-z,A-Z.]+\)/, '');
    if (params) {
      params = params[0].replace(/\(|\)/g, '').split(',');
      for (var param in params) {
        params[param] = (0, _utils.getDataFromVar)(component, params[param]);
      }
    }
    dom.el[domEvent] = function (e) {
      var args = [component, e];
      args = args.concat(params);
      component[event].apply(undefined, args);
    };
  }
}, {
  regex: /^[a-z,A-Z]+\(\)/,
  method: function method(component, dom, val) {
    dom.el[val.replace(/\(\)/, '')]();
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
      component.data['$'] = item;
      (0, _core.renderElementArray)(component, dom, (0, _utils.getContent)(template));
    }
    return true;
  }
}];

var driveDirectives = exports.driveDirectives = function driveDirectives(val, dom, component, template) {
  var skipped = false;
  Directives.forEach(function (directive) {
    if (val.match(directive.regex)) {
      var skip = directive.method(component, dom, val, template);
      if (skip) skipped = true;
    }
  });
  return skipped;
};