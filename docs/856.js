"use strict";
(self["webpackChunk_foreverido_uilib"] = self["webpackChunk_foreverido_uilib"] || []).push([[856],{

/***/ "./src/docs/examples/Virtualized/index.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Virtualized)
});

// NAMESPACE OBJECT: ./src/docs/examples/Virtualized/helpers.tsx
var Virtualized_helpers_namespaceObject = {};
__webpack_require__.r(Virtualized_helpers_namespaceObject);
__webpack_require__.d(Virtualized_helpers_namespaceObject, {
  "getSimpleItemData": () => (getSimpleItemData),
  "loadData": () => (loadData),
  "renderComplexItem": () => (renderComplexItem),
  "renderSimpleItems": () => (renderSimpleItems)
});

// EXTERNAL MODULE: ./src/docs/components/Code/Code.tsx + 60 modules
var Code = __webpack_require__("./src/docs/components/Code/Code.tsx");
;// CONCATENATED MODULE: ./node_modules/raw-loader/dist/cjs.js!./src/docs/examples/Virtualized/Endless.tsx
/* harmony default export */ const Endless = ("import { Component } from 'react';\nimport { VirtualizedListScroll, VirtualizedList, array } from 'uilib';\nimport { createStore, withStore } from 'justorm/react';\n\nconst { getSimpleItemData, renderSimpleItems, loadData } = helpers;\n\nconst PAGE_SIZE = 20;\nconst totalCount = 100;\nconst store = createStore('example', { data: [] });\n\nconst loadNextData = (first, last) =>\n  loadData(first, last, getSimpleItemData, 1000);\n\nfunction setData(nextData, startIndex = store.data.length) {\n  store.data = array.insert(store.data, nextData, startIndex);\n}\n\nexport default withStore('example')(\n  class Example extends Component {\n    componentDidMount() {\n      loadNextData(0, PAGE_SIZE).then(setData);\n    }\n\n    onScrollEnd() {\n      const count = store.data.length;\n      loadNextData(count, count + PAGE_SIZE).then(setData);\n    }\n\n    render() {\n      const { data } = store.originalObject;\n      const itemsCount = data.length;\n\n      return (\n        // <VirtualizedList\n        <VirtualizedListScroll\n          scrollProps={{ y: true }}\n          totalCount={totalCount}\n          itemsCount={itemsCount}\n          overlapCount={10}\n          itemHeight={40}\n          renderItem={itemProps =>\n            renderSimpleItems(itemProps, data[itemProps.key])\n          }\n          onScrollEnd={() => this.onScrollEnd()}\n          pageSize={PAGE_SIZE}\n        />\n      );\n    }\n  }\n);\n\n// import { Component, Fragment } from 'react';\n// import omit from 'lodash.omit';\n\n// import State from 'docs/helpers/State';\n// import Title from 'docs/helpers/Title';\n\n// import { Form, SubmitButtons } from 'components/Form/Form';\n// import { Container } from 'components/Container/Container';\n\n// import { VirtualizedList, VirtualizedCards, VirtualizedTable } from '.';\n\n// import S from './Virtualized.example.styl';\n// import * as H from './Virtualized.example-helpers';\n\n// class Example extends Component {\n//   static defaultProps = {\n//     Elem: VirtualizedList,\n//   };\n\n//   constructor(props) {\n//     super(props);\n//     this.state = {\n//       data: [],\n//       totalCount: 500,\n//       itemHeight: props.itemHeight || 40,\n//       overlapCount: 10,\n//       pageSize: PAGE_SIZE,\n//     };\n//   }\n\n//   componentDidMount() {\n//     this.loadData();\n//   }\n\n//   loadData = async () => {\n//     const { getItemData, prefix } = this.props;\n//     const { pageSize, totalCount } = this.state;\n//     const data = [...this.state.data];\n//     const itemsCount = data.length;\n//     const indexTill = Math.min(totalCount, itemsCount + pageSize);\n\n//     return new Promise(resolve => {\n//       for (let i = itemsCount; i < indexTill; i++) {\n//         data.push(getItemData(i));\n//       }\n\n//       this.setState({ data });\n//       resolve();\n//     });\n//   };\n\n//   render() {\n//     const { Elem } = this.props;\n//     const { data, itemHeight, totalCount } = this.state;\n//     const itemsCount = data.length;\n\n//     const renderItem = itemProps =>\n//       this.props.renderItem(itemProps, data[itemProps.key]);\n\n//     const formVals = omit(this.state, ['data']);\n//     const infinityScrollProps = {\n//       ...omit(formVals, ['pageSize']),\n//       ...this.props,\n//       itemsCount,\n//       totalCount,\n//       renderItem,\n//     };\n\n//     return (\n//       <div className={S.root}>\n//         <Container vertical className={S.form}>\n//           <div className={S.count}>\n//             {itemsCount} of {totalCount}\n//           </div>\n//           <SettingsForm\n//             initialValues={formVals}\n//             onSubmit={vals => this.setState(vals)}\n//           />\n//         </Container>\n//         <div className={S.list}>\n//           <Elem {...infinityScrollProps} onScrollEnd={this.loadData} />\n//         </div>\n//       </div>\n//     );\n//   }\n// }\n\n// export default () => (\n//   <>\n//     <Container vertical fullWidth>\n//       <Title id=\"list-simple\" text=\"List (simple)\" />\n//       <Example\n//         getItemData={H.getSimpleItemData}\n//         renderItem={H.renderSimpleItems}\n//       />\n//     </Container>\n\n//     <Container vertical fullWidth>\n//       <Title id=\"list-simple1\" text=\"List (simple)1\" />\n//       <Example\n//         getItemData={H.getSimpleItemData}\n//         renderItem={H.renderSimpleItems}\n//       />\n//     </Container>\n\n//     {/*\n//     <Container vertical fullWidth>\n//       <Title id=\"list-complex\" text=\"List (complex)\" />\n//       <Example\n//         getItemData={H.getSimpleItemData}\n//         renderItem={H.renderComplexItem}\n//       />\n//     </Container>\n//     <Container vertical>\n//       <Title id=\"cards-simple\" text=\"Cards (simple)\" />\n//       <Example\n//         Elem={VirtualizedCards}\n//         getItemData={H.getSimpleItemData}\n//         renderItem={H.renderSimpleItems}\n//         itemHeight={50}\n//         itemMinWidth={190}\n//         itemMaxWidth={230}\n//       />\n//     </Container>\n\n//     <Container vertical>\n//       <Title id=\"cards-complex\" text=\"Cards (complex)\" />\n//       <Example\n//         Elem={VirtualizedCards}\n//         getItemData={H.getCardItemData}\n//         renderItem={H.renderCardItem}\n//         itemHeight={270}\n//         itemMinWidth={190}\n//         itemMaxWidth={230}\n//       />\n//     </Container>\n\n//     <Container vertical>\n//       <Title id=\"table\" text=\"Table\" />\n//       <Example\n//         Elem={VirtualizedTable}\n//         getItemData={H.getTableItemData}\n//         renderItem={H.renderTableRow}\n//         thead={H.renderTableHeader()}\n//       />\n//     </Container>\n//     */}\n//   </>\n// );\n");
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js + 1 modules
var objectWithoutProperties = __webpack_require__("./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__("./node_modules/react/index.js");
// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__("./node_modules/classnames/index.js");
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
// EXTERNAL MODULE: ./node_modules/timen/index.js
var timen = __webpack_require__("./node_modules/timen/index.js");
var timen_default = /*#__PURE__*/__webpack_require__.n(timen);
// EXTERNAL MODULE: ./src/components/Button/Button.tsx + 2 modules
var Button = __webpack_require__("./src/components/Button/Button.tsx");
// EXTERNAL MODULE: ./src/components/Icon/Icon.tsx + 16 modules
var Icon = __webpack_require__("./src/components/Icon/Icon.tsx");
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js");
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js");
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js");
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js");
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-modules-typescript-loader/index.js!./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[2].use[3]!./node_modules/stylus-loader/dist/cjs.js!./src/docs/examples/Virtualized/helpers.styl
var helpers = __webpack_require__("./node_modules/css-modules-typescript-loader/index.js!./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[2].use[3]!./node_modules/stylus-loader/dist/cjs.js!./src/docs/examples/Virtualized/helpers.styl");
;// CONCATENATED MODULE: ./src/docs/examples/Virtualized/helpers.styl

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(helpers/* default */.Z, options);




       /* harmony default export */ const Virtualized_helpers = (helpers/* default */.Z && helpers/* default.locals */.Z.locals ? helpers/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/docs/examples/Virtualized/helpers.tsx

var _excluded = ["className"];



 // import Card from 'components/Card/Card';
// import * as TH from '../Table/Table.stories-helpers';
// import { Column } from '../Table/Table.types';

 // const CARD_DATA = {
//   image: [
//     getRandomImageUrl(136, 175),
//     getRandomImageUrl(136, 175),
//     getRandomImageUrl(136, 175),
//     getRandomImageUrl(136, 175),
//     getRandomImageUrl(136, 175),
//   ],
//   title: ['Jacket', 'Shorts', 'Underwear', 'Sweaters', 'Suit', 'Dress', 'Shoe'],
//   description: [
//     'Events 423',
//     'Events 123',
//     'Events 453',
//     'Events 422',
//     'Events 732',
//     'Events 533',
//     'Events 478',
//   ],
// };

function loadData(first, last, getItemData) {
  var delay = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 200;
  var data = [];
  return new Promise(function (resolve) {
    for (var i = first; i < last; i++) {
      data.push(getItemData(i));
    }

    timen_default().after(delay, function () {
      return resolve(data);
    });
  });
}
function getSimpleItemData(i) {
  return "Item ".concat(i + 1);
} // export function getTableItemData(i) {
//   return TH.COLUMNS.reduce(
//     (acc, { id }) => ({ ...acc, ...TH.generateColFakeData(id, i) }),
//     {}
//   );
// }
// export function getCardItemData(i) {
//   return {
//     image: getRandomItem(CARD_DATA.image),
//     title: `${i + 1}. ${getRandomItem(CARD_DATA.title)}`,
//     description: getRandomItem(CARD_DATA.description),
//   };
// }

function renderSimpleItems(props, data) {
  if (!data) return null;
  return /*#__PURE__*/react.createElement("div", props, data);
}
function renderComplexItem(_ref, data) {
  var className = _ref.className,
      props = (0,objectWithoutProperties/* default */.Z)(_ref, _excluded);

  return /*#__PURE__*/react.createElement(Button/* Button */.z, Object.assign({
    className: classnames_default()(Virtualized_helpers.item, className)
  }, props, {
    onClick: function onClick() {
      return alert('booo!');
    }
  }), /*#__PURE__*/react.createElement(Icon/* Icon */.J, {
    type: "arrow-down"
  }), " ", data);
} // export function renderCardItem(props, cardData) {
//   return <Card {...props} {...cardData} key={props.key} />;
// }
// export function renderTableHeader() {
//   return (
//     <tr>
//       {TH.COLUMNS.map(({ id, title }) => (
//         <th key={id}>{title}</th>
//       ))}
//     </tr>
//   );
// }
// export function renderTableCell(data, { id, dataAccessor, render }: Column) {
//   if (render) return render(data);
//   if (dataAccessor) return path(dataAccessor.split('.'), data);
//   return data[id];
// }
// export function renderTableRow(props, data) {
//   return (
//     <tr {...props}>
//       {TH.COLUMNS.map(colParams => (
//         <td key={colParams.id}>{renderTableCell(data, colParams)}</td>
//       ))}
//     </tr>
//   );
// }
;// CONCATENATED MODULE: ./src/docs/examples/Virtualized/index.tsx
/* provided dependency */ var React = __webpack_require__("./node_modules/react/index.js");

 // import example from '!!raw-loader!./Finite';


/* harmony default export */ const Virtualized = (function () {
  return /*#__PURE__*/React.createElement(Code/* Code */.E, {
    code: Endless,
    scope: {
      helpers: Virtualized_helpers_namespaceObject
    }
  });
});

/***/ }),

/***/ "./node_modules/css-modules-typescript-loader/index.js!./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[2].use[3]!./node_modules/stylus-loader/dist/cjs.js!./src/docs/examples/Virtualized/helpers.styl":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".helpers__root___jqPlK{display:flex;height:50vh}.helpers__count___dz6ze{text-align:right;margin-bottom:10px}.helpers__form___E59JF{max-width:200px}.helpers__list___bumA2{flex:1;margin-left:16px;border-radius:8px;box-shadow:0 0 0 1px var(--default-color)}.helpers__item___UfZEV{margin:0 !important}", ""]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"root": "helpers__root___jqPlK",
	"count": "helpers__count___dz6ze",
	"form": "helpers__form___E59JF",
	"list": "helpers__list___bumA2",
	"item": "helpers__item___UfZEV"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ })

}]);