"use strict";

require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.regexp.test.js");
// 组件就是一组 DOM 元素的封装
// 这组 DOM 元素就是组件要渲染的内容，因此我们可以定义一个函数来代表组件，而函数的返回值就代表组件要渲染的内容

const MyComponent = function MyComponent() {
  return {
    tag: 'div',
    props: {
      onClick: () => alert('hello')
    },
    children: 'click me'
  };
};

// 那么虚拟DOM就是：
const vNode = {
  tag: 'div',
  props: {
    onClick: () => alert('hi')
  },
  children: [{
    tag: MyComponent
  }, {
    tag: 'span',
    children: 'haha'
  }]
};

// 渲染器需要改一下：
function renderer(vNode, container) {
  if (typeof vNode.tag === 'string') {
    mountElement(vNode, container);
  } else if (typeof vNode.tag === 'function') {
    mountComponent(vNode, container);
  }
}

// 渲染普通标签元素
function mountElement(vNode, container) {
  const el = document.createElement(vNode.tag);

  // 处理属性、事件
  for (const key in vNode.props) {
    if (/^on/.test(key)) {
      el.addEventListener(key.substring(2).toLowerCase(), vNode.props[key]);
    } else {
      el.setAttribute(key, vNode.props[key]);
    }
  }

  // 处理children
  if (typeof vNode.children === 'string') {
    el.appendChild(document.createTextNode(vNode.children));
  } else if (Array.isArray(vNode.children)) {
    vNode.children.forEach(child => renderer(child, el));
  }

  // 挂载
  container.appendChild(el);
}

// 渲染组件
function mountComponent(vNode, container) {
  // 调用组件函数，获取虚拟DOM
  const subtree = vNode.tag();
  // 递归调用 renderer 渲染 subtree
  renderer(subtree, container);
}