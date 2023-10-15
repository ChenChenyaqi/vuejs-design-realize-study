/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/05_渲染器/main.js":
/*!****************************!*\
  !*** ./src/05_渲染器/main.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _vue_renderer_renderer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vue-renderer/renderer */ \"./src/05_渲染器/vue-renderer/renderer.js\");\n\nvar vnode = {\n  type: \"div\",\n  props: {\n    id: \"foo\"\n  },\n  children: [{\n    type: \"p\",\n    children: \"hello\"\n  }, {\n    type: \"button\",\n    props: {\n      disabled: false,\n      // false / ''\n      onClick: function onClick() {\n        console.log(\"click\");\n        (0,_vue_renderer_renderer__WEBPACK_IMPORTED_MODULE_0__.render)(newNode, document.getElementById(\"app\"));\n      }\n    },\n    children: \"click me!\"\n  }]\n};\nvar newNode = {\n  type: \"div\",\n  props: {\n    id: \"foo\"\n  },\n  children: [{\n    type: \"div\",\n    children: \"hello hello\"\n  }, {\n    type: \"button\",\n    props: {\n      disabled: false,\n      // false / ''\n      onClick: function onClick() {\n        console.log(\"click Me\");\n      }\n    },\n    children: \"click me!\"\n  }]\n};\n(0,_vue_renderer_renderer__WEBPACK_IMPORTED_MODULE_0__.render)(vnode, document.getElementById(\"app\"));\n\n//# sourceURL=webpack:///./src/05_%E6%B8%B2%E6%9F%93%E5%99%A8/main.js?");

/***/ }),

