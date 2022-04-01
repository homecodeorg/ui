"use strict";
(self["webpackChunk_foreverido_uilib"] = self["webpackChunk_foreverido_uilib"] || []).push([[113],{

/***/ "./src/docs/examples/Notifications/index.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Notifications)
});

// EXTERNAL MODULE: ./src/docs/components/Code/Code.tsx + 61 modules
var Code = __webpack_require__("./src/docs/components/Code/Code.tsx");
;// CONCATENATED MODULE: ./node_modules/raw-loader/dist/cjs.js!./src/docs/examples/Notifications/Example.tsx
/* harmony default export */ const Example = ("import Time from 'timen';\nimport { Container, Button, Notifications, NotificationsStore } from 'uilib';\n\nconst params = {\n  info: {\n    title: 'Information',\n    content: 'This is informative type of notification.',\n  },\n  warning: {\n    type: 'warning',\n    title: 'Warning',\n    content: 'Connection lost.',\n  },\n  error: {\n    type: 'danger',\n    title: 'Error',\n    content: 'Server are down. Need your support ASAP.',\n  },\n  loading: {\n    autohide: false,\n    title: 'Loading...',\n    content: 'This notification stay visible until you close it.',\n  },\n};\n\nconst show = type => NotificationsStore.show(params[type]);\nconst showAll = () => {\n  let delay = 0;\n  ['info', 'warning', 'error', 'loading'].forEach(type =>\n    Time.after((delay += Math.random() * 1000), () => show(type))\n  );\n};\n\nexport default () => (\n  <Container centered fullHeight>\n    <Notifications style={{ maxWidth: '60%' }} />\n    <div>\n      <Button onClick={() => show('info')}>Info</Button>\n      <br />\n      <Button onClick={() => show('warning')}>Warning</Button>\n      <br />\n      <Button onClick={() => show('error')}>Error</Button>\n      <br />\n      <Button onClick={() => show('loading')}>Loading</Button>\n      <br />\n      <Button onClick={showAll}>All</Button>\n    </div>\n  </Container>\n);\n");
;// CONCATENATED MODULE: ./src/docs/examples/Notifications/index.tsx
/* provided dependency */ var React = __webpack_require__("./node_modules/react/index.js");


/* harmony default export */ const Notifications = (function () {
  return /*#__PURE__*/React.createElement(Code/* Code */.E, {
    code: Example
  });
});

/***/ })

}]);