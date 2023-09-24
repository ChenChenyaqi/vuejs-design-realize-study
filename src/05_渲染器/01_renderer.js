// import { unmount, normalizeClass, shouldSetAsProps } from "./utils"

function createRenderer(config) {
  const { createElement, insert, setElementText, patchProps } = config

  /**
   * 将虚拟dom vnode渲染到container容器上去
   * @param {object} vnode 虚拟dom
   * @param {HTMLElement} container 容器
   */
  function render(vnode, container) {
    if (vnode) {
      // 新vnode存在，则diff
      patch(container._vnode, vnode, container)
    } else {
      if (container._vnode) {
        // 卸载操作
        unmount(container._vnode)
      }
    }
    // 保存旧vnode
    container._vnode = vnode
  }

  /**
   * 打补丁 diff
   * @param {object} oldNode
   * @param {object} newNode
   * @param {HTMLElement} container
   */
  function patch(oldNode, newNode, container) {
    // 如果新旧vnode类型不同，则当做卸载旧vnode
    if (oldNode && oldNode.type !== newNode.type) {
      unmount(oldNode)
      oldNode = null
    }
    const { type } = newNode
    if (typeof type === "string") {
      if (!oldNode) {
        // 挂载操作
        mountElement(newNode, container)
      } else {
        // 更新普通dom元素操作
        patchElement(oldNode, newNode)
      }
    } else if (typeof type === "object") {
      // vnode是组件
    } else if (typeof type === "xxx") {
      // 处理其它类型的vnode
    }
  }

  /**
   * 挂载vnode到container上
   * @param {object} vnode
   * @param {HTMLElement} container
   */
  function mountElement(vnode, container) {
    // vnode.el 引用真实dom元素
    vnode.el = createElement(vnode.type)
    const el = vnode.el

    // 处理children
    if (typeof vnode.children === "string") {
      // children是文本
      setElementText(el, vnode.children)
    } else if (Array.isArray(vnode.children)) {
      // children是数组
      vnode.children.forEach((child) => {
        patch(null, child, el)
      })
    }

    // 处理props
    if (vnode.props) {
      for (const key in vnode.props) {
        patchProps(el, key, null, vnode.props[key])
      }
    }
    insert(el, container)
  }

  /**
   * 更新普通dom元素操作
   * @param {object} oldNode
   * @param {object} newNode
   */
  function patchElement(oldNode, newNode) {
    const el = (newNode.el = oldNode.el)
    const oldProps = oldNode.props
    const newProps = newNode.props
    // 更新props
    for (const key in newProps) {
      if (newProps[key] !== oldProps[key]) {
        patchProps(el, key, oldProps[key], newProps[key])
      }
    }
    for (const key in oldProps) {
      if (!key in newProps) {
        patchProps(el, key, oldProps[key], null)
      }
    }
    // 更新children
    patchChildren(oldNode, newNode, el)
  }

  /**
   * 更新children
   * @param {object} oldNode
   * @param {object} newNode
   * @param {HTMLElement} container
   */
  function patchChildren(oldNode, newNode, container) {
    // 当新vnode的children是文本
    if (typeof newNode.children === "string") {
      // 只有旧vnode的children是一组子节点，才需要逐个卸载
      if (Array.isArray(oldNode.children)) {
        oldNode.children.forEach((c) => unmount(c))
      }
      setElementText(container, newNode.children)
    } else if (Array.isArray(newNode.children)) {
      // 新vnode的children也是一组子节点
      if (Array.isArray(oldNode.children)) {
        // diff
        // 将旧的一组子节点全部卸载
        oldNode.children.forEach((c) => unmount(c))
        newNode.children.forEach((c) => patch(null, c, container))
      } else {
        setElementText(container, "")
        newNode.children.forEach((c) => patch(null, c, container))
      }
    } else {
      if (Array.isArray(oldNode.children)) {
        oldNode.children.forEach((c) => unmount(c))
      } else if (typeof oldNode.children === "string") {
        setElementText(container, "")
      }
    }
  }

  return render
}

const render = createRenderer({
  createElement(tag) {
    return document.createElement(tag)
  },
  setElementText(el, text) {
    el.textContent = text
  },
  insert(el, parent, anchor = null) {
    parent.insertBefore(el, anchor)
  },
  /**
   *
   * @param {HTMLElement} el
   * @param {string} key
   * @param {object} preValue
   * @param {object} nextValue
   */
  patchProps(el, key, preValue, nextValue) {
    // 处理事件
    if (/^on/.test(key)) {
      const name = key.slice(2).toLowerCase()
      // 该元素身上的所有事件回调
      const invokers = el._vei || (el._vei = {})
      let invoker = invokers[key]
      if (nextValue) {
        if (!invoker) {
          invoker = el._vei[key] = (e) => {
            // e.timeStamp 事件发生的时间、
            // 如果事件发生的时间早于事件绑定到dom元素上的时间，则不执行事件处理函数
            if (e.timeStamp < invoker.attachedTime) return
            if (Array.isArray(invoker.value)) {
              invoker.value.forEach((fn) => fn(e))
            } else {
              invoker.value(e)
            }
          }
          invoker.value = nextValue
          // 添加事件绑定时间
          invoker.attachedTime = performance.now()
          el.addEventListener(name, invoker)
        } else {
          invoker.value = nextValue
        }
      } else if (invoker) {
        el.removeEventListener(name, invoker)
      }
    } else if (key === "class") {
      // 优先处理class
      el.className = nextValue || ""
    } else if (shouldSetAsProps(el, key, nextValue)) {
      // 优先设置dom property
      const type = typeof el[key]
      if (type === "boolean" && nextValue === "") {
        el[key] = true
      } else {
        el[key] = nextValue
      }
    } else {
      el.setAttribute(key, nextValue)
    }
  },
})

const vnode = {
  type: "div",
  props: {
    id: "foo",
  },
  children: [
    {
      type: "p",
      children: "hello",
    },
    {
      type: "button",
      props: {
        disabled: false, // false / ''
        onClick: () => {
          console.log("click")
          render(newNode, document.getElementById("app"))
        },
      },
      children: "click me!",
    },
  ],
}

const newNode = {
  type: "div",
  props: {
    id: "foo",
  },
  children: [
    {
      type: "div",
      children: "hello hello",
    },
    {
      type: "button",
      props: {
        disabled: false, // false / ''
        onClick: () => {
          console.log("click Me")
        },
      },
      children: "click me!",
    },
  ],
}

render(vnode, document.getElementById("app"))

// 特殊的props只能通过setAttribute设置
function shouldSetAsProps(el, key, value) {
  if (key === "form" && el.tagName === "INPUT") return false
  return key in el
}

// 卸载
function unmount(vnode) {
  const parent = vnode.el.parentNode
  if (parent) {
    parent.removeChild(vnode.el)
  }
}

// 转换className
function normalizeClass(className) {
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
