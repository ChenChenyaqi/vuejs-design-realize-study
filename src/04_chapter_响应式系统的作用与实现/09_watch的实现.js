// source 是响应式数据
// callback 是回调函数
function watch(source, callback) {
  let getter
  // 如果source是函数，则说明用户传递的是 getter，所以直接把source 赋值给getter
  if(typeof source === 'function') {
    // getter函数里用到了哪些响应式数据，则当那些响应式数据变化时，才会执行callback
    getter = source
  } else {
    // 触发读取操作，从而建立联系
    getter = () => traverse(source)
  } 

  // 定义新值和旧值
  let oldValue, newValue

  const effectFn = effect(
    // 执行getter
    () => getter(),
    {
      lazy: true,
      scheduler() {
        newValue = effectFn()
        // 当数据变化时，调用callback
        callback(newValue, oldValue)
        oldValue = newValue
      },
    }
  )
}

function traverse(value, seen = new Set()) {
  // 如果要读取的数据是原始值，或者已经被读取过了，那么什么都不做
  if(typeof value !== 'object' || value === null || seen.has(value)){
    return
  }

  seen.add(value)
  // 暂时 不考虑 数组等其他结构
  // 假设value就是一个对象
  for (const k in value) {
    traverse(value[k], seen)
  }
  return value
}
