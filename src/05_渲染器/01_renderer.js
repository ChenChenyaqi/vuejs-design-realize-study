import { unmount, normalizeClass, shouldSetAsProps } from "./utils"

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
        // diff
        patchElement(newNode, oldNode)
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
   * diff
   * @param {object} newNode
   * @param {object} oldNode
   */
  function patchElement(newNode, oldNode) {}

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
  patchProps(el, key, preValue, nextValue) {
    // 优先处理class
    if (key === "class") {
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
      },
      children: "click me!",
    },
  ],
}
