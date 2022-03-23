"use strict";
(self["webpackChunk_foreverido_uilib"] = self["webpackChunk_foreverido_uilib"] || []).push([[294],{

/***/ "./src/docs/examples/Popup/index.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Popup)
});

// EXTERNAL MODULE: ./src/docs/components/Code/Code.tsx + 48 modules
var Code = __webpack_require__("./src/docs/components/Code/Code.tsx");
;// CONCATENATED MODULE: ./node_modules/raw-loader/dist/cjs.js!./src/docs/examples/Popup/Example.tsx
/* harmony default export */ const Example = ("import { useCallback, useState } from 'react';\nimport { Popup, Button } from 'uilib';\n\nexport default () => {\n  const [isOpen, setOpen] = useState(true);\n  const toggle = useCallback(() => setOpen(!isOpen), [isOpen]);\n  const size = 'm';\n\n  return (\n    <Popup\n      isOpen={isOpen}\n      size={size}\n      controllable\n      direction=\"bottom\"\n      trigger={\n        <Button size={size} onClick={toggle}>\n          Open Popup\n        </Button>\n      }\n      content={<div style={{ padding: 10 }}>Popup content</div>}\n    />\n  );\n};\n");
;// CONCATENATED MODULE: ./src/docs/examples/Popup/index.tsx
/* provided dependency */ var React = __webpack_require__("./node_modules/react/index.js");

 // import cn from 'classnames';
// import S from './Popup.styl';
// const TEST_TEXT =
//   'Lorem Ipsum is simply dummy text of the printing and typesetting industry.';
// const TextBlock = <div className={S.minWidth}>{TEST_TEXT}</div>;
// const Cell = ({
//   children,
//   direction = 'row',
//   align = 'center',
//   justify = '',
// }) => {
//   const classes = cn(
//     S.cell,
//     S[direction],
//     justify && S[`justify-${justify}`],
//     align && S[`align-${align}`]
//   );
//   return <div className={classes}>{children}</div>;
// };

/* harmony default export */ const Popup = (function () {
  return /*#__PURE__*/React.createElement(Code/* Code */.E, {
    code: Example
  });
}); // export default () => (
//   <Fragment>
//     <Container size="l" vertical>
//       <h2>Directions</h2>
//       <Container centered vertical fullHeight>
//         <Cell>
//           <Popup
//             direction="top"
//             contentProps={{ className: S.padded }}
//             trigger={<Button>top</Button>}
//             content={TextBlock}
//           />
//         </Cell>
//         <Cell>
//           <Cell justify="end">
//             <Popup
//               direction="top-left"
//               contentProps={{ className: S.padded }}
//               trigger={<Button>top-left</Button>}
//               content={TextBlock}
//             />
//           </Cell>
//           <Cell justify="start">
//             <Popup
//               direction="top-right"
//               contentProps={{ className: S.padded }}
//               trigger={<Button>top-right</Button>}
//               content={TextBlock}
//             />
//           </Cell>
//         </Cell>
//         <Cell>
//           <Cell>
//             <Popup
//               direction="left"
//               contentProps={{ className: S.padded }}
//               trigger={<Button>left</Button>}
//               content={TextBlock}
//             />
//           </Cell>
//           <Cell direction="column" align="end">
//             <Popup
//               direction="left-top"
//               contentProps={{ className: S.padded }}
//               trigger={<Button>left-top</Button>}
//               content={TextBlock}
//             />
//             &nbsp;
//             <Popup
//               direction="left-bottom"
//               contentProps={{ className: S.padded }}
//               trigger={<Button>left-bottom</Button>}
//               content={TextBlock}
//             />
//           </Cell>
//           <Cell direction="column" align="start">
//             <Popup
//               direction="right-top"
//               contentProps={{ className: S.padded }}
//               trigger={<Button>right-top</Button>}
//               content={TextBlock}
//             />
//             &nbsp;
//             <Popup
//               direction="right-bottom"
//               contentProps={{ className: S.padded }}
//               trigger={<Button>right-bottom</Button>}
//               content={TextBlock}
//             />
//           </Cell>
//           <Cell>
//             <Popup
//               direction="right"
//               contentProps={{ className: S.padded }}
//               trigger={<Button>right</Button>}
//               content={TextBlock}
//             />
//           </Cell>
//         </Cell>
//         <Cell>
//           <Cell justify="end">
//             <Popup
//               direction="bottom-left"
//               contentProps={{ className: S.padded }}
//               trigger={<Button>bottom-left</Button>}
//               content={TextBlock}
//             />
//           </Cell>
//           <Cell justify="start">
//             <Popup
//               direction="bottom-right"
//               contentProps={{ className: S.padded }}
//               trigger={<Button>bottom-right</Button>}
//               content={TextBlock}
//             />
//           </Cell>
//         </Cell>
//         <Cell>
//           <Popup
//             direction="bottom"
//             contentProps={{ className: S.padded }}
//             trigger={<Button>bottom</Button>}
//             content={TextBlock}
//           />
//         </Cell>
//       </Container>
//     </Container>
//     <Container size="l" vertical>
//       <h2>autoClose</h2>
//       <Container centered>
//         <div>
//           <Popup
//             autoClose
//             direction="bottom-left"
//             trigger={<Button>click me</Button>}
//             content={<Button>click to close</Button>}
//           />
//         </div>
//       </Container>
//     </Container>
//     <Container size="l" vertical>
//       <h2>Inline</h2>
//       <Container vertical fullHeight>
//         <div style={{ maxWidth: 200 }}>
//           <Popup
//             inline
//             contentProps={{ className: S.padded }}
//             direction="bottom-right"
//             trigger={<Button>click me</Button>}
//             content={TextBlock}
//           />
//         </div>
//         some other content...
//       </Container>
//     </Container>
//     <Container size="l" vertical>
//       <h2>Nested</h2>
//       <Container centered>
//         <State initial={{ isOpenLv1: false, isOpenLv2: false }}>
//           {state => (
//             <Popup
//               direction="bottom-left"
//               isOpen={state.isOpenLv1}
//               trigger={
//                 <Button onClick={() => (state.isOpenLv1 = !state.isOpenLv1)}>
//                   click me
//                 </Button>
//               }
//               content={
//                 <Popup
//                   direction="right-bottom"
//                   contentProps={{ className: S.padded }}
//                   outlined
//                   isOpen={state.isOpenLv2}
//                   trigger={
//                     <Button
//                       variant="clear"
//                       onClick={() => (state.isOpenLv2 = !state.isOpenLv2)}
//                     >
//                       we need to go deeper
//                     </Button>
//                   }
//                   content={TextBlock}
//                 />
//               }
//             />
//           )}
//         </State>
//       </Container>
//     </Container>
//     <Container size="l" vertical>
//       <h2>Controllable</h2>
//       <State initial={{ isOpen: false }}>
//         {state => (
//           <Container size="l" centered style={{ minHeight: 300 }}>
//             <Popup
//               direction="bottom-left"
//               outlined
//               controllable
//               isOpen={state.isOpen}
//               trigger={<Icon size="xl" type="close" />}
//               content={
//                 <div className={cn(S.minWidth, S.padded)}>
//                   This popup close only when you click on button again.
//                 </div>
//               }
//             />
//             &nbsp;––––––&nbsp;
//             <Button onClick={() => (state.isOpen = !state.isOpen)}>
//               toggle popup state
//             </Button>
//           </Container>
//         )}
//       </State>
//     </Container>
//   </Fragment>
// );

/***/ })

}]);