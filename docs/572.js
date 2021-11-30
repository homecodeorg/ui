"use strict";
(self["webpackChunk_truerenton_uilib"] = self["webpackChunk_truerenton_uilib"] || []).push([[572],{

/***/ "./src/components/Popup/Popup.example.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Popup_example)
});

// EXTERNAL MODULE: ./node_modules/preact/compat/dist/compat.module.js
var compat_module = __webpack_require__("./node_modules/preact/compat/dist/compat.module.js");
// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__("./node_modules/classnames/index.js");
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
// EXTERNAL MODULE: ./src/helpers.tsx
var helpers = __webpack_require__("./src/helpers.tsx");
// EXTERNAL MODULE: ./src/components/Container/Container.tsx + 1 modules
var Container = __webpack_require__("./src/components/Container/Container.tsx");
// EXTERNAL MODULE: ./src/components/Button/Button.tsx + 2 modules
var Button = __webpack_require__("./src/components/Button/Button.tsx");
// EXTERNAL MODULE: ./src/components/Icon/Icon.tsx + 1 modules
var Icon = __webpack_require__("./src/components/Icon/Icon.tsx");
// EXTERNAL MODULE: ./src/components/Popup/Popup.tsx + 2 modules
var Popup = __webpack_require__("./src/components/Popup/Popup.tsx");
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
// EXTERNAL MODULE: ./node_modules/css-modules-typescript-loader/index.js!./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[3]!./node_modules/stylus-loader/dist/cjs.js!./src/components/Popup/Popup.stories.styl
var Popup_stories = __webpack_require__("./node_modules/css-modules-typescript-loader/index.js!./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[3]!./node_modules/stylus-loader/dist/cjs.js!./src/components/Popup/Popup.stories.styl");
;// CONCATENATED MODULE: ./src/components/Popup/Popup.stories.styl

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(Popup_stories/* default */.Z, options);




       /* harmony default export */ const Popup_Popup_stories = (Popup_stories/* default */.Z && Popup_stories/* default.locals */.Z.locals ? Popup_stories/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/components/Popup/Popup.example.tsx
/* provided dependency */ var h = __webpack_require__("./node_modules/preact/dist/preact.module.js")["h"];








var TEST_TEXT = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.';
var TextBlock = h("div", {
  className: Popup_Popup_stories.minWidth
}, TEST_TEXT);

var Cell = function Cell(_ref) {
  var children = _ref.children,
      _ref$direction = _ref.direction,
      direction = _ref$direction === void 0 ? 'row' : _ref$direction,
      _ref$align = _ref.align,
      align = _ref$align === void 0 ? 'center' : _ref$align,
      _ref$justify = _ref.justify,
      justify = _ref$justify === void 0 ? '' : _ref$justify;
  var classes = classnames_default()(Popup_Popup_stories.cell, Popup_Popup_stories[direction], justify && Popup_Popup_stories["justify-".concat(justify)], align && Popup_Popup_stories["align-".concat(align)]);
  return h("div", {
    className: classes
  }, children);
};

/* harmony default export */ const Popup_example = (function () {
  return h(compat_module/* Fragment */.HY, null, h(Container/* Container */.W, {
    size: "l",
    vertical: true
  }, h("h2", null, "Directions"), h(Container/* Container */.W, {
    centered: true,
    vertical: true,
    fullHeight: true
  }, h(Cell, null, h(Popup/* Popup */.G, {
    direction: "top",
    contentProps: {
      className: Popup_Popup_stories.padded
    },
    trigger: h(Button/* Button */.z, null, "top"),
    content: TextBlock
  })), h(Cell, null, h(Cell, {
    justify: "end"
  }, h(Popup/* Popup */.G, {
    direction: "top-left",
    contentProps: {
      className: Popup_Popup_stories.padded
    },
    trigger: h(Button/* Button */.z, null, "top-left"),
    content: TextBlock
  })), h(Cell, {
    justify: "start"
  }, h(Popup/* Popup */.G, {
    direction: "top-right",
    contentProps: {
      className: Popup_Popup_stories.padded
    },
    trigger: h(Button/* Button */.z, null, "top-right"),
    content: TextBlock
  }))), h(Cell, null, h(Cell, null, h(Popup/* Popup */.G, {
    direction: "left",
    contentProps: {
      className: Popup_Popup_stories.padded
    },
    trigger: h(Button/* Button */.z, null, "left"),
    content: TextBlock
  })), h(Cell, {
    direction: "column",
    align: "end"
  }, h(Popup/* Popup */.G, {
    direction: "left-top",
    contentProps: {
      className: Popup_Popup_stories.padded
    },
    trigger: h(Button/* Button */.z, null, "left-top"),
    content: TextBlock
  }), "\xA0", h(Popup/* Popup */.G, {
    direction: "left-bottom",
    contentProps: {
      className: Popup_Popup_stories.padded
    },
    trigger: h(Button/* Button */.z, null, "left-bottom"),
    content: TextBlock
  })), h(Cell, {
    direction: "column",
    align: "start"
  }, h(Popup/* Popup */.G, {
    direction: "right-top",
    contentProps: {
      className: Popup_Popup_stories.padded
    },
    trigger: h(Button/* Button */.z, null, "right-top"),
    content: TextBlock
  }), "\xA0", h(Popup/* Popup */.G, {
    direction: "right-bottom",
    contentProps: {
      className: Popup_Popup_stories.padded
    },
    trigger: h(Button/* Button */.z, null, "right-bottom"),
    content: TextBlock
  })), h(Cell, null, h(Popup/* Popup */.G, {
    direction: "right",
    contentProps: {
      className: Popup_Popup_stories.padded
    },
    trigger: h(Button/* Button */.z, null, "right"),
    content: TextBlock
  }))), h(Cell, null, h(Cell, {
    justify: "end"
  }, h(Popup/* Popup */.G, {
    direction: "bottom-left",
    contentProps: {
      className: Popup_Popup_stories.padded
    },
    trigger: h(Button/* Button */.z, null, "bottom-left"),
    content: TextBlock
  })), h(Cell, {
    justify: "start"
  }, h(Popup/* Popup */.G, {
    direction: "bottom-right",
    contentProps: {
      className: Popup_Popup_stories.padded
    },
    trigger: h(Button/* Button */.z, null, "bottom-right"),
    content: TextBlock
  }))), h(Cell, null, h(Popup/* Popup */.G, {
    direction: "bottom",
    contentProps: {
      className: Popup_Popup_stories.padded
    },
    trigger: h(Button/* Button */.z, null, "bottom"),
    content: TextBlock
  })))), h(Container/* Container */.W, {
    size: "l",
    vertical: true
  }, h("h2", null, "autoClose"), h(Container/* Container */.W, {
    centered: true
  }, h("div", null, h(Popup/* Popup */.G, {
    autoClose: true,
    direction: "bottom-left",
    trigger: h(Button/* Button */.z, null, "click me"),
    content: h(Button/* Button */.z, null, "click to close")
  })))), h(Container/* Container */.W, {
    size: "l",
    vertical: true
  }, h("h2", null, "Inline"), h(Container/* Container */.W, {
    vertical: true,
    fullHeight: true
  }, h("div", {
    style: {
      maxWidth: 200
    }
  }, h(Popup/* Popup */.G, {
    inline: true,
    contentProps: {
      className: Popup_Popup_stories.padded
    },
    direction: "bottom-right",
    trigger: h(Button/* Button */.z, null, "click me"),
    content: TextBlock
  })), "some other content...")), h(Container/* Container */.W, {
    size: "l",
    vertical: true
  }, h("h2", null, "Nested"), h(Container/* Container */.W, {
    centered: true
  }, h(helpers/* State */.ZM, {
    initial: {
      isOpenLv1: false,
      isOpenLv2: false
    }
  }, function (state) {
    return h(Popup/* Popup */.G, {
      direction: "bottom-left",
      isOpen: state.isOpenLv1,
      trigger: h(Button/* Button */.z, {
        onClick: function onClick() {
          return state.isOpenLv1 = !state.isOpenLv1;
        }
      }, "click me"),
      content: h(Popup/* Popup */.G, {
        direction: "right-bottom",
        contentProps: {
          className: Popup_Popup_stories.padded
        },
        outlined: true,
        isOpen: state.isOpenLv2,
        trigger: h(Button/* Button */.z, {
          variant: "clear",
          onClick: function onClick() {
            return state.isOpenLv2 = !state.isOpenLv2;
          }
        }, "we need to go deeper"),
        content: TextBlock
      })
    });
  }))), h(Container/* Container */.W, {
    size: "l",
    vertical: true
  }, h("h2", null, "Controllable"), h(helpers/* State */.ZM, {
    initial: {
      isOpen: false
    }
  }, function (state) {
    return h(Container/* Container */.W, {
      size: "l",
      centered: true,
      style: {
        minHeight: 300
      }
    }, h(Popup/* Popup */.G, {
      direction: "bottom-left",
      outlined: true,
      controllable: true,
      isOpen: state.isOpen,
      trigger: h(Icon/* Icon */.J, {
        size: "xl",
        type: "close"
      }),
      content: h("div", {
        className: classnames_default()(Popup_Popup_stories.minWidth, Popup_Popup_stories.padded)
      }, "This popup close only when you click on button again.")
    }), "\xA0\u2013\u2013\u2013\u2013\u2013\u2013\xA0", h(Button/* Button */.z, {
      onClick: function onClick() {
        return state.isOpen = !state.isOpen;
      }
    }, "toggle popup state"));
  })));
});

/***/ }),

/***/ "./node_modules/css-modules-typescript-loader/index.js!./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[3]!./node_modules/stylus-loader/dist/cjs.js!./src/components/Popup/Popup.stories.styl":
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
___CSS_LOADER_EXPORT___.push([module.id, "h2{padding:20px 0}.Popup-stories__cell___tZ_Zj{display:flex;justify-content:center;margin:2px;min-width:100px}.Popup-stories__row___Zbz2B{flex-direction:row}.Popup-stories__column___YXsmy{flex-direction:column}.Popup-stories__align-start___H6cn6{align-items:flex-start}.Popup-stories__align-end___lWXbT{align-items:flex-end}.Popup-stories__align-center____SPPP{align-items:center}.Popup-stories__justify-start___aH9lK{justify-content:flex-start}.Popup-stories__justify-end___HxvZS{justify-content:flex-end}.Popup-stories__padded___N8GYM{padding:4px}.Popup-stories__minWidth___LvPlC{min-width:100px}", ""]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"cell": "Popup-stories__cell___tZ_Zj",
	"row": "Popup-stories__row___Zbz2B",
	"column": "Popup-stories__column___YXsmy",
	"align-start": "Popup-stories__align-start___H6cn6",
	"align-end": "Popup-stories__align-end___lWXbT",
	"align-center": "Popup-stories__align-center____SPPP",
	"justify-start": "Popup-stories__justify-start___aH9lK",
	"justify-end": "Popup-stories__justify-end___HxvZS",
	"padded": "Popup-stories__padded___N8GYM",
	"minWidth": "Popup-stories__minWidth___LvPlC"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ })

}]);