/***/ "./src/05_渲染器/vue-renderer/renderer.js":
/*!*********************************************!*\
  !*** ./src/05_渲染器/vue-renderer/renderer.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   render: () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ \"./src/05_渲染器/vue-renderer/utils.js\");\nfunction _typeof(o) { \"@babel/helpers - typeof\"; return _typeof = \"function\" == typeof Symbol && \"symbol\" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && \"function\" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? \"symbol\" : typeof o; }, _typeof(o); }\n\n\n// 文本节点的type标识\nvar Text = Symbol();\nfunction createRenderer(config) {\n  var createElement = config.createElement,\n    insert = config.insert,\n    setElementText = config.setElementText,\n    patchProps = config.patchProps,\n    setText = config.setText,\n    createText = config.createText;\n\n  /**\r\n   * 将虚拟dom vnode渲染到container容器上去\r\n   * @param {object} vnode 虚拟dom\r\n   * @param {HTMLElement} container 容器\r\n   */\n  function render(vnode, container) {\n    if (vnode) {\n      // 新vnode存在，则diff\n      patch(container._vnode, vnode, container);\n    } else {\n      if (container._vnode) {\n        // 卸载操作\n        (0,_utils__WEBPACK_IMPORTED_MODULE_0__.unmount)(container._vnode);\n      }\n    }\n    // 保存旧vnode\n    container._vnode = vnode;\n  }\n\n  /**\r\n   * 打补丁 diff\r\n   * @param {object} oldNode\r\n   * @param {object} newNode\r\n   * @param {HTMLElement} container\r\n   */\n  function patch(oldNode, newNode, container) {\n    // 如果新旧vnode类型不同，则当做卸载旧vnode\n    if (oldNode && oldNode.type !== newNode.type) {\n      (0,_utils__WEBPACK_IMPORTED_MODULE_0__.unmount)(oldNode);\n      oldNode = null;\n    }\n    var type = newNode.type;\n    if (typeof type === \"string\") {\n      if (!oldNode) {\n        // 挂载操作\n        mountElement(newNode, container);\n      } else {\n        // 更新普通dom元素操作\n        patchElement(oldNode, newNode);\n      }\n    } else if (type === Text) {\n      // 处理文本节点\n      if (!oldNode) {\n        var el = newNode.el = createText(newNode.children);\n        insert(el, container);\n      } else {\n        var _el = newNode.el = oldNode.el;\n        if (newNode.children !== oldNode.children) {\n          setText(_el, newNode.children);\n        }\n      }\n    } else if (_typeof(type) === \"object\") {\n      // vnode是组件\n    } else if (typeof type === \"xxx\") {\n      // 处理其它类型的vnode\n    }\n  }\n\n  /**\r\n   * 挂载vnode到container上\r\n   * @param {object} vnode\r\n   * @param {HTMLElement} container\r\n   */\n  function mountElement(vnode, container) {\n    // vnode.el 引用真实dom元素\n    vnode.el = createElement(vnode.type);\n    var el = vnode.el;\n\n    // 处理children\n    if (typeof vnode.children === \"string\") {\n      // children是文本\n      setElementText(el, vnode.children);\n    } else if (Array.isArray(vnode.children)) {\n      // children是数组\n      vnode.children.forEach(function (child) {\n        patch(null, child, el);\n      });\n    }\n\n    // 处理props\n    if (vnode.props) {\n      for (var key in vnode.props) {\n        patchProps(el, key, null, vnode.props[key]);\n      }\n    }\n    insert(el, container);\n  }\n\n  /**\r\n   * 更新普通dom元素操作\r\n   * @param {object} oldNode\r\n   * @param {object} newNode\r\n   */\n  function patchElement(oldNode, newNode) {\n    var el = newNode.el = oldNode.el;\n    var oldProps = oldNode.props;\n    var newProps = newNode.props;\n    // 更新props\n    for (var key in newProps) {\n      if (newProps[key] !== oldProps[key]) {\n        patchProps(el, key, oldProps[key], newProps[key]);\n      }\n    }\n    for (var _key in oldProps) {\n      if (!_key in newProps) {\n        patchProps(el, _key, oldProps[_key], null);\n      }\n    }\n    // 更新children\n    patchChildren(oldNode, newNode, el);\n  }\n\n  /**\r\n   * 更新children\r\n   * @param {object} oldNode\r\n   * @param {object} newNode\r\n   * @param {HTMLElement} container\r\n   */\n  function patchChildren(oldNode, newNode, container) {\n    // 当新vnode的children是文本\n    if (typeof newNode.children === \"string\") {\n      // 只有旧vnode的children是一组子节点，才需要逐个卸载\n      if (Array.isArray(oldNode.children)) {\n        oldNode.children.forEach(function (c) {\n          return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.unmount)(c);\n        });\n      }\n      setElementText(container, newNode.children);\n    } else if (Array.isArray(newNode.children)) {\n      // 新vnode的children也是一组子节点\n      if (Array.isArray(oldNode.children)) {\n        // diff\n        patchKeyedChildren(oldNode, newNode, container);\n      } else {\n        setElementText(container, \"\");\n        newNode.children.forEach(function (c) {\n          return patch(null, c, container);\n        });\n      }\n    } else {\n      if (Array.isArray(oldNode.children)) {\n        oldNode.children.forEach(function (c) {\n          return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.unmount)(c);\n        });\n      } else if (typeof oldNode.children === \"string\") {\n        setElementText(container, \"\");\n      }\n    }\n  }\n\n  /**\r\n   * 双端diff算法处理children\r\n   * @param {object} oldNode\r\n   * @param {object} newNode\r\n   * @param {HTMLElement} container\r\n   */\n  function patchKeyedChildren(oldNode, newNode, container) {\n    var oldChildren = oldNode.children;\n    var newChildren = newNode.children;\n    // 四个索引值\n    var oldStartIndex = 0;\n    var oldEndIndex = oldChildren.length - 1;\n    var newStartIndex = 0;\n    var newEndIndex = newChildren.length - 1;\n    // 四个索引指向的vnode节点\n    var oldStartVNode = oldChildren[oldStartIndex];\n    var oldEndVNode = oldChildren[oldEndIndex];\n    var newStartVNode = newChildren[newStartIndex];\n    var newEndVNode = newChildren[newEndIndex];\n    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {\n      if (!oldStartVNode) {\n        oldStartVNode = oldChildren[++oldStartIndex];\n      } else if (!oldEndVNode) {\n        oldEndVNode = oldChildren[--oldEndIndex];\n      } else if (oldStartVNode.key === newStartVNode.key) {\n        patch(oldStartVNode, newStartVNode, container);\n        oldStartVNode = oldChildren[++oldStartIndex];\n        newStartVNode = newChildren[++newStartIndex];\n      } else if (oldEndVNode.key === newEndVNode.key) {\n        patch(oldEndVNode, newEndVNode, container);\n        oldEndVNode = oldChildren[--oldEndIndex];\n        newEndVNode = newChildren[--newEndIndex];\n      } else if (oldStartVNode.key === newEndVNode.key) {\n        patch(oldStartVNode, newEndVNode, container);\n        insert(oldStartVNode.el, container, oldEndVNode.el.nextSibling);\n        oldStartVNode = oldChildren[++oldStartIndex];\n        newEndVNode = newChildren[--newEndIndex];\n      } else if (oldEndVNode.key === newStartVNode.key) {\n        patch(oldEndVNode, newStartVNode, container);\n        insert(oldEndVNode.el, container, oldStartVNode.el);\n        oldEndVNode = oldChildren[--oldEndIndex];\n        newStartVNode = newChildren[++newStartIndex];\n      } else {\n        // 处理非理性的情况\n        var indexInOld = oldChildren.findIndex(function (node) {\n          return node.key === newStartVNode.key;\n        });\n        if (indexInOld > 0) {\n          // 能在oldChildren中找到newStarVNode，说明可以复用，移动旧节点\n          var vnodeToMove = oldChildren[indexInOld];\n          patch(vnodeToMove, newStartVNode, container);\n          insert(vnodeToMove.el, container, oldStartVNode.el);\n          oldChildren[indexInOld] = undefined;\n        } else {\n          // 找不到，说明是新的节点，进行挂载\n          patch(null, newStartVNode, container, oldStartVNode.el);\n        }\n        newStartVNode = newChildren[++newStartIndex];\n      }\n    }\n\n    // 检查是否还有遗留的节点\n    if (oldEndIndex < oldStartIndex && newStartIndex <= newEndIndex) {\n      // 有新增的节点要处理\n      for (var i = newStartIndex; i <= newEndIndex; i++) {\n        patch(null, newChildren[i], container, oldStartVNode.el);\n      }\n    } else if (newEndIndex < newStartIndex && oldStartIndex <= oldEndIndex) {\n      // 有卸载的节点要处理\n      for (var _i = oldStartIndex; _i <= oldEndIndex; _i++) {\n        (0,_utils__WEBPACK_IMPORTED_MODULE_0__.unmount)(oldChildren[_i]);\n      }\n    }\n  }\n  return render;\n}\nvar render = createRenderer({\n  createElement: function createElement(tag) {\n    return document.createElement(tag);\n  },\n  setElementText: function setElementText(el, text) {\n    el.textContent = text;\n  },\n  insert: function insert(el, parent) {\n    var anchor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;\n    parent.insertBefore(el, anchor);\n  },\n  /** 创建一个文本节点 */createText: function createText(text) {\n    return document.createTextNode(text);\n  },\n  /** 设置文本节点的值 */setText: function setText(el, text) {\n    el.nodeValue = text;\n  },\n  /**\r\n   *\r\n   * @param {HTMLElement} el\r\n   * @param {string} key\r\n   * @param {object} preValue\r\n   * @param {object} nextValue\r\n   */\n  patchProps: function patchProps(el, key, preValue, nextValue) {\n    // 处理事件\n    if (/^on/.test(key)) {\n      var name = key.slice(2).toLowerCase();\n      // 该元素身上的所有事件回调\n      var invokers = el._vei || (el._vei = {});\n      var invoker = invokers[key];\n      if (nextValue) {\n        if (!invoker) {\n          invoker = el._vei[key] = function (e) {\n            // e.timeStamp 事件发生的时间、\n            // 如果事件发生的时间早于事件绑定到dom元素上的时间，则不执行事件处理函数\n            if (e.timeStamp < invoker.attachedTime) return;\n            if (Array.isArray(invoker.value)) {\n              invoker.value.forEach(function (fn) {\n                return fn(e);\n              });\n            } else {\n              invoker.value(e);\n            }\n          };\n          invoker.value = nextValue;\n          // 添加事件绑定时间\n          invoker.attachedTime = performance.now();\n          el.addEventListener(name, invoker);\n        } else {\n          invoker.value = nextValue;\n        }\n      } else if (invoker) {\n        el.removeEventListener(name, invoker);\n      }\n    } else if (key === \"class\") {\n      // 优先处理class\n      el.className = nextValue || \"\";\n    } else if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.shouldSetAsProps)(el, key, nextValue)) {\n      // 优先设置dom property\n      var type = _typeof(el[key]);\n      if (type === \"boolean\" && nextValue === \"\") {\n        el[key] = true;\n      } else {\n        el[key] = nextValue;\n      }\n    } else {\n      el.setAttribute(key, nextValue);\n    }\n  }\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createRenderer);\n\n\n//# sourceURL=webpack:///./src/05_%E6%B8%B2%E6%9F%93%E5%99%A8/vue-renderer/renderer.js?");

/***/ }),

