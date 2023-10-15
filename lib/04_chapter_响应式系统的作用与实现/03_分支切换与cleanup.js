"use strict";

require("core-js/modules/web.dom-collections.iterator.js");
// 上节代码同样存在缺陷，同一个副作用函数，可能同时挂在 key1、key2...下
// 比如这种情况
const _data = {
  ok: true,
  text: 'hello world'
};
const _dataProxy = new Proxy(_data, {/* ... */});
let _activeEffect;
function _effect(fn) {
  _activeEffect = fn;
  fn();
}
_effect(() => {
  // 这是一个三元表达式，根据 ok 的不同会执行不同的代码分支
  // 当字段 obj.ok 的值发生变化时，代码执行的分支会跟着变化，这就是所谓的分支切换。

  // 分支切换会产生遗留的副作用函数，比如：
  // ok的初始值为true，第一次会读取text的值，但会触发ok和text两个属性的读操作
  // 那么，副作用函数会与ok 和 text建立联系
  // 当 ok 被改为false时，此时不会执行 text的读操作，所以不应该在于text建立联系
  // 但是我们目前做不到，这个联系依旧建立，这样会导致不必要的更新
  document.body.innerText = _dataProxy.ok ? _dataProxy.text : 'not';
});

// 解决此问题的思路很简单：每次执行完副作用函数后，我们就把它从所有与之关联的依赖集合中删除

// 重新设计 effect函数
let activeEffect;
function effect(fn) {
  const effectFn = () => {
    // 调用 cleanup 函数完成清除工作
    cleanup(effectFn);
    // 当 effectFn 执行时，将其设置为当前激活的副作用函数
    activeEffect = effectFn;
    fn();
  };
  // activeEffect.deps 用来存储所有与该副作用函数相关联的依赖集合
  effectFn.deps = [];
  // 执行副作用函数
  effectFn();
}
function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    // 某些key下的Set集合，里面保存与这个key建立联系的副作用函数们
    const deps = effectFn.deps[i];
    // 把 effectFn 从依赖集合中移除
    deps.delete(effectFn);
  }
  // 重置 effectFn.deps 数组
  effectFn.deps = [];
}

// 在track函数中对effectFn.deps进行收集
function track(target, key) {
  if (!activeEffect) return;
  let depsMap = bucket.get(target);
  if (!depsMap) {
    bucket.set(target, depsMap = new Map());
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, deps = new Set());
  }
  // 把当前激活的副作用函数添加到依赖集合deps中
  deps.add(activeEffect);
  // deps就是一个与当前副作用函数存在联系的依赖集合
  // 将其添加到 activeEffect.deps 数组中
  activeEffect.deps.push(deps);
}

// 为了解决无限循环，需要对trigger函数做出改变
function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  const effectsToRun = new Set(effects); // 新增
  effectsToRun.forEach(effectFn => effectFn()); // 新增
  // effects && effects.forEach(effectFn => effectFn()) 移除
}