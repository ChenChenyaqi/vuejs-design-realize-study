# 你写的 vue/react 组件是怎么呈现在页面上的？

不知道大家有没有好奇，就是平时你用 vue/react 去写页面，你写的一个 vue 组件或者是 react 组件，是怎么呈现到页面上的？

我先拿 vue 举例子，比如这么一个简单的组件：

```js
<template>
    <div @click="handleClick" class="wrapper">
        Click Me!
    </div>
</template>

<script>
    export default {
        data(){
            return {
                /* ... */
            }
        },
        methods:{
            handleClick(){
                alert('Hello World!')
            }
        }
    }
</script>
```

就是这么一个玩意，它是怎么呈现到页面上的？

不知道你知不知道虚拟 DOM，什么是虚拟 DOM？虚拟 DOM 就是一个 js 对象：
你在<template></template>这个标签内写的所有类 html 代码，最后都会被转为虚拟 DOM

```js
const vNode = {
    tag: "div",
    props: {
        onClick: handleClick,
    },
    children: "Click Me!",
}
```

然后，vue 会把这个虚拟 DOM 交给 renderer【渲染器】进行渲染【根据虚拟 DOM 创建真实 DOM 并挂载到页面上】

renderer是怎么工作的？我们来写一个简单的 renderer

```js
/**
 * vNode: 虚拟DOM对象
 * container: 要挂在到哪个真实dom下，一般是 id为root的节点
 */
function renderer(vNode, container) {
    // 要判断当前节点是普通的dom元素还是你写的组件
    if (typeof vNode.tag === "string") {
        renderElement(vNode, container)
    } else if (typeof vNode.tag === "function") {
        renderComponent(vNode, container)
    }
}

// 渲染普通dom元素
function renderElement(vNode, container) {
    // 根据tag创建真实dom
    const el = document.createElement(vNode.tag)

    // 处理el身上的所有属性
    for (let key in vNode.props) {
        if (/^on/.test(key)) {
            // 说明是方法
            el.addEventListener(
                key.substring(2).toLowerCase(),
                vNode.props[key]
            )
        } else if (key === "class") {
            el.className = vNode.props[key]
        } else {
            /* ... */
        }
    }

    // 处理children
    if (typeof vNode.children === "string") {
        el.appendChild(document.createTextNode(vNode.children))
    } else if (Array.isArray(vNode.children)) {
        vNode.children.forEach((child) => renderer(child, el))
    }

    // 挂载
    container.appendChild(el)
}

// 渲染组件(函数组件)
function renderComponent(vNode, container) {
    const subtree = vNode.tag()
    renderer(subtree, container)
}
```

我们写的这个 renderer 比较简单，并使用上不是很方便，因为，我们需要自己去写好 vNode，传给 renderer 进行渲染

那么，如何做到像 vue 那样，让我们可以直接在 <template></template> 中写 html，就能直接就变成 vNode，然后再渲染？

这就需要用到 **编译器**

编译器的作用，就是把我们在 <template></template> 中写 html，编译成 vNode

vue 中，编译器是这样做的，比如下面这个 vue 组件：

```js
<template>
    <div @click="handleClick" class="wrapper">
        Click Me!
    </div>
</template>

<script>
    export default {
        data(){
            return {
                /* ... */
            }
        },
        methods:{
            handleClick(){
                alert('Hello World!')
            }
        }
    }
</script>
```

会变成====>

```js
export default {
    data() {
        return {
            /* ... */
        }
    },
    methods: {
        handleClick() {
            alert("Hello World!")
        },
    },
    render() {
        // 这个h函数的作用，就是返回vNode
        return h(
            "div",
            { onClick: handleClick, class: "wrapper" },
            "Click Me！"
        )
    },
}
```

至于编译器具体是怎么工作的？ 它是有一套算法，比较复杂，这个以后讲