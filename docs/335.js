"use strict";
(self["webpackChunk_foreverido_uilib"] = self["webpackChunk_foreverido_uilib"] || []).push([[335],{

/***/ "./src/docs/examples/Gallery/index.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Gallery)
});

// EXTERNAL MODULE: ./src/docs/components/Code/Code.tsx + 48 modules
var Code = __webpack_require__("./src/docs/components/Code/Code.tsx");
;// CONCATENATED MODULE: ./node_modules/raw-loader/dist/cjs.js!./src/docs/examples/Gallery/Example.tsx
/* harmony default export */ const Example = ("import { Gallery } from 'uilib';\n\nconst { getRandomImageUrl } = helpers;\nconst items = [\n  getRandomImageUrl(),\n  getRandomImageUrl(),\n  getRandomImageUrl(),\n  getRandomImageUrl(),\n  getRandomImageUrl(),\n];\n\nexport default () => {\n  return <Gallery items={items} style={{ height: 400 }} />;\n};\n");
;// CONCATENATED MODULE: ./src/docs/examples/Gallery/index.tsx
/* provided dependency */ var React = __webpack_require__("./node_modules/react/index.js");


/* harmony default export */ const Gallery = (function () {
  return /*#__PURE__*/React.createElement(Code/* Code */.E, {
    code: Example
  });
});

/***/ })

}]);