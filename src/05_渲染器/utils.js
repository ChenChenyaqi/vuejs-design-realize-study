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
