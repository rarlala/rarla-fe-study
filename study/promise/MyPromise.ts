class MyPromise2<T> {
  status: "pending" | "fulfilled" | "rejected" = "pending";
  value: T | null = null;
  reason: any = null;
  callbackList: Array<(value: T) => void> = [];
  rejectList: Array<(reason: any) => void> = [];

  constructor(
    execute: (
      resolve: (value: T) => void,
      reject: (reason: any) => void
    ) => void
  ) {
    const resolve = (value: T) => {
      if (this.status === "pending") {
        this.status = "fulfilled";
        this.value = value;
        this.callbackList.forEach((callback) => callback(value));
      }
    };

    const reject = (reason: any) => {
      if (this.status === "pending") {
        this.status = "rejected";
        this.reason = reason;
        this.rejectList.forEach((reject) => reject(reason));
      }
    };

    try {
      execute(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then<U>(
    onFulfilled?: (value: T) => U | MyPromise2<U>,
    onRejected?: (reason: any) => U | MyPromise2<U>
  ): MyPromise2<U> {
    return new MyPromise2<U>((resolve, reject) => {
      const handleFulfilled = () => {
        try {
          if (onFulfilled) {
            const result = onFulfilled(this.value as T);
            if (result instanceof MyPromise2) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          } else {
            resolve(this.value as unknown as U);
          }
        } catch (error) {
          reject(error);
        }
      };

      const handleRejected = () => {
        try {
          if (onRejected) {
            const result = onRejected(this.reason);
            if (result instanceof MyPromise2) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          } else {
            resolve(this.reason);
          }
        } catch (error) {
          reject(error);
        }
      };

      if (this.status === "fulfilled") {
        setTimeout(handleFulfilled, 0);
      } else if (this.status === "rejected") {
        setTimeout(handleRejected, 0);
      } else {
        this.callbackList.push(handleFulfilled);
        this.rejectList.push(handleRejected);
      }
    });
  }

  catch(onRejected: (reason: any) => any): MyPromise2<any> {
    return this.then(undefined, onRejected);
  }

  static resolve<T>(value: T): MyPromise2<T> {
    return new MyPromise2((resolve) => resolve(value));
  }

  static reject<T = never>(reason: any): MyPromise2<T> {
    return new MyPromise2((_, reject) => reject(reason));
  }
}

const promise = new MyPromise2(
  (resolve: (value: string) => void, reject: (value: string) => void) => {
    // setTimeout(() => {
    const randomNumber = Math.random() * 10;
    console.log("randomNumber", randomNumber);

    if (randomNumber > 5) {
      resolve("foo");
    } else {
      reject("Error");
    }
    // }, 300);
  }
);

promise
  .then((value) => {
    console.log(`${value} and bar`);
    return `${value} and bar`;
  })
  .catch((err) => console.log(`Error: ${err}`))
  .then((value) => console.log(`${value} and bar again`));
