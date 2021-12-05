"use strict";
(self["webpackChunk_truerenton_uilib"] = self["webpackChunk_truerenton_uilib"] || []).push([[21],{

/***/ "./src/components/AssistiveText/AssistiveText.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "T": () => (/* binding */ AssistiveText_AssistiveText_AssistiveText)
});

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/keys.js
var keys = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/keys.js");
var keys_default = /*#__PURE__*/__webpack_require__.n(keys);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/get-own-property-symbols.js
var get_own_property_symbols = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/get-own-property-symbols.js");
var get_own_property_symbols_default = /*#__PURE__*/__webpack_require__.n(get_own_property_symbols);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/assign.js
var object_assign = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/assign.js");
var assign_default = /*#__PURE__*/__webpack_require__.n(object_assign);
// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__("./node_modules/classnames/index.js");
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
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
// EXTERNAL MODULE: ./node_modules/css-modules-typescript-loader/index.js!./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[3]!./node_modules/stylus-loader/dist/cjs.js!./src/components/AssistiveText/AssistiveText.styl
var AssistiveText = __webpack_require__("./node_modules/css-modules-typescript-loader/index.js!./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[3]!./node_modules/stylus-loader/dist/cjs.js!./src/components/AssistiveText/AssistiveText.styl");
;// CONCATENATED MODULE: ./src/components/AssistiveText/AssistiveText.styl

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(AssistiveText/* default */.Z, options);




       /* harmony default export */ const AssistiveText_AssistiveText = (AssistiveText/* default */.Z && AssistiveText/* default.locals */.Z.locals ? AssistiveText/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/components/AssistiveText/AssistiveText.tsx
/* provided dependency */ var h = __webpack_require__("./node_modules/preact/dist/preact.module.js")["h"];



var _excluded = ["className", "size", "variant", "children"];

function _extends() { _extends = (assign_default()) || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if ((get_own_property_symbols_default())) { var sourceSymbolKeys = get_own_property_symbols_default()(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = keys_default()(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }



function AssistiveText_AssistiveText_AssistiveText(props) {
  var className = props.className,
      _props$size = props.size,
      size = _props$size === void 0 ? 'm' : _props$size,
      _props$variant = props.variant,
      variant = _props$variant === void 0 ? 'default' : _props$variant,
      children = props.children,
      rest = _objectWithoutProperties(props, _excluded);

  return h("div", _extends({
    className: classnames_default()(AssistiveText_AssistiveText.root, AssistiveText_AssistiveText["size-".concat(size)], AssistiveText_AssistiveText["variant-".concat(variant)], className)
  }, rest), children);
}

/***/ }),

/***/ "./src/components/Checkbox/Checkbox.example.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var src_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/helpers.tsx");
/* harmony import */ var _Container_Container__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/components/Container/Container.tsx");
/* harmony import */ var _Checkbox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/components/Checkbox/Checkbox.tsx");
/* provided dependency */ var h = __webpack_require__("./node_modules/preact/dist/preact.module.js")["h"];



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (function () {
  return h(_Container_Container__WEBPACK_IMPORTED_MODULE_0__/* .Container */ .W, {
    centered: true,
    fullHeight: true,
    size: "l"
  }, h(src_helpers__WEBPACK_IMPORTED_MODULE_1__/* .State */ .ZM, {
    initial: {
      checked: true
    }
  }, function (store) {
    return h(_Checkbox__WEBPACK_IMPORTED_MODULE_2__/* .Checkbox */ .X, {
      label: "i'm a checkbutton",
      onChange: function onChange() {
        return store.checked = !store.checked;
      },
      checked: store.checked
    });
  }));
});

/***/ }),