/***/ "./src/05_渲染器/vue-renderer/utils.js":
/*!******************************************!*\
  !*** ./src/05_渲染器/vue-renderer/utils.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   normalizeClass: () => (/* binding */ normalizeClass),\n/* harmony export */   shouldSetAsProps: () => (/* binding */ shouldSetAsProps),\n/* harmony export */   unmount: () => (/* binding */ unmount)\n/* harmony export */ });\n// 特殊的props只能通过setAttribute设置\nfunction shouldSetAsProps(el, key, value) {\n  if (key === \"form\" && el.tagName === \"INPUT\") return false;\n  return key in el;\n}\n\n// 卸载\nfunction unmount(vnode) {\n  var parent = vnode.el.parentNode;\n  if (parent) {\n    parent.removeChild(vnode.el);\n  }\n}\n\n// 转换className\nfunction normalizeClass(className) {\n  if (typeof className === \"string\") {\n    return className;\n  } else if (Array.isArray(className)) {\n    var classList = [];\n    className.forEach(function (cl) {\n      classList.push(cl);\n    });\n    return classList.join(\" \");\n  } else {\n    var _classList = [];\n    for (var key in className) {\n      if (className[key]) {\n        _classList.push(key);\n      }\n    }\n    return _classList.join(\" \");\n  }\n}\n\n//# sourceURL=webpack:///./src/05_%E6%B8%B2%E6%9F%93%E5%99%A8/vue-renderer/utils.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/05_渲染器/main.js");
/******/ 	
/******/ })()
;