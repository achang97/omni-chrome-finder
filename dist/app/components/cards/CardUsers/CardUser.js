"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _md = require("react-icons/md");

var _CircleButton = _interopRequireDefault(require("../../common/CircleButton"));

var _PlaceholderImg = _interopRequireDefault(require("../../common/PlaceholderImg"));

var _cardUsers = _interopRequireDefault(require("./card-users.css"));

var _styleHelpers = require("../../../utils/styleHelpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var s = (0, _styleHelpers.getStyleApplicationFn)(_cardUsers["default"]);

var CardUser = function CardUser(_ref) {
  var className = _ref.className,
      name = _ref.name,
      img = _ref.img,
      size = _ref.size,
      onClick = _ref.onClick,
      onRemoveClick = _ref.onRemoveClick,
      rest = _objectWithoutProperties(_ref, ["className", "name", "img", "size", "onClick", "onRemoveClick"]);

  return _react["default"].createElement("div", _extends({
    className: s("card-user ".concat(className, " ").concat(onRemoveClick ? 'pr-sm pt-sm' : ''))
  }, rest), _react["default"].createElement(_CircleButton["default"], {
    content: _react["default"].createElement(_PlaceholderImg["default"], {
      src: img,
      name: name,
      className: s("w-full h-full")
    }),
    size: size,
    label: name,
    labelClassName: s("card-user-label"),
    onClick: onClick
  }), onRemoveClick && _react["default"].createElement("button", {
    onClick: onRemoveClick,
    className: s("absolute top-0 right-0 text-purple-gray-50")
  }, _react["default"].createElement(_md.MdClose, null)));
};

CardUser.propTypes = {
  className: _propTypes["default"].string,
  name: _propTypes["default"].string.isRequired,
  img: _propTypes["default"].string,
  size: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].oneOf(['sm', 'md', 'lg'])]),
  onClick: _propTypes["default"].func,
  onRemoveClick: _propTypes["default"].func
};
CardUser.defaultProps = {
  className: '',
  size: 'md'
};
var _default = CardUser;
exports["default"] = _default;

//# sourceMappingURL=CardUser.js.map