/***/ "./src/components/Checkbox/Checkbox.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "X": () => (/* binding */ Checkbox_Checkbox_Checkbox)
});

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
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/keys.js
var keys = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/keys.js");
var keys_default = /*#__PURE__*/__webpack_require__.n(keys);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/get-own-property-symbols.js
var get_own_property_symbols = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/get-own-property-symbols.js");
var get_own_property_symbols_default = /*#__PURE__*/__webpack_require__.n(get_own_property_symbols);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/assign.js
var object_assign = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/assign.js");
var assign_default = /*#__PURE__*/__webpack_require__.n(object_assign);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/symbol.js
var symbol = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/symbol.js");
var symbol_default = /*#__PURE__*/__webpack_require__.n(symbol);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/symbol/iterator.js
var iterator = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/symbol/iterator.js");
var iterator_default = /*#__PURE__*/__webpack_require__.n(iterator);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/define-property.js
var define_property = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/define-property.js");
var define_property_default = /*#__PURE__*/__webpack_require__.n(define_property);
// EXTERNAL MODULE: ./node_modules/preact/compat/dist/compat.module.js
var compat_module = __webpack_require__("./node_modules/preact/compat/dist/compat.module.js");
// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__("./node_modules/classnames/index.js");
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
// EXTERNAL MODULE: ./node_modules/nanoid/index.prod.js
var index_prod = __webpack_require__("./node_modules/nanoid/index.prod.js");
// EXTERNAL MODULE: ./node_modules/justorm/preact.js
var preact = __webpack_require__("./node_modules/justorm/preact.js");
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
// EXTERNAL MODULE: ./node_modules/css-modules-typescript-loader/index.js!./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[3]!./node_modules/stylus-loader/dist/cjs.js!./src/components/Checkbox/Checkbox.styl
var Checkbox = __webpack_require__("./node_modules/css-modules-typescript-loader/index.js!./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[3]!./node_modules/stylus-loader/dist/cjs.js!./src/components/Checkbox/Checkbox.styl");
;// CONCATENATED MODULE: ./src/components/Checkbox/Checkbox.styl

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(Checkbox/* default */.Z, options);




       /* harmony default export */ const Checkbox_Checkbox = (Checkbox/* default */.Z && Checkbox/* default.locals */.Z.locals ? Checkbox/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/components/Checkbox/Checkbox.tsx
/* provided dependency */ var h = __webpack_require__("./node_modules/preact/dist/preact.module.js")["h"];
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof (symbol_default()) === "function" && typeof (iterator_default()) === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof (symbol_default()) === "function" && obj.constructor === (symbol_default()) && obj !== (symbol_default()).prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }










var _excluded = ["className", "label", "size"];


