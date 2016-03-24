'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderElementArray = undefined;

var _exr = require('./exr');

var _utils = require('./utils');

var _component = require('./component');

var _element = require('./element');

var _renderer = require('./renderer');

var buildElement = function buildElement(component, dom, elementArray) {
  var tag = (0, _utils.getTag)(elementArray);
  var content = (0, _utils.getContent)(elementArray);

  dom.el = (0, _element.newDomElement)(dom.parent, tag);
  dom.el.innerHTML = (0, _utils.validateContent)(content);

  dom.parent = dom.el;
  (0, _renderer.traverse)(component, dom, elementArray);
  dom.parent = dom.parent.parentNode;
};

var renderElementArray = exports.renderElementArray = function renderElementArray(component, dom, elementArray) {
  var tag = (0, _utils.getTag)(elementArray);
  if ((0, _component.isComponent)(tag)) {
    var subElement = (0, _element.newDomElement)(dom.parent, 'div');
    var subComponent = (0, _component.buildComponent)(dom, elementArray);
    (0, _renderer.render)(subComponent, subElement);
    for (var j = 1; j < elementArray.length; j++) {
      (0, _utils.applySelector)(subElement, elementArray[j]);
    }
  } else {
    buildElement(component, dom, elementArray);
  }
};