/*
  将下面异步代码使用 Promise 的方法改进
  尽量用看上去像同步代码的方式
  setTimeout(function () {
    var a = 'hello'
    setTimeout(function () {
      var b = 'lagou'
      setTimeout(function () {
        var c = 'I ♥ U'
        console.log(a + b +c)
      }, 10)
    }, 10)
  }, 10)
*/

console.time("promise");
new Promise((resolve) => {
  setTimeout(() => {
    resolve("hello");
  }, 10);
})
  .then((res) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(res + "lagou");
      }, 10);
    });
  })
  .then((res) => {
    setTimeout(() => {
      console.log(res + "I ♥ U");
      console.timeEnd("promise");
    }, 10);
  });
