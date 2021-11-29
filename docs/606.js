"use strict";
(self["webpackChunk_truerenton_uilib"] = self["webpackChunk_truerenton_uilib"] || []).push([[606],{

/***/ "./src/components/Button/Button.example.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/helpers.tsx");
/* harmony import */ var components_Form_Form__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/components/Form/Form.tsx");
/* harmony import */ var components_Container_Container__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/components/Container/Container.tsx");
/* harmony import */ var components_Checkbox_Checkbox__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/components/Checkbox/Checkbox.tsx");
/* harmony import */ var components_Select_Select__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/components/Select/Select.tsx");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/components/Button/Button.tsx");
/* provided dependency */ var h = __webpack_require__("./node_modules/preact/dist/preact.module.js")["h"];






var SIZES = [{
  id: 's',
  label: 'S'
}, {
  id: 'm',
  label: 'M'
}, {
  id: 'l',
  label: 'L'
}];
var VARIANTS = [{
  id: 'default',
  label: 'Default'
}, {
  id: 'primary',
  label: 'Primary'
}, {
  id: 'clear',
  label: 'Clear'
}];
var INITIAL_PROPS = {
  size: 'm',
  variant: 'default',
  isLoading: false
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (function () {
  return h(components_Form_Form__WEBPACK_IMPORTED_MODULE_0__/* .Form */ .l0, {
    initialValues: INITIAL_PROPS
  }, function (_ref) {
    var Field = _ref.Field,
        values = _ref.values;
    return h(components_Container_Container__WEBPACK_IMPORTED_MODULE_1__/* .Container */ .W, {
      style: {
        maxWidth: 600
      },
      centeredH: true,
      size: "l"
    }, h(components_Container_Container__WEBPACK_IMPORTED_MODULE_1__/* .Container */ .W, {
      vertical: true,
      style: {
        flexGrow: 1
      },
      size: "s"
    }, h(helpers__WEBPACK_IMPORTED_MODULE_2__/* .Title */ .Dx, {
      text: "Props:"
    }), h(Field, {
      name: "size",
      component: components_Select_Select__WEBPACK_IMPORTED_MODULE_3__/* .Select */ .P,
      options: SIZES,
      label: "Size"
    }), h(Field, {
      name: "variant",
      component: components_Select_Select__WEBPACK_IMPORTED_MODULE_3__/* .Select */ .P,
      options: VARIANTS,
      label: "Variant"
    }), h(Field, {
      name: "isLoading",
      component: components_Checkbox_Checkbox__WEBPACK_IMPORTED_MODULE_4__/* .Checkbox */ .X,
      label: "isLoading"
    })), h(components_Container_Container__WEBPACK_IMPORTED_MODULE_1__/* .Container */ .W, {
      style: {
        flexGrow: 1
      },
      vertical: true,
      size: "s"
    }, h(helpers__WEBPACK_IMPORTED_MODULE_2__/* .Title */ .Dx, {
      text: "Result:"
    }), h(_Button__WEBPACK_IMPORTED_MODULE_5__/* .Button */ .z, values, "I'm a button")));
  });
});

/***/ })

}]);