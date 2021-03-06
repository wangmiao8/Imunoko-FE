class Container {
  static of(value) {
    return new Container(value);
  }
  constructor(value) {
    this._value = value;
  }
  map(fn) {
    return Container.of(fn(this._value));
  }
}

class Maybe {
  static of(x) {
    return new Maybe(x);
  }
  constructor(x) {
    this._value = x;
  }
  isNothing() {
    return this._value === null || this._value === undefined;
  }
  map(fn) {
    return this.isNothing() ? this : new Maybe(fn(this._value));
  }
}

module.exports = { Container, Maybe };
