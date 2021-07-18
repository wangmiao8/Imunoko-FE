# Part1-2 作业

( 请在当前文件直接作答 )

## 简答题

### 1. 请说出下列最终执行结果，并解释为什么?

```javascript
var a = [];
for (var i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[6]();
```

答： 输出 10

a 数组中存放的是函数体而不是函数的执行结果，所以在 for 循环中赋值的匿名函数是不会执行的。当执行到 `a[6]()` 的时候，实际上 for 循环已经执行完毕，此时 i 的值为 10，而根据函数的作用域链查找 `a[6]()` 函数里的 i 就是 10。

### 2. 请说出此案列最终执行结果，并解释为什么?

```javascript
var tmp = 123;
if (true) {
  console.log(tmp);
  let tmp;
}
```

答： 会报错（ReferenceError: Cannot access 'tmp' before initialization）。

由于 ES6 引入了块级作用域，条件语句中会存在块级作用域。通过 `let` 声明的变量 `tmp` 会绑定这个块级作用域，并且不存在变量提升，所以在 `tmp` 声明前使用就会报错。

报错的信息是 `ReferenceError: Cannot access 'tmp' before initialization`，而不是 `ReferenceError: tmp is not defined` 的原因，是块级作用域中 `let` 声明变量前会存在暂时性死区，在变量初始化前不能访问变量，通过 `let` 声明的变量是在执行的时候才开始初始化。

### 3. 结合 ES6 语法，用最简单的方式找出数组中的最小值

```javascript
var arr = [12, 34, 32, 89, 4];
```

```js
/* 获取数组内最小值 */
const findMinForArr = (arr = []) => Math.min(...arr);
```

### 4. 请详细说明 var、let、const 三种声明变量的方式之间的具体差别

答：

- var 存在变量提升，而 let 和 const 在声明变量前使用变量会报错
- var 在 if、for 等代码块内不存在块级作用域，let 和 const 有块级作用域，并在其中存在暂时性死区
- var 重复声明相同变量，后者会覆盖前者，let 和 const 不能重复声明
- var 和 let 声明时可以不用初始化值，const 必须给定一个值
- const 声明的值不允许修改（声明是对象的话是地址不能修改，对象属性还是能修改的）

### 5. 请说出下列代码最终输出结果，并解释为什么？

```javascript
var a = 10;
var obj = {
  a: 20,
  fn() {
    setTimeout(() => {
      console.log(this.a);
    });
  },
};
obj.fn();
```

答：输出 20

因为 `setTimeout` 的回调函数使用的是箭头函数方式，箭头函数内部的 this 会取决于外部作用域的 this，即 `obj.fn` 函数的 this。

所以 `obj.fn()` 执行时，定时器的 this 是指向 obj，输出 20。

### 6. 简述 Symbol 类型的用途

Symbol 的作用是用于生成一个独一无二的值，基于这个特点，我们可以实现以下的一些用途。

#### 1. 实现私有属性

```js
const AGE = new Symbol("age");
const GET_AGE = new Symbol("get_age");

class Person {
  constructor(name, age) {
    this.name = name;
    this[AGE] = age;
    this[GET_AGE] = function () {
      return this[AGE];
    };
  }
}
```

#### 2. 单例模式

```js
class Person {
  constructor(name, age) {
    this.name = "imunoko";
    this.age = "18";
  }
}

const key = Symbol.for("Person");

if (!globalThis[key]) globalThis[key] = new Person();
```

### 7. 说说什么是浅拷贝，什么是深拷贝？

### 8. 请简述 TypeScript 与 JavaScript 之间的关系？

### 9. 请谈谈你所认为的 typescript 优缺点

### 10. 描述引用计数的工作原理和优缺点

### 11. 描述标记整理算法的工作流程

### 12.描述 V8 中新生代存储区垃圾回收的流程

### 13. 描述增量标记算法在何时使用及工作原理
