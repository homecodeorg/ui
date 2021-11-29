"use strict";
(self["webpackChunk_truerenton_uilib"] = self["webpackChunk_truerenton_uilib"] || []).push([[845],{

/***/ "./src/components/Input/Input.example.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_corejs2_core_js_object_define_property__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/define-property.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_object_define_property__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_object_define_property__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_core_js_object_keys__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/keys.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_object_keys__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_object_keys__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_corejs2_core_js_object_get_own_property_symbols__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/get-own-property-symbols.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_object_get_own_property_symbols__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_object_get_own_property_symbols__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_corejs2_core_js_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/get-own-property-descriptor.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_corejs2_core_js_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/get-own-property-descriptors.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_corejs2_core_js_object_define_properties__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/define-properties.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_object_define_properties__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_object_define_properties__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_corejs2_core_js_object_assign__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@babel/runtime-corejs2/core-js/object/assign.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_object_assign__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_object_assign__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var lodash_omit__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/lodash.omit/index.js");
/* harmony import */ var lodash_omit__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(lodash_omit__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var helpers__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("./src/helpers.tsx");
/* harmony import */ var components_Container_Container__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./src/components/Container/Container.tsx");
/* harmony import */ var components_Checkbox_Checkbox__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("./src/components/Checkbox/Checkbox.tsx");
/* harmony import */ var components_Select_Select__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("./src/components/Select/Select.tsx");
/* harmony import */ var components_Form_Form__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./src/components/Form/Form.tsx");
/* harmony import */ var components_Icon_Icon__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./src/components/Icon/Icon.tsx");
/* harmony import */ var _Input__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("./src/components/Input/Input.tsx");
/* provided dependency */ var h = __webpack_require__("./node_modules/preact/dist/preact.module.js")["h"];








function _extends() { _extends = (_babel_runtime_corejs2_core_js_object_assign__WEBPACK_IMPORTED_MODULE_6___default()) || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = _babel_runtime_corejs2_core_js_object_keys__WEBPACK_IMPORTED_MODULE_1___default()(object); if ((_babel_runtime_corejs2_core_js_object_get_own_property_symbols__WEBPACK_IMPORTED_MODULE_2___default())) { var symbols = _babel_runtime_corejs2_core_js_object_get_own_property_symbols__WEBPACK_IMPORTED_MODULE_2___default()(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return _babel_runtime_corejs2_core_js_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_3___default()(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if ((_babel_runtime_corejs2_core_js_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_4___default())) { _babel_runtime_corejs2_core_js_object_define_properties__WEBPACK_IMPORTED_MODULE_5___default()(target, _babel_runtime_corejs2_core_js_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_4___default()(source)); } else { ownKeys(Object(source)).forEach(function (key) { _babel_runtime_corejs2_core_js_object_define_property__WEBPACK_IMPORTED_MODULE_0___default()(target, key, _babel_runtime_corejs2_core_js_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_3___default()(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { _babel_runtime_corejs2_core_js_object_define_property__WEBPACK_IMPORTED_MODULE_0___default()(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }









var INITIAL_PROPS = {
  size: 'm',
  label: 'Label',
  placeholder: '',
  error: '',
  required: true,
  disabled: false,
  adornmentLeft: null,
  adornmentRight: null
};
var SIZE_OPTIONS = [{
  id: 's',
  label: 'S'
}, {
  id: 'm',
  label: 'M'
}, {
  id: 'l',
  label: 'L'
}];
var ADORNMENT_OPTIONS = [{
  id: 'icon',
  label: 'Icon'
}, {
  id: 'text',
  label: 'Text'
}];

function getAdorment(type, size) {
  if (type === 'text') return 'texttexttexttexttexttexttexttexttexttexttexttexttexttexttexttextte';
  if (type === 'icon') return h(components_Icon_Icon__WEBPACK_IMPORTED_MODULE_8__/* .Icon */ .J, {
    type: "close",
    size: size
  });
  return null;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (function () {
  return h(components_Form_Form__WEBPACK_IMPORTED_MODULE_9__/* .Form */ .l0, {
    initialValues: INITIAL_PROPS
  }, function (_ref) {
    var Field = _ref.Field,
        values = _ref.values;
    var size = values.size,
        adornmentLeft = values.adornmentLeft,
        adornmentRight = values.adornmentRight;

    var props = _objectSpread(_objectSpread({}, lodash_omit__WEBPACK_IMPORTED_MODULE_7___default()(values, ['adornmentLeft', 'adornmentRight'])), {}, {
      adornmentLeft: getAdorment(adornmentLeft, size),
      adornmentRight: getAdorment(adornmentRight, size)
    });

    return h(components_Container_Container__WEBPACK_IMPORTED_MODULE_10__/* .Container */ .W, {
      style: {
        maxWidth: 600
      },
      size: "l"
    }, h(components_Container_Container__WEBPACK_IMPORTED_MODULE_10__/* .Container */ .W, {
      style: {
        width: '50%'
      },
      vertical: true,
      size: "s"
    }, h(helpers__WEBPACK_IMPORTED_MODULE_11__/* .Title */ .Dx, {
      text: "Props:"
    }), h(Field, {
      name: "size",
      label: "Size",
      component: components_Select_Select__WEBPACK_IMPORTED_MODULE_12__/* .Select */ .P,
      options: SIZE_OPTIONS
    }), h(Field, {
      name: "label",
      label: "Label"
    }), h(Field, {
      name: "placeholder",
      label: "Placeholder"
    }), h(Field, {
      name: "adornmentLeft",
      label: "Adornment Left",
      component: components_Select_Select__WEBPACK_IMPORTED_MODULE_12__/* .Select */ .P,
      options: ADORNMENT_OPTIONS
    }), h(Field, {
      name: "adornmentRight",
      label: "Adornment Right",
      component: components_Select_Select__WEBPACK_IMPORTED_MODULE_12__/* .Select */ .P,
      options: ADORNMENT_OPTIONS
    }), h(Field, {
      name: "error",
      label: "Error message"
    }), h(Field, {
      name: "disabled",
      label: "Disabled",
      component: components_Checkbox_Checkbox__WEBPACK_IMPORTED_MODULE_13__/* .Checkbox */ .X
    }), h(Field, {
      name: "required",
      label: "Required",
      component: components_Checkbox_Checkbox__WEBPACK_IMPORTED_MODULE_13__/* .Checkbox */ .X
    })), h(components_Container_Container__WEBPACK_IMPORTED_MODULE_10__/* .Container */ .W, {
      style: {
        width: '50%'
      },
      vertical: true,
      size: "s"
    }, h(helpers__WEBPACK_IMPORTED_MODULE_11__/* .Title */ .Dx, {
      text: "Result:"
    }), h(_Input__WEBPACK_IMPORTED_MODULE_14__/* .Input */ .I, _extends({}, props, {
      defaultValue: "Alise"
    }))));
  });
});

/***/ })

}]);