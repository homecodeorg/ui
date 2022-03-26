"use strict";
(self["webpackChunk_foreverido_uilib"] = self["webpackChunk_foreverido_uilib"] || []).push([[408],{

/***/ "./src/docs/examples/Button/index.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Button)
});

// EXTERNAL MODULE: ./src/docs/components/Code/Code.tsx + 59 modules
var Code = __webpack_require__("./src/docs/components/Code/Code.tsx");
;// CONCATENATED MODULE: ./node_modules/raw-loader/dist/cjs.js!./src/docs/examples/Button/Example.tsx
/* harmony default export */ const Example = ("import { Button, Icon } from 'uilib';\n\nexport default () => {\n  const size = 'm';\n\n  return (\n    <Button\n      size={size}\n      // isSquare\n      variant=\"default\"\n      prefixElem={<Icon type=\"check\" size={size} />}\n    >\n      I'm a button\n    </Button>\n  );\n};\n");
;// CONCATENATED MODULE: ./src/docs/examples/Button/index.tsx
/* provided dependency */ var React = __webpack_require__("./node_modules/react/index.js");


/* harmony default export */ const Button = (function () {
  return /*#__PURE__*/React.createElement(Code/* Code */.E, {
    code: Example
  });
});

/***/ })

}]);