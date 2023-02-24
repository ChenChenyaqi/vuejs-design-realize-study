// effect嵌套
effect(function effectFn1() {
    effect(function effectFn2() {
        /* ... */
    })
    /* ... */
})

// 比如vue中嵌套组件就存在effect嵌套
const Bar = {
    render() {/* ... */ }
}
const Foo = { // Foo组件渲染了Bar组件
    render() {
        return <Bar />
    }
}
// 此时就发生了嵌套，相当于
effect(() => {
    Foo.render()
    // 嵌套
    effect(() => {
        Bar.render()
    })
})


// 嵌套effect会存在一些问题
// 比如：
const data = { foo: true, bar: true }
const dataProxy = new Proxy(data, {})

let temp1, temp2;

effect(function effectFn1() {
    console.log('effectFn1 执行');

    effect(function effectFn2() {
        console.log('effectFn2 执行');
        temp2 = obj.bar
    })
    temp1 = obj.foo
})

// 结果会是：
/* 
    effectFn1 执行 √
    effectFn2 执行 √
    effectFn2 执行 ×  原因是 activeEffect会被内层的effectFn覆盖掉，从而丢失了外层的effectFn
*/

// 解决办法：effect栈
let activeEffect;

const effectStack = [] // 栈

function effect(fn) {
    const effectFn = () => {
        cleanup(effectFn)
        activeEffect = effectFn
        effectStack.push(effectFn)
        fn()
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
    }
    effectFn.deps = []
    effectFn()
}