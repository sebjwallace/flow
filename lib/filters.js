'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.driveFilters = undefined;

var _utils = require('./utils');

var filters = {
  '==': function _(filterArray, component) {

    var f = filterArray.map(function (filter) {
      return (0, _utils.getDataFromVar)(component, filter);
    });

    if (f[1] == f[2]) return f[3];else if (f.length > 4) return f[4];
  }
};

var driveFilters = exports.driveFilters = function driveFilters(component, filterArray) {
  var token = filterArray[0];
  if (filters[token]) return filters[token](filterArray, component);else return filterArray;
};