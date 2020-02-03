"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.PlaceholderImg = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _placeholderImg = _interopRequireDefault(require("./placeholder-img.css"));

var _styleHelpers = require("../../../utils/styleHelpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var s = (0, _styleHelpers.getStyleApplicationFn)(_placeholderImg["default"]);
var NUM_COLORS = 3;

var hashCode = function hashCode(s) {
  return Math.abs(s.split("").reduce(function (a, b) {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0));
};

var getPlaceholder = function getPlaceholder(name, className) {
  if (!name) return null;
  var bucket = hashCode(name) % NUM_COLORS;
  var tokens = name.trim().split(' ');
  var initials = tokens.length === 0 ? '' : "".concat(tokens[0][0]).concat(tokens.length > 1 ? tokens[tokens.length - 1][0] : '');
  return _react["default"].createElement("div", {
    className: s("placeholder-img placeholder-img-".concat(bucket, " ").concat(className))
  }, initials);
};

var PlaceholderImg = function PlaceholderImg(_ref) {
  var name = _ref.name,
      src = _ref.src,
      className = _ref.className;
  return src ? _react["default"].createElement("img", {
    src: src,
    className: className
  }) : getPlaceholder(name, className);
};

exports.PlaceholderImg = PlaceholderImg;
PlaceholderImg.propTypes = {
  name: _propTypes["default"].string.isRequired,
  src: _propTypes["default"].string,
  className: _propTypes["default"].string
};
PlaceholderImg.defaultProps = {
  className: ''
};
var _default = PlaceholderImg;
exports["default"] = _default;

//# sourceMappingURL=index.js.map