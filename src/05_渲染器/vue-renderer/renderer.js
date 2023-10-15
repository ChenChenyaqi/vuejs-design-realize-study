import { unmount, normalizeClass, shouldSetAsProps } from "./utils"

// 文本节点的type标识
const Text = Symbol()

function createRenderer(config) {
  const {
    createElement,
    insert,
    setElementText,
    patchProps,
    setText,
    createText,
  } = config

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
    } else if (type === Text) {
      // 处理文本节点
      if (!oldNode) {
        const el = (newNode.el = createText(newNode.children))
        insert(el, container)
      } else {
        const el = (newNode.el = oldNode.el)
        if (newNode.children !== oldNode.children) {
          setText(el, newNode.children)
        }
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
        patchKeyedChildren(oldNode, newNode, container)
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

  /**
   * 双端diff算法处理children
   * @param {object} oldNode
   * @param {object} newNode
   * @param {HTMLElement} container
   */
  function patchKeyedChildren(oldNode, newNode, container) {
    const oldChildren = oldNode.children
    const newChildren = newNode.children
    // 四个索引值
    let oldStartIndex = 0
    let oldEndIndex = oldChildren.length - 1
    let newStartIndex = 0
    let newEndIndex = newChildren.length - 1
    // 四个索引指向的vnode节点
    let oldStartVNode = oldChildren[oldStartIndex]
    let oldEndVNode = oldChildren[oldEndIndex]
    let newStartVNode = newChildren[newStartIndex]
    let newEndVNode = newChildren[newEndIndex]

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
      if (!oldStartVNode) {
        oldStartVNode = oldChildren[++oldStartIndex]
      } else if (!oldEndVNode) {
        oldEndVNode = oldChildren[--oldEndIndex]
      } else if (oldStartVNode.key === newStartVNode.key) {
        patch(oldStartVNode, newStartVNode, container)
        oldStartVNode = oldChildren[++oldStartIndex]
        newStartVNode = newChildren[++newStartIndex]
      } else if (oldEndVNode.key === newEndVNode.key) {
        patch(oldEndVNode, newEndVNode, container)
        oldEndVNode = oldChildren[--oldEndIndex]
        newEndVNode = newChildren[--newEndIndex]
      } else if (oldStartVNode.key === newEndVNode.key) {
        patch(oldStartVNode, newEndVNode, container)
        insert(oldStartVNode.el, container, oldEndVNode.el.nextSibling)
        oldStartVNode = oldChildren[++oldStartIndex]
        newEndVNode = newChildren[--newEndIndex]
      } else if (oldEndVNode.key === newStartVNode.key) {
        patch(oldEndVNode, newStartVNode, container)
        insert(oldEndVNode.el, container, oldStartVNode.el)
        oldEndVNode = oldChildren[--oldEndIndex]
        newStartVNode = newChildren[++newStartIndex]
      } else {
        // 处理非理性的情况
        const indexInOld = oldChildren.findIndex(
          (node) => node.key === newStartVNode.key
        )

        if (indexInOld > 0) {
          // 能在oldChildren中找到newStarVNode，说明可以复用，移动旧节点
          const vnodeToMove = oldChildren[indexInOld]
          patch(vnodeToMove, newStartVNode, container)
          insert(vnodeToMove.el, container, oldStartVNode.el)
          oldChildren[indexInOld] = undefined
        } else {
          // 找不到，说明是新的节点，进行挂载
          patch(null, newStartVNode, container, oldStartVNode.el)
        }
        newStartVNode = newChildren[++newStartIndex]
      }
    }

    // 检查是否还有遗留的节点
    if (oldEndIndex < oldStartIndex && newStartIndex <= newEndIndex) {
      // 有新增的节点要处理
      for (let i = newStartIndex; i <= newEndIndex; i++) {
        patch(null, newChildren[i], container, oldStartVNode.el)
      }
    } else if (newEndIndex < newStartIndex && oldStartIndex <= oldEndIndex) {
      // 有卸载的节点要处理
      for (let i = oldStartIndex; i <= oldEndIndex; i++) {
        unmount(oldChildren[i])
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
  /** 创建一个文本节点 */
  createText(text) {
    return document.createTextNode(text)
  },
  /** 设置文本节点的值 */
  setText(el, text) {
    el.nodeValue = text
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

export default createRenderer
export { render }
