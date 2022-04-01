"use strict";
(self["webpackChunk_foreverido_uilib"] = self["webpackChunk_foreverido_uilib"] || []).push([[679],{

/***/ "./src/docs/examples/Checkbox/index.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Checkbox)
});

// EXTERNAL MODULE: ./src/docs/components/Code/Code.tsx + 61 modules
var Code = __webpack_require__("./src/docs/components/Code/Code.tsx");
;// CONCATENATED MODULE: ./node_modules/raw-loader/dist/cjs.js!./src/docs/examples/Checkbox/Example.tsx
/* harmony default export */ const Example = ("import { useState } from 'react';\nimport { Checkbox } from 'uilib';\n\nexport default () => {\n  const [checked, setChecked] = useState(false);\n\n  return (\n    <Checkbox\n      size=\"m\"\n      label=\"I'm a checkbutton\"\n      onChange={() => setChecked(!checked)}\n      checked={checked}\n    />\n  );\n};\n");
;// CONCATENATED MODULE: ./src/docs/examples/Checkbox/index.tsx
/* provided dependency */ var React = __webpack_require__("./node_modules/react/index.js");


/* harmony default export */ const Checkbox = (function () {
  return /*#__PURE__*/React.createElement(Code/* Code */.E, {
    code: Example
  });
});

/***/ })

}]);