function _extends() { _extends = (assign_default()) || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if ((get_own_property_symbols_default())) { var sourceSymbolKeys = get_own_property_symbols_default()(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = keys_default()(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; define_property_default()(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = create_default()(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = (set_prototype_of_default()) || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = construct_default()(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !(construct_default())) return false; if ((construct_default()).sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(construct_default()(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = (set_prototype_of_default()) ? (get_prototype_of_default()) : function _getPrototypeOf(o) { return o.__proto__ || get_prototype_of_default()(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { define_property_default()(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






var Checkbox_Checkbox_Checkbox = function (_Component) {
  _inherits(Checkbox, _Component);

  var _super = _createSuper(Checkbox);

  function Checkbox(props) {
    var _this;

    _classCallCheck(this, Checkbox);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "id", void 0);

    _defineProperty(_assertThisInitialized(_this), "store", void 0);

    _defineProperty(_assertThisInitialized(_this), "onMouseDown", function () {
      _this.store.isActive = true;
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseUp", function () {
      _this.store.isActive = false;
    });

    _defineProperty(_assertThisInitialized(_this), "onFocus", function (e) {
      var onFocus = _this.props.onFocus;
      _this.store.isFocused = true;
      if (onFocus) onFocus(e);
    });

    _defineProperty(_assertThisInitialized(_this), "onBlur", function (e) {
      var onBlur = _this.props.onBlur;
      _this.store.isFocused = false;
      if (onBlur) onBlur(e);
    });

    _this.id = props.id || (0,index_prod/* nanoid */.x0)();
    _this.store = (0,preact.createStore)(_assertThisInitialized(_this), {
      isActive: false,
      isFocused: false
    });
    return _this;
  }

  _createClass(Checkbox, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          label = _this$props.label,
          size = _this$props.size,
          props = _objectWithoutProperties(_this$props, _excluded);

      var checked = props.checked;
      var _this$store = this.store,
          isActive = _this$store.isActive,
          isFocused = _this$store.isFocused;
      var classes = classnames_default()(Checkbox_Checkbox.root, Checkbox_Checkbox["size-".concat(size)], checked && Checkbox_Checkbox.isChecked, isActive && Checkbox_Checkbox.isActive, isFocused && Checkbox_Checkbox.isFocused, className);
      return h("label", {
        className: classes,
        onMouseDown: this.onMouseDown,
        onMouseUp: this.onMouseUp
      }, h("div", {
        className: Checkbox_Checkbox.controlWrapper
      }, h("input", _extends({
        className: Checkbox_Checkbox.control
      }, props, {
        onFocus: this.onFocus,
        onBlur: this.onBlur,
        id: this.id,
        type: "checkbox",
        tabIndex: 0
      })), h("div", {
        className: Checkbox_Checkbox.checkmark
      })), label);
    }
  }]);

  return Checkbox;
}(compat_module/* Component */.wA);

_defineProperty(Checkbox_Checkbox_Checkbox, "defaultProps", {
  size: 's',
  label: '',
  checked: false
});

/***/ }),

/***/ "./src/helpers.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ZM": () => (/* binding */ State),
/* harmony export */   "Dx": () => (/* binding */ Title),
/* harmony export */   "WJ": () => (/* binding */ LOREM_IPSUM_LONG)
/* harmony export */ });
/* unused harmony exports LOREM_IPSUM_SHORT, getRandomImageUrl, getRandomItem */
/* harmony import */ var _babel_runtime_corejs2_core_js_object_define_property__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/define-property.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_object_define_property__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_object_define_property__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_corejs2_core_js_object_set_prototype_of__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/set-prototype-of.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_object_set_prototype_of__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_object_set_prototype_of__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_corejs2_core_js_object_get_prototype_of__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/get-prototype-of.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_object_get_prototype_of__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_object_get_prototype_of__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_corejs2_core_js_reflect_construct__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/reflect/construct.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_reflect_construct__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_reflect_construct__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_corejs2_core_js_object_create__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/create.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_object_create__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_object_create__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _babel_runtime_corejs2_core_js_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/symbol.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_symbol__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_symbol__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_core_js_symbol_iterator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/symbol/iterator.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_symbol_iterator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_symbol_iterator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/preact/compat/dist/compat.module.js");
/* harmony import */ var justorm_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./node_modules/justorm/preact.js");
/* harmony import */ var justorm_react__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(justorm_react__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _components_AssistiveText_AssistiveText__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./src/components/AssistiveText/AssistiveText.tsx");
/* provided dependency */ var h = __webpack_require__("./node_modules/preact/dist/preact.module.js")["h"];
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof (_babel_runtime_corejs2_core_js_symbol__WEBPACK_IMPORTED_MODULE_0___default()) === "function" && typeof (_babel_runtime_corejs2_core_js_symbol_iterator__WEBPACK_IMPORTED_MODULE_1___default()) === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof (_babel_runtime_corejs2_core_js_symbol__WEBPACK_IMPORTED_MODULE_0___default()) === "function" && obj.constructor === (_babel_runtime_corejs2_core_js_symbol__WEBPACK_IMPORTED_MODULE_0___default()) && obj !== (_babel_runtime_corejs2_core_js_symbol__WEBPACK_IMPORTED_MODULE_0___default().prototype) ? "symbol" : typeof obj; }; } return _typeof(obj); }









function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; _babel_runtime_corejs2_core_js_object_define_property__WEBPACK_IMPORTED_MODULE_2___default()(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = _babel_runtime_corejs2_core_js_object_create__WEBPACK_IMPORTED_MODULE_6___default()(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = (_babel_runtime_corejs2_core_js_object_set_prototype_of__WEBPACK_IMPORTED_MODULE_3___default()) || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = _babel_runtime_corejs2_core_js_reflect_construct__WEBPACK_IMPORTED_MODULE_5___default()(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !(_babel_runtime_corejs2_core_js_reflect_construct__WEBPACK_IMPORTED_MODULE_5___default())) return false; if ((_babel_runtime_corejs2_core_js_reflect_construct__WEBPACK_IMPORTED_MODULE_5___default().sham)) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(_babel_runtime_corejs2_core_js_reflect_construct__WEBPACK_IMPORTED_MODULE_5___default()(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = (_babel_runtime_corejs2_core_js_object_set_prototype_of__WEBPACK_IMPORTED_MODULE_3___default()) ? (_babel_runtime_corejs2_core_js_object_get_prototype_of__WEBPACK_IMPORTED_MODULE_4___default()) : function _getPrototypeOf(o) { return o.__proto__ || _babel_runtime_corejs2_core_js_object_get_prototype_of__WEBPACK_IMPORTED_MODULE_4___default()(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { _babel_runtime_corejs2_core_js_object_define_property__WEBPACK_IMPORTED_MODULE_2___default()(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




var State = function (_Component) {
  _inherits(State, _Component);

  var _super = _createSuper(State);

  function State(props) {
    var _this;

    _classCallCheck(this, State);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "store", void 0);

    _this.store = (0,justorm_react__WEBPACK_IMPORTED_MODULE_8__.createStore)(_assertThisInitialized(_this), props.initial);
    return _this;
  }

  _createClass(State, [{
    key: "render",
    value: function render(_ref) {
      var children = _ref.children;
      return children(this.store);
    }
  }]);

  return State;
}(react__WEBPACK_IMPORTED_MODULE_7__/* .Component */ .wA);
function Title(_ref2) {
  var text = _ref2.text;
  return h(_components_AssistiveText_AssistiveText__WEBPACK_IMPORTED_MODULE_9__/* .AssistiveText */ .T, {
    style: {
      marginBottom: 10
    }
  }, text);
}
var LOREM_IPSUM_SHORT = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.';
var LOREM_IPSUM_LONG = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
function getRandomImageUrl() {
  var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 400;
  var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 300;
  var id = Math.round(Math.random() * 500);
  return "https://picsum.photos/id/".concat(id, "/").concat(width, "/").concat(height, ".jpg");
}
function getRandomItem(arr) {
  var index = Math.round(Math.random() * (arr.length - 1));
  var item = arr[index];
  return item;
}

/***/ }),

/***/ "./node_modules/css-modules-typescript-loader/index.js!./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[3]!./node_modules/stylus-loader/dist/cjs.js!./src/components/AssistiveText/AssistiveText.styl":
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
___CSS_LOADER_EXPORT___.push([module.id, ".AssistiveText__root___cSHdG{font-size:80%;line-height:1.5em;margin-bottom:.2em}.AssistiveText__size-s___sg6UA{padding:0 10px}.AssistiveText__size-m___w72z5{padding:0 12px}.AssistiveText__size-l___dDjcL{padding:0 14px}.AssistiveText__variant-danger___sGG9z{color:var(--danger-color)}", ""]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"root": "AssistiveText__root___cSHdG",
	"size-s": "AssistiveText__size-s___sg6UA",
	"size-m": "AssistiveText__size-m___w72z5",
	"size-l": "AssistiveText__size-l___dDjcL",
	"variant-danger": "AssistiveText__variant-danger___sGG9z"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-modules-typescript-loader/index.js!./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[3]!./node_modules/stylus-loader/dist/cjs.js!./src/components/Checkbox/Checkbox.styl":
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
___CSS_LOADER_EXPORT___.push([module.id, ".Checkbox__root___yjgqm{cursor:pointer;display:inline-flex;align-items:center;box-sizing:border-box;text-decoration:none;color:inherit;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.Checkbox__controlWrapper___lEqgp{box-shadow:inset 0 0 0 2px var(--accent-color);position:relative;display:block;border-radius:var(--border-radius-m);transition:.2s ease-out;transition-property:opacity,box-shadow}.Checkbox__root___yjgqm:hover .Checkbox__controlWrapper___lEqgp{background-color:var(--active-color-alpha-100)}.Checkbox__isActive___DxpuE .Checkbox__controlWrapper___lEqgp,.Checkbox__isFocused___HkJHG .Checkbox__controlWrapper___lEqgp{box-shadow:inset 0 0 0 2px var(--active-color) !important}.Checkbox__isActive___DxpuE .Checkbox__controlWrapper___lEqgp{opacity:.7;background-color:var(--active-color-alpha-100)}.Checkbox__size-s___XyW5Z .Checkbox__controlWrapper___lEqgp{height:30px;width:30px;margin-right:var(--indent-s)}.Checkbox__size-m___AVv83 .Checkbox__controlWrapper___lEqgp{height:40px;width:40px;margin-right:var(--indent-m)}.Checkbox__size-l___YVv5L .Checkbox__controlWrapper___lEqgp{height:50px;width:50px;margin-right:var(--indent-l)}.Checkbox__control___nAhML{-webkit-appearance:none;-moz-appearance:none;appearance:none;outline:none;border-radius:var(--border-radius-m);box-sizing:border-box;box-shadow:inset 0 0 0 2px var(--accent-color);background-color:var(--bg-color);transition:.2s ease-out;transition-property:box-shadow,opacity;transition:.1s ease-out;transition-property:background-color,color;cursor:pointer;border-radius:var(--border-radius-s)}.Checkbox__control___nAhML:hover{box-shadow:inset 0 0 0 2px var(--active-color)}.Checkbox__checkmark___gqVb4{position:absolute;left:0;top:6px;height:100%;width:100%;opacity:0;transform:scale(.8) rotateZ(-45deg);transform-origin:center;transition:.1s ease-in;transition-property:transform,opacity;pointer-events:none}.Checkbox__checkmark___gqVb4::before,.Checkbox__checkmark___gqVb4::after{content:'';position:absolute;width:3px;background-color:var(--accent-color);border-radius:var(--border-radius-s)}.Checkbox__checkmark___gqVb4::before{z-index:1;left:calc(50% - 2px);height:16px;transform:rotateZ(9deg)}.Checkbox__checkmark___gqVb4::after{top:3px;left:21px;height:20px;transform:rotateZ(-103deg)}.Checkbox__isChecked___VknOz .Checkbox__checkmark___gqVb4{opacity:1}", ""]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"root": "Checkbox__root___yjgqm",
	"controlWrapper": "Checkbox__controlWrapper___lEqgp",
	"isActive": "Checkbox__isActive___DxpuE",
	"isFocused": "Checkbox__isFocused___HkJHG",
	"size-s": "Checkbox__size-s___XyW5Z",
	"size-m": "Checkbox__size-m___AVv83",
	"size-l": "Checkbox__size-l___YVv5L",
	"control": "Checkbox__control___nAhML",
	"checkmark": "Checkbox__checkmark___gqVb4",
	"isChecked": "Checkbox__isChecked___VknOz"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/nanoid/index.prod.js":
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "x0": () => (/* binding */ nanoid)
/* harmony export */ });
/* unused harmony exports customAlphabet, customRandom, random */

if (false) {}
let random = bytes => crypto.getRandomValues(new Uint8Array(bytes))
let customRandom = (alphabet, size, getRandom) => {
  let mask = (2 << (Math.log(alphabet.length - 1) / Math.LN2)) - 1
  let step = -~((1.6 * mask * size) / alphabet.length)
  return () => {
    let id = ''
    while (true) {
      let bytes = getRandom(step)
      let j = step
      while (j--) {
        id += alphabet[bytes[j] & mask] || ''
        if (id.length === size) return id
      }
    }
  }
}
let customAlphabet = (alphabet, size) => customRandom(alphabet, size, random)
let nanoid = (size = 21) => {
  let id = ''
  let bytes = crypto.getRandomValues(new Uint8Array(size))
  while (size--) {
    let byte = bytes[size] & 63
    if (byte < 36) {
      id += byte.toString(36)
    } else if (byte < 62) {
      id += (byte - 26).toString(36).toUpperCase()
    } else if (byte < 63) {
      id += '_'
    } else {
      id += '-'
    }
  }
  return id
}



/***/ })

}]);