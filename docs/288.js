"use strict";
(self["webpackChunk_foreverido_uilib"] = self["webpackChunk_foreverido_uilib"] || []).push([[288],{

/***/ "./src/docs/examples/InputFile/index.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ InputFile)
});

// EXTERNAL MODULE: ./src/docs/components/Code/Code.tsx + 59 modules
var Code = __webpack_require__("./src/docs/components/Code/Code.tsx");
;// CONCATENATED MODULE: ./node_modules/raw-loader/dist/cjs.js!./src/docs/examples/InputFile/Example.tsx
/* harmony default export */ const Example = ("import { useState } from 'react';\nimport { InputFile } from 'uilib';\n\nexport default () => {\n  const [value, setValue] = useState([]);\n\n  return (\n    <InputFile\n      size=\"m\"\n      label=\"Photos\"\n      value={value}\n      onChange={(e, val) => setValue(val)}\n      // @ts-ignore\n      upload={upload}\n      maxCount={5}\n      accept=\"image/png, image/jpeg\"\n    />\n  );\n};\n");
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js
var asyncToGenerator = __webpack_require__("./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js
var objectSpread2 = __webpack_require__("./node_modules/@babel/runtime/helpers/esm/objectSpread2.js");
// EXTERNAL MODULE: ./node_modules/@babel/runtime/regenerator/index.js
var regenerator = __webpack_require__("./node_modules/@babel/runtime/regenerator/index.js");
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);
// EXTERNAL MODULE: ./src/tools/file.ts
var tools_file = __webpack_require__("./src/tools/file.ts");
;// CONCATENATED MODULE: ./src/docs/examples/InputFile/helpers.ts




var defaultState = {
  total: 1000,
  loaded: 0
};

var simulateLoader = function simulateLoader(onProgress, onComplete) {
  var state = (0,objectSpread2/* default */.Z)((0,objectSpread2/* default */.Z)({}, defaultState), {}, {
    run: function run() {
      var _this = this;

      this.loaded += 250;
      onProgress({
        total: this.total,
        loaded: this.loaded
      });
      if (this.loaded === this.total) onComplete();else setTimeout(function () {
        return _this.run();
      }, 400 + Math.random() * 1000);
    }
  });

  state.run();
  return state;
};

function getOnComplete(file, resolve) {
  return /*#__PURE__*/(0,asyncToGenerator/* default */.Z)( /*#__PURE__*/regenerator_default().mark(function _callee() {
    var src;
    return regenerator_default().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return tools_file.toBase64(file);

          case 2:
            src = _context.sent;
            resolve(src);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
}

var upload = function upload(file, onProgress) {
  return new Promise(function (resolve) {
    simulateLoader(onProgress, getOnComplete(file, resolve));
  });
};
;// CONCATENATED MODULE: ./src/docs/examples/InputFile/index.tsx
/* provided dependency */ var React = __webpack_require__("./node_modules/react/index.js");



/* harmony default export */ const InputFile = (function () {
  return /*#__PURE__*/React.createElement(Code/* Code */.E, {
    code: Example,
    scope: {
      upload: upload
    }
  });
});

/***/ })

}]);