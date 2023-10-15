"use strict";

require("core-js/modules/web.dom-collections.iterator.js");
/* const obj = { text: 'hello world' }

function effect() {
    document.body.innerText = obj.text
}

obj.text = 'hello vue3' // 我们希望当obj发生变化时，effect会重新执行一次 */

// 如何实现响应式？
// 其实就是两个操作，读(get) 和 设置(set)

// 当读取字段text时，把副作用函数effect存到一个“桶”里
// 当设置字段text时，再把副作用函数effect从“桶”里取出来并执行

// ES2015之前 只能通过 Object.defineProperty实现
// ES2015+中，可以使用代理对象 Proxy 来实现

// 存储副作用函数的桶
const bucket = new Set();

// 原始数据
const data = {
  text: "hello world"
};

// 对原始数据的代理
const dataProxy = new Proxy(data, {
  // 拦截读操作
  get(target, key) {
    // 这里的target是原始数据data
    // 将副作用函数 effect 添加到存储副作用函数的桶中
    bucket.add(effect);
    // 返回属性值
    return target[key];
  },
  // 拦截设置操作
  set(target, key, newVal) {
    // 设置属性值
    target[key] = newVal;
    // 把副作用函数从桶中取出来并执行
    bucket.forEach(fn => fn());
    // 返回true代表设置操作成功
    return true;
  }
});

// 测试：(使用的时候，要用代理对象)
// 副作用函数
function effect() {
  document.body.innerText = dataProxy.text;
}

// 执行副作用函数，触发读取
effect();

// 1 秒后修改响应式数据
setTimeout(() => {
  dataProxy.text = 'hello vue3';
}, 1000);