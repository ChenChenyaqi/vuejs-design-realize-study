// 计算属性，我们不希望它立即执行，而是希望它在需要的时候才执行
effect(
  () => {
    console.log(obj.foo)
  },
  {
    // 指定为lazy
    lazy: true,
  }
)

const effect = (fn, options) => {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    effectStack.push(effectFn)
    // 将fn的结果存在fn中
    const res = fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
    // 返回res
    return res
  }

  effectFn.options = options
  effectFn.deps = []
  // 只有非lazy时，才立即执行
  if (!options.lazy) {
    effectFn()
  }
  // 将副作用函数作为返回值返回
  return effectFn
}

// 现在可以拿到effectFn
const effectFn = effect(
  () => {
    return obj.foo + obj.bar
  },
  {
    // 指定为lazy
    lazy: true,
  }
)

// 拿到其返回的值
const value = effectFn()

// 手写computed
function computed(getter) {
  // value 用来缓存上次计算的值
  let value
  // dirty 标志是否需要重新计算，为 true 则意味着“脏”，需要计算
  let dirty = true
  // 把getter作为副作用函数，创建一个lazy的effect
  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      if(!dirty) {
        dirty = true
        // 当计算属性依赖的响应式数据变化时，手动调用 trigger 函数触发响应
        trigger(obj, 'value')
      }
    },
  })

  const obj = {
    // 当读取 value 时才执行 effectFn
    get value() {
      if (dirty) {
        value = effectFn()
        dirty = false
      }
      // 当读取value时，手动调用 track 函数进行追踪
      track(obj, 'value')
      return value
    },
  }
  return obj
}
