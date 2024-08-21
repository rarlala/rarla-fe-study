class MyPromise {
  constructor(executor) {
    this.status = "pending"; // pending, fulfilled, rejected
    this.value = null;
    this.callbackList = [];
    this.catchFunc = null;

    const resolve = (value) => {
      this.statue = "fulfilled";
      this.value = value;
      console.log(value);
    };

    const reject = (reason) => {
      this.statue = "rejected";
      this.value = reason;
      console.log(reason);
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
}

const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    const randomNumber = Math.random() * 10;
    console.log("randomNumber", randomNumber);

    if (randomNumber > 5) {
      resolve("foo");
    } else {
      reject("Error");
    }
  }, 300);
});
