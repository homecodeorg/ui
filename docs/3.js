"use strict";
(self["webpackChunk_foreverido_uilib"] = self["webpackChunk_foreverido_uilib"] || []).push([[3],{

/***/ "./src/docs/examples/Form/index.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Form)
});

// EXTERNAL MODULE: ./src/docs/components/Code/Code.tsx + 61 modules
var Code = __webpack_require__("./src/docs/components/Code/Code.tsx");
;// CONCATENATED MODULE: ./node_modules/raw-loader/dist/cjs.js!./src/docs/examples/Form/Example.tsx
/* harmony default export */ const Example = ("import { Form, SubmitButtons, Select } from 'uilib';\n\nconst initialValues = {\n  name: 'Alise',\n  age: 18,\n  groupId: null,\n};\nconst validationSchema = {\n  name: { type: 'string', empty: false },\n  age: { type: 'number', min: 18 },\n  groupId: { type: 'number', empty: false },\n};\n\nconst groupsOptions = [\n  { id: 1, label: 'group 1' },\n  { id: 2, label: 'group 2' },\n  { id: 3, label: 'group 3' },\n];\n\nexport default () => {\n  return (\n    <Form\n      initialValues={initialValues}\n      validationSchema={validationSchema}\n      onSubmit={values => alert(JSON.stringify(values))}\n    >\n      {({ Field, isDirty, isValid, isLoading, reset }) => (\n        <>\n          <Field name=\"name\" label=\"Name\" />\n          <Field name=\"age\" label=\"Age\" type=\"number\" />\n          <Field\n            name=\"groupId\"\n            label=\"Group\"\n            component={Select}\n            options={groupsOptions}\n            popupProps={{ direction: 'top' }}\n          />\n          <SubmitButtons\n            buttons={[\n              {\n                key: 'reset',\n                children: 'Reset',\n                size: 'm',\n                disabled: !isDirty,\n                onClick: reset,\n              },\n              {\n                key: 'submit',\n                children: 'Send',\n                type: 'submit',\n                size: 'm',\n                disabled: !isValid,\n                isLoading,\n              },\n            ]}\n          />\n        </>\n      )}\n    </Form>\n  );\n};\n");
;// CONCATENATED MODULE: ./src/docs/examples/Form/index.tsx
/* provided dependency */ var React = __webpack_require__("./node_modules/react/index.js");


/* harmony default export */ const Form = (function () {
  return /*#__PURE__*/React.createElement(Code/* Code */.E, {
    code: Example
  });
});

/***/ })

}]);