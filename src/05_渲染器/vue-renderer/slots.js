// 父组件渲染函数
function render() {
  return {
    type: MyComponent,
    children: {
      header() {
        return { type: "h1", children: "我是标题" }
      },
      body() {
        return { type: "section", children: "我是内容" }
      },
      footer() {
        return { type: "p", children: "我是注脚" }
      },
    },
  }
}

// MyComponent组件渲染函数
function render() {
  return [
    {
      type: "header",
      children: [this.$slots.header()],
    },
    {
      type: "body",
      children: [this.$slots.body()],
    },
    {
      type: "footer",
      children: [this.$slots.footer()],
    },
  ]
}
