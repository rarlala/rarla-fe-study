// 2. Function으로 상속처럼 구현하기
function Person2(name: string) {
  return {
    stepCount: 0,
    name,
    walk() {
      return ++this.stepCount;
    },
  };
}

function Girl2(name: string) {
  const person = Person2(name);
  return {
    ...person,
    makeUp() {
      console.log("make up!");
    },
  };
}

const john = Person2("john");
john.walk(); // 1

const alice = Girl2("alice");
alice.makeUp(); // make up!
