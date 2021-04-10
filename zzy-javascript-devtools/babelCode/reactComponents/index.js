"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Img = Img;
exports.TopBar = exports.NoData = exports.ErrorBoundary = exports.ScrollLoadingBar = void 0;

var _devTools = _interopRequireDefault(require("../devTools.min"));

var _react = _interopRequireWildcard(require("react"));

require("./index.css");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

// function selfRequire(d){
//   const s = require(d)
//   console.log(d ,s);
//   return s
//   // return require(d).default || require(d)
// }
var devtools = new _devTools["default"](); // 无限滚动触发块，直接链接触发事件即可
// 需要在触发事件内结束时 赋值 devtools.infinityScrolling.bol = true

/*
  props
    getMoreData Function 加载更多
*/
// HOOK报错，暂不启用
// function ScrollLoadingBar({ getMoreData }) {
//   let [nomarl, nomarlA] = useState()
//   useEffect(() => {
//     let that = this
//     devtools.infinityScrolling(
//       document.querySelector('.scrollLoadingBar'),
//       () => {
//         devtools.infinityScrolling.bol = false
//         getMoreData()
//       }
//     )
//     return () => devtools.infinityScrolling.closeMonitor()
//   }, [])
//   return (
//     <div
//       className="scrollLoadingBar"
//       style={{ opacity: 0, width: 0, height: 0, zIndex: -1 }}
//     >{nomarl}</div>
//   )
// }

var ScrollLoadingBar = /*#__PURE__*/function (_Component) {
  _inherits(ScrollLoadingBar, _Component);

  var _super = _createSuper(ScrollLoadingBar);

  function ScrollLoadingBar() {
    _classCallCheck(this, ScrollLoadingBar);

    return _super.apply(this, arguments);
  }

  _createClass(ScrollLoadingBar, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this = this;

      devtools.infinityScrolling(document.querySelector('.scrollLoadingBar'), function () {
        devtools.infinityScrolling.bol = false;

        _this.props.getMoreData();
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      devtools.infinityScrolling.closeMonitor();
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "scrollLoadingBar",
        style: {
          opacity: 0,
          width: '1px',
          height: '1px',
          zIndex: -1
        }
      });
    }
  }]);

  return ScrollLoadingBar;
}(_react.Component);
/*
 错误边界
  1.请在App.js中用此组件将 Route组件包裹即可展示错误之后的UI信息
  2.它在渲染期间、生命周期方法和整个组件树的构造函数中捕获错误
  3.无法捕获 事件处理，异步代码等错误
*/


exports.ScrollLoadingBar = ScrollLoadingBar;

var ErrorBoundary = /*#__PURE__*/function (_Component2) {
  _inherits(ErrorBoundary, _Component2);

  var _super2 = _createSuper(ErrorBoundary);

  function ErrorBoundary(props) {
    var _this2;

    _classCallCheck(this, ErrorBoundary);

    _this2 = _super2.call(this, props);
    _this2.state = {
      hasError: false
    };
    return _this2;
  }

  _createClass(ErrorBoundary, [{
    key: "componentDidCatch",
    value: function componentDidCatch(error, errorInfo) {
      console.log(error, errorInfo, '将报错上传至服务器');
    }
  }, {
    key: "render",
    value: function render() {
      if (this.state.hasError) return /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          fontSize: '2.5rem',
          color: 'red'
        }
      }, "Something was wrong, please open the console to check the printing, or contact the Developer.");
      return this.props.children;
    }
  }], [{
    key: "getDerivedStateFromError",
    value: function getDerivedStateFromError(error) {
      console.log(error, '更新state 使下一次的UI是降级后的UI');
      return {
        hasError: true
      };
    }
  }]);

  return ErrorBoundary;
}(_react.Component);
/**
 * 此组件用于图片懒加载，配合 zzy-javascript-devtools -> devtools.lazyImage() 方法使用
 * 必须等待加载目标的 data-src 属性赋值完毕，再执行此方法
 * @param {String} className 赋予的类名
 * @param {String} src 目标地址
 * @param {Function} click 具有点击事件能力
 *
 */


exports.ErrorBoundary = ErrorBoundary;

function Img(_ref) {
  var className = _ref.className,
      src = _ref.src,
      click = _ref.click;
  return /*#__PURE__*/_react["default"].createElement("img", {
    onClick: function onClick() {
      return click && click();
    },
    src: "",
    "data-src": src["default"] || src,
    alt: "",
    className: className
  });
}
/*
  无数据显示组件
  props:
    say - 文案
    style - 样式 就像给普通标签写样式一样添加style即可
    src - 图片地址
*/


var NoData = /*#__PURE__*/function (_Component3) {
  _inherits(NoData, _Component3);

  var _super3 = _createSuper(NoData);

  function NoData() {
    _classCallCheck(this, NoData);

    return _super3.apply(this, arguments);
  }

  _createClass(NoData, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "noData-component_zzyDevtools"
      }, /*#__PURE__*/_react["default"].createElement("img", {
        style: this.props.style,
        src: this.props.src["default"] || this.props.src,
        alt: "",
        className: "noDataPic"
      }), /*#__PURE__*/_react["default"].createElement("span", {
        className: "say"
      }, this.props.say));
    }
  }]);

  return NoData;
}(_react.Component);
/*
  顶部栏(kl标准)
  props:
    type
      0 - 黑色主题
      1 - 白色
      不传  默认为白色主题，背景为空(透明)
    noArrow
      true - 隐藏箭头
      false - 显示
    arrowBack 返回事件
    title  标题
    rigTxt 右侧文字 不传则隐藏
    clickRigTxt 右侧点击事件
*/


exports.NoData = NoData;

var TopBar = /*#__PURE__*/function (_Component4) {
  _inherits(TopBar, _Component4);

  var _super4 = _createSuper(TopBar);

  function TopBar() {
    _classCallCheck(this, TopBar);

    return _super4.apply(this, arguments);
  }

  _createClass(TopBar, [{
    key: "render",
    value: function render() {
      var _this3 = this;

      var arrowSvg = require("".concat(this.props.type == '0' ? './image/backArrow_black.svg' : './image/backArrow.svg'));

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "topBar-component_zzyDevtools",
        style: {
          background: this.props.type == 0 ? '#fff' : this.props.type == 1 ? '#000' : 'none'
        }
      }, !this.props.noArrow && /*#__PURE__*/_react["default"].createElement("img", {
        src: arrowSvg["default"] || arrowSvg,
        alt: "",
        className: "arrow",
        onClick: function onClick() {
          return _this3.props.arrowBack();
        }
      }), /*#__PURE__*/_react["default"].createElement("span", {
        className: "topBarTil",
        style: {
          color: this.props.type === '0' ? '#000' : '#fff'
        }
      }, this.props.title), this.props.rigTxt && /*#__PURE__*/_react["default"].createElement("span", {
        className: "rigTxt",
        style: {
          color: this.props.type === '0' ? '#000' : '#fff'
        },
        onClick: function onClick() {
          return _this3.props.clickRigTxt();
        }
      }, this.props.rigTxt));
    }
  }]);

  return TopBar;
}(_react.Component); // ./node_modules/.bin/uglifyjs ./index.js


exports.TopBar = TopBar;