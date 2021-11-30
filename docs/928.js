"use strict";
(self["webpackChunk_truerenton_uilib"] = self["webpackChunk_truerenton_uilib"] || []).push([[928],{

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

/***/ "./src/components/Icon/Icon.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "J": () => (/* binding */ Icon_Icon_Icon)
});

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/keys.js
var object_keys = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/keys.js");
var keys_default = /*#__PURE__*/__webpack_require__.n(object_keys);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/get-own-property-symbols.js
var get_own_property_symbols = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/get-own-property-symbols.js");
var get_own_property_symbols_default = /*#__PURE__*/__webpack_require__.n(get_own_property_symbols);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/define-property.js
var define_property = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/define-property.js");
var define_property_default = /*#__PURE__*/__webpack_require__.n(define_property);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/get-own-property-descriptor.js
var get_own_property_descriptor = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/get-own-property-descriptor.js");
var get_own_property_descriptor_default = /*#__PURE__*/__webpack_require__.n(get_own_property_descriptor);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/get-own-property-descriptors.js
var get_own_property_descriptors = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/get-own-property-descriptors.js");
var get_own_property_descriptors_default = /*#__PURE__*/__webpack_require__.n(get_own_property_descriptors);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/define-properties.js
var define_properties = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/define-properties.js");
var define_properties_default = /*#__PURE__*/__webpack_require__.n(define_properties);
// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__("./node_modules/classnames/index.js");
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
// EXTERNAL MODULE: ./src/components/Icon/icons/index.ts + 3 modules
var icons = __webpack_require__("./src/components/Icon/icons/index.ts");
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
// EXTERNAL MODULE: ./node_modules/css-modules-typescript-loader/index.js!./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[3]!./node_modules/stylus-loader/dist/cjs.js!./src/components/Icon/Icon.styl
var Icon = __webpack_require__("./node_modules/css-modules-typescript-loader/index.js!./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[3]!./node_modules/stylus-loader/dist/cjs.js!./src/components/Icon/Icon.styl");
;// CONCATENATED MODULE: ./src/components/Icon/Icon.styl

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(Icon/* default */.Z, options);




       /* harmony default export */ const Icon_Icon = (Icon/* default */.Z && Icon/* default.locals */.Z.locals ? Icon/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/components/Icon/Icon.tsx
/* provided dependency */ var h = __webpack_require__("./node_modules/preact/dist/preact.module.js")["h"];






var _excluded = ["className", "type", "size"];

function ownKeys(object, enumerableOnly) { var keys = keys_default()(object); if ((get_own_property_symbols_default())) { var symbols = get_own_property_symbols_default()(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return get_own_property_descriptor_default()(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if ((get_own_property_descriptors_default())) { define_properties_default()(target, get_own_property_descriptors_default()(source)); } else { ownKeys(Object(source)).forEach(function (key) { define_property_default()(target, key, get_own_property_descriptor_default()(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { define_property_default()(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if ((get_own_property_symbols_default())) { var sourceSymbolKeys = get_own_property_symbols_default()(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = keys_default()(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }




function Icon_Icon_Icon(props) {
  var className = props.className,
      type = props.type,
      size = props.size,
      rest = _objectWithoutProperties(props, _excluded);

  var iconProps = _objectSpread({
    className: classnames_default()(Icon_Icon.root, Icon_Icon["size-".concat(size)], className),
    role: 'img'
  }, rest);

  var LocalIcon = icons/* default */.Z[type];
  return h(LocalIcon, iconProps);
}
Icon_Icon_Icon.defaultProps = {
  size: 's'
};

/***/ }),

/***/ "./src/components/Icon/icons/index.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ icons)
});

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/assign.js
var object_assign = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/assign.js");
var assign_default = /*#__PURE__*/__webpack_require__.n(object_assign);
// EXTERNAL MODULE: ./node_modules/preact/dist/preact.module.js
var preact_module = __webpack_require__("./node_modules/preact/dist/preact.module.js");
;// CONCATENATED MODULE: ./src/components/Icon/icons/close.svg


/* harmony default export */ function icons_close(props) {
  var styles = props.styles;

  var rest = assign_default()({}, props);

  delete rest.styles;
  return (0,preact_module.h)('svg', assign_default()({
    "viewBox": "0 0 24 24",
    "xmlns": "http://www.w3.org/2000/svg",
    "fill": "currentColor"
  }, rest), [(0,preact_module.h)('path', {
    "d": "M18.6 6.1l-.7-.7c-.2-.2-.5-.2-.7 0l-4.5 4.5c-.4.4-1 .4-1.4 0L6.8 5.4c-.2-.2-.5-.2-.7 0l-.7.7c-.2.2-.2.5 0 .7l4.5 4.5c.4.4.4 1 0 1.4l-4.5 4.5c-.2.2-.2.5 0 .7l.7.7c.2.2.5.2.7 0l4.5-4.5c.4-.4 1-.4 1.4 0l4.5 4.5c.2.2.5.2.7 0l.7-.7c.2-.2.2-.5 0-.7l-4.5-4.5c-.4-.4-.4-1 0-1.4l4.5-4.5c.2-.2.2-.5 0-.7z"
  }, [])]);
}
;
;// CONCATENATED MODULE: ./src/components/Icon/icons/arrow-left.svg


/* harmony default export */ function arrow_left(props) {
  var styles = props.styles;

  var rest = assign_default()({}, props);

  delete rest.styles;
  return (0,preact_module.h)('svg', assign_default()({
    "enable-background": "new 0 0 24 24",
    "viewBox": "0 0 24 24",
    "xmlns": "http://www.w3.org/2000/svg",
    "fill": "currentColor"
  }, rest), [(0,preact_module.h)('path', {
    "d": "m10.9 16.1 3.8-3.8c.2-.2.2-.5 0-.7l-3.8-3.8c-.4-.3-.9 0-.9.4v7.6c0 .4.5.7.9.3z"
  }, []), (0,preact_module.h)('path', {
    "d": "m0 24v-24h24v24z",
    "fill": "none"
  }, [])]);
}
;
;// CONCATENATED MODULE: ./src/components/Icon/icons/arrow-right.svg


/* harmony default export */ function arrow_right(props) {
  var styles = props.styles;

  var rest = assign_default()({}, props);

  delete rest.styles;
  return (0,preact_module.h)('svg', assign_default()({
    "enable-background": "new 0 0 24 24",
    "viewBox": "0 0 24 24",
    "xmlns": "http://www.w3.org/2000/svg",
    "fill": "currentColor"
  }, rest), [(0,preact_module.h)('path', {
    "d": "m14 15.8v-7.6c0-.4-.5-.7-.9-.4l-3.8 3.8c-.2.2-.2.5 0 .7l3.8 3.8c.4.4.9.1.9-.3z"
  }, []), (0,preact_module.h)('path', {
    "d": "m0 24v-24h24v24z",
    "fill": "none"
  }, [])]);
}
;
;// CONCATENATED MODULE: ./src/components/Icon/icons/index.ts



/* harmony default export */ const icons = ({
  close: icons_close,
  'arrow-left': arrow_left,
  'arrow-right': arrow_right
});

/***/ }),

/***/ "./src/components/Popup/Popup.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "G": () => (/* binding */ Popup_Popup_Popup)
});

// UNUSED EXPORTS: ANIMATION_DURATION

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/assign.js
var object_assign = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/assign.js");
var assign_default = /*#__PURE__*/__webpack_require__.n(object_assign);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/promise.js
var promise = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/promise.js");
var promise_default = /*#__PURE__*/__webpack_require__.n(promise);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/define-property.js
var define_property = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/define-property.js");
var define_property_default = /*#__PURE__*/__webpack_require__.n(define_property);
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
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/array/is-array.js
var is_array = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/array/is-array.js");
var is_array_default = /*#__PURE__*/__webpack_require__.n(is_array);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/symbol.js
var symbol = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/symbol.js");
var symbol_default = /*#__PURE__*/__webpack_require__.n(symbol);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/symbol/iterator.js
var iterator = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/symbol/iterator.js");
var iterator_default = /*#__PURE__*/__webpack_require__.n(iterator);
// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/array/from.js
var from = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/array/from.js");
var from_default = /*#__PURE__*/__webpack_require__.n(from);
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
// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__("./node_modules/classnames/index.js");
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
// EXTERNAL MODULE: ./node_modules/timen/index.js
var timen = __webpack_require__("./node_modules/timen/index.js");
var timen_default = /*#__PURE__*/__webpack_require__.n(timen);
// EXTERNAL MODULE: ./node_modules/justorm/preact.js
var preact = __webpack_require__("./node_modules/justorm/preact.js");
;// CONCATENATED MODULE: ./src/tools/throttle.ts
function throttle(func, wait) {
  var throttling = false;
  var result;
  return function () {
    var args = Array.prototype.slice.call(arguments);

    if (!throttling) {
      throttling = true;
      result = func.apply(this, arguments);
      setTimeout(function () {
        throttling = false;
      }, wait);
    }

    return result;
  };
}
// EXTERNAL MODULE: ./src/tools/dom.ts
var dom = __webpack_require__("./src/tools/dom.ts");
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
// EXTERNAL MODULE: ./node_modules/css-modules-typescript-loader/index.js!./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[3]!./node_modules/stylus-loader/dist/cjs.js!./src/components/Popup/Popup.styl
var Popup = __webpack_require__("./node_modules/css-modules-typescript-loader/index.js!./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[3]!./node_modules/stylus-loader/dist/cjs.js!./src/components/Popup/Popup.styl");
;// CONCATENATED MODULE: ./src/components/Popup/Popup.styl

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(Popup/* default */.Z, options);




       /* harmony default export */ const Popup_Popup = (Popup/* default */.Z && Popup/* default.locals */.Z.locals ? Popup/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/components/Popup/Popup.tsx
/* provided dependency */ var h = __webpack_require__("./node_modules/preact/dist/preact.module.js")["h"];
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof (symbol_default()) === "function" && typeof (iterator_default()) === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof (symbol_default()) === "function" && obj.constructor === (symbol_default()) && obj !== (symbol_default()).prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = keys_default()(object); if ((get_own_property_symbols_default())) { var symbols = get_own_property_symbols_default()(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return get_own_property_descriptor_default()(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if ((get_own_property_descriptors_default())) { define_properties_default()(target, get_own_property_descriptors_default()(source)); } else { ownKeys(Object(source)).forEach(function (key) { define_property_default()(target, key, get_own_property_descriptor_default()(source, key)); }); } } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return from_default()(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof (symbol_default()) !== "undefined" && arr[(iterator_default())] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (is_array_default()(arr)) return arr; }

function _extends() { _extends = (assign_default()) || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }


















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










var ANIMATION_DURATION = 100;

function getIframeDoc() {
  var _document$querySelect;

  return (_document$querySelect = document.querySelector('iframe')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.contentDocument;
}

var Popup_Popup_Popup = function (_Component) {
  _inherits(Popup, _Component);

  var _super = _createSuper(Popup);

  function Popup(props) {
    var _this;

    _classCallCheck(this, Popup);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "rootElem", (0,compat_module/* createRef */.Vf)());

    _defineProperty(_assertThisInitialized(_this), "triggerElem", (0,compat_module/* createRef */.Vf)());

    _defineProperty(_assertThisInitialized(_this), "containerElem", (0,compat_module/* createRef */.Vf)());

    _defineProperty(_assertThisInitialized(_this), "scrollParent", void 0);

    _defineProperty(_assertThisInitialized(_this), "_focused", false);

    _defineProperty(_assertThisInitialized(_this), "_mousePressed", false);

    _defineProperty(_assertThisInitialized(_this), "store", void 0);

    _defineProperty(_assertThisInitialized(_this), "timers", timen_default().create());

    _defineProperty(_assertThisInitialized(_this), "subscribeDoc", function (doc) {
      if (!doc) return;
      doc.addEventListener('mousedown', _this.onMouseDown);
      doc.addEventListener('mouseup', _this.onMouseUp, true);
    });

    _defineProperty(_assertThisInitialized(_this), "unsubscribeDoc", function (doc) {
      if (!doc) return;
      doc.removeEventListener('mousedown', _this.onMouseDown);
      doc.removeEventListener('mouseup', _this.onMouseUp);
    });

    _defineProperty(_assertThisInitialized(_this), "onDocKeyUp", function (e) {
      if (_this.store.isOpen && e.key === 'Escape') {
        e.stopPropagation();

        _this.close();

        return;
      }

      if (!_this._focused) return;

      if (/Enter| /.test(e.key)) {
        e.stopPropagation();

        _this.toggle();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseDown", function () {
      _this._mousePressed = true;
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseUp", function (e) {
      var autoClose = _this.props.autoClose;
      var isOpen = _this.store.isOpen;
      _this._mousePressed = false;

      if (_this._focused) {
        _this.open();

        return;
      }

      if (!isOpen || (0,dom/* hasParent */.IY)(e.target, _this.triggerElem.current)) return;
      if (!e.target.closest(".".concat(Popup_Popup.content)) || autoClose) _this.close();
    });

    _defineProperty(_assertThisInitialized(_this), "onFocus", function () {
      var _this$props = _this.props,
          controllable = _this$props.controllable,
          onFocus = _this$props.onFocus;
      _this._focused = true;
      if (!controllable && !_this._mousePressed) _this.open();
      if (onFocus) onFocus();
    });

    _defineProperty(_assertThisInitialized(_this), "onBlur", function () {
      var _this$props2 = _this.props,
          controllable = _this$props2.controllable,
          onBlur = _this$props2.onBlur;
      _this._focused = false;
      if (onBlur) onBlur();

      if (!controllable && !_this._mousePressed) {
        _this.timers.after(80, _this.close);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "open", function () {
      var onOpen = _this.props.onOpen;
      if (_this.store.isOpen) return;

      _this.timers.clear(_this.afterClose);

      assign_default()(_this.store, {
        isOpen: true,
        isContentVisible: true
      });

      if (onOpen) timen_default().nextTick(onOpen);
    });

    _defineProperty(_assertThisInitialized(_this), "close", function () {
      if (!_this.store.isOpen) return;
      _this.store.isOpen = false;

      _this.timers.after(ANIMATION_DURATION, _this.afterClose);
    });

    _defineProperty(_assertThisInitialized(_this), "toggle", function () {
      _this.store.isOpen ? _this.close() : _this.open();
    });

    var _isOpen = Boolean(props.isOpen);

    _this.store = (0,preact.createStore)(_assertThisInitialized(_this), {
      isOpen: _isOpen,
      isContentVisible: _isOpen
    });
    _this.afterClose = _this.afterClose.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Popup, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var controllable = this.props.controllable;

      if (this.rootElem) {
        this.scrollParent = (0,tools_scroll/* getScrollParent */.rP)(this.rootElem.current);
        this.scrollParent.addEventListener('scroll', this.close);
      }

      if (!controllable) {
        this.subscribeDoc(document);
        this.awaitIframe().then(this.subscribeDoc);
        document.addEventListener('keyup', this.onDocKeyUp, true);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props3 = this.props,
          isOpen = _this$props3.isOpen,
          disabled = _this$props3.disabled;

      if (disabled) {
        this.store.isOpen = false;
        return;
      }

      if (typeof isOpen === 'boolean' && isOpen !== prevProps.isOpen) {
        isOpen ? this.open() : this.close();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.timers.clear();
      this.unsubscribeDoc(document);
      this.unsubscribeDoc(getIframeDoc());
      document.removeEventListener('keyup', this.onDocKeyUp, true);

      if (this.scrollParent) {
        this.scrollParent.removeEventListener('scroll', this.close);
      }
    }
  }, {
    key: "awaitIframe",
    value: function awaitIframe() {
      var _this2 = this;

      var getIframe = function getIframe(resolve) {
        var iframeDoc = getIframeDoc();

        if (iframeDoc) {
          resolve(iframeDoc);
        } else {
          _this2.timers.after(300, function () {
            return getIframe(resolve);
          });
        }
      };

      return new (promise_default())(getIframe);
    }
  }, {
    key: "afterClose",
    value: function afterClose() {
      var onClose = this.props.onClose;
      this.store.isContentVisible = false;
      if (onClose) timen_default().nextTick(onClose);
    }
  }, {
    key: "renderTrigger",
    value: function renderTrigger() {
      var _this$props4 = this.props,
          trigger = _this$props4.trigger,
          content = _this$props4.content,
          disabled = _this$props4.disabled,
          controllable = _this$props4.controllable,
          hoverControl = _this$props4.hoverControl;
      var isOpen = this.store.isOpen;
      var disableTrigger = disabled || !content;
      var classesTrigger = classnames_default()(Popup_Popup.trigger, isOpen && Popup_Popup.isOpen, disableTrigger && Popup_Popup.disabled);
      var triggerProps = {};
      if (!trigger) return null;

      if (!disableTrigger) {
        triggerProps.role = 'button';

        if (!controllable) {
          assign_default()(triggerProps, {
            onFocusCapture: this.onFocus,
            onBlurCapture: this.onBlur
          });
        }

        if (hoverControl) {
          assign_default()(triggerProps, {
            onMouseOver: throttle(this.open, 100),
            onMouseLeave: throttle(this.close, 100)
          });
        }
      }

      return h("div", _extends({
        className: classesTrigger
      }, triggerProps, {
        ref: this.triggerElem
      }), trigger);
    }
  }, {
    key: "renderContent",
    value: function renderContent() {
      var _this$props5 = this.props,
          content = _this$props5.content,
          _this$props5$contentP = _this$props5.contentProps,
          contentProps = _this$props5$contentP === void 0 ? {} : _this$props5$contentP,
          _this$props5$wrapperP = _this$props5.wrapperProps,
          wrapperProps = _this$props5$wrapperP === void 0 ? {} : _this$props5$wrapperP,
          size = _this$props5.size,
          disabled = _this$props5.disabled,
          inline = _this$props5.inline,
          outlined = _this$props5.outlined,
          paranja = _this$props5.paranja,
          elevation = _this$props5.elevation,
          clearTargetMargin = _this$props5.clearTargetMargin,
          direction = _this$props5.direction;
      var _this$store = this.store,
          isOpen = _this$store.isOpen,
          isContentVisible = _this$store.isContentVisible;
      var trigger = this.triggerElem.current;
      var target = document.getElementById('app-modal');
      if (!target) return null;
      var wrapperClasses = classnames_default()(Popup_Popup.contentWrapper, inline && Popup_Popup.inline, isOpen && Popup_Popup.isOpen, wrapperProps.className);

      var _direction$split = direction.split('-'),
          _direction$split2 = _slicedToArray(_direction$split, 2),
          axis = _direction$split2[0],
          _float = _direction$split2[1];

      var classes = classnames_default()(Popup_Popup.content, !disabled && isOpen && Popup_Popup.isOpen, !clearTargetMargin && Popup_Popup.hasMargin, outlined && Popup_Popup.outlined, elevation && Popup_Popup["elevation-".concat(elevation)], Popup_Popup["size-".concat(size)], Popup_Popup["axis-".concat(axis)], Popup_Popup["float-".concat(_float || 'middle')], contentProps.className);

      if (trigger && !inline) {
        var offsetHeight = trigger.offsetHeight,
            offsetWidth = trigger.offsetWidth;
        wrapperProps.style = _objectSpread({
          minHeight: offsetHeight,
          minWidth: offsetWidth
        }, (0,dom/* getCoords */.r7)(trigger));
      }

      var contentNode = h("div", _extends({}, wrapperProps, {
        className: wrapperClasses
      }), paranja && (0,compat_module/* createPortal */.jz)(h("div", {
        className: classnames_default()(Popup_Popup.paranja, isOpen && Popup_Popup.isOpen)
      }), target), h("div", _extends({}, contentProps, {
        ref: this.containerElem,
        className: classes
      }), isContentVisible && content));
      if (inline) return contentNode;
      return (0,compat_module/* createPortal */.jz)(contentNode, target);
    }
  }, {
    key: "render",
    value: function render() {
      var className = this.props.className;
      var classes = classnames_default()(Popup_Popup.root, className);
      return h("div", {
        className: classes,
        ref: this.rootElem
      }, this.renderTrigger(), this.renderContent());
    }
  }]);

  return Popup;
}(compat_module/* Component */.wA);

_defineProperty(Popup_Popup_Popup, "defaultProps", {
  size: 'm'
});

/***/ }),

/***/ "./src/helpers.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ZM": () => (/* binding */ State),
/* harmony export */   "Dx": () => (/* binding */ Title)
/* harmony export */ });
/* unused harmony exports LOREM_IPSUM_SHORT, LOREM_IPSUM_LONG, getRandomImageUrl, getRandomItem */
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

/***/ "./src/tools/scroll.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "rP": () => (/* binding */ getScrollParent),
/* harmony export */   "zT": () => (/* binding */ scrollIntoView)
/* harmony export */ });
/* unused harmony export scrollTo */
var METRICS_BY_AXIS = {
  horizontal: {
    size: 'offsetWidth',
    scroll: 'scrollWidth'
  },
  vertical: {
    size: 'offsetHeight',
    scroll: 'scrollHeight'
  }
};

function isScrollable(node, axis) {
  var threshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;
  var m = METRICS_BY_AXIS[axis];
  return node[m.scroll] - node[m.size] > threshold;
}

function getScrollParent(node) {
  var axis = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'vertical';
  if (node == null) return null;
  if (node.tagName === 'BODY' || isScrollable(node, axis)) return node;
  return getScrollParent(node.parentNode, axis);
}
function scrollTo(elem, left, top) {
  if ('scrollBehavior' in document.documentElement.style) {
    elem.scrollTo({
      left: left,
      top: top,
      behavior: 'smooth'
    });
    return;
  }

  elem.scrollTo(left, top);
}
function scrollIntoView(elem) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    horizontal: false
  },
      horizontal = _ref.horizontal;

  if (!elem) return;
  var scrollParent = getScrollParent(elem);
  if (!scrollParent) return;
  var to = horizontal ? elem.offsetLeft + elem.offsetWidth / 2 - scrollParent.clientWidth / 2 : elem.offsetTop + elem.offsetHeight / 2 - scrollParent.clientHeight / 2;
  scrollTo(scrollParent, 0, Math.max(0, to));
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

/***/ "./node_modules/css-modules-typescript-loader/index.js!./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[3]!./node_modules/stylus-loader/dist/cjs.js!./src/components/Icon/Icon.styl":
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
___CSS_LOADER_EXPORT___.push([module.id, ".Icon__root___EfPby{display:inline-block;color:inherit;pointer-events:none}.Icon__size-s___NbvpA{width:12px;height:12px}.Icon__size-m___oveK6{width:16px;height:16px}.Icon__size-l___zVfxa{width:20px;height:20px}.Icon__size-xl___zmDoJ{width:26px;height:26px}", ""]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"root": "Icon__root___EfPby",
	"size-s": "Icon__size-s___NbvpA",
	"size-m": "Icon__size-m___oveK6",
	"size-l": "Icon__size-l___zVfxa",
	"size-xl": "Icon__size-xl___zmDoJ"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-modules-typescript-loader/index.js!./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[3]!./node_modules/stylus-loader/dist/cjs.js!./src/components/Popup/Popup.styl":
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
___CSS_LOADER_EXPORT___.push([module.id, ".Popup__root___FoFZI{position:relative;display:inline-block}.Popup__contentWrapper___MrnC3{pointer-events:none;position:absolute}.Popup__contentWrapper___MrnC3.Popup__inline___oIXOm.Popup__isOpen___zigfu{position:relative}.Popup__contentWrapper___MrnC3:not(.Popup__inline___oIXOm),.Popup__contentWrapper___MrnC3:not(.Popup__inline___oIXOm) > .Popup__content___CoZGx{position:absolute}.Popup__paranja___l_pDK{z-index:10;position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;transition:background-color .2s ease-out}.Popup__paranja___l_pDK.Popup__isOpen___zigfu{background-color:var(--accent-color-alpha-800);pointer-events:all}.Popup__trigger___fqdBs{cursor:pointer}.Popup__trigger___fqdBs.Popup__isOpen___zigfu{position:relative;z-index:11}.Popup__trigger___fqdBs.Popup__disabled___TcnPU{pointer-events:none}.Popup__content___CoZGx{position:relative;z-index:11;min-width:100%;background-color:var(--accent-color);opacity:0;transform-origin:top center;transform:scale3d(.5,.5,.5);transition:.1s ease-out;transition-property:opacity,transform;-webkit-backface-visibility:hidden;backface-visibility:hidden;overflow:hidden;pointer-events:none;color:var(--decent-color)}.Popup__content___CoZGx.Popup__size-s___QE_Lt{border-radius:4px}.Popup__content___CoZGx.Popup__size-m___mX8Ta{border-radius:6px}.Popup__content___CoZGx.Popup__size-l___T97ma{border-radius:8px}.Popup__content___CoZGx.Popup__outlined___vTSIY::after{content:'';position:absolute;top:0;left:0;right:0;bottom:0;border-radius:inherit;pointer-events:none;box-shadow:inset 0 0 0 1px var(--bg-color)}.Popup__content___CoZGx.Popup__isOpen___zigfu{pointer-events:all;transform:scale3d(1,1,1);opacity:1}.Popup__axis-top___IGtkf{bottom:100%}.Popup__axis-top___IGtkf.Popup__hasMargin___KaqRU{margin-bottom:4px}.Popup__axis-bottom___MMaLk{top:100%}.Popup__axis-bottom___MMaLk.Popup__hasMargin___KaqRU{margin-top:4px}.Popup__axis-right___Fyl_R{left:100%}.Popup__axis-right___Fyl_R.Popup__hasMargin___KaqRU{margin-left:4px}.Popup__axis-left___HlOR3{right:100%}.Popup__axis-left___HlOR3.Popup__hasMargin___KaqRU{margin-right:4px}.Popup__float-top___opQjK{bottom:0}.Popup__float-right___kFfry{left:0}.Popup__float-bottom___BO0pr{top:0}.Popup__float-left___f2gsi{right:0}.Popup__axis-top___IGtkf.Popup__float-middle___p2JBs,.Popup__axis-bottom___MMaLk.Popup__float-middle___p2JBs{left:50%;transform:scale3d(.5,.5,.5) translateX(-50%)}.Popup__axis-top___IGtkf.Popup__float-middle___p2JBs.Popup__isOpen___zigfu,.Popup__axis-bottom___MMaLk.Popup__float-middle___p2JBs.Popup__isOpen___zigfu{transform:scale3d(1,1,1) translateX(-50%)}.Popup__axis-left___HlOR3.Popup__float-middle___p2JBs,.Popup__axis-right___Fyl_R.Popup__float-middle___p2JBs{top:50%;transform:scale3d(.5,.5,.5) translateY(-50%)}.Popup__axis-left___HlOR3.Popup__float-middle___p2JBs.Popup__isOpen___zigfu,.Popup__axis-right___Fyl_R.Popup__float-middle___p2JBs.Popup__isOpen___zigfu{transform:scale3d(1,1,1) translateY(-50%)}.Popup__axis-top___IGtkf.Popup__float-middle___p2JBs,.Popup__axis-top___IGtkf.Popup__float-right___kFfry{transform-origin:bottom left}.Popup__axis-top___IGtkf.Popup__float-left___f2gsi{transform-origin:bottom right}.Popup__axis-bottom___MMaLk.Popup__float-middle___p2JBs,.Popup__axis-bottom___MMaLk.Popup__float-right___kFfry{transform-origin:top left}.Popup__axis-bottom___MMaLk.Popup__float-left___f2gsi{transform-origin:top right}.Popup__axis-right___Fyl_R.Popup__float-middle___p2JBs{transform-origin:top left}.Popup__axis-right___Fyl_R.Popup__float-top___opQjK{transform-origin:bottom left}.Popup__axis-right___Fyl_R.Popup__float-bottom___BO0pr{transform-origin:top left}.Popup__axis-left___HlOR3.Popup__float-middle___p2JBs{transform-origin:top right}.Popup__axis-left___HlOR3.Popup__float-top___opQjK{transform-origin:bottom right}.Popup__axis-left___HlOR3.Popup__float-bottom___BO0pr{transform-origin:top right}", ""]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"root": "Popup__root___FoFZI",
	"contentWrapper": "Popup__contentWrapper___MrnC3",
	"inline": "Popup__inline___oIXOm",
	"isOpen": "Popup__isOpen___zigfu",
	"content": "Popup__content___CoZGx",
	"paranja": "Popup__paranja___l_pDK",
	"trigger": "Popup__trigger___fqdBs",
	"disabled": "Popup__disabled___TcnPU",
	"size-s": "Popup__size-s___QE_Lt",
	"size-m": "Popup__size-m___mX8Ta",
	"size-l": "Popup__size-l___T97ma",
	"outlined": "Popup__outlined___vTSIY",
	"axis-top": "Popup__axis-top___IGtkf",
	"hasMargin": "Popup__hasMargin___KaqRU",
	"axis-bottom": "Popup__axis-bottom___MMaLk",
	"axis-right": "Popup__axis-right___Fyl_R",
	"axis-left": "Popup__axis-left___HlOR3",
	"float-top": "Popup__float-top___opQjK",
	"float-right": "Popup__float-right___kFfry",
	"float-bottom": "Popup__float-bottom___BO0pr",
	"float-left": "Popup__float-left___f2gsi",
	"float-middle": "Popup__float-middle___p2JBs"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ })

}]);