// 上节的代码存在缺陷
// 如：当副作用函数是匿名函数时，就不能很好的收集副作用函数到桶中

// 用一个全局变量存储被注册的副作用函数
let activeEffect;

// effect 函数用于注册副作用函数
function effect(fn) {
    // 当调用effect注册副作用函数时，将副作用函数fn赋值给activeEffect
    activeEffect = fn;
    // 执行副作用函数
    fn();
}

// 重新设计 存储副作用函数的桶
const bucket = new WeakMap()

// 原始数据
const data = { text: "hello world" }

// 对原始数据的代理
const dataProxy = new Proxy(data, {
    // 拦截读操作
    get(target, key) {  // 这里的target是原始数据data
        // 追踪
        track(target, key)

        return target[key]
    },

    // 拦截设置操作
    set(target, key, newVal) {
        // 更新属性值
        target[key] = newVal
        // 触发
        trigger(target, key)
    }
})

// 在 get 拦截内调用 track 函数追踪变化
function track(target, key) {
    if (!activeEffect) return target[key]
    /* 
        data - key - fn 树形结构的关系
        bucket存储了所有的这种关系
        每个原始对象都有一个 keys - fns 的关系表
        每个对象下的每个key里 都有某些副作用函数fn 挂在它下
    */
    let depsMap = bucket.get(target)
    if (!depsMap) {
        bucket.set(target, (depsMap = new Map()))
    }
    let deps = depsMap.get(key)
    if (!deps) {
        depsMap.set(key, (deps = new Set()))
    }
    deps.add(activeEffect)
}

// 在 set 拦截内调用trigger函数触发变化
function trigger(target, key) {
    // 获取这个target对象下的所有 对应表
    const depsMap = bucket.get(target)

    if (!depsMap) return

    // 获取挂在key下的所有副作用函数集合Set
    const effects = depsMap.get(key)
    // 执行副作用函数
    effects && effects.forEach(fn => fn())
}


// 使用：
effect(() => {
    document.body.innerHTML = dataProxy.text
})
effect(() => {
    console.log("重新执行了");
})

setTimeout(() => {
    dataProxy.text = "hhh"
}, 1000)
// 设置/读取任意属性，都会触发副作用函数执行，这是因为副作用函数没有与属性建立联系
setTimeout(() => {
    dataProxy.notExist = 'kkk'
}, 3000)


/* 
    WeakMap 和 Map区别

const map = new Map();
const weakmap = new WeakMap();

(function(){
    const foo = {foo: 1};
    const bar = {bar: 2};

    map.set(foo, 1);
    weakmap.set(bar, 2);
})()

WeakMap 对 key 是弱引用，不影响垃圾回收器的工
作。据这个特性可知，一旦 key 被垃圾回收器回收，那么对应的键和
值就访问不到了。所以 WeakMap 经常用于存储那些只有当 key 所引
用的对象存在时（没有被回收）才有价值的信息，例如上面的场景
中，如果 target 对象没有任何引用了，说明用户侧不再需要它了，
这时垃圾回收器会完成回收任务。
*/