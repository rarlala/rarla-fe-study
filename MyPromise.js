class MyPromise {
  constructor(executor) {
    this.status = "pending"; // pending, fulfilled, rejected
    this.value = null;
    this.callbackList = [];
    this.catchFuncList = [];

    const resolve = (value) => {
      if (this.status === "pending") {
        this.status = "fulfilled";
        this.value = value;

        this.callbackList.forEach((callback) => {
          try {
            this.value = callback(this.value);
          } catch (error) {
            reject(error);
          }
        });
      }
    };

    const reject = (reason) => {
      if (this.status === "pending") {
        this.status = "rejected";
        this.value = reason;

        this.catchFuncList.forEach((catchFunc) => {
          try {
            this.value = catchFunc(this.value);
          } catch (error) {
            reject(error);
          }
        });
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(thenExecutor) {
    return new MyPromise((resolve, reject) => {
      if (this.status === "fulfilled") {
        try {
          resolve(thenExecutor(this.value));
        } catch (error) {
          reject(error);
        }
      } else if (this.status === "pending") {
        this.callbackList.push(thenExecutor);
      }
    });
  }

  catch(catchExecutor) {
    return new MyPromise((resolve, reject) => {
      if (this.status === "rejected") {
        try {
          resolve(catchExecutor(this.value));
        } catch (error) {
          reject(error);
        }
      } else if (this.status === "pending") {
        this.catchFuncList.push(catchExecutor);
      }
    });
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

promise
  .then((value) => console.log(`${value} and bar`))
  .catch((err) => console.log(`Error: ${err}`));
