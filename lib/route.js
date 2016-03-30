'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.currentHash = exports.matchRoute = exports.startRoute = exports.addRoute = undefined;

var _renderer = require('./renderer');

var routes = {};
var route = '';

var addRoute = exports.addRoute = function addRoute(exp, component) {
  routes[exp] = component;
};

var startRoute = exports.startRoute = function startRoute() {
  route = window.location.hash;

  window.onhashchange = function () {
    route = window.location.hash;

    for (var exp in routes) {
      if (matchRoute(exp)) {
        var component = routes[exp];
        (0, _renderer.render)(component, component.root);
      }
    }
  };
};

var matchRoute = exports.matchRoute = function matchRoute(exp) {
  var reex = new RegExp(exp);
  if (route.match(reex)) return true;
};

var currentHash = exports.currentHash = function currentHash() {
  if (route == '' || route == '#') return '#';else return route;
};