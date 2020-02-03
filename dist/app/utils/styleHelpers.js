"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStyleApplicationFn = getStyleApplicationFn;

var _underscore = _interopRequireDefault(require("underscore"));

var _global = _interopRequireDefault(require("../styles/global.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function getStyleApplicationFn() {
  var hashedClassNameMap = _underscore["default"].extend.apply(_underscore["default"], [_global["default"]].concat(Array.prototype.slice.call(arguments)));

  return function (classNameString) {
    return classNameString.split(/\s+/).map(function (className) {
      return hashedClassNameMap[className] || className;
    }).join(' ');
  };
}

//# sourceMappingURL=styleHelpers.js.map