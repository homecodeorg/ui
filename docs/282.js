"use strict";
(self["webpackChunk_foreverido_uilib"] = self["webpackChunk_foreverido_uilib"] || []).push([[282],{

/***/ "./src/docs/examples/Scroll/index.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Scroll)
});

// EXTERNAL MODULE: ./src/docs/components/Code/Code.tsx + 61 modules
var Code = __webpack_require__("./src/docs/components/Code/Code.tsx");
;// CONCATENATED MODULE: ./node_modules/raw-loader/dist/cjs.js!./src/docs/examples/Scroll/Example.tsx
/* harmony default export */ const Example = ("import { getLongText } from 'helpers';\n\nimport { Scroll } from 'uilib';\n\nexport default () => (\n  <Scroll\n    x\n    y\n    style={{\n      height: 200,\n      width: 200,\n      color: `var(--accent-color-alpha-100)`,\n    }}\n    offset={{\n      x: { after: 20 },\n      y: { before: 50, after: 20 },\n    }}\n  >\n    <div style={{ width: 1000 }}>{getLongText(5)}</div>\n  </Scroll>\n);\n");
// EXTERNAL MODULE: ./src/docs/helpers/index.ts + 1 modules
var helpers = __webpack_require__("./src/docs/helpers/index.ts");
;// CONCATENATED MODULE: ./src/docs/examples/Scroll/index.tsx
/* provided dependency */ var React = __webpack_require__("./node_modules/react/index.js");



/* harmony default export */ const Scroll = (function () {
  return /*#__PURE__*/React.createElement(Code/* Code */.E, {
    scope: {
      helpers: helpers
    },
    code: Example
  });
});

/***/ })

}]);