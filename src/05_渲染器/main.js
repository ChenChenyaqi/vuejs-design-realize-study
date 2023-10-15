import { render } from "./vue-renderer/renderer"

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
