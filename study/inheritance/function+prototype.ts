// 3. Function으로 상속 구현하기
// class 없던 시절에 하던 방식
// Girl3를 Girl과 똑같이 구현하기

interface PersonType {
  name: string;
  stepCount: number;
  walk(): void;
}

interface PersonConstructor {
  new (name: string): PersonType;
}

const Person3: PersonConstructor = function (this: PersonType, name: string) {
  this.name = name;
  this.stepCount = 0;
} as any;

Person3.prototype.walk = function (this: PersonType) {
  console.log("walk", this.stepCount);
  return ++this.stepCount;
};

// const person = new Person3("person");
// const test = person.walk();

interface GirlType extends PersonType {
  makeUp(): void;
}

interface GirlConstructor {
  new (name: string): GirlType;
}

const Girl3: GirlConstructor = function (this: GirlType, name: string) {
  Person3.call(this, name);
} as any;

Girl3.prototype = Object.create(Person3.prototype);
Girl3.prototype.constructor = Girl3;

Girl3.prototype.makeUp = function () {
  console.log("make up");
};

const joy = new Girl3("joy");
console.log(joy);
console.log(joy.name);
console.log(joy.stepCount);
joy.walk();
joy.walk();
joy.makeUp();
