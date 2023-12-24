const MyComponent = {
  name: "MyComponent",
  props: {
    title: String,
  },
  data() {
    return { foo: "hello world" }
  },
  render() {
    return {
      type: "div",
      children: `foo的值是: ${this.foo}, title的值是: ${this.title}`, // 在渲染函数内使用组件的状态
    }
  },
}

const vnode = {
  type: MyComponent,
  props: {
    title: "A big Title",
    other: this.val,
  },
}
