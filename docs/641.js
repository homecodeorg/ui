"use strict";
(self["webpackChunk_foreverido_uilib"] = self["webpackChunk_foreverido_uilib"] || []).push([[641],{

/***/ "./src/docs/examples/DateTime/index.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ DateTime)
});

// EXTERNAL MODULE: ./src/docs/components/Code/Code.tsx + 65 modules
var Code = __webpack_require__("./src/docs/components/Code/Code.tsx");
// EXTERNAL MODULE: ./node_modules/moment/moment.js
var moment = __webpack_require__("./node_modules/moment/moment.js");
var moment_default = /*#__PURE__*/__webpack_require__.n(moment);
;// CONCATENATED MODULE: ./node_modules/raw-loader/dist/cjs.js!./src/docs/examples/DateTime/Example.tsx
/* harmony default export */ const Example = ("import { DateTime } from 'uilib';\n\nconst date = moment().add(2, 'day');\n\nexport default () => {\n  return (\n    <DateTime\n      value={date}\n      // format=\"DD.MM.YYYY\"\n      format=\"toNow\"\n      locale=\"ru\"\n    />\n  );\n};\n");
;// CONCATENATED MODULE: ./src/docs/examples/DateTime/index.tsx
/* provided dependency */ var React = __webpack_require__("./node_modules/react/index.js");



/* harmony default export */ const DateTime = (function () {
  return /*#__PURE__*/React.createElement(Code/* Code */.E, {
    code: Example,
    scope: {
      moment: (moment_default())
    }
  });
});

/***/ })

}]);