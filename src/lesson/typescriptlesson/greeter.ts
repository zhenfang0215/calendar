class Student {
    fullName: string;
    constructor(public firstName: string, public middleInitial: string, public lastName: string) {
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
}

interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person: Person) {
    return "Hello, " + person.firstName + " " + person.lastName
}

let user = new Student("Jane", "M.", "User")

document.body.textContent = greeter(user)


let test: Number = 1;

interface myInf {
    label?: string
    label2: number
}

let x: myInf = {label2: 1, label:"1"}
let y: myInf = {label2: 2}


