// 渲染器的作用就是把虚拟 DOM 渲染为真实 DOM

// 假设有如下的虚拟DOM
const vNode = {
    tag: "div",
    props: {
        onClick: () => alert("hello"),
    },
    children: "click me",
}

// 我们编写一个渲染器，把虚拟DOM 渲染为 真实DOM
function renderer(vNode, container) {
    const el = document.createElement(vNode.tag)

    // 处理某个节点所有属性、事件
    for (const key in vNode.props) {
        if (/^on/.test(key)) {
            // 如果以on开头，说明是事件
            el.addEventListener(
                key.substring(2).toLowerCase(),
                vNode.props[key]
            )
        } else {
          el.setAttribute(key, vNode.props[key])
        }
    }

    // 处理children
    if (typeof vNode.children === "string") {
        el.appendChild(document.createTextNode(vNode.children))
    } else if (Array.isArray(vNode.children)) {
        vNode.children.forEach((child) => renderer(child, el))
    }

    // 把元素挂载到挂载点下
    container.appendChild(el)
}

// 使用时：
renderer(vNode, document.getElementById("root"))
