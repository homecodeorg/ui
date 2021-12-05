"use strict";
(self["webpackChunk_truerenton_uilib"] = self["webpackChunk_truerenton_uilib"] || []).push([[531],{

/***/ "./src/components/Scroll/Scroll.example.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ components_Scroll_Scroll_example)
});

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/define-property.js
var define_property = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/define-property.js");
var define_property_default = /*#__PURE__*/__webpack_require__.n(define_property);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/keys.js
var object_keys = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/keys.js");
var keys_default = /*#__PURE__*/__webpack_require__.n(object_keys);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/get-own-property-symbols.js
var get_own_property_symbols = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/get-own-property-symbols.js");
var get_own_property_symbols_default = /*#__PURE__*/__webpack_require__.n(get_own_property_symbols);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/get-own-property-descriptor.js
var get_own_property_descriptor = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/get-own-property-descriptor.js");
var get_own_property_descriptor_default = /*#__PURE__*/__webpack_require__.n(get_own_property_descriptor);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/get-own-property-descriptors.js
var get_own_property_descriptors = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/get-own-property-descriptors.js");
var get_own_property_descriptors_default = /*#__PURE__*/__webpack_require__.n(get_own_property_descriptors);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/define-properties.js
var define_properties = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/define-properties.js");
var define_properties_default = /*#__PURE__*/__webpack_require__.n(define_properties);
// EXTERNAL MODULE: ./node_modules/preact/compat/dist/compat.module.js
var compat_module = __webpack_require__("./node_modules/preact/compat/dist/compat.module.js");
// EXTERNAL MODULE: ./src/helpers.tsx
var helpers = __webpack_require__("./src/helpers.tsx");
// EXTERNAL MODULE: ./src/tools/scroll.ts
var tools_scroll = __webpack_require__("./src/tools/scroll.ts");
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js");
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js");
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js");
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js");
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-modules-typescript-loader/index.js!./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[3]!./node_modules/stylus-loader/dist/cjs.js!./src/components/Heading/Heading.styl
var Heading = __webpack_require__("./node_modules/css-modules-typescript-loader/index.js!./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[3]!./node_modules/stylus-loader/dist/cjs.js!./src/components/Heading/Heading.styl");
;// CONCATENATED MODULE: ./src/components/Heading/Heading.styl

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(Heading/* default */.Z, options);




       /* harmony default export */ const Heading_Heading = (Heading/* default */.Z && Heading/* default.locals */.Z.locals ? Heading/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/components/Heading/Heading.tsx
/* provided dependency */ var h = __webpack_require__("./node_modules/preact/dist/preact.module.js")["h"];



function Heading_Heading_Heading(_ref) {
  var id = _ref.id,
      text = _ref.text;
  var domElem = (0,compat_module/* useRef */.sO)(null);
  var hash = "#".concat(id);
  (0,compat_module/* useEffect */.d4)(function () {
    if (location.hash === hash) (0,tools_scroll/* scrollIntoView */.zT)(domElem.current);
  }, []);
  return h("h2", {
    className: Heading_Heading.root,
    ref: domElem
  }, h("a", {
    name: id,
    href: "".concat(location.pathname).concat(hash),
    className: Heading_Heading.link
  }, "#"), text);
}
// EXTERNAL MODULE: ./src/components/Input/Input.tsx + 4 modules
var Input = __webpack_require__("./src/components/Input/Input.tsx");
// EXTERNAL MODULE: ./src/components/Container/Container.tsx + 1 modules
var Container = __webpack_require__("./src/components/Container/Container.tsx");
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/set-prototype-of.js
var set_prototype_of = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/set-prototype-of.js");
var set_prototype_of_default = /*#__PURE__*/__webpack_require__.n(set_prototype_of);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/get-prototype-of.js
var get_prototype_of = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/get-prototype-of.js");
var get_prototype_of_default = /*#__PURE__*/__webpack_require__.n(get_prototype_of);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/reflect/construct.js
var construct = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/reflect/construct.js");
var construct_default = /*#__PURE__*/__webpack_require__.n(construct);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/create.js
var create = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/create.js");
var create_default = /*#__PURE__*/__webpack_require__.n(create);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/assign.js
var object_assign = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/assign.js");
var assign_default = /*#__PURE__*/__webpack_require__.n(object_assign);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/symbol.js
var symbol = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/symbol.js");
var symbol_default = /*#__PURE__*/__webpack_require__.n(symbol);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/symbol/iterator.js
var iterator = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/symbol/iterator.js");
var iterator_default = /*#__PURE__*/__webpack_require__.n(iterator);
// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__("./node_modules/classnames/index.js");
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
// EXTERNAL MODULE: ./node_modules/justorm/preact.js
var preact = __webpack_require__("./node_modules/justorm/preact.js");
// EXTERNAL MODULE: ./node_modules/lodash.omit/index.js
var lodash_omit = __webpack_require__("./node_modules/lodash.omit/index.js");
var lodash_omit_default = /*#__PURE__*/__webpack_require__.n(lodash_omit);
// EXTERNAL MODULE: ./node_modules/timen/index.js
var timen = __webpack_require__("./node_modules/timen/index.js");
var timen_default = /*#__PURE__*/__webpack_require__.n(timen);
// EXTERNAL MODULE: ./src/tools/string.ts
var string = __webpack_require__("./src/tools/string.ts");
// EXTERNAL MODULE: ./src/tools/dom.ts
var dom = __webpack_require__("./src/tools/dom.ts");
;// CONCATENATED MODULE: ./src/tools/debounce.ts
function debounce(cb, ms) {
  var isCooldown = false;
  var isCalledAtCooldown = false;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (isCooldown) {
      isCalledAtCooldown = true;
      return;
    }

    cb.apply(void 0, args);
    isCooldown = true;
    setTimeout(function () {
      isCooldown = false;

      if (isCalledAtCooldown) {
        cb.apply(void 0, args);
        isCalledAtCooldown = false;
      }
    }, ms);
  };
}
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/map.js
var map = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/map.js");
var map_default = /*#__PURE__*/__webpack_require__.n(map);
// EXTERNAL MODULE: ./node_modules/compareq/index.js
var compareq = __webpack_require__("./node_modules/compareq/index.js");
var compareq_default = /*#__PURE__*/__webpack_require__.n(compareq);
// EXTERNAL MODULE: ./node_modules/lodash.pick/index.js
var lodash_pick = __webpack_require__("./node_modules/lodash.pick/index.js");
var lodash_pick_default = /*#__PURE__*/__webpack_require__.n(lodash_pick);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/array/is-array.js
var is_array = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/array/is-array.js");
var is_array_default = /*#__PURE__*/__webpack_require__.n(is_array);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/array/from.js
var from = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/array/from.js");
;// CONCATENATED MODULE: ./src/tools/array.ts





function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return _Array$from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArray(iter) { if (typeof _Symbol !== "undefined" && iter[_Symbol$iterator] != null || iter["@@iterator"] != null) return _Array$from(iter); }

function _arrayWithHoles(arr) { if (_Array$isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof (symbol_default()) === "function" && typeof (iterator_default()) === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof (symbol_default()) === "function" && obj.constructor === (symbol_default()) && obj !== (symbol_default()).prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function indexWhere(arr, val, fieldName) {
  if (!fieldName) {
    return arr.indexOf(val);
  }

  var isValObj = _typeof(val) === 'object';
  var index = -1;
  arr.some(function (d, i) {
    var dVal = isValObj ? val === null || val === void 0 ? void 0 : val[fieldName] : val;

    if ((d === null || d === void 0 ? void 0 : d[fieldName]) === dVal) {
      index = i;
      return true;
    }

    return false;
  });
  return index;
}
function sliceWhere(_ref, val, fieldName) {
  var _ref2 = _toArray(_ref),
      arr = _ref2.slice(0);

  array_spliceWhere(arr, val, fieldName);
  return arr;
}
function array_spliceWhere(arr, val, fieldName) {
  var index = indexWhere(arr, val, fieldName);
  if (index > -1) arr.splice(index, 1);
}

function _addUniq(_ref3, action) {
  var arr = _ref3.arr,
      val = _ref3.val,
      fieldName = _ref3.fieldName;

  if (is_array_default()(val)) {
    val.forEach(function (v) {
      return addUniq(arr, v, fieldName);
    });
    return;
  }

  var index = indexWhere(arr, val, fieldName);
  if (index === -1) action(val);
}

function addUniq(arr, val, fieldName) {
  _addUniq({
    arr: arr,
    val: val,
    fieldName: fieldName
  }, function (value) {
    return arr.push(value);
  });
}
function unshiftUniq(arr, val, fieldName) {
  _addUniq({
    arr: arr,
    val: val,
    fieldName: fieldName
  }, function (value) {
    return arr.unshift(value);
  });
}
function sortByField(arr, fieldName) {
  var f = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (str) {
    return str;
  };
  return arr.sort(function (a, b) {
    return f(a[fieldName]) > f(b[fieldName]) ? 1 : f(b[fieldName]) > f(a[fieldName]) ? -1 : 0;
  });
}
function groupByField(arr, fieldName) {
  return arr.reduce(function (acc, item) {
    var field = item[fieldName];
    if (!acc[field]) acc[field] = [];
    acc[field].push(item);
    return acc;
  }, {});
}
;// CONCATENATED MODULE: ./src/tools/resizeObserver.ts





var ITEMS = new (map_default())();
var NATIVE_OBSERVERS = new (map_default())();
var IS_NATIVE = ('ResizeObserver' in window);
var TIMEOUT = 500;
var SIZE_FIELDS = ['offsetWidth', 'offsetHeight'];

function check() {
  ITEMS.forEach(function (item, elem) {
    var sizes = item.sizes,
        listeners = item.listeners;
    var newSizes = lodash_pick_default()(elem, SIZE_FIELDS);

    if (!compareq_default()(newSizes, sizes)) {
      item.sizes = newSizes;
      listeners.forEach(function (cb) {
        return cb(newSizes, elem);
      });
    }
  });
  run();
}

function run() {
  if (ITEMS.size > 0) timen_default().after(TIMEOUT, check);
}

function observe(elem, cb) {
  if (IS_NATIVE) {
    var observer = new ResizeObserver(cb);
    observer.observe(elem);
    NATIVE_OBSERVERS.set(elem, observer);
    return;
  }

  var data = ITEMS.get(elem);

  if (data) {
    addUniq(data.listeners, cb);
    return;
  }

  ITEMS.set(elem, {
    sizes: lodash_pick_default()(elem, SIZE_FIELDS),
    listeners: [cb]
  });
  if (ITEMS.size === 1) run();
}
function unobserve(elem, cb) {
  if (IS_NATIVE) {
    var observer = NATIVE_OBSERVERS.get(elem);
    if (!observer) return;
    observer.unobserve(elem);
    NATIVE_OBSERVERS["delete"](elem);
    return;
  }

  var data = ITEMS.get(elem);
  if (!cb || (data === null || data === void 0 ? void 0 : data.listeners.indexOf(cb)) === -1) return;
  if (data.listeners.length === 1) ITEMS["delete"](elem);else spliceWhere(data.listeners, cb);
}
// EXTERNAL MODULE: ./node_modules/css-modules-typescript-loader/index.js!./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[3]!./node_modules/stylus-loader/dist/cjs.js!./src/components/Scroll/Scroll.styl
var Scroll = __webpack_require__("./node_modules/css-modules-typescript-loader/index.js!./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[3]!./node_modules/stylus-loader/dist/cjs.js!./src/components/Scroll/Scroll.styl");
;// CONCATENATED MODULE: ./src/components/Scroll/Scroll.styl

      
      
      
      
      
      
      
      
      

var Scroll_options = {};

Scroll_options.styleTagTransform = (styleTagTransform_default());
Scroll_options.setAttributes = (setAttributesWithoutAttributes_default());

      Scroll_options.insert = insertBySelector_default().bind(null, "head");
    
Scroll_options.domAPI = (styleDomAPI_default());
Scroll_options.insertStyleElement = (insertStyleElement_default());

var Scroll_update = injectStylesIntoStyleTag_default()(Scroll/* default */.Z, Scroll_options);




       /* harmony default export */ const Scroll_Scroll = (Scroll/* default */.Z && Scroll/* default.locals */.Z.locals ? Scroll/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/components/Scroll/Scroll.tsx
/* provided dependency */ var Scroll_h = __webpack_require__("./node_modules/preact/dist/preact.module.js")["h"];
function Scroll_typeof(obj) { "@babel/helpers - typeof"; if (typeof (symbol_default()) === "function" && typeof (iterator_default()) === "symbol") { Scroll_typeof = function _typeof(obj) { return typeof obj; }; } else { Scroll_typeof = function _typeof(obj) { return obj && typeof (symbol_default()) === "function" && obj.constructor === (symbol_default()) && obj !== (symbol_default()).prototype ? "symbol" : typeof obj; }; } return Scroll_typeof(obj); }















function _extends() { _extends = (assign_default()) || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = keys_default()(object); if ((get_own_property_symbols_default())) { var symbols = get_own_property_symbols_default()(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return get_own_property_descriptor_default()(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if ((get_own_property_descriptors_default())) { define_properties_default()(target, get_own_property_descriptors_default()(source)); } else { ownKeys(Object(source)).forEach(function (key) { define_property_default()(target, key, get_own_property_descriptor_default()(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; define_property_default()(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = create_default()(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = (set_prototype_of_default()) || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = construct_default()(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (Scroll_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !(construct_default())) return false; if ((construct_default()).sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(construct_default()(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = (set_prototype_of_default()) ? (get_prototype_of_default()) : function _getPrototypeOf(o) { return o.__proto__ || get_prototype_of_default()(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { define_property_default()(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }












var Scroll_Scroll_Scroll = function (_Component) {
  _inherits(Scroll, _Component);

  var _super = _createSuper(Scroll);

  function Scroll(props) {
    var _this;

    _classCallCheck(this, Scroll);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "innerElem", (0,compat_module/* createRef */.Vf)());

    _defineProperty(_assertThisInitialized(_this), "thumbELem", {
      x: (0,compat_module/* createRef */.Vf)(),
      y: (0,compat_module/* createRef */.Vf)()
    });

    _defineProperty(_assertThisInitialized(_this), "store", void 0);

    _defineProperty(_assertThisInitialized(_this), "isTouch", void 0);

    _defineProperty(_assertThisInitialized(_this), "events", void 0);

    _defineProperty(_assertThisInitialized(_this), "timers", timen_default().create());

    _defineProperty(_assertThisInitialized(_this), "prevCoords", {
      x: 0,
      y: 0
    });

    _defineProperty(_assertThisInitialized(_this), "prevScrolls", {
      x: 0,
      y: 0
    });

    _defineProperty(_assertThisInitialized(_this), "prevBoundings", {
      x: 0,
      y: 0
    });

    _defineProperty(_assertThisInitialized(_this), "unsubscribeScrollHeightObserver", void 0);

    _defineProperty(_assertThisInitialized(_this), "observeScrollHeight", function () {
      if (_this.isScrollChanged() || _this.isBoudingsChanged()) {
        _this.update();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "update", function () {
      _this.updateCoeff();

      _this.updatePos();
    });

    _defineProperty(_assertThisInitialized(_this), "updatePos", function () {
      var _offset$x, _offset$x2, _offset$y, _offset$y2, _this$thumbELem$x$cur, _this$thumbELem$y$cur;

      var offset = _this.props.offset;
      var xOffsetBefore = (offset === null || offset === void 0 ? void 0 : (_offset$x = offset.x) === null || _offset$x === void 0 ? void 0 : _offset$x.before) || 0;
      var xOffsetAfter = (offset === null || offset === void 0 ? void 0 : (_offset$x2 = offset.x) === null || _offset$x2 === void 0 ? void 0 : _offset$x2.after) || 0;
      var yOffsetBefore = (offset === null || offset === void 0 ? void 0 : (_offset$y = offset.y) === null || _offset$y === void 0 ? void 0 : _offset$y.before) || 0;
      var yOffsetAfter = (offset === null || offset === void 0 ? void 0 : (_offset$y2 = offset.y) === null || _offset$y2 === void 0 ? void 0 : _offset$y2.after) || 0;
      var _this$innerElem$curre = _this.innerElem.current,
          clientHeight = _this$innerElem$curre.clientHeight,
          clientWidth = _this$innerElem$curre.clientWidth,
          scrollHeight = _this$innerElem$curre.scrollHeight,
          scrollWidth = _this$innerElem$curre.scrollWidth,
          scrollTop = _this$innerElem$curre.scrollTop,
          scrollLeft = _this$innerElem$curre.scrollLeft;
      var xThumbSize = (_this$thumbELem$x$cur = _this.thumbELem.x.current) === null || _this$thumbELem$x$cur === void 0 ? void 0 : _this$thumbELem$x$cur.offsetWidth;
      var yThumbSize = (_this$thumbELem$y$cur = _this.thumbELem.y.current) === null || _this$thumbELem$y$cur === void 0 ? void 0 : _this$thumbELem$y$cur.offsetHeight;
      var x = xThumbSize ? (clientWidth - xThumbSize - xOffsetBefore - xOffsetAfter) * (scrollLeft / (scrollWidth - clientWidth)) : 0;
      var y = yThumbSize ? (clientHeight - yThumbSize - yOffsetBefore - yOffsetAfter) * (scrollTop / (scrollHeight - clientHeight)) : 0;
      _this.store.pos = {
        x: x,
        y: y
      };
    });

    _defineProperty(_assertThisInitialized(_this), "dropScrollingState", function () {
      return _this.store.isScrolling = false;
    });

    _defineProperty(_assertThisInitialized(_this), "onScroll", function (e) {
      var activeAxis = _this.store.activeAxis;

      if (activeAxis && _this.innerElem.current !== e.target) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onInnerScroll", function (e) {
      var _this$store = _this.store,
          activeAxis = _this$store.activeAxis,
          isScrolling = _this$store.isScrolling;
      if (!activeAxis) _this.updatePos();
      if (!isScrolling) _this.store.isScrolling = true;

      _this.timers.clear(_this.dropScrollingState);

      _this.timers.after(500, _this.dropScrollingState);
    });

    _defineProperty(_assertThisInitialized(_this), "onPointerStart", function (axis, e) {
      e.preventDefault();
      e.stopPropagation();
      _this.prevCoords = _this.getEventCoords(e);
      _this.store.activeAxis = axis;
    });

    _defineProperty(_assertThisInitialized(_this), "onPointerMove", function (e) {
      var _this$store2 = _this.store,
          axis = _this$store2.activeAxis,
          coeff = _this$store2.coeff;
      if (!axis) return;
      e.preventDefault();
      e.stopPropagation();

      var coords = _this.getEventCoords(e);

      var scrollDir = axis === 'y' ? 'scrollTop' : 'scrollLeft';
      var pos = coords[axis] - _this.prevCoords[axis];
      _this.prevCoords = coords;
      _this.innerElem.current[scrollDir] += pos / coeff[axis];

      _this.updatePos();
    });

    _defineProperty(_assertThisInitialized(_this), "onPointerEnd", function (e) {
      e.stopPropagation();
      _this.store.activeAxis = null;
    });

    _this.isTouch = (0,dom/* isTouch */.T)();
    _this.store = (0,preact.createStore)(_assertThisInitialized(_this), {
      coeff: {
        x: 0,
        y: 0
      },
      pos: {
        x: 0,
        y: 0
      },
      isScrolling: false,
      activeAxis: null
    });
    _this.events = _this.isTouch ? {
      start: 'onTouchStart',
      move: 'touchmove',
      end: 'touchend'
    } : {
      start: 'onMouseDown',
      move: 'mousemove',
      end: 'mouseup'
    };
    _this.updatePos = debounce(_this.updatePos, 50);
    return _this;
  }

  _createClass(Scroll, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.updateCoeff();
      this.unsubscribeScrollHeightObserver = timen_default().every(100, this.observeScrollHeight);
      observe(this.innerElem.current, this.update);
      document.addEventListener(this.events.move, this.onPointerMove, {
        passive: false
      });
      document.addEventListener(this.events.end, this.onPointerEnd);
      document.addEventListener('scroll', this.onScroll);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this$unsubscribeScro;

      (_this$unsubscribeScro = this.unsubscribeScrollHeightObserver) === null || _this$unsubscribeScro === void 0 ? void 0 : _this$unsubscribeScro.call(this);
      document.removeEventListener(this.events.move, this.onPointerMove);
      document.removeEventListener(this.events.end, this.onPointerEnd);
      document.removeEventListener('scroll', this.onScroll);
    }
  }, {
    key: "isScrollChanged",
    value: function isScrollChanged() {
      var _this$props = this.props,
          x = _this$props.x,
          y = _this$props.y;
      var currScrolls = this.getScrollSizes();
      var isChanged = false;
      if (x && this.prevScrolls.x !== currScrolls.x) isChanged = true;
      if (y && this.prevScrolls.y !== currScrolls.y) isChanged = true;
      if (isChanged) this.prevScrolls = currScrolls;
      return isChanged;
    }
  }, {
    key: "isBoudingsChanged",
    value: function isBoudingsChanged() {
      var _this$props2 = this.props,
          x = _this$props2.x,
          y = _this$props2.y;
      var _this$innerElem$curre2 = this.innerElem.current,
          offsetWidth = _this$innerElem$curre2.offsetWidth,
          offsetHeight = _this$innerElem$curre2.offsetHeight;
      var boundings = {
        x: offsetWidth,
        y: offsetHeight
      };
      var isChanged = false;
      if (y && offsetHeight !== this.prevBoundings.y) isChanged = true;
      if (x && offsetWidth !== this.prevBoundings.x) isChanged = true;
      if (isChanged) this.prevBoundings = boundings;
      return isChanged;
    }
  }, {
    key: "updateCoeff",
    value: function updateCoeff() {
      var _this$innerElem$curre3 = this.innerElem.current,
          clientHeight = _this$innerElem$curre3.clientHeight,
          clientWidth = _this$innerElem$curre3.clientWidth,
          scrollHeight = _this$innerElem$curre3.scrollHeight,
          scrollWidth = _this$innerElem$curre3.scrollWidth;
      this.store.coeff = {
        x: clientWidth / scrollWidth,
        y: clientHeight / scrollHeight
      };
    }
  }, {
    key: "getScrollSizes",
    value: function getScrollSizes() {
      var _this$innerElem$curre4 = this.innerElem.current,
          y = _this$innerElem$curre4.scrollHeight,
          x = _this$innerElem$curre4.scrollWidth;
      return {
        x: x,
        y: y
      };
    }
  }, {
    key: "getEventCoords",
    value: function getEventCoords(e) {
      var target = this.isTouch ? e.targetTouches[0] : e;
      return {
        x: target.clientX,
        y: target.clientY
      };
    }
  }, {
    key: "getOffset",
    value: function getOffset(axis) {
      var _this$props$offset, _ref;

      var offset = (_this$props$offset = this.props.offset) === null || _this$props$offset === void 0 ? void 0 : _this$props$offset[axis];
      var isVertical = axis === 'y';
      var before = isVertical ? 'top' : 'left';
      var after = isVertical ? 'bottom' : 'right';
      return _ref = {}, _defineProperty(_ref, before, (offset === null || offset === void 0 ? void 0 : offset.before) || 0), _defineProperty(_ref, after, (offset === null || offset === void 0 ? void 0 : offset.after) || 0), _ref;
    }
  }, {
    key: "renderBar",
    value: function renderBar(axis, sizeField, posField) {
      var _this$thumbELem$axis$, _thumbStyle;

      var thumbClassName = this.props.thumbClassName;
      var _this$store3 = this.store,
          coeff = _this$store3.coeff,
          pos = _this$store3.pos,
          activeAxis = _this$store3.activeAxis;
      if (coeff[axis] === 1) return null;
      var offsetSizeField = "offset".concat((0,string/* capitalize */.k)(sizeField));
      var thumbSize = ((_this$thumbELem$axis$ = this.thumbELem[axis].current) === null || _this$thumbELem$axis$ === void 0 ? void 0 : _this$thumbELem$axis$[offsetSizeField]) || 0;
      var thumbStyle = (_thumbStyle = {}, _defineProperty(_thumbStyle, sizeField, "".concat(coeff[axis] * 100, "%")), _defineProperty(_thumbStyle, posField, "".concat(pos[axis], "px")), _thumbStyle);

      var barProps = _defineProperty({
        className: classnames_default()(Scroll_Scroll.bar, Scroll_Scroll[axis], activeAxis && Scroll_Scroll.isActive),
        style: this.getOffset(axis)
      }, this.events.start, this.onPointerStart.bind(this, axis));

      return Scroll_h("div", barProps, Scroll_h("div", {
        className: classnames_default()(Scroll_Scroll.thumb, thumbClassName),
        style: thumbStyle,
        ref: this.thumbELem[axis]
      }));
    }
  }, {
    key: "renderInner",
    value: function renderInner() {
      var _this$props3 = this.props,
          innerClassName = _this$props3.innerClassName,
          innerProps = _this$props3.innerProps,
          children = _this$props3.children;
      var innerClasses = classnames_default()(Scroll_Scroll.inner, innerProps === null || innerProps === void 0 ? void 0 : innerProps.className, innerClassName);

      var props = _objectSpread(_objectSpread({}, innerProps), {}, {
        onScroll: this.onInnerScroll
      });

      return Scroll_h("div", _extends({}, props, {
        className: innerClasses,
        ref: this.innerElem
      }), children);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          y = _this$props4.y,
          x = _this$props4.x,
          autoHide = _this$props4.autoHide,
          className = _this$props4.className;
      var _this$store4 = this.store,
          coeff = _this$store4.coeff,
          isScrolling = _this$store4.isScrolling,
          activeAxis = _this$store4.activeAxis;
      var classes = classnames_default()(Scroll_Scroll.root, y && Scroll_Scroll.y, x && Scroll_Scroll.x, autoHide && Scroll_Scroll.autoHide, (isScrolling || activeAxis) && Scroll_Scroll.isScrolling, this.isTouch && Scroll_Scroll.isTouch, className);
      var props = lodash_omit_default()(this.props, ['x', 'y', 'className', 'innerClassName', 'innerProps', 'thumbClassName', 'autoHide', 'children']);
      return Scroll_h("div", _extends({
        className: classes
      }, props), this.renderInner(), x && this.renderBar('x', 'width', 'left'), y && this.renderBar('y', 'height', 'top'));
    }
  }]);

  return Scroll;
}(compat_module/* Component */.wA);


// EXTERNAL MODULE: ./node_modules/css-modules-typescript-loader/index.js!./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[3]!./node_modules/stylus-loader/dist/cjs.js!./src/components/Scroll/Scroll.example.styl
var Scroll_example = __webpack_require__("./node_modules/css-modules-typescript-loader/index.js!./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[3]!./node_modules/stylus-loader/dist/cjs.js!./src/components/Scroll/Scroll.example.styl");
;// CONCATENATED MODULE: ./src/components/Scroll/Scroll.example.styl

      
      
      
      
      
      
      
      
      

var Scroll_example_options = {};

Scroll_example_options.styleTagTransform = (styleTagTransform_default());
Scroll_example_options.setAttributes = (setAttributesWithoutAttributes_default());

      Scroll_example_options.insert = insertBySelector_default().bind(null, "head");
    
Scroll_example_options.domAPI = (styleDomAPI_default());
Scroll_example_options.insertStyleElement = (insertStyleElement_default());

var Scroll_example_update = injectStylesIntoStyleTag_default()(Scroll_example/* default */.Z, Scroll_example_options);




       /* harmony default export */ const Scroll_Scroll_example = (Scroll_example/* default */.Z && Scroll_example/* default.locals */.Z.locals ? Scroll_example/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/components/Scroll/Scroll.example.tsx
/* provided dependency */ var Scroll_example_h = __webpack_require__("./node_modules/preact/dist/preact.module.js")["h"];







function Scroll_example_ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function Scroll_example_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { Scroll_example_ownKeys(Object(source), true).forEach(function (key) { Scroll_example_defineProperty(target, key, source[key]); }); } else if (_Object$getOwnPropertyDescriptors) { _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)); } else { Scroll_example_ownKeys(Object(source)).forEach(function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } } return target; }

function Scroll_example_defineProperty(obj, key, value) { if (key in obj) { _Object$defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }








var TEXT = [helpers/* LOREM_IPSUM_LONG */.WJ, helpers/* LOREM_IPSUM_LONG */.WJ, helpers/* LOREM_IPSUM_LONG */.WJ, helpers/* LOREM_IPSUM_LONG */.WJ, helpers/* LOREM_IPSUM_LONG */.WJ].join('\n');

function Example(style) {
  return Scroll_example_h("div", {
    style: Scroll_example_objectSpread({
      maxWidth: '100%'
    }, style)
  }, TEXT);
}

/* harmony default export */ const components_Scroll_Scroll_example = (function () {
  return Scroll_example_h(compat_module/* Fragment */.HY, null, Scroll_example_h(Container/* Container */.W, {
    vertical: true,
    size: "s"
  }, Scroll_example_h(Heading_Heading_Heading, {
    id: "xy",
    text: "XY"
  }), Scroll_example_h(Scroll_Scroll_Scroll, {
    className: Scroll_Scroll_example.example,
    innerClassName: Scroll_Scroll_example.inner,
    x: true,
    y: true
  }, Scroll_example_h("div", {
    style: {
      width: 1000
    }
  }, TEXT))), Scroll_example_h(Container/* Container */.W, {
    vertical: true,
    size: "s"
  }, Scroll_example_h(Heading_Heading_Heading, {
    id: "y",
    text: "Y"
  }), Scroll_example_h(Scroll_Scroll_Scroll, {
    className: Scroll_Scroll_example.example,
    innerClassName: Scroll_Scroll_example.inner,
    y: true
  }, TEXT)), Scroll_example_h(Container/* Container */.W, {
    vertical: true,
    size: "s"
  }, Scroll_example_h(Heading_Heading_Heading, {
    id: "x",
    text: "X"
  }), Scroll_example_h(Scroll_Scroll_Scroll, {
    className: Scroll_Scroll_example.example,
    innerClassName: Scroll_Scroll_example.inner,
    x: true
  }, Scroll_example_h("div", {
    style: {
      width: 2000
    }
  }, TEXT))), Scroll_example_h(Container/* Container */.W, {
    vertical: true,
    size: "s"
  }, Scroll_example_h(Heading_Heading_Heading, {
    id: "y-offset",
    text: "Y with offset before"
  }), Scroll_example_h(Scroll_Scroll_Scroll, {
    className: Scroll_Scroll_example.example,
    innerClassName: Scroll_Scroll_example.inner,
    y: true,
    offset: {
      y: {
        before: 50
      }
    }
  }, TEXT)), Scroll_example_h(Container/* Container */.W, {
    vertical: true,
    size: "s"
  }, Scroll_example_h(Heading_Heading_Heading, {
    id: "y-offset",
    text: "XY with offset from every side"
  }), Scroll_example_h(Scroll_Scroll_Scroll, {
    className: Scroll_Scroll_example.example,
    innerClassName: Scroll_Scroll_example.inner,
    x: true,
    y: true,
    offset: {
      x: {
        before: 20,
        after: 20
      },
      y: {
        before: 20,
        after: 20
      }
    }
  }, Scroll_example_h("div", {
    style: {
      width: 1000
    }
  }, TEXT))), Scroll_example_h(Container/* Container */.W, {
    vertical: true,
    size: "s"
  }, Scroll_example_h(Heading_Heading_Heading, {
    id: "thumb-depend-scroll",
    text: "Thumb size depend on scroll height"
  }), Scroll_example_h(helpers/* State */.ZM, {
    initial: {
      width: 1000,
      height: 1000
    }
  }, function (state) {
    return Scroll_example_h("div", null, Scroll_example_h("div", {
      style: {
        width: 300,
        display: 'flex'
      }
    }, Scroll_example_h(Input/* Input */.I, {
      className: Scroll_Scroll_example.input,
      label: "width",
      type: "number",
      step: 100,
      value: state.width,
      onChange: function onChange(val) {
        return state.width = val;
      }
    }), Scroll_example_h(Input/* Input */.I, {
      className: Scroll_Scroll_example.input,
      label: "height",
      type: "number",
      step: 100,
      value: state.height,
      onChange: function onChange(val) {
        return state.height = val;
      }
    })), Scroll_example_h(Scroll_Scroll_Scroll, {
      className: Scroll_Scroll_example.example,
      innerClassName: Scroll_Scroll_example.inner,
      y: true,
      offset: {
        y: {
          before: 20,
          after: 20
        }
      }
    }, Scroll_example_h("div", {
      style: {
        width: state.width,
        height: state.height,
        overflow: 'hidden'
      }
    }, TEXT)));
  })));
});

/***/ }),

/***/ "./node_modules/css-modules-typescript-loader/index.js!./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[3]!./node_modules/stylus-loader/dist/cjs.js!./src/components/Heading/Heading.styl":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".Heading__root___LIW0I{position:relative;margin:1em 0}.Heading__root___LIW0I,.Heading__root___LIW0I > a{color:var(--accent-color) !important}.Heading__link___uFVcD{position:absolute;display:block;bottom:0;left:-1.7em;right:1.7em;min-height:100%;padding:.8em 1em 0;transition:all .2s ease-out;opacity:0;text-decoration:none}.Heading__root___LIW0I:hover .Heading__link___uFVcD{opacity:1;transform:translateX(-5px)}", ""]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"root": "Heading__root___LIW0I",
	"link": "Heading__link___uFVcD"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-modules-typescript-loader/index.js!./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[3]!./node_modules/stylus-loader/dist/cjs.js!./src/components/Scroll/Scroll.example.styl":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".Scroll-example__example___l4JR2{height:300px;width:300px;font-size:18px;border-radius:8px;box-shadow:inset 0 0 0 1px var(--accent-color-alpha-100)}.Scroll-example__inner___isBk9{padding:8px}.Scroll-example__input___MAYAo{flex-grow:1;margin-bottom:8px}.Scroll-example__input___MAYAo + .Scroll-example__input___MAYAo{margin-left:8px}", ""]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"example": "Scroll-example__example___l4JR2",
	"inner": "Scroll-example__inner___isBk9",
	"input": "Scroll-example__input___MAYAo"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-modules-typescript-loader/index.js!./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[3]!./node_modules/stylus-loader/dist/cjs.js!./src/components/Scroll/Scroll.styl":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".Scroll__root___uNzmI{position:relative;overflow:hidden;display:flex}.Scroll__inner___uM4Pm{width:100%;overflow:hidden;-webkit-overflow-scrolling:touch;-ms-overflow-style:none;scrollbar-width:none}.Scroll__inner___uM4Pm::-webkit-scrollbar{display:none}.Scroll__y___einFi .Scroll__inner___uM4Pm{overflow-y:auto}.Scroll__x___dIeLw .Scroll__inner___uM4Pm{overflow-x:auto}.Scroll__thumb___PE90F{position:absolute;background-color:var(--active-color);border-radius:1px;transition:all .1s ease-out;transform-origin:center}.Scroll__thumb___PE90F:active{transition:none}.Scroll__y___einFi > .Scroll__thumb___PE90F{top:0;left:50%;width:1px}.Scroll__x___dIeLw > .Scroll__thumb___PE90F{left:0;top:50%;height:1px}.Scroll__bar___kQ5uR{z-index:2;position:absolute;transition:.3s opacity .1s ease-out;cursor:pointer;overflow:hidden}.Scroll__autoHide___G6xl2 .Scroll__bar___kQ5uR{opacity:0}.Scroll__isScrolling___YfrZZ .Scroll__bar___kQ5uR,.Scroll__bar___kQ5uR:hover{transition-delay:0;opacity:1}.Scroll__bar___kQ5uR::before{content:'';position:absolute;opacity:0;transition:.1s opacity .3s ease-out;background-color:var(--accent-color-alpha-100)}.Scroll__bar___kQ5uR:hover,.Scroll__bar___kQ5uR.Scroll__isActive___NQiBJ{z-index:1}.Scroll__bar___kQ5uR:hover::before,.Scroll__bar___kQ5uR.Scroll__isActive___NQiBJ::before{opacity:1;transition-delay:0s}.Scroll__bar___kQ5uR:hover .Scroll__thumb___PE90F,.Scroll__bar___kQ5uR.Scroll__isActive___NQiBJ .Scroll__thumb___PE90F{transition-delay:0s}.Scroll__bar___kQ5uR.Scroll__y___einFi{right:0;top:8px;bottom:8px;width:16px}.Scroll__isTouch___DPyrK .Scroll__bar___kQ5uR.Scroll__y___einFi{width:32px}.Scroll__bar___kQ5uR.Scroll__y___einFi::before{left:50%;width:1px;height:100%}.Scroll__bar___kQ5uR.Scroll__y___einFi:hover .Scroll__thumb___PE90F,.Scroll__bar___kQ5uR.Scroll__y___einFi.Scroll__isActive___NQiBJ .Scroll__thumb___PE90F{width:5px;left:calc(50% - 2px)}.Scroll__bar___kQ5uR.Scroll__x___dIeLw{bottom:0;right:8px;left:8px;height:16px}.Scroll__isTouch___DPyrK .Scroll__bar___kQ5uR.Scroll__x___dIeLw{height:32px}.Scroll__bar___kQ5uR.Scroll__x___dIeLw::before{top:50%;height:1px;width:100%}.Scroll__bar___kQ5uR.Scroll__x___dIeLw:hover .Scroll__thumb___PE90F,.Scroll__bar___kQ5uR.Scroll__x___dIeLw.Scroll__isActive___NQiBJ .Scroll__thumb___PE90F{height:5px;top:calc(50% - 2px)}", ""]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"root": "Scroll__root___uNzmI",
	"inner": "Scroll__inner___uM4Pm",
	"y": "Scroll__y___einFi",
	"x": "Scroll__x___dIeLw",
	"thumb": "Scroll__thumb___PE90F",
	"bar": "Scroll__bar___kQ5uR",
	"autoHide": "Scroll__autoHide___G6xl2",
	"isScrolling": "Scroll__isScrolling___YfrZZ",
	"isActive": "Scroll__isActive___NQiBJ",
	"isTouch": "Scroll__isTouch___DPyrK"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ })

}]);