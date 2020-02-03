"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _io = require("react-icons/io");

var _CardUser = _interopRequireDefault(require("./CardUser"));

var _CircleButton = _interopRequireDefault(require("../../common/CircleButton"));

var _styleHelpers = require("../../../utils/styleHelpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var s = (0, _styleHelpers.getStyleApplicationFn)();

var CardUsers = function CardUsers(_ref) {
  var className = _ref.className,
      users = _ref.users,
      onUserClick = _ref.onUserClick,
      onRemoveClick = _ref.onRemoveClick,
      onAddClick = _ref.onAddClick;
  return _react["default"].createElement("div", {
    className: s("card-users-container ".concat(className))
  }, users.map(function (_ref2) {
    var id = _ref2.id,
        name = _ref2.name,
        img = _ref2.img;
    return _react["default"].createElement(_CardUser["default"], {
      key: id,
      size: "md",
      name: name,
      img: img,
      className: s("mr-sm"),
      onClick: onUserClick,
      onRemoveClick: onRemoveClick
    });
  }), onAddClick && _react["default"].createElement(_CircleButton["default"], {
    content: _react["default"].createElement(_io.IoMdAdd, {
      size: 30
    }),
    containerClassName: s("text-purple-reg pt-sm ml-xs"),
    buttonClassName: s("bg-purple-gray-10"),
    labelClassName: s("text-xs"),
    size: "md",
    label: "Add",
    onClick: onAddClick
  }));
};

CardUsers.propTypes = {
  className: _propTypes["default"].string,
  users: _propTypes["default"].arrayOf(_propTypes["default"].object).isRequired,
  onRemoveClick: _propTypes["default"].func,
  onUserClick: _propTypes["default"].func,
  onAddClick: _propTypes["default"].func
};
CardUsers.defaultProps = {
  className: ''
};
var _default = CardUsers;
exports["default"] = _default;

//# sourceMappingURL=index.js.map