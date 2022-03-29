"use strict";
(self["webpackChunk_foreverido_uilib"] = self["webpackChunk_foreverido_uilib"] || []).push([[659],{

/***/ "./src/docs/examples/Input/index.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Input)
});

// EXTERNAL MODULE: ./src/docs/components/Code/Code.tsx + 60 modules
var Code = __webpack_require__("./src/docs/components/Code/Code.tsx");
;// CONCATENATED MODULE: ./node_modules/raw-loader/dist/cjs.js!./src/docs/examples/Input/Example.tsx
/* harmony default export */ const Example = ("import { useState } from 'react';\nimport { Input } from 'uilib';\n\nexport default () => {\n  const [value, setValue] = useState(`Ask Alice, I think she know`);\n\n  return (\n    <Input\n      type=\"textarea\"\n      label=\"Textar eaxample label\"\n      value={value}\n      onChange={(e, val) => setValue(val)}\n      hasClear\n      size=\"m\"\n    />\n  );\n};\n");
;// CONCATENATED MODULE: ./src/docs/examples/Input/index.tsx
/* provided dependency */ var React = __webpack_require__("./node_modules/react/index.js");


/* harmony default export */ const Input = (function () {
  return /*#__PURE__*/React.createElement(Code/* Code */.E, {
    code: Example
  });
});

/***/ })

}]);