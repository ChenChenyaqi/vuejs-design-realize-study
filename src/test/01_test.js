const { reactive, ref, computed, watch, effect } = require("vue")

const person = reactive({
  name: "jack",
  age: 18,
})

function sayHello() {
  console.log(person.name + ": " + person.age)
}

watch(person, () => {
  console.log(person.name + ": watch: ", person.age)
})

effect(() => {
  console.log(person.age + " by effect")
})

sayHello()

setTimeout(() => {
  person.age += 1
}, 1000)
