'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateModel = exports.attachModel = exports.model = undefined;

var _renderer = require('./renderer');

var models = [];
var history = [];

var model = exports.model = function model(_model) {
  var name = void 0;
  for (name in _model) {
    break;
  }models[name] = _model;
};

var attachModel = exports.attachModel = function attachModel(name, component) {
  if (!models[name].__listeners) models[name].__listeners = {};
  models[name].__listeners[component.id] = component;
  component.data[name] = models[name][name];
  console.log(models);
};

var updateModel = exports.updateModel = function updateModel(name, method, values) {
  var ctr = models[name];
  var updatedModel = ctr[method](ctr, values);
  ctr[name] = updatedModel;
  history.push(updatedModel);
  var listeners = ctr.__listeners;
  for (var _listener in listeners) {
    var listener = listeners[_listener];
    listener.data[name] = updatedModel;
    (0, _renderer.render)(listener, listener.root);
  }
  console.log(models);
};