// 总结前面的小节，写出一个完善的响应系统
const obj = { name: "Jon", age: 18 }

// 当前的副作用函数
let activeEffect = null;
// 副作用函数依赖 key: 原始对象， value：Map<key: 原始对象.key, value: Set<effectFn>>
const bucket = new WeakMap()
// 原始对象 - 代理对象
const reactiveMap = new Map()

// effect栈
const effectStack = []
// 注册副作用函数
// fn: 副作用函数，options: 支持调度器
const effect = (fn, options) => {
  const effectFn = () => {
    activeEffect = effectFn
    // 清除deps
    cleanup(effectFn)
    effectStack.push(effectFn)
    fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
  }
  effectFn.options = options
  effectFn.deps = []
  effectFn()
}

// 清除deps
function cleanup(effectFn) {
  for(let i = 0; i < effectFn.deps.length; i++) {
    const depsSet = effectFn.deps[i]
    depsSet.delete(effectFn)
  }
  effectFn.deps = []
}


function reactive(data) {
  let existProxyData = reactiveMap.get(data)
  if(existProxyData) {
    return existProxyData
  }
  existProxyData = createReactive(data)
  reactiveMap.set(data, existProxyData)
  return existProxyData
} 

function createReactive(data) {
  return new Proxy(data, {
    get(target, key) {
      // 跟踪依赖
      trick(target, key)
      return target[key]
    },
    set(target, key, newVal) {
      target[key] = newVal
      // 触发依赖
      trigger(target, key)
    }
  })
}

function trick(target, key) {
  if(!activeEffect) {
    return
  }
  let depsMap = bucket.get(target)
  if(!depsMap) {
    bucket.set(target, depsMap = new Map())
  }
  let depsSet = depsMap.get(key)
  if(!depsSet) {
    depsMap.set(key, depsSet = new Set())
  }
  depsSet.add(activeEffect)
  // 加入依赖
  activeEffect.deps.push(depsSet)
}

function trigger(target, key) {
  const depsMap = bucket.get(target)
  if(!depsMap) {
    return
  }
  const depsSet = depsMap.get(key)
  const effectFnToRun = new Set()
  depsSet && depsSet.forEach(effectFn => {
    // 防止自增操作引起的栈溢出
    if(activeEffect !== effectFn) {
      effectFnToRun.add(effectFn)
    }
  })
  effectFnToRun.forEach(effectFn => {
    // 如果有调度器，则交给调度器执行
    if(effectFn.options && effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn)
    } else {
      effectFn()
    }
  })
}


// ================测试==========================

const user = reactive({name: "Jon", age: 18})

effect(() => {
  const name = user.name
  const age = user.age
  console.log(`name: ${name}, age: ${age}`);
}, {
  scheduler: (fn) => {
    setTimeout(fn)
  }
})


user.name = 'Mike'
console.log('更改name 1');

user.age = 10
console.log('更改 age 1');


