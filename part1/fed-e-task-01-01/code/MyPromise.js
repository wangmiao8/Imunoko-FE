/*
尽可能还原 Promise 中的每一个 API, 并通过注释的方式描述思路和原理.
*/

const { reject } = require("lodash");

// Promise 的三个状态
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

/**
 * then 方法的特点：
 * 1. 同一个 Promise 的 then 可以多次调用
 * 2. return 一个新的 Promise，实现链式调用
 * 3. 执行器函数异步情况下，使用队列缓存回调
 *
 * Promise 错误处理：
 * 1. 执行器错误捕获
 * 2. then 的成功回调和失败回调中的错误
 * 3. 异步下缓存的回调队列的错误
 */
class MyPromise {
  /**
   * @desc:
   * @param {*} fn
   */
  constructor(fn) {
    try {
      // fn 是在 new MyPromise 时同步执行的
      fn(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }

  // 初始化 Promise 实例属性
  status = PENDING;
  value = undefined;
  reason = undefined;
  successCallback = [];
  failureCallback = [];

  /**
   * @desc: 更改状态为 fulfilled，一旦状态确定就不可改变
   * @param {*} value
   */
  resolve = (value) => {
    if (this.status !== PENDING) return;
    this.status = FULFILLED;
    this.value = value;
    // fn 存在异步情况下，执行 then 缓存的回调
    while (this.successCallback.length) {
      this.successCallback.shift()();
    }
  };

  /**
   * @desc: 更状态为 rejected，一旦状态确定就不可改变
   * @param {*} reason
   */
  reject = (reason) => {
    if (this.status !== PENDING) return;
    this.status = REJECTED;
    this.reason = reason;
    // fn 存在异步情况下，执行 then 缓存的回调
    while (this.failureCallback.length) {
      this.failureCallback.shift()();
    }
  };

  /**
   * @desc: 执行对应状态的回调，并返回一个新的 promise，回调的结果作为新 promise then 定义的回调的参数
   * @param {*} success 成功回调
   * @param {*} failure 失败回调
   */
  then(
    success = (value) => value,
    failure = (reason) => {
      throw reason;
    }
  ) {
    // 用新的变量接收，为了能拿到这个新的 Promise 的引用做循环引用的比较
    const newPromise = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        // 异步才能拿到 newPromise 的引用
        setTimeout(() => {
          try {
            const result = success(this.value);
            resolvePromise(newPromise, result, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      } else if (this.status === REJECTED) {
        // 异步才能拿到 newPromise 的引用
        setTimeout(() => {
          try {
            const result = failure(this.reason);
            resolvePromise(newPromise, result, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      } else {
        // 处理 fn 异步情况
        this.successCallback.push(() => {
          setTimeout(() => {
            try {
              const result = success(this.value);
              resolvePromise(newPromise, result, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
        this.failureCallback.push(() => {
          setTimeout(() => {
            try {
              const result = failure(this.reason);
              resolvePromise(newPromise, result, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });
    return newPromise;
  }

  /**
   * @desc: 不管失败还是成功都会执行 callback，并且返回一个 Promise 用于链式调用，
   * 返回的 Promise 的结果由上一个 Promise 结果决定，不由 finally 的返回值决定。
   * @param {*} callback
   */
  finally(callback) {
    return this.then(
      (value) => MyPromise.resolve(callback()).then(() => value),
      (reason) =>
        MyPromise.resolve(callback()).then(() => {
          throw reason;
        })
    );
  }

  /**
   * @desc: 捕获链上的错误，相当于 .then(undefined, failureCallback)
   */
  catch(failureCallback) {
    return this.then(undefined, failureCallback);
  }

  /**
   * @desc: Promise 并发执行，返回结果有序，但是只要有一个失败就算失败
   * @param {*} arr
   */
  static all(arr) {
    const result = []; //结果数组
    let count = 0; // 计数器

    return new MyPromise((resolve, reject) => {
      // 添加到结果数组的指定位置
      const addData = (key, val) => {
        result[key] = val;
        count++;
        count === result.length && resolve(result);
      };

      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (item instanceof MyPromise) {
          item.then(
            (res) => addData(i, res),
            (reason) => reject(reason)
          );
        } else {
          addData(i, item);
        }
      }
    });
  }

  /**
   * @desc: 返回一个 Promise 对象
   * @param {*} value
   */
  static resolve(value) {
    return value instanceof MyPromise ? value : new MyPromise((resolve) => resolve(value));
  }
}

/**
 * @desc: 检查 result 的类型和引用处理，并且作为下一个 then 的回调参数
 */
const resolvePromise = (newPromise, result, resolveFn, rejectFn) => {
  // 避免 then 回调里返回自身导致循环引用
  if (newPromise === result) {
    rejectFn(new TypeError("Chaining cycle detected for promise #<Promise>"));
  }
  if (result instanceof MyPromise) {
    // 如果是 promise 就直接作为 then 的回调
    result.then(resolveFn, rejectFn);
  } else {
    // 如果是基本类型，直接 resolve
    resolveFn(result);
  }
};
