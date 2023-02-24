// 一个需求
const data = { foo: 1 }
const obj = new Proxy(data, {/* */ })

effect(() => {
    console.log(obj.foo);
})

obj.foo++

console.log('结束了');

/* 
    输出结果：
    1
    2
    '结束了'
*/

// 现在需要调整输出顺序
/* 
    1
    '结束了'
    2
*/

// 可以在不改变源码的方式实现这个需求
// 需要响应系统支持 调度
function effect(fn, options = {}) {
    const effectFn = () => {
        cleanup(effectFn)
        activeEffect = effectFn
        effectStack.push(effectFn)
        fn()
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
    }
    // 将 options 挂载到 effectFn 上
    effectFn.options = options
    effectFn.deps = []
    effectFn()
}

// 同时在trigger中触发副作用函数时，将控制器交给用户
function trigger(target, key) {
    const depsMap = bucket.get(target)
    if (!depsMap) return
    const effects = depsMap.get(key)

    const effectsToRun = new Set()
    effects && effects.forEach(effectFn => {
        if (effectFn !== activeEffect) {
            effectsToRun.add(effectFn)
        }
    })
    effectsToRun.forEach(effectFn => {
        // 如果一个副作用函数存在调度器，则调用该调度器
        if (effectFn.options.scheduler) {
            effectFn.options.scheduler(effectFn)
        } else {
            effectFn()
        }
    })
}

// 现在就可以实现刚刚的需求了
effect(() => { console.log(obj.foo); }, {
    scheduler(fn) {
        setTimeout(fn)
    }
})