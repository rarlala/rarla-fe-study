// 1. class로 상속 구현하기
class Person {
  name: string;
  private stepCount = 0;

  constructor(name: string) {
    this.name = name;
  }

  walk() {
    this.stepCount++;
  }
}

class Girl extends Person {
  makeUp() {
    console.log("make up!");
  }
}

const elena = new Girl("elena");
// elena = (Object -> Human -> Girl) + (name = "elena")
