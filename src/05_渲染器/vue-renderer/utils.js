// 特殊的props只能通过setAttribute设置
export function shouldSetAsProps(el, key, value) {
  if (key === "form" && el.tagName === "INPUT") return false
  return key in el
}

// 卸载
export function unmount(vnode) {
  const parent = vnode.el.parentNode
  if (parent) {
    parent.removeChild(vnode.el)
  }
}

// 转换className
export function normalizeClass(className) {
  if (typeof className === "string") {
    return className
  } else if (Array.isArray(className)) {
    const classList = []
    className.forEach((cl) => {
      classList.push(cl)
    })
    return classList.join(" ")
  } else {
    const classList = []
    for (const key in className) {
      if (className[key]) {
        classList.push(key)
      }
    }
    return classList.join(" ")
  }
}

// 解析组件的props和attrs
export function resolveProps(options, propsData) {
  const props = {}
  const attrs = {}
  // 遍历为组件传递的 props 数据
  for (const key in propsData) {
    if (key in options) {
      // 如果为组件传递的 props 数据在组件自身的 props 选项中有定义，则将其视为合法的 props
      props[key] = propsData[key]
    } else {
      // 否则将其作为 attrs
      attrs[key] = propsData[key]
    }
  }

  // 最后返回 props 与 attrs 数据
  return [props, attrs]
}

// 新旧props是否发生改变
export function hasPropsChanged(prevProps, nextProps) {
  const nextKeys = Object.keys(nextProps)
  // 如果新旧 props 的数量变了，则说明有变化
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true
  }
  // 只有
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i]
    // 有不相等的 props，则说明有变化
    if (nextProps[key] !== prevProps[key]) return true
  }
  return false
}
