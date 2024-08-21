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
            callback(this.value);
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
            catchFunc(this.value);
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
      const handleCallback = () => {
        try {
          const result = thenExecutor(this.value);

          if (result && typeof result.then === "function") {
            result.then(resolve).catch(reject);
          } else {
            resolve(result);
          }
        } catch (e) {
          reject(e);
        }
      };

      if (this.status === "fulfilled") {
        handleCallback();
      } else if (this.status === "pending") {
        this.callbackList.push(handleCallback);
      }
    });
  }

  catch(catchExecutor) {
    return new MyPromise((resolve, reject) => {
      const handleCatch = () => {
        try {
          const result = catchExecutor(this.value);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      if (this.status === "rejected") {
        handleCatch();
      } else if (this.status === "pending") {
        this.catchFuncList.push(handleCatch);
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
  .then((value) => {
    console.log(`${value} and bar`);
    return `${value} and bar`;
  })
  .then((value) => console.log(`${value} and bar again`));
// .catch((err) => console.log(`Error: ${err}`));
