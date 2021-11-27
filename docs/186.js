"use strict";
(self["webpackChunk_truerenton_uilib"] = self["webpackChunk_truerenton_uilib"] || []).push([[186],{

/***/ "./src/components/Checkbox/Checkbox.example.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var src_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/helpers.tsx");
/* harmony import */ var _Container_Container__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/components/Container/Container.tsx");
/* harmony import */ var _Checkbox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/components/Checkbox/Checkbox.tsx");
/* provided dependency */ var h = __webpack_require__("./node_modules/preact/dist/preact.module.js")["h"];



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (function () {
  return h(_Container_Container__WEBPACK_IMPORTED_MODULE_0__/* .Container */ .W, {
    centered: true,
    fullHeight: true,
    size: "l"
  }, h(src_helpers__WEBPACK_IMPORTED_MODULE_1__/* .State */ .ZM, {
    initial: {
      checked: true
    }
  }, function (store) {
    return h(_Checkbox__WEBPACK_IMPORTED_MODULE_2__/* .Checkbox */ .X, {
      label: "i'm a checkbutton",
      onChange: function onChange() {
        return store.checked = !store.checked;
      },
      checked: store.checked
    });
  }));
});

/***/ }),

/***/ "./node_modules/nanoid/index.prod.js":
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "x0": () => (/* binding */ nanoid)
/* harmony export */ });
/* unused harmony exports customAlphabet, customRandom, random */

if (false) {}
let random = bytes => crypto.getRandomValues(new Uint8Array(bytes))
let customRandom = (alphabet, size, getRandom) => {
  let mask = (2 << (Math.log(alphabet.length - 1) / Math.LN2)) - 1
  let step = -~((1.6 * mask * size) / alphabet.length)
  return () => {
    let id = ''
    while (true) {
      let bytes = getRandom(step)
      let j = step
      while (j--) {
        id += alphabet[bytes[j] & mask] || ''
        if (id.length === size) return id
      }
    }
  }
}
let customAlphabet = (alphabet, size) => customRandom(alphabet, size, random)
let nanoid = (size = 21) => {
  let id = ''
  let bytes = crypto.getRandomValues(new Uint8Array(size))
  while (size--) {
    let byte = bytes[size] & 63
    if (byte < 36) {
      id += byte.toString(36)
    } else if (byte < 62) {
      id += (byte - 26).toString(36).toUpperCase()
    } else if (byte < 63) {
      id += '_'
    } else {
      id += '-'
    }
  }
  return id
}



/***/ })

}]);