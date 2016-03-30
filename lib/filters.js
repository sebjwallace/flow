'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.driveFilters = undefined;

var _utils = require('./utils');

var _route = require('./route');

var filters = {
  '==': function _(filterArray, component) {

    var f = filterArray.map(function (filter) {
      return (0, _utils.getDataFromVar)(component, filter);
    });

    if (f[1] == f[2]) return f[3];else if (f.length > 4) return f[4];
  },
  '/|': function _(filterArray, component) {
    var exp = filterArray[1];
    var match = (0, _route.matchRoute)(exp);
    if (!match) return false;
    var pa = (0, _utils.getDataFromVar)(component, filterArray[2]);
    var pb = (0, _utils.getDataFromVar)(component, filterArray[3]);
    if (pa != pb) return true;
  },
  '#/?': function _(filterArray) {
    var expected = filterArray[1];
    var r = filterArray[2];
    var uri = (0, _route.currentHash)().replace(/\#|\//g, '');
    if (expected == uri) return r;
  }
};

var driveFilters = exports.driveFilters = function driveFilters(component, filterArray, dom) {
  var token = filterArray[0];
  if (filters[token]) return filters[token](filterArray, component, dom);else return filterArray;
};