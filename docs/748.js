"use strict";
(self["webpackChunk_foreverido_uilib"] = self["webpackChunk_foreverido_uilib"] || []).push([[748],{

/***/ "./src/docs/examples/LightBox/index.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ LightBox)
});

// EXTERNAL MODULE: ./src/docs/components/Code/Code.tsx + 48 modules
var Code = __webpack_require__("./src/docs/components/Code/Code.tsx");
;// CONCATENATED MODULE: ./node_modules/raw-loader/dist/cjs.js!./src/docs/examples/LightBox/Example.tsx
/* harmony default export */ const Example = ("import { useState } from 'react';\nimport { LightBox, Button, Gallery } from 'uilib';\n\nconst { getRandomImageUrl } = helpers;\nconst items = [\n  getRandomImageUrl(),\n  getRandomImageUrl(),\n  getRandomImageUrl(),\n  getRandomImageUrl(),\n  getRandomImageUrl(),\n];\n\nexport default () => {\n  const [isOpen, setOpen] = useState(false);\n\n  return (\n    <>\n      <Button onClick={() => setOpen(true)}>Open {`<LightBox />`}</Button>\n      <LightBox isOpen={isOpen} onClose={() => setOpen(false)}>\n        <Gallery items={items} style={{ height: 400 }} />\n      </LightBox>\n    </>\n  );\n};\n");
;// CONCATENATED MODULE: ./src/docs/examples/LightBox/index.tsx
/* provided dependency */ var React = __webpack_require__("./node_modules/react/index.js");


/* harmony default export */ const LightBox = (function () {
  return /*#__PURE__*/React.createElement(Code/* Code */.E, {
    code: Example
  });
});

/***/ })

}]);