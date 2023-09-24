class Person {
  constructor(name) {
    this.name = name
  }

  constructor(name, age) {
    this.name = name
    this.age = age
  }
}


const person = new Person('Jack', 18)

console.log(person.name, person.age);