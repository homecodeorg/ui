"use strict";
(self["webpackChunk_foreverido_uilib"] = self["webpackChunk_foreverido_uilib"] || []).push([[176],{

/***/ "./src/docs/examples/Router/index.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Router)
});

// EXTERNAL MODULE: ./src/docs/components/Code/Code.tsx + 63 modules
var Code = __webpack_require__("./src/docs/components/Code/Code.tsx");
;// CONCATENATED MODULE: ./node_modules/raw-loader/dist/cjs.js!./src/docs/examples/Router/Example.tsx
/* harmony default export */ const Example = ("import { withStore } from 'justorm/react';\nimport { Router, Link } from 'uilib';\n\nconst StartPage = () => (\n  <>\n    <Link href=\"/\">Home</Link>\n    > <Link href=\"/users\">Users</Link>\n  </>\n);\nconst UsersPage = () => (\n  <>\n    <Link href=\"/\">Home</Link>\n    > <Link href=\"/users\">Users</Link>\n    <br />\n    <Link href=\"/users/azaza\">azaza</Link>\n    <Link href=\"/users/ololosh\">ololosh</Link>\n  </>\n);\nconst UserPage = ({ id, rootPath }) => {\n  const currPage = `/users/${id}`;\n\n  return (\n    <>\n      <Link href=\"/\">Home</Link>\n      > <Link href=\"/users\">Users</Link>\n      > <Link href={currPage}>{id}</Link>\n      <br />\n      <Router rootPath={`${rootPath}${currPage}`}>\n        <UserMenu id={id} />\n        <UserFriends path=\"/friends\" />\n        <UserCreatures path=\"/creatures\" />\n      </Router>\n    </>\n  );\n}\nconst UserMenu = ({ id }) => (<>\n  <Link href=\"/friends\">friends</Link>\n  <Link href=\"/creatures\">creatures</Link>\n</>);\nconst UserFriends = () => \"friends: foo, bar\";\nconst UserCreatures = () => \"creatures: sas\";\n\nexport default withStore('router')(({ store: { router } }) => {\n  const rootPath = '/router';\n\n  return (\n    <>\n      {router.path.replace(new RegExp(`^${rootPath}`), '') || '/'}\n      <br />\n      <Router rootPath={rootPath}>\n        <StartPage />\n        <UsersPage path=\"/users\" />\n        <UserPage exact path=\"/users/:id\" rootPath={rootPath} />\n      </Router>\n    </>\n  );\n});\n");
;// CONCATENATED MODULE: ./src/docs/examples/Router/index.tsx
/* provided dependency */ var React = __webpack_require__("./node_modules/react/index.js");


/* harmony default export */ const Router = (function () {
  return /*#__PURE__*/React.createElement(Code/* Code */.E, {
    code: Example
  });
});

/***/ })

}]);