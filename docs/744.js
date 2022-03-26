"use strict";
(self["webpackChunk_foreverido_uilib"] = self["webpackChunk_foreverido_uilib"] || []).push([[744],{

/***/ "./src/docs/examples/Select/Select.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Select)
});

// NAMESPACE OBJECT: ./src/docs/examples/Select/helpers.ts
var helpers_namespaceObject = {};
__webpack_require__.r(helpers_namespaceObject);
__webpack_require__.d(helpers_namespaceObject, {
  "OPTIONS": () => (OPTIONS),
  "default": () => (Select_helpers),
  "generateTreeOptions": () => (generateTreeOptions)
});

// EXTERNAL MODULE: ./src/docs/components/Code/Code.tsx + 60 modules
var Code = __webpack_require__("./src/docs/components/Code/Code.tsx");
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js + 2 modules
var toConsumableArray = __webpack_require__("./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
// EXTERNAL MODULE: ./src/docs/helpers/index.ts + 1 modules
var helpers = __webpack_require__("./src/docs/helpers/index.ts");
;// CONCATENATED MODULE: ./src/docs/examples/Select/helpers.ts


var TEXT = ['Aenean', 'Pellentesque', 'Ante', 'Sed', 'Cursus', 'Lacinia', 'Mauris', 'Viverra', 'Odio', 'Vitae', 'Finibus', 'Tincidunt'];

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function generateOption(id) {
  return {
    id: id,
    label: (0,helpers.getRandomItem)(TEXT)
  };
}

var OPTIONS = new Array(15).fill(1).map(function (n, i) {
  return generateOption(i);
});
function generateTreeOptions() {
  var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var parentId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var length = level ? randomInt(10) : 10;
  var items = [];

  for (var i = 0; i < length; i++) {
    var id = "".concat(parentId).concat(i);
    var item = generateOption(id);
    if (parentId) item.parentId = parentId;
    if (randomInt(10) - 6 - level > 0) items.push.apply(items, (0,toConsumableArray/* default */.Z)(generateTreeOptions(level + 1, id)));
    items.push(item);
  }

  return items;
}
/* harmony default export */ const Select_helpers = ({});
;// CONCATENATED MODULE: ./node_modules/raw-loader/dist/cjs.js!./src/docs/examples/Select/Example.tsx
/* harmony default export */ const Example = ("import { useState } from 'react';\nimport { Select } from 'uilib';\nimport { OPTIONS } from 'helpers';\n\nexport default () => {\n  const [value, setValue] = useState(OPTIONS[0].id);\n\n  return (\n    <Select\n      isSearchable\n      label=\"Label\"\n      options={OPTIONS}\n      value={value}\n      onChange={val => setValue(val)}\n    />\n  );\n};\n");
;// CONCATENATED MODULE: ./src/docs/examples/Select/Select.tsx
/* provided dependency */ var React = __webpack_require__("./node_modules/react/index.js");


 // const OPTIONS = H.generateOptions();
// const TREE_OPTIONS = H.generateTreeOptions();
// const PRESET_LETER = getRandomItem(OPTIONS).label[0];
// const OPTIONS_PRESET = OPTIONS.filter(({ label }) =>
//   new RegExp(`^${PRESET_LETER}`).test(label)
// );
// const GROUPED_OPTIONS = (function () {
//   let goroupCount = 1;
//   return OPTIONS.reduce((acc, item, i) => {
//     if (i === 1 || i % 5 === 0) {
//       const num = goroupCount++;
//       acc.push({ isGroup: true, id: `group-${num}`, label: `Group ${num}` });
//     }
//     return [...acc, item];
//   }, []);
// })();
// console.log('OPTIONS', OPTIONS);
// function API() {
//   return (
//     <>
//       <Title text="API" />
//     </>
//   );
// }
// export default () => <div>123123</div>;

/* harmony default export */ const Select = (function () {
  return /*#__PURE__*/React.createElement(Code/* Code */.E, {
    scope: {
      helpers: helpers_namespaceObject
    },
    code: Example
  });
}); // export default () => (
//   <Fragment>
//     <Container fullHeight>
//       <State initial={{ value: OPTIONS[0].id }}>
//         {state => (
//           <Select
//             label="Lorem Ipsum"
//             options={[...OPTIONS]}
//             value={state.value}
//             onChange={value => (state.value = value)}
//           />
//         )}
//       </State>
//     </Container>
//     <Container fullHeight vertical>
//       <State initial={{ lang: OPTIONS[0].id, cluster: OPTIONS[0].id }}>
//         {state => [
//           <Select
//             key="list1"
//             inputProps={{ placeholder: 'List 1' }}
//             options={[...OPTIONS]}
//             value={state.lang}
//             onChange={value => (state.value = value)}
//             popupProps={{ inline: true }}
//           />,
//           '-----------',
//           <Select
//             key="list2"
//             inputProps={{ placeholder: 'List 2' }}
//             options={[...OPTIONS]}
//             value={state.cluster}
//             onChange={value => (state.value = value)}
//             popupProps={{ inline: true }}
//           />,
//         ]}
//       </State>
//     </Container>
//     <Container fullHeight>
//       <State initial={{ value: null }}>
//         {state => (
//           <Select
//             label="Lorem Ipsum"
//             options={GROUPED_OPTIONS}
//             value={state.value}
//             onChange={value => (state.value = value)}
//           />
//         )}
//       </State>
//     </Container>
//     <Container fullHeight>
//       <State initial={{ value: [] }}>
//         {state => (
//           <Select
//             label="Lorem Ipsum"
//             options={GROUPED_OPTIONS}
//             value={state.value}
//             onChange={value => (state.value = value)}
//           />
//         )}
//       </State>
//     </Container>
//     <Container fullHeight>
//       <State initial={{ value: [OPTIONS[0].id] }}>
//         {state => (
//           <Select
//             label="Lorem Ipsum"
//             options={[...OPTIONS]}
//             value={state.value}
//             onChange={value => (state.value = value)}
//           />
//         )}
//       </State>
//     </Container>
//     <Container fullHeight>
//       <State initial={{ value: [OPTIONS[0].id] }}>
//         {state => (
//           <Select
//             label="Lorem Ipsum"
//             options={[...OPTIONS]}
//             value={state.value}
//             onChange={value => (state.value = value)}
//             presets={[
//               {
//                 label: `All "${PRESET_LETER}"`,
//                 ids: OPTIONS_PRESET.map(({ id }) => id),
//               },
//             ]}
//             selectAllButton
//             clearButton
//           />
//         )}
//       </State>
//     </Container>
//     <Container fullHeight>
//       <State initial={{ value: [] }}>
//         {state => (
//           <Select
//             label="Lorem Ipsum"
//             options={TREE_OPTIONS}
//             value={state.value}
//             onChange={value => (state.value = value)}
//           />
//         )}
//       </State>
//     </Container>
//   </Fragment>
// );

/***/ })

}]);