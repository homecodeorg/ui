"use strict";
(self["webpackChunk_foreverido_uilib"] = self["webpackChunk_foreverido_uilib"] || []).push([[197],{

/***/ "./src/docs/examples/InputFile/index.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ InputFile)
});

// EXTERNAL MODULE: ./src/components/Container/Container.tsx + 1 modules
var Container = __webpack_require__("./src/components/Container/Container.tsx");
// EXTERNAL MODULE: ./src/components/Router/Link/Link.tsx + 2 modules
var Link = __webpack_require__("./src/components/Router/Link/Link.tsx");
// EXTERNAL MODULE: ./src/components/Router/Router.tsx + 6 modules
var Router = __webpack_require__("./src/components/Router/Router.tsx");
// EXTERNAL MODULE: ./src/docs/components/Code/Code.tsx + 61 modules
var Code = __webpack_require__("./src/docs/components/Code/Code.tsx");
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js
var objectSpread2 = __webpack_require__("./node_modules/@babel/runtime/helpers/esm/objectSpread2.js");
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

var getOnComplete = function getOnComplete(file, resolve) {
  return function () {
    return tools_file.toBase64(file).then(resolve);
  };
};

var upload = function upload(file, onProgress) {
  return new Promise(function (resolve) {
    simulateLoader(onProgress, getOnComplete(file, resolve));
  });
};
;// CONCATENATED MODULE: ./node_modules/raw-loader/dist/cjs.js!./src/docs/examples/InputFile/UploadOnChange.tsx
/* harmony default export */ const UploadOnChange = ("import { useState } from 'react';\nimport { InputFile } from 'uilib';\n\nexport default () => {\n  const [value, setValue] = useState([]);\n\n  return (\n    <InputFile\n      size=\"m\"\n      label=\"Photos\"\n      value={value}\n      onChange={(e, val) => setValue(val)}\n      // @ts-ignore\n      upload={upload}\n      maxCount={5}\n      accept=\"image/png, image/jpeg\"\n    />\n  );\n};\n");
;// CONCATENATED MODULE: ./node_modules/raw-loader/dist/cjs.js!./src/docs/examples/InputFile/UploadOnDemand.tsx
/* harmony default export */ const UploadOnDemand = ("import { useCallback, useState } from 'react';\nimport { InputFile, Form, SubmitButtons } from 'uilib';\n\nlet demandUploader;\n\nexport default () => {\n  const [initialValues, setInitialValues] = useState({ photos: [] });\n\n  const onSubmit = useCallback(async function () {\n    const photos = await demandUploader(upload);\n\n    setInitialValues({ photos });\n  }, []);\n\n  const renderFields = useCallback(\n    ({ Field, isLoading, isValid, isDirty }) => (\n      <>\n        <Field\n          name=\"photos\"\n          component={InputFile}\n          size=\"m\"\n          label=\"Photos\"\n          uploadOnDemand={fn => (demandUploader = fn)}\n          maxCount={5}\n          accept=\"image/png, image/jpeg\"\n        />\n        <SubmitButtons\n          buttons={[\n            {\n              type: 'submit',\n              children: 'Submit',\n              isLoading,\n              key: 'submit',\n              disabled: !isValid || !isDirty,\n            },\n          ]}\n        />\n      </>\n    ),\n    []\n  );\n\n  return (\n    <Form\n      initialValues={initialValues}\n      validationSchema={{\n        photos: { type: 'array', items: 'string', empty: false },\n      }}\n      onSubmit={onSubmit}\n    >\n      {renderFields}\n    </Form>\n  );\n};\n");
;// CONCATENATED MODULE: ./src/docs/examples/InputFile/index.tsx
/* provided dependency */ var React = __webpack_require__("./node_modules/react/index.js");





var rootPath = '/inputFile';
/* harmony default export */ const InputFile = (function () {
  return /*#__PURE__*/React.createElement(Container/* Container */.W, {
    vertical: true,
    fullWidth: true
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Link/* Link */.r, {
    href: "".concat(rootPath, "/onchange")
  }, "Upload on change"), /*#__PURE__*/React.createElement(Link/* Link */.r, {
    href: "".concat(rootPath, "/ondemand")
  }, "Upload on demand")), /*#__PURE__*/React.createElement(Router/* Router */.F0, {
    rootPath: rootPath
  }, /*#__PURE__*/React.createElement(Code/* Code */.E, {
    exact: true,
    path: "/onchange",
    code: UploadOnChange,
    scope: {
      upload: upload
    },
    key: "onchange"
  }), /*#__PURE__*/React.createElement(Code/* Code */.E, {
    exact: true,
    path: "/ondemand",
    code: UploadOnDemand,
    scope: {
      upload: upload
    },
    key: "ondemand"
  })));
});

/***/ })

}]);