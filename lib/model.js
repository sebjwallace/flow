'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatch = exports.attach = exports.model = undefined;

var _renderer = require('./renderer');

var models = [];
var events = [];
var history = [];

var model = exports.model = function model(name, _model) {
  _model.data = null;
  _model.name = name;
  _model.listeners = [];
  models[name] = _model;
  for (var method in _model) {
    if (!events[method]) events[method] = [];
    if (method != 'init' || method != 'save' || method != 'load') events[method].push(_model);
  }
  if (_model.init) _model.data = _model.init(_model.data);
};

var attach = exports.attach = function attach(modelName, component) {
  models[modelName].listeners.push(component);
  return models[modelName].data;
};

var dispatch = exports.dispatch = function dispatch(action) {
  events[action.type].forEach(function (model) {
    var data = model[action.type](model.data, action, model);
    model.data = data;
    history.push(data);
    if (!model.listeners) return;
    model.listeners.forEach(function (listener) {
      listener.models[model.name](model.data);
      (0, _renderer.render)(listener, listener.root);
    });
  });
};