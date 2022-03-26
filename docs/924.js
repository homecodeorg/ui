"use strict";
(self["webpackChunk_foreverido_uilib"] = self["webpackChunk_foreverido_uilib"] || []).push([[924],{

/***/ "./src/docs/examples/PopupMenu/index.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ PopupMenu)
});

// EXTERNAL MODULE: ./src/docs/components/Code/Code.tsx + 59 modules
var Code = __webpack_require__("./src/docs/components/Code/Code.tsx");
;// CONCATENATED MODULE: ./node_modules/raw-loader/dist/cjs.js!./src/docs/examples/PopupMenu/Example.tsx
/* harmony default export */ const Example = ("import { PopupMenu, Button } from 'uilib';\n\nexport default () => {\n  const size = 'm';\n  return (\n    <PopupMenu\n      direction=\"bottom\"\n      autoClose\n      isOpen\n      size={size}\n      trigger={\n        <Button size={size} variant=\"default\">\n          Open Menu\n        </Button>\n      }\n      items={[\n        {\n          id: 'ololo',\n          title: 'Ololo',\n          // onClick: () => alert('ololo'),\n        },\n        {\n          id: 'azaza',\n          title: 'Azaza',\n          // onClick: () => alert('azaza'),\n        },\n      ]}\n    />\n  );\n};\n");
;// CONCATENATED MODULE: ./src/docs/examples/PopupMenu/index.tsx
/* provided dependency */ var React = __webpack_require__("./node_modules/react/index.js");


/* harmony default export */ const PopupMenu = (function () {
  return /*#__PURE__*/React.createElement(Code/* Code */.E, {
    code: Example
  });
});

/***/ })

}]);