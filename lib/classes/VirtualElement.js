'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _exr = require('../exr');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VirtualElement = function () {
  function VirtualElement(elementArray) {
    _classCallCheck(this, VirtualElement);

    this.tag = elementArray[0];
    this.content = elementArray[elementArray.length - 1];
  }

  _createClass(VirtualElement, [{
    key: 'getContent',
    value: function getContent() {
      if (typeof this.content == 'string' && !(0, _exr.CHECK)(this.content, 'TRANS')) return this.content;else return '';
    }
  }, {
    key: 'getTag',
    value: function getTag() {
      return this.tag;
    }
  }]);

  return VirtualElement;
}();

exports.default = VirtualElement;