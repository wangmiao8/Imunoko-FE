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

答：由于引用数据类型在内存是以堆内存存储，声明变量赋值的都是堆内存的地址，一旦某个地方修改引用类型数据的属性，那么就会影响到所有引用该堆内存的变量。

```js
const o = {
  name: "imunoko",
  age: 18,
};

const n = o; // 预期：获取新的且内容一样的对象。表面结果也符合预期。
n.name = "miko"; // 预期：修改 n 的 name。结果 n 的 name 确实改变了。

if (o.name === "imunoko") {
  // 改变了 n 的 name 属性，导致了 o.name 的值（对象 o 的逻辑不符合预期）
  // do something ...
}
```

浅拷贝和深拷贝都是为了解决引用数据类型（对象、数组等）的拷贝问题。简单的来说浅拷贝只拷贝引用数据的第一层的数据，深拷贝则是完全拷贝整个对象（所有层级）。

```js
// 举一个栗子

const target = {
  name: "imunoko",
  hobby: {
    life: ["撸猫", "游戏", "摄影"],
    work: ["摸鱼", "不干正事"],
  },
};

const imu = { ...target }; // 浅拷贝
const imu2 = JSON.parse(JSON.stringify(target)); // 深拷贝

/* 区别：虽然都是一个新的对象，但是浅拷贝只拷贝一层，如果第一层有引用数据类型，则只是拷贝了堆内存的地址 */
imu.hobby.newType = "新爱好";
imu2.hobby.newType2 = "新爱好2";

console.log(target); // target.hobby 多了一个 newType，但是没有 newType2
```

### 8. 请简述 TypeScript 与 JavaScript 之间的关系？

答：

- TypeScript 是 JavaScript 的超集。TypeScript 在 JavaScript 的基础上扩展了类型系统，同时也支持 JavaScript，即使不使用到任何 TypeScript 提供的特性。

- TypeScript 支持新的 ECMAScript 特性，TypeScript 编译后的代码其实也是 JavaScript。

- TypeScript 不能在直接在浏览器或者 nodejs 上运行，需要经过编译，最终 JS 引擎执行的还是 JavaScript。说 TypeScript 是语法糖也可。

### 9. 请谈谈你所认为的 typescript 优缺点

优点：

- 代码相对 JavaScript 更安全，编写和编译的时候就能知道由类型引发的错误，而不是运行时。
- IDE 更好的智能提示
- 更好的可读性和可维护性
- 社区活跃

缺点：

- 编译时间相对更长，因为需要经过编译，牺牲编译的效率换取了代码的安全（deno 停用 Typescript 原因之一）
- 在需要快速迭代的中小型项目，Typescript 会增加开发成本（学习成本、开发效率）

### 10. 描述引用计数的工作原理和优缺点

答：引用计数器管理对象的被引用次数，每次程序对对象的引用变化时，就会增减，当引用次数为 0 由垃圾回收器回收马上回收。

优点：对象引用为 0 马上回收，为后面的程序提供更大的内存；最大减少内存占满导致程序运行阻塞的问题。

缺点：无法回收循环引用的对象；由于内部维护引用计数器，会存在时间效率问题。

### 11. 描述标记整理算法的工作流程

标记整理（Scavenge）算法基于标记清除改进而来，与标记清除一样，将 GC 分为清除和标记两个阶段。

基本流程：

1. 标记当前程序的所有活动对象
2. 将所有标记的活动对象进行整理，使活动对象成为连续的内存
3. 清除所有未标记的活动对象，释放空间
4. 将所有标记过的活动对象清除标记，以便下一次标记整理

### 12.描述 V8 中新生代存储区垃圾回收的流程

答：V8 采用的是分代回收算法，将空间分为新生代内存和老生代内存，根据不同的内存使用不同的算法。新生代为存活时间较短的对象，采用的是空间复制和标记整理算法；老生代为存活时间较长或者由新生代晋升的对象，采用标记清除、标记整理和增量标记算法。

基本流程：

1. 将内存分为新生代内存（32M|16M）和老生代内存（1.4G|700M），而新生代内存二等分为 Form 和 To 两个部分的内存
2. 程序运行过程中，将存活时间较短的对象放入新生代，时间较长的放入老生代
3. 新生代进行 GC，在 Form 内存中进行标记整理，将标记为活动对象的整理后放入 To 中，未标记的进行将会被回收，期间 To 内存超过 25% 将会进行晋升（将对象放入老生代内存），完成标记整理后将 From 和 To 进行对换
4. 老生代进行 GC，使用标记清除完成垃圾回收，回收的垃圾是碎片化的。期间如果存在新生代的晋升，当老生代内存不足以存放新生代晋升的对象的时候，会进行标记整理，获取到连续的内存空间存放晋升对象，进而继续进行垃圾回收。期间的标记采用增量标记进行标记效率优化。

### 13. 描述增量标记算法在何时使用及工作原理

在老生代进行 GC 时，会存在标记清除和标记整理，增量标记就是在进行标记阶段，将原来一整段的标记拆分成多段标记，和程序的执行一起交替进行，在程序中这个时间间隔是很小的，用户几乎感知不到。

增量标记避免了原本程序执行后再一整段进行时间标记的带给用户的卡顿感。
