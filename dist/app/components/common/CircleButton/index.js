"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _circleButton = _interopRequireDefault(require("./circle-button.css"));

var _styleHelpers = require("../../../utils/styleHelpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var s = (0, _styleHelpers.getStyleApplicationFn)(_circleButton["default"]);

var CircleButton = function CircleButton(_ref) {
  var size = _ref.size,
      onClick = _ref.onClick,
      content = _ref.content,
      label = _ref.label,
      containerClassName = _ref.containerClassName,
      buttonClassName = _ref.buttonClassName,
      labelClassName = _ref.labelClassName;
  var buttonStyle;

  switch (size) {
    case 'sm':
      buttonStyle = {
        height: '32px',
        width: '32px'
      };
      break;

    case 'md':
      buttonStyle = {
        height: '40px',
        width: '40px'
      };
      break;

    case 'lg':
      buttonStyle = {
        height: '48px',
        width: '48px'
      };
      break;

    default:
      buttonStyle = {
        height: size,
        width: size
      };
      break;
  }

  return _react["default"].createElement("div", {
    className: s("circle-button-container ".concat(containerClassName))
  }, _react["default"].createElement("div", {
    className: s("circle-button button-hover ".concat(buttonClassName)),
    onClick: onClick,
    style: buttonStyle
  }, content), label && _react["default"].createElement("div", {
    className: s("circle-button-label ".concat(labelClassName))
  }, " ", label, " "));
};

CircleButton.propTypes = {
  size: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].oneOf(['sm', 'md', 'lg'])]),
  content: _propTypes["default"].oneOfType([_propTypes["default"].element, _propTypes["default"].string]).isRequired,
  onClick: _propTypes["default"].func,
  label: _propTypes["default"].string,
  containerClassName: _propTypes["default"].string,
  buttonClassName: _propTypes["default"].string,
  labelClassName: _propTypes["default"].string
};
CircleButton.defaultProps = {
  size: 'md',
  containerClassName: '',
  buttonClassName: '',
  labelClassName: ''
};
var _default = CircleButton;
exports["default"] = _default;

//# sourceMappingURL=index.js.map