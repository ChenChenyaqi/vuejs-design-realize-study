// 定义状态机的状态
const State = {
  initial: 1, // 初始状态
  tagOpen: 2, // 标签开始状态
  tagName: 3, // 标签名称状态
  text: 4, // 文本状态
  tagEnd: 5, // 结束标签状态
  tagEndName: 6, // 结束标签名称状态
}

/**
 * 判断是否是a-z字母
 * @param {String} char
 */
function isAlpha(char) {
  return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z")
}

/**
 * 接收模板字符串作为参数，并将模板切割为Token返回
 * @param {String} str
 */
function tokenize(str) {
  // 状态机的当前状态：初始状态
  let currentState = State.initial
  // 用于缓存字符
  const chars = []
  // 生成的Token会存储在tokens数组中
  const tokens = []

  while (str) {
    const char = str[0]
    switch (currentState) {
      // 当前状态机处于初始状态
      case State.initial:
        if (char === "<") {
          // 1.状态机进入标签开始状态
          currentState = State.tagOpen
          // 2.消费字符<
          str = str.slice(1)
        } else if (isAlpha(char)) {
          // 1.状态机进入文本状态
          currentState = State.text
          // 2. 将当前字符缓存到chars数组中
          chars.push(char)
          // 3. 消费字符
          str = str.slice(1)
        }
        break
      // 当状态机当前处于标签开始状态
      case State.tagOpen:
        if (isAlpha(char)) {
          // 切换到标签名称状态
          currentState = State.tagName
          chars.push(char)
          str = str.slice(1)
        } else if (char === "/") {
          // 切换到标签结束状态
          currentState = State.tagEnd
          str = str.slice(1)
        }
        break
      // 状态机处于标签名称状态
      case State.tagName:
        if (isAlpha(char)) {
          // 不需要切换状态，只需要消费字符并缓存
          chars.push(char)
          str = str.slice(1)
        } else if (char === ">") {
          // 切换到初始状态，代表标签名称读完
          currentState = State.initial
          // 把当前读到的完整标签名称放进tokens数组中
          tokens.push({
            type: "tag",
            name: chars.join(""),
          })
          chars.length = 0
          str = str.slice(1)
        }
        break
      // 状态机处于文本状态
      case State.text:
        if (isAlpha(char)) {
          chars.push(char)
          str = str.slice(1)
        } else if (char === "<") {
          // 切换到标签开始状态，此时得到一个完整的文本token
          currentState = State.tagOpen
          tokens.push({
            type: "text",
            content: chars.join(""),
          })
          chars.length = 0
          str = str.slice(1)
        }
        break
      // 状态机处于标签结束状态
      case State.tagEnd:
        if (isAlpha(char)) {
          // 切换到结束标签名称状态
          currentState = State.tagEndName
          chars.push(char)
          str = str.slice(1)
        }
        break
      // 状态机处于结束标签名称状态
      case State.tagEndName:
        if (isAlpha(char)) {
          chars.push(char)
          str = str.slice(1)
        } else if (char === ">") {
          currentState = State.initial
          tokens.push({
            type: "tagEnd",
            name: chars.join(""),
          })
          chars.length = 0
          str = str.slice(1)
        }
        break
    }
  }

  return tokens
}

/**
 * 传入html模板字符串，构建AST
 * @param {String} str
 */
function parse(str) {
  const tokens = tokenize(str)
  // 创建逻辑根节点Root
  const root = {
    type: "Root",
    children: [],
  }

  // 维护所有起始标签节点栈
  const elementStack = [root]

  while (tokens.length) {
    // 获取当前栈顶元素作为父节点
    const parent = elementStack[elementStack.length - 1]
    // 当前扫描到的节点
    const t = tokens[0]
    switch (t.type) {
      // 起始标签节点
      case "tag":
        // 创建Element节点，入栈
        const elementNode = {
          type: "Element",
          tag: t.name,
          children: [],
        }
        elementStack.push(elementNode)
        // 由于是起始标签节点，代表一个html元素，所以要挂载在父节点下
        parent.children.push(elementNode)
        break
      case "text":
        // 如果是文本节点，直接加入到父节点下
        const textNode = {
          type: "Text",
          content: t.content,
        }
        parent.children.push(textNode)
        break
      case "tagEnd":
        // 遇到结束标签，将栈顶元素弹出
        elementStack.pop()
        break
    }
    tokens.shift()
  }
  return root
}

/**
 * 处理AST
 * @param {*} ast
 */
function transform(ast) {
  // 构造转换上下文
  const context = {
    // 表示当前正在转换的节点
    currentNode: null,
    // 当前节点在父节点的children中的位置索引
    childIndex: 0,
    // 当前转换节点的父节点
    parent: null,
    // 替换AST中的节点为另一个新节点
    replaceNode(node) {
      context.parent.children[context.childIndex] = node
      context.currentNode = node
    },
    nodeTransforms: [transformElement, transformText],
  }

  traverseNode(ast, context)
  dump(ast)
}

/**
 * 深度优先遍历处理AST每个节点
 * @param {*} ast
 * @param {*} context
 */
function traverseNode(ast, context) {
  // 设置当前转换的节点信息
  context.currentNode = ast
  const transforms = context.nodeTransforms
  for (let i = 0; i < transforms.length; i++) {
    transforms[i](context.currentNode, context)
  }

  const children = context.currentNode.children
  if (children) {
    for (let i = 0; i < children.length; i++) {
      // 递归之前，将当前节点设置为父节点
      context.parent = context.currentNode
      //设置位置索引
      context.childIndex = i
      traverseNode(children[i], context)
    }
  }
}

function transformElement(node) {
  if (node.type === "Element" && node.tag === "p") {
    node.tag = "h1"
  }
}

function transformText(node, context) {
  if (node.type === "Text") {
    // 如果当前是文本节点，就替换为span
    context.replaceNode({
      type: "Element",
      tag: "span",
    })
  }
}

// ==========调用===========
const root = parse(`<div><p>Vue</p><p>Template</p></div>`)
transform(root)

/**
 * 打印AST
 * @param {*} node
 * @param {*} indent
 */
function dump(node, indent = 0) {
  // 节点的类型
  const type = node.type
  // 节点的描述，如果是根节点，则没有描述
  // 如果是 Element 类型的节点，则使用 node.tag 作为节点的描述
  // 如果是 Text 类型的节点，则使用 node.content 作为节点的描述
  const desc =
    node.type === "Root"
      ? ""
      : node.type === "Element"
      ? node.tag
      : node.content

  // 打印节点的类型和描述信息
  console.log(`${"-".repeat(indent)}${type}: ${desc}`)

  // 递归地打印子节点
  if (node.children) {
    node.children.forEach((n) => dump(n, indent + 2))
  }
}
