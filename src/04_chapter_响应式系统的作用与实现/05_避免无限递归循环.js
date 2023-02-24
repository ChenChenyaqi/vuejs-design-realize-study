// 对属性的自增操作引起的栈溢出

const data = { foo: 1 }
const dataProxy = new Proxy(data, {})

effect(() => dataProxy.foo++)

/* 
    分析：
    dataProxy.foo++ 这个自增操作分开看
    1. dataProxy.foo 读取操作，它会引起track
        把副作用函数收集到桶中
    2. dataProxy.foo = dataProxy.foo + 1 设置操作
        触发trigger，把副作用函数从桶中取出并执行
        但是 副作用函数正在执行中，还没有执行完毕，就要开始下一次的执行
        所以会导致无限递归下去，栈溢出
*/

// 解决办法，在trigger发生时增加一个守卫条件：
// 如果trigger触发执行的副作用函数与当前正在执行的副作用函数相同，则不触发执行
function trigger(target, key) {
    const depsMap = bucket.get(target)
    if (!depsMap) return
    const effects = depsMap.get(key)

    const effectsToRun = new Set()
    effects && effects.forEach(effectFn => {
        // 如果trigger触发执行的副作用函数与当前正在执行的副作用函数相同，则不触发执行
        if (effectFn !== activeEffect) {
            effectsToRun.add(effectFn)
        }
    })
    effectsToRun.forEach(effectFn => effectFn())
}