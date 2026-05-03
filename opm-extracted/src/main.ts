// Source: decompiled/deobfuscated.js
// Original path: ./src/main.ts
// Extracted by opm-extracted/tools/extract.mjs

  if (environment.production) {
    (0, enableProdMode)();
  }
  platformBrowser().bootstrapModule(AppModule);

  /***/
}),
/***/85817: (/***/() => {

  /* (ignored) */

  /***/}),
/***/18590: (/***/() => {

  /* (ignored) */

  /***/}),
/***/4530: (/***/() => {

  /* (ignored) */

  /***/}),
/***/8108: (/***/() => {

  /* (ignored) */

  /***/}),
/***/80551: (/***/() => {

  /* (ignored) */

  /***/}),
/***/41234: (/***/() => {

  /* (ignored) */

  /***/}),
/***/67227: (/***/module => {
  "use strict";

  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
    enumerable: true,
    configurable: true,
    writable: true,
    value
  }) : obj[key] = value;
  var __export = (target, all) => {
    for (var name in all) {
      __defProp(target, name, {
        get: all[name],
        enumerable: true
      });
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from)) {
        if (!__hasOwnProp.call(to, key) && key !== except) {
          __defProp(to, key, {
            get: () => from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
          });
        }
      }
    }
    return to;
  };
  var __toCommonJS = mod => __copyProps(__defProp({}, "__esModule", {
    value: true
  }), mod);
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    ARC4RNG: () => ARC4RNG,
    FunctionRNG: () => FunctionRNG,
    MathRandomRNG: () => MathRandomRNG,
    RNG: () => RNG,
    Random: () => Random,
    XOR128RNG: () => XOR128RNG,
    createRNG: () => createRNG,
    default: () => random_default,
    mixKey: () => mixKey,
    processSeed: () => processSeed
  });
  module.exports = __toCommonJS(src_exports);

  // src/rng.ts
  var RNG = class {};

  // src/generators/function.ts
  var FunctionRNG = class _FunctionRNG extends RNG {
    constructor(rngFn) {
      super();
      __publicField(this, "_name");
      __publicField(this, "_rngFn");
      this._name = rngFn.name ?? "function";
      this._rngFn = rngFn;
    }
    get name() {
      return this._name;
    }
    next() {
      return this._rngFn();
    }
    clone() {
      return new _FunctionRNG(this._rngFn);
    }
  };

  // src/utils.ts
  function createRNG(seedOrRNG) {
    switch (typeof seedOrRNG) {
      case "object":
        if (seedOrRNG instanceof RNG) {
          return seedOrRNG;
        }
        break;
      case "function":
        return new FunctionRNG(seedOrRNG);
      default:
        return new ARC4RNG(seedOrRNG);
    }
    throw new Error(`invalid RNG seed or instance "${seedOrRNG}"`);
  }
  function processSeed(seed = crypto.randomUUID()) {
    if (typeof seed === "number") {
      return seed;
    }
    const strSeed = `${seed}`;
    let s = 0;
    for (let k = 0; k < strSeed.length; ++k) {
      s ^= strSeed.charCodeAt(k) | 0;
    }
    return s;
  }
  function mixKey(seed, key) {
    const seedStr = `${seed}`;
    let smear = 0;
    let j = 0;
    while (j < seedStr.length) {
      key[j & 255] = (smear ^= (key[j & 255] ?? 0) * 19) + seedStr.charCodeAt(j++) & 255;
    }
    if (!key.length) {
      return [0];
    }
    return key;
  }

  // src/generators/arc4.ts
  var _arc4_startdenom = 281474976710656;
  var _arc4_significance = 4503599627370496;
  var _arc4_overflow = 9007199254740992;
  var ARC4RNG = class _ARC4RNG extends RNG {
    constructor(seed) {
      super();
      __publicField(this, "_seed");
      __publicField(this, "i");
      __publicField(this, "j");
      __publicField(this, "S");
      const s = processSeed(seed);
      this._seed = s;
      const key = mixKey(s, []);
      const S = [];
      const keylen = key.length;
      this.i = 0;
      this.j = 0;
      this.S = S;
      let i = 0;
      while (i <= 255) {
        S[i] = i++;
      }
      for (let i2 = 0, j = 0; i2 <= 255; i2++) {
        const t = S[i2];
        j = j + key[i2 % keylen] + t & 255;
        S[i2] = S[j];
        S[j] = t;
      }
      this.g(256);
    }
    get name() {
      return "arc4";
    }
    next() {
      let n = this.g(6);
      let d = _arc4_startdenom;
      let x = 0;
      while (n < _arc4_significance) {
        n = (n + x) * 256;
        d *= 256;
        x = this.g(1);
      }
      while (n >= _arc4_overflow) {
        n /= 2;
        d /= 2;
        x >>>= 1;
      }
      return (n + x) / d;
    }
    g(count) {
      const {
        S
      } = this;
      let {
        i,
        j
      } = this;
      let r = 0;
      while (count--) {
        i = i + 1 & 255;
        const t = S[i];
        S[j] = t;
        j = j + t & 255;
        S[i] = S[j];
        r = r * 256 + S[S[i] + t & 255];
      }
      this.i = i;
      this.j = j;
      return r;
    }
    clone() {
      return new _ARC4RNG(this._seed);
    }
  };

  // src/generators/math-random.ts
  var MathRandomRNG = class _MathRandomRNG extends RNG {
    get name() {
      return "Math.random";
    }
    next() {
      return Math.random();
    }
    clone() {
      return new _MathRandomRNG();
    }
  };

  // src/generators/xor128.ts
  var XOR128RNG = class _XOR128RNG extends RNG {
    constructor(seed) {
      super();
      __publicField(this, "_seed");
      __publicField(this, "x");
      __publicField(this, "y");
      __publicField(this, "z");
      __publicField(this, "w");
      this._seed = processSeed(seed);
      this.x = this._seed;
      this.y = 0;
      this.z = 0;
      this.w = 0;
      for (let i = 0; i < 64; ++i) {
        this.next();
      }
    }
    get name() {
      return "xor128";
    }
    next() {
      const t = this.x ^ this.x << 1;
      this.x = this.y;
      this.y = this.z;
      this.z = this.w;
      this.w = this.w ^ (this.w >>> 19 ^ t ^ t >>> 8);
      return (this.w >>> 0) / 4294967296;
    }
    clone() {
      return new _XOR128RNG(this._seed);
    }
  };

  // src/validation.ts
  function numberValidator(num) {
    return new NumberValidator(num);
  }
  var NumberValidator = class {
    constructor(num) {
      __publicField(this, "n");
      __publicField(this, "isInt", () => {
        if (Number.isInteger(this.n)) {
          return this;
        }
        throw new Error(`Expected number to be an integer, got ${this.n}`);
      });
      __publicField(this, "isPositive", () => {
        if (this.n > 0) {
          return this;
        }
        throw new Error(`Expected number to be positive, got ${this.n}`);
      });
      __publicField(this, "lessThan", v => {
        if (this.n < v) {
          return this;
        }
        throw new Error(`Expected number to be less than ${v}, got ${this.n}`);
      });
      __publicField(this, "greaterThanOrEqual", v => {
        if (this.n >= v) {
          return this;
        }
        throw new Error(`Expected number to be greater than or equal to ${v}, got ${this.n}`);
      });
      __publicField(this, "greaterThan", v => {
        if (this.n > v) {
          return this;
        }
        throw new Error(`Expected number to be greater than ${v}, got ${this.n}`);
      });
      this.n = num;
    }
  };

  // src/distributions/bates.ts
  function bates(random, n = 1) {
    numberValidator(n).isInt().isPositive();
    const irwinHall2 = random.irwinHall(n);
    return () => {
      return irwinHall2() / n;
    };
  }

  // src/distributions/bernoulli.ts
  function bernoulli(random, p = 0.5) {
    numberValidator(p).greaterThanOrEqual(0).lessThan(1);
    return () => {
      return Math.floor(random.next() + p);
    };
  }

  // src/distributions/binomial.ts
  function binomial(random, n = 1, p = 0.5) {
    numberValidator(n).isInt().isPositive();
    numberValidator(p).greaterThanOrEqual(0).lessThan(1);
    return () => {
      let i = 0;
      let x = 0;
      while (i++ < n) {
        if (random.next() < p) {
          x++;
        }
      }
      return x;
    };
  }

  // src/distributions/exponential.ts
  function exponential(random, lambda = 1) {
    numberValidator(lambda).isPositive();
    return () => {
      return -Math.log(1 - random.next()) / lambda;
    };
  }

  // src/distributions/geometric.ts
  function geometric(random, p = 0.5) {
    numberValidator(p).greaterThan(0).lessThan(1);
    const invLogP = 1 / Math.log(1 - p);
    return () => {
      return Math.floor(1 + Math.log(random.next()) * invLogP);
    };
  }

  // src/distributions/irwin-hall.ts
  function irwinHall(random, n = 1) {
    numberValidator(n).isInt().greaterThanOrEqual(0);
    return () => {
      let sum = 0;
      for (let i = 0; i < n; ++i) {
        sum += random.next();
      }
      return sum;
    };
  }

  // src/distributions/log-normal.ts
  function logNormal(random, mu = 0, sigma = 1) {
    const normal2 = random.normal(mu, sigma);
    return () => {
      return Math.exp(normal2());
    };
  }

  // src/distributions/normal.ts
  function normal(random, mu = 0, sigma = 1) {
    return () => {
      let x;
      let y;
      let r;
      do {
        x = random.next() * 2 - 1;
        y = random.next() * 2 - 1;
        r = x * x + y * y;
      } while (!r || r > 1);
      return mu + sigma * y * Math.sqrt(Math.log(r) * -2 / r);
    };
  }

  // src/distributions/pareto.ts
  function pareto(random, alpha = 1) {
    numberValidator(alpha).greaterThanOrEqual(0);
    const invAlpha = 1 / alpha;
    return () => {
      return 1 / Math.pow(1 - random.next(), invAlpha);
    };
  }

  // src/distributions/poisson.ts
  var logFactorialTable = [0, 0, 0.6931471805599453, 1.791759469228055, 3.1780538303479458, 4.787491742782046, 6.579251212010101, 8.525161361065415, 10.60460290274525, 12.801827480081469];
  var logFactorial = k => {
    return logFactorialTable[k];
  };
  var logSqrt2PI = 0.9189385332046727;
  function poisson(random, lambda = 1) {
    numberValidator(lambda).isPositive();
    if (lambda < 10) {
      const expMean = Math.exp(-lambda);
      return () => {
        let p = expMean;
        let x = 0;
        let u = random.next();
        while (u > p) {
          u = u - p;
          p = lambda * p / ++x;
        }
        return x;
      };
    } else {
      const smu = Math.sqrt(lambda);
      const b = 0.931 + smu * 2.53;
      const a = -0.059 + b * 0.02483;
      const invAlpha = 1.1239 + 1.1328 / (b - 3.4);
      const vR = 0.9277 - 3.6224 / (b - 2);
      return () => {
        while (true) {
          let u;
          let v = random.next();
          if (v <= vR * 0.86) {
            u = v / vR - 0.43;
            return Math.floor((a * 2 / (0.5 - Math.abs(u)) + b) * u + lambda + 0.445);
          }
          if (v >= vR) {
            u = random.next() - 0.5;
          } else {
            u = v / vR - 0.93;
            u = (u < 0 ? -0.5 : 0.5) - u;
            v = random.next() * vR;
          }
          const us = 0.5 - Math.abs(u);
          if (us < 0.013 && v > us) {
            continue;
          }
          const k = Math.floor((a * 2 / us + b) * u + lambda + 0.445);
          v = v * invAlpha / (a / (us * us) + b);
          if (k >= 10) {
            const t = (k + 0.5) * Math.log(lambda / k) - lambda - logSqrt2PI + k - (1 / 12 - (1 / 360 - 1 / (k * 1260 * k)) / (k * k)) / k;
            if (Math.log(v * smu) <= t) {
              return k;
            }
          } else if (k >= 0) {
            const f = logFactorial(k) ?? 0;
            if (Math.log(v) <= k * Math.log(lambda) - lambda - f) {
              return k;
            }
          }
        }
      };
    }
  }

  // src/distributions/uniform.ts
  function uniform(random, min = 0, max = 1) {
    return () => {
      return random.next() * (max - min) + min;
    };
  }

  // src/distributions/uniform-boolean.ts
  function uniformBoolean(random) {
    return () => {
      return random.next() >= 0.5;
    };
  }

  // src/distributions/uniform-int.ts
  function uniformInt(random, min = 0, max = 1) {
    if (max === undefined) {
      max = min === undefined ? 1 : min;
      min = 0;
    }
    numberValidator(min).isInt();
    numberValidator(max).isInt();
    return () => {
      return Math.floor(random.next() * (max - min + 1) + min);
    };
  }

  // src/random.ts
  var Random = class _Random {
    constructor(seedOrRNG = new MathRandomRNG()) {
      __publicField(this, "_rng");
      __publicField(this, "_cache", {});
      // --------------------------------------------------------------------------
      // Uniform utility functions
      // --------------------------------------------------------------------------
      /**
       * Convenience wrapper around `this.rng.next()`
       *
       * Returns a floating point number in [0, 1).
       *
       * @return {number}
       */
      __publicField(this, "next", () => {
        return this._rng.next();
      });
      /**
       * Samples a uniform random floating point number, optionally specifying
       * lower and upper bounds.
       *
       * Convence wrapper around `random.uniform()`
       *
       * @param {number} [min=0] - Lower bound (float, inclusive)
       * @param {number} [max=1] - Upper bound (float, exclusive)
       * @return {number}
       */
      __publicField(this, "float", (min, max) => {
        return this.uniform(min, max)();
      });
      /**
       * Samples a uniform random integer, optionally specifying lower and upper
       * bounds.
       *
       * Convence wrapper around `random.uniformInt()`
       *
       * @param {number} [min=0] - Lower bound (integer, inclusive)
       * @param {number} [max=1] - Upper bound (integer, inclusive)
       * @return {number}
       */
      __publicField(this, "int", (min, max) => {
        return this.uniformInt(min, max)();
      });
      /**
       * Samples a uniform random integer, optionally specifying lower and upper
       * bounds.
       *
       * Convence wrapper around `random.uniformInt()`
       *
       * @alias `random.int`
       *
       * @param {number} [min=0] - Lower bound (integer, inclusive)
       * @param {number} [max=1] - Upper bound (integer, inclusive)
       * @return {number}
       */
      __publicField(this, "integer", (min, max) => {
        return this.uniformInt(min, max)();
      });
      /**
       * Samples a uniform random boolean value.
       *
       * Convence wrapper around `random.uniformBoolean()`
       *
       * @alias `random.boolean`
       *
       * @return {boolean}
       */
      __publicField(this, "bool", () => {
        return this.uniformBoolean()();
      });
      /**
       * Samples a uniform random boolean value.
       *
       * Convence wrapper around `random.uniformBoolean()`
       *
       * @return {boolean}
       */
      __publicField(this, "boolean", () => {
        return this.uniformBoolean()();
      });
      // --------------------------------------------------------------------------
      // Uniform distributions
      // --------------------------------------------------------------------------
      /**
       * Generates a [Continuous uniform distribution](https://en.wikipedia.org/wiki/Uniform_distribution_(continuous)).
       *
       * @param {number} [min=0] - Lower bound (float, inclusive)
       * @param {number} [max=1] - Upper bound (float, exclusive)
       */
      __publicField(this, "uniform", (min, max) => {
        return this._memoize("uniform", uniform, min, max);
      });
      /**
       * Generates a [Discrete uniform distribution](https://en.wikipedia.org/wiki/Discrete_uniform_distribution).
       *
       * @param {number} [min=0] - Lower bound (integer, inclusive)
       * @param {number} [max=1] - Upper bound (integer, inclusive)
       * @return {function}
       */
      __publicField(this, "uniformInt", (min, max) => {
        return this._memoize("uniformInt", uniformInt, min, max);
      });
      /**
       * Generates a [Discrete uniform distribution](https://en.wikipedia.org/wiki/Discrete_uniform_distribution),
       * with two possible outcomes, `true` or `false.
       *
       * This method is analogous to flipping a coin.
       *
       * @return {function}
       */
      __publicField(this, "uniformBoolean", () => {
        return this._memoize("uniformBoolean", uniformBoolean);
      });
      // --------------------------------------------------------------------------
      // Normal distributions
      // --------------------------------------------------------------------------
      /**
       * Generates a [Normal distribution](https://en.wikipedia.org/wiki/Normal_distribution).
       *
       * @param {number} [mu=0] - Mean
       * @param {number} [sigma=1] - Standard deviation
       * @return {function}
       */
      __publicField(this, "normal", (mu, sigma) => {
        return normal(this, mu, sigma);
      });
      /**
       * Generates a [Log-normal distribution](https://en.wikipedia.org/wiki/Log-normal_distribution).
       *
       * @param {number} [mu=0] - Mean of underlying normal distribution
       * @param {number} [sigma=1] - Standard deviation of underlying normal distribution
       * @return {function}
       */
      __publicField(this, "logNormal", (mu, sigma) => {
        return logNormal(this, mu, sigma);
      });
      // --------------------------------------------------------------------------
      // Bernoulli distributions
      // --------------------------------------------------------------------------
      /**
       * Generates a [Bernoulli distribution](https://en.wikipedia.org/wiki/Bernoulli_distribution).
       *
       * @param {number} [p=0.5] - Success probability of each trial.
       * @return {function}
       */
      __publicField(this, "bernoulli", p => {
        return bernoulli(this, p);
      });
      /**
       * Generates a [Binomial distribution](https://en.wikipedia.org/wiki/Binomial_distribution).
       *
       * @param {number} [n=1] - Number of trials.
       * @param {number} [p=0.5] - Success probability of each trial.
       * @return {function}
       */
      __publicField(this, "binomial", (n, p) => {
        return binomial(this, n, p);
      });
      /**
       * Generates a [Geometric distribution](https://en.wikipedia.org/wiki/Geometric_distribution).
       *
       * @param {number} [p=0.5] - Success probability of each trial.
       * @return {function}
       */
      __publicField(this, "geometric", p => {
        return geometric(this, p);
      });
      // --------------------------------------------------------------------------
      // Poisson distributions
      // --------------------------------------------------------------------------
      /**
       * Generates a [Poisson distribution](https://en.wikipedia.org/wiki/Poisson_distribution).
       *
       * @param {number} [lambda=1] - Mean (lambda > 0)
       * @return {function}
       */
      __publicField(this, "poisson", lambda => {
        return poisson(this, lambda);
      });
      /**
       * Generates an [Exponential distribution](https://en.wikipedia.org/wiki/Exponential_distribution).
       *
       * @param {number} [lambda=1] - Inverse mean (lambda > 0)
       * @return {function}
       */
      __publicField(this, "exponential", lambda => {
        return exponential(this, lambda);
      });
      // --------------------------------------------------------------------------
      // Misc distributions
      // --------------------------------------------------------------------------
      /**
       * Generates an [Irwin Hall distribution](https://en.wikipedia.org/wiki/Irwin%E2%80%93Hall_distribution).
       *
       * @param {number} [n=1] - Number of uniform samples to sum (n >= 0)
       * @return {function}
       */
      __publicField(this, "irwinHall", n => {
        return irwinHall(this, n);
      });
      /**
       * Generates a [Bates distribution](https://en.wikipedia.org/wiki/Bates_distribution).
       *
       * @param {number} [n=1] - Number of uniform samples to average (n >= 1)
       * @return {function}
       */
      __publicField(this, "bates", n => {
        return bates(this, n);
      });
      /**
       * Generates a [Pareto distribution](https://en.wikipedia.org/wiki/Pareto_distribution).
       *
       * @param {number} [alpha=1] - Alpha
       * @return {function}
       */
      __publicField(this, "pareto", alpha => {
        return pareto(this, alpha);
      });
      this._rng = createRNG(seedOrRNG);
    }
    /**
     * @member {RNG} rng - Underlying pseudo-random number generator.
     */
    get rng() {
      return this._rng;
    }
    /**
     * Creates a new `Random` instance, optionally specifying parameters to
     * set a new seed.
     *
     * @return {Random}
     */
    clone(seedOrRNG = this.rng.clone()) {
      return new _Random(seedOrRNG);
    }
    /**
     * Sets the underlying pseudorandom number generator.
     *
     * @example
     * ```ts
     * import random from 'random'
     *
     * random.use('example-seed')
     * // or
     * random.use(Math.random)
     * ```
     */
    use(seedOrRNG) {
      this._rng = createRNG(seedOrRNG);
    }
    /**
     * Returns an item chosen uniformly at random from the given array.
     *
     * Convence wrapper around `random.uniformInt()`
     *
     * @param {Array<T>} [array] - Input array
     * @return {T | undefined}
     */
    choice(array) {
      if (!Array.isArray(array)) {
        throw new TypeError(`Random.choice expected input to be an array, got ${typeof array}`);
      }
      const length = array.length;
      if (length > 0) {
        const index = this.uniformInt(0, length - 1)();
        return array[index];
      } else {
        return undefined;
      }
    }
    // --------------------------------------------------------------------------
    // Internal
    // --------------------------------------------------------------------------
    /**
     * Memoizes distributions to ensure they're only created when necessary.
     *
     * Returns a thunk which that returns independent, identically distributed
     * samples from the specified distribution.
     *
     * @internal
     *
     * @param {string} label - Name of distribution
     * @param {function} getter - Function which generates a new distribution
     * @param {...*} args - Distribution-specific arguments
     *
     * @return {function}
     */
    _memoize(label, getter, ...args) {
      const key = `${args.join(";")}`;
      let value = this._cache[label];
      if (value === undefined || value.key !== key) {
        value = {
          key,
          distribution: getter(this, ...args)
        };
        this._cache[label] = value;
      }
      return value.distribution;
    }
  };
  var random_default = new Random();

  /***/
}),
/***/83853: (/***/module => {
  function _OverloadYield(e, d) {
    this.v = e;
    this.k = d;
  }
  module.exports = _OverloadYield;
  module.exports.__esModule = true;
  module.exports.default = module.exports;
  /***/
}),
/***/70088: (/***/module => {
  function _asyncIterator(r) {
    var n;
    var t;
    var o;
    var e = 2;
    for (typeof Symbol != "undefined" && (t = Symbol.asyncIterator, o = Symbol.iterator); e--;) {
      if (t && (n = r[t]) != null) {
        return n.call(r);
      }
      if (o && (n = r[o]) != null) {
        return new AsyncFromSyncIterator(n.call(r));
      }
      t = "@@asyncIterator";
      o = "@@iterator";
    }
    throw new TypeError("Object is not async iterable");
  }
  function AsyncFromSyncIterator(r) {
    function AsyncFromSyncIteratorContinuation(r) {
      if (Object(r) !== r) {
        return Promise.reject(new TypeError(r + " is not an object."));
      }
      var n = r.done;
      return Promise.resolve(r.value).then(function (r) {
        return {
          value: r,
          done: n
        };
      });
    }
    AsyncFromSyncIterator = function AsyncFromSyncIterator(r) {
      this.s = r;
      this.n = r.next;
    };
    AsyncFromSyncIterator.prototype = {
      s: null,
      n: null,
      next: function next() {
        return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments));
      },
      return: function _return(r) {
        var n = this.s.return;
        if (n === undefined) {
          return Promise.resolve({
            value: r,
            done: true
          });
        } else {
          return AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
        }
      },
      throw: function _throw(r) {
        var n = this.s.return;
        if (n === undefined) {
          return Promise.reject(r);
        } else {
          return AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
        }
      }
    };
    return new AsyncFromSyncIterator(r);
  }
  module.exports = _asyncIterator;
  module.exports.__esModule = true;
  module.exports.default = module.exports;
  /***/
}),
/***/24510: (/***/module => {
  function asyncGeneratorStep(n, t, e, r, o, a, c) {
    try {
      var i = n[a](c);
      var u = i.value;
    } catch (n) {
      e(n);
      return;
    }
    if (i.done) {
      t(u);
    } else {
      Promise.resolve(u).then(r, o);
    }
  }
  function _asyncToGenerator(n) {
    return function () {
      var t = this;
      var e = arguments;
      return new Promise(function (r, o) {
        var a = n.apply(t, e);
        function _next(n) {
          asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
        }
        function _throw(n) {
          asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
        }
        _next(undefined);
      });
    };
  }
  module.exports = _asyncToGenerator;
  module.exports.__esModule = true;
  module.exports.default = module.exports;
  /***/
}),
/***/88361: (/***/(module, __unused_webpack_exports, __webpack_require__) => {

  function _awaitAsyncGenerator(e) {
    return new OverloadYield(e, 0);
  }
  module.exports = _awaitAsyncGenerator;
  module.exports.__esModule = true;
  module.exports.default = module.exports;
  /***/
}),
/***/31761: (/***/(module, __unused_webpack_exports, __webpack_require__) => {

  function _wrapAsyncGenerator(e) {
    return function () {
      return new AsyncGenerator(e.apply(this, arguments));
    };
  }
  function AsyncGenerator(e) {
    var r;
    var t;
    function resume(r, t) {
      try {
        var n = e[r](t);
        var o = n.value;
        var u = o instanceof OverloadYield;
        Promise.resolve(u ? o.v : o).then(function (t) {
          if (u) {
            var i = r === "return" ? "return" : "next";
            if (!o.k || t.done) {
              return resume(i, t);
            }
            t = e[i](t).value;
          }
          settle(n.done ? "return" : "normal", t);
        }, function (e) {
          resume("throw", e);
        });
      } catch (e) {
        settle("throw", e);
      }
    }
    function settle(e, n) {
      switch (e) {
        case "return":
          r.resolve({
            value: n,
            done: true
          });
          break;
        case "throw":
          r.reject(n);
          break;
        default:
          r.resolve({
            value: n,
            done: false
          });
      }
      if (r = r.next) {
        resume(r.key, r.arg);
      } else {
        t = null;
      }
    }
    this._invoke = function (e, n) {
      return new Promise(function (o, u) {
        var i = {
          key: e,
          arg: n,
          resolve: o,
          reject: u,
          next: null
        };
        if (t) {
          t = t.next = i;
        } else {
          r = t = i;
          resume(e, n);
        }
      });
    };
    if (typeof e.return != "function") {
      this.return = undefined;
    }
  }
  AsyncGenerator.prototype[typeof Symbol == "function" && Symbol.asyncIterator || "@@asyncIterator"] = function () {
    return this;
  };
  AsyncGenerator.prototype.next = function (e) {
    return this._invoke("next", e);
  };
  AsyncGenerator.prototype.throw = function (e) {
    return this._invoke("throw", e);
  };
  AsyncGenerator.prototype.return = function (e) {
    return this._invoke("return", e);
  };
  module.exports = _wrapAsyncGenerator;
  module.exports.__esModule = true;
  module.exports.default = module.exports;
  /***/
}),
/***/10194: (/***/(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    FX: () => (/* binding */ɵPRE_STYLE),
    If: () => (/* binding */AnimationMetadataType),
    K2: () => (/* binding */sequence),
    MA: () => (/* binding */animateChild),
    Os: () => (/* binding */group),
    P: () => (/* binding */query),
    hZ: () => (/* binding */trigger),
    i0: () => (/* binding */animate),
    iF: () => (/* binding */style),
    kY: () => (/* binding */transition),
    kp: () => (/* binding */AUTO_STYLE),
    sf: () => (/* binding */NoopAnimationPlayer),
    ui: () => (/* binding */AnimationGroupPlayer),
    wk: () => (/* binding */state)

  });

  /**
   * @license Angular v18.2.13
   * (c) 2010-2024 Google LLC. https://angular.io/
   * License: MIT
   */

  /**
   * @description Constants for the categories of parameters that can be defined for animations.
   *
   * A corresponding function defines a set of parameters for each category, and
   * collects them into a corresponding `AnimationMetadata` object.
   *
   * @publicApi
   */
  var AnimationMetadataType = /*#__PURE__*/function (AnimationMetadataType) {
    /**
     * Associates a named animation state with a set of CSS styles.
     * See [`state()`](api/animations/state)
     */
    AnimationMetadataType[AnimationMetadataType.State = 0] = "State";
    /**
     * Data for a transition from one animation state to another.
     * See `transition()`
     */
    AnimationMetadataType[AnimationMetadataType.Transition = 1] = "Transition";
    /**
     * Contains a set of animation steps.
     * See `sequence()`
     */
    AnimationMetadataType[AnimationMetadataType.Sequence = 2] = "Sequence";
    /**
     * Contains a set of animation steps.
     * See `{@link animations/group group()}`
     */
    AnimationMetadataType[AnimationMetadataType.Group = 3] = "Group";
    /**
     * Contains an animation step.
     * See `animate()`
     */
    AnimationMetadataType[AnimationMetadataType.Animate = 4] = "Animate";
    /**
     * Contains a set of animation steps.
     * See `keyframes()`
     */
    AnimationMetadataType[AnimationMetadataType.Keyframes = 5] = "Keyframes";
    /**
     * Contains a set of CSS property-value pairs into a named style.
     * See `style()`
     */
    AnimationMetadataType[AnimationMetadataType.Style = 6] = "Style";
    /**
     * Associates an animation with an entry trigger that can be attached to an element.
     * See `trigger()`
     */
    AnimationMetadataType[AnimationMetadataType.Trigger = 7] = "Trigger";
    /**
     * Contains a re-usable animation.
     * See `animation()`
     */
    AnimationMetadataType[AnimationMetadataType.Reference = 8] = "Reference";
    /**
     * Contains data to use in executing child animations returned by a query.
     * See `animateChild()`
     */
    AnimationMetadataType[AnimationMetadataType.AnimateChild = 9] = "AnimateChild";
    /**
     * Contains animation parameters for a re-usable animation.
     * See `useAnimation()`
     */
    AnimationMetadataType[AnimationMetadataType.AnimateRef = 10] = "AnimateRef";
    /**
     * Contains child-animation query data.
     * See `query()`
     */
    AnimationMetadataType[AnimationMetadataType.Query = 11] = "Query";
    /**
     * Contains data for staggering an animation sequence.
     * See `stagger()`
     */
    AnimationMetadataType[AnimationMetadataType.Stagger = 12] = "Stagger";
    return AnimationMetadataType;
  }(AnimationMetadataType || {});
  /**
   * Specifies automatic styling.
   *
   * @publicApi
   */
  const AUTO_STYLE = "*";
  /**
   * Creates a named animation trigger, containing a  list of [`state()`](api/animations/state)
   * and `transition()` entries to be evaluated when the expression
   * bound to the trigger changes.
   *
   * @param name An identifying string.
   * @param definitions  An animation definition object, containing an array of
   * [`state()`](api/animations/state) and `transition()` declarations.
   *
   * @return An object that encapsulates the trigger data.
   *
   * @usageNotes
   * Define an animation trigger in the `animations` section of `@Component` metadata.
   * In the template, reference the trigger by name and bind it to a trigger expression that
   * evaluates to a defined animation state, using the following format:
   *
   * `[@triggerName]="expression"`
   *
   * Animation trigger bindings convert all values to strings, and then match the
   * previous and current values against any linked transitions.
   * Booleans can be specified as `1` or `true` and `0` or `false`.
   *
   * ### Usage Example
   *
   * The following example creates an animation trigger reference based on the provided
   * name value.
   * The provided animation value is expected to be an array consisting of state and
   * transition declarations.
   *
   * ```typescript
   * @Component({
   *   selector: "my-component",
   *   templateUrl: "my-component-tpl.html",
   *   animations: [
   *     trigger("myAnimationTrigger", [
   *       state(...),
   *       state(...),
   *       transition(...),
   *       transition(...)
   *     ])
   *   ]
   * })
   * class MyComponent {
   *   myStatusExp = "something";
   * }
   * ```
   *
   * The template associated with this component makes use of the defined trigger
   * by binding to an element within its template code.
   *
   * ```html
   * <!-- somewhere inside of my-component-tpl.html -->
   * <div [@myAnimationTrigger]="myStatusExp">...</div>
   * ```
   *
   * ### Using an inline function
   * The `transition` animation method also supports reading an inline function which can decide
   * if its associated animation should be run.
   *
   * ```typescript
   * // this method is run each time the `myAnimationTrigger` trigger value changes.
   * function myInlineMatcherFn(fromState: string, toState: string, element: any, params: {[key:
   string]: any}): boolean {
   *   // notice that `element` and `params` are also available here
   *   return toState == 'yes-please-animate';
   * }
   *
   * @Component({
   *   selector: 'my-component',
   *   templateUrl: 'my-component-tpl.html',
   *   animations: [
   *     trigger('myAnimationTrigger', [
   *       transition(myInlineMatcherFn, [
   *         // the animation sequence code
   *       ]),
   *     ])
   *   ]
   * })
   * class MyComponent {
   *   myStatusExp = "yes-please-animate";
   * }
   * ```
   *
   * ### Disabling Animations
   * When true, the special animation control binding `@.disabled` binding prevents
   * all animations from rendering.
   * Place the  `@.disabled` binding on an element to disable
   * animations on the element itself, as well as any inner animation triggers
   * within the element.
   *
   * The following example shows how to use this feature:
   *
   * ```typescript
   * @Component({
   *   selector: 'my-component',
   *   template: `
   *     <div [@.disabled]="isDisabled">
   *       <div [@childAnimation]="exp"></div>
   *     </div>
   *   `,
   *   animations: [
   *     trigger("childAnimation", [
   *       // ...
   *     ])
   *   ]
   * })
   * class MyComponent {
   *   isDisabled = true;
   *   exp = '...';
   * }
   * ```
   *
   * When `@.disabled` is true, it prevents the `@childAnimation` trigger from animating,
   * along with any inner animations.
   *
   * ### Disable animations application-wide
   * When an area of the template is set to have animations disabled,
   * **all** inner components have their animations disabled as well.
   * This means that you can disable all animations for an app
   * by placing a host binding set on `@.disabled` on the topmost Angular component.
   *
   * ```typescript
   * import {Component, HostBinding} from '@angular/core';
   *
   * @Component({
   *   selector: 'app-component',
   *   templateUrl: 'app.component.html',
   * })
   * class AppComponent {
   *   @HostBinding('@.disabled')
   *   public animationsDisabled = true;
   * }
   * ```
   *
   * ### Overriding disablement of inner animations
   * Despite inner animations being disabled, a parent animation can `query()`
   * for inner elements located in disabled areas of the template and still animate
   * them if needed. This is also the case for when a sub animation is
   * queried by a parent and then later animated using `animateChild()`.
   *
   * ### Detecting when an animation is disabled
   * If a region of the DOM (or the entire application) has its animations disabled, the animation
   * trigger callbacks still fire, but for zero seconds. When the callback fires, it provides
   * an instance of an `AnimationEvent`. If animations are disabled,
   * the `.disabled` flag on the event is true.
   *
   * @publicApi
   */
  function trigger(name, definitions) {
    return {
      type: AnimationMetadataType.Trigger,
      name,
      definitions,
      options: {}
    };
  }
  /**
   * Defines an animation step that combines styling information with timing information.
   *
   * @param timings Sets `AnimateTimings` for the parent animation.
   * A string in the format "duration [delay] [easing]".
   *  - Duration and delay are expressed as a number and optional time unit,
   * such as "1s" or "10ms" for one second and 10 milliseconds, respectively.
   * The default unit is milliseconds.
   *  - The easing value controls how the animation accelerates and decelerates
   * during its runtime. Value is one of  `ease`, `ease-in`, `ease-out`,
   * `ease-in-out`, or a `cubic-bezier()` function call.
   * If not supplied, no easing is applied.
   *
   * For example, the string "1s 100ms ease-out" specifies a duration of
   * 1000 milliseconds, and delay of 100 ms, and the "ease-out" easing style,
   * which decelerates near the end of the duration.
   * @param styles Sets AnimationStyles for the parent animation.
   * A function call to either `style()` or `keyframes()`
   * that returns a collection of CSS style entries to be applied to the parent animation.
   * When null, uses the styles from the destination state.
   * This is useful when describing an animation step that will complete an animation;
   * see "Animating to the final state" in `transitions()`.
   * @returns An object that encapsulates the animation step.
   *
   * @usageNotes
   * Call within an animation `sequence()`, `{@link animations/group group()}`, or
   * `transition()` call to specify an animation step
   * that applies given style data to the parent animation for a given amount of time.
   *
   * ### Syntax Examples
   * **Timing examples**
   *
   * The following examples show various `timings` specifications.
   * - `animate(500)` : Duration is 500 milliseconds.
   * - `animate("1s")` : Duration is 1000 milliseconds.
   * - `animate("100ms 0.5s")` : Duration is 100 milliseconds, delay is 500 milliseconds.
   * - `animate("5s ease-in")` : Duration is 5000 milliseconds, easing in.
   * - `animate("5s 10ms cubic-bezier(.17,.67,.88,.1)")` : Duration is 5000 milliseconds, delay is 10
   * milliseconds, easing according to a bezier curve.
   *
   * **Style examples**
   *
   * The following example calls `style()` to set a single CSS style.
   * ```typescript
   * animate(500, style({ background: "red" }))
   * ```
   * The following example calls `keyframes()` to set a CSS style
   * to different values for successive keyframes.
   * ```typescript
   * animate(500, keyframes(
   *  [
   *   style({ background: "blue" }),
   *   style({ background: "red" })
   *  ])
   * ```
   *
   * @publicApi
   */
  function animate(timings, styles = null) {
    return {
      type: AnimationMetadataType.Animate,
      styles,
      timings
    };
  }
  /**
   * @description Defines a list of animation steps to be run in parallel.
   *
   * @param steps An array of animation step objects.
   * - When steps are defined by `style()` or `animate()`
   * function calls, each call within the group is executed instantly.
   * - To specify offset styles to be applied at a later time, define steps with
   * `keyframes()`, or use `animate()` calls with a delay value.
   * For example:
   *
   * ```typescript
   * group([
   *   animate("1s", style({ background: "black" })),
   *   animate("2s", style({ color: "white" }))
   * ])
   * ```
   *
   * @param options An options object containing a delay and
   * developer-defined parameters that provide styling defaults and
   * can be overridden on invocation.
   *
   * @return An object that encapsulates the group data.
   *
   * @usageNotes
   * Grouped animations are useful when a series of styles must be
   * animated at different starting times and closed off at different ending times.
   *
   * When called within a `sequence()` or a
   * `transition()` call, does not continue to the next
   * instruction until all of the inner animation steps have completed.
   *
   * @publicApi
   */
  function group(steps, options = null) {
    return {
      type: AnimationMetadataType.Group,
      steps,
      options
    };
  }
  /**
   * Defines a list of animation steps to be run sequentially, one by one.
   *
   * @param steps An array of animation step objects.
   * - Steps defined by `style()` calls apply the styling data immediately.
   * - Steps defined by `animate()` calls apply the styling data over time
   *   as specified by the timing data.
   *
   * ```typescript
   * sequence([
   *   style({ opacity: 0 }),
   *   animate("1s", style({ opacity: 1 }))
   * ])
   * ```
   *
   * @param options An options object containing a delay and
   * developer-defined parameters that provide styling defaults and
   * can be overridden on invocation.
   *
   * @return An object that encapsulates the sequence data.
   *
   * @usageNotes
   * When you pass an array of steps to a
   * `transition()` call, the steps run sequentially by default.
   * Compare this to the `{@link animations/group group()}` call, which runs animation steps in
   *parallel.
   *
   * When a sequence is used within a `{@link animations/group group()}` or a `transition()` call,
   * execution continues to the next instruction only after each of the inner animation
   * steps have completed.
   *
   * @publicApi
   **/
  function sequence(steps, options = null) {
    return {
      type: AnimationMetadataType.Sequence,
      steps,
      options
    };
  }
  /**
   * Declares a key/value object containing CSS properties/styles that
   * can then be used for an animation [`state`](api/animations/state), within an animation
   *`sequence`, or as styling data for calls to `animate()` and `keyframes()`.
   *
   * @param tokens A set of CSS styles or HTML styles associated with an animation state.
   * The value can be any of the following:
   * - A key-value style pair associating a CSS property with a value.
   * - An array of key-value style pairs.
   * - An asterisk (*), to use auto-styling, where styles are derived from the element
   * being animated and applied to the animation when it starts.
   *
   * Auto-styling can be used to define a state that depends on layout or other
   * environmental factors.
   *
   * @return An object that encapsulates the style data.
   *
   * @usageNotes
   * The following examples create animation styles that collect a set of
   * CSS property values:
   *
   * ```typescript
   * // string values for CSS properties
   * style({ background: "red", color: "blue" })
   *
   * // numerical pixel values
   * style({ width: 100, height: 0 })
   * ```
   *
   * The following example uses auto-styling to allow an element to animate from
   * a height of 0 up to its full height:
   *
   * ```
   * style({ height: 0 }),
   * animate("1s", style({ height: "*" }))
   * ```
   *
   * @publicApi
   **/
  function style(tokens) {
    return {
      type: AnimationMetadataType.Style,
      styles: tokens,
      offset: null
    };
  }
  /**
   * Declares an animation state within a trigger attached to an element.
   *
   * @param name One or more names for the defined state in a comma-separated string.
   * The following reserved state names can be supplied to define a style for specific use
   * cases:
   *
   * - `void` You can associate styles with this name to be used when
   * the element is detached from the application. For example, when an `ngIf` evaluates
   * to false, the state of the associated element is void.
   *  - `*` (asterisk) Indicates the default state. You can associate styles with this name
   * to be used as the fallback when the state that is being animated is not declared
   * within the trigger.
   *
   * @param styles A set of CSS styles associated with this state, created using the
   * `style()` function.
   * This set of styles persists on the element once the state has been reached.
   * @param options Parameters that can be passed to the state when it is invoked.
   * 0 or more key-value pairs.
   * @return An object that encapsulates the new state data.
   *
   * @usageNotes
   * Use the `trigger()` function to register states to an animation trigger.
   * Use the `transition()` function to animate between states.
   * When a state is active within a component, its associated styles persist on the element,
   * even when the animation ends.
   *
   * @publicApi
   **/
  function state(name, styles, options) {
    return {
      type: AnimationMetadataType.State,
      name,
      styles,
      options
    };
  }
  /**
   * Defines a set of animation styles, associating each style with an optional `offset` value.
   *
   * @param steps A set of animation styles with optional offset data.
   * The optional `offset` value for a style specifies a percentage of the total animation
   * time at which that style is applied.
   * @returns An object that encapsulates the keyframes data.
   *
   * @usageNotes
   * Use with the `animate()` call. Instead of applying animations
   * from the current state
   * to the destination state, keyframes describe how each style entry is applied and at what point
   * within the animation arc.
   * Compare [CSS Keyframe Animations](https://www.w3schools.com/css/css3_animations.asp).
   *
   * ### Usage
   *
   * In the following example, the offset values describe
   * when each `backgroundColor` value is applied. The color is red at the start, and changes to
   * blue when 20% of the total time has elapsed.
   *
   * ```typescript
   * // the provided offset values
   * animate("5s", keyframes([
   *   style({ backgroundColor: "red", offset: 0 }),
   *   style({ backgroundColor: "blue", offset: 0.2 }),
   *   style({ backgroundColor: "orange", offset: 0.3 }),
   *   style({ backgroundColor: "black", offset: 1 })
   * ]))
   * ```
   *
   * If there are no `offset` values specified in the style entries, the offsets
   * are calculated automatically.
   *
   * ```typescript
   * animate("5s", keyframes([
   *   style({ backgroundColor: "red" }) // offset = 0
   *   style({ backgroundColor: "blue" }) // offset = 0.33
   *   style({ backgroundColor: "orange" }) // offset = 0.66
   *   style({ backgroundColor: "black" }) // offset = 1
   * ]))
   *```

   * @publicApi
   */
  function keyframes(steps) {
    return {
      type: AnimationMetadataType.Keyframes,
      steps
    };
  }
  /**
   * Declares an animation transition which is played when a certain specified condition is met.
   *
   * @param stateChangeExpr A string with a specific format or a function that specifies when the
   * animation transition should occur (see [State Change Expression](#state-change-expression)).
   *
   * @param steps One or more animation objects that represent the animation's instructions.
   *
   * @param options An options object that can be used to specify a delay for the animation or provide
   * custom parameters for it.
   *
   * @returns An object that encapsulates the transition data.
   *
   * @usageNotes
   *
   * ### State Change Expression
   *
   * The State Change Expression instructs Angular when to run the transition's animations, it can
   *either be
   *  - a string with a specific syntax
   *  - or a function that compares the previous and current state (value of the expression bound to
   *    the element's trigger) and returns `true` if the transition should occur or `false` otherwise
   *
   * The string format can be:
   *  - `fromState => toState`, which indicates that the transition's animations should occur then the
   *    expression bound to the trigger's element goes from `fromState` to `toState`
   *
   *    _Example:_
   *      ```typescript
   *        transition('open => closed', animate('.5s ease-out', style({ height: 0 }) ))
   *      ```
   *
   *  - `fromState <=> toState`, which indicates that the transition's animations should occur then
   *    the expression bound to the trigger's element goes from `fromState` to `toState` or vice versa
   *
   *    _Example:_
   *      ```typescript
   *        transition('enabled <=> disabled', animate('1s cubic-bezier(0.8,0.3,0,1)'))
   *      ```
   *
   *  - `:enter`/`:leave`, which indicates that the transition's animations should occur when the
   *    element enters or exists the DOM
   *
   *    _Example:_
   *      ```typescript
   *        transition(':enter', [
   *          style({ opacity: 0 }),
   *          animate('500ms', style({ opacity: 1 }))
   *        ])
   *      ```
   *
   *  - `:increment`/`:decrement`, which indicates that the transition's animations should occur when
   *    the numerical expression bound to the trigger's element has increased in value or decreased
   *
   *    _Example:_
   *      ```typescript
   *        transition(':increment', query('@counter', animateChild()))
   *      ```
   *
   *  - a sequence of any of the above divided by commas, which indicates that transition's animations
   *    should occur whenever one of the state change expressions matches
   *
   *    _Example:_
   *      ```typescript
   *        transition(':increment, * => enabled, :enter', animate('1s ease', keyframes([
   *          style({ transform: 'scale(1)', offset: 0}),
   *          style({ transform: 'scale(1.1)', offset: 0.7}),
   *          style({ transform: 'scale(1)', offset: 1})
   *        ]))),
   *      ```
   *
   * Also note that in such context:
   *  - `void` can be used to indicate the absence of the element
   *  - asterisks can be used as wildcards that match any state
   *  - (as a consequence of the above, `void => *` is equivalent to `:enter` and `* => void` is
   *    equivalent to `:leave`)
   *  - `true` and `false` also match expression values of `1` and `0` respectively (but do not match
   *    _truthy_ and _falsy_ values)
   *
   * <div class="alert is-helpful">
   *
   *  Be careful about entering end leaving elements as their transitions present a common
   *  pitfall for developers.
   *
   *  Note that when an element with a trigger enters the DOM its `:enter` transition always
   *  gets executed, but its `:leave` transition will not be executed if the element is removed
   *  alongside its parent (as it will be removed "without warning" before its transition has
   *  a chance to be executed, the only way that such transition can occur is if the element
   *  is exiting the DOM on its own).
   *
   *
   * </div>
   *
   * ### Animating to a Final State
   *
   * If the final step in a transition is a call to `animate()` that uses a timing value
   * with no `style` data, that step is automatically considered the final animation arc,
   * for the element to reach the final state, in such case Angular automatically adds or removes
   * CSS styles to ensure that the element is in the correct final state.
   *
   *
   * ### Usage Examples
   *
   *  - Transition animations applied based on
   *    the trigger's expression value
   *
   *   ```html
   *   <div [@myAnimationTrigger]="myStatusExp">
   *    ...
   *   </div>
   *   ```
   *
   *   ```typescript
   *   trigger("myAnimationTrigger", [
   *     ..., // states
   *     transition("on => off, open => closed", animate(500)),
   *     transition("* <=> error", query('.indicator', animateChild()))
   *   ])
   *   ```
   *
   *  - Transition animations applied based on custom logic dependent
   *    on the trigger's expression value and provided parameters
   *
   *    ```html
   *    <div [@myAnimationTrigger]="{
   *     value: stepName,
   *     params: { target: currentTarget }
   *    }">
   *     ...
   *    </div>
   *    ```
   *
   *    ```typescript
   *    trigger("myAnimationTrigger", [
   *      ..., // states
   *      transition(
   *        (fromState, toState, _element, params) =>
   *          ['firststep', 'laststep'].includes(fromState.toLowerCase())
   *          && toState === params?.['target'],
   *        animate('1s')
   *      )
   *    ])
   *    ```
   *
   * @publicApi
   **/
  function transition(stateChangeExpr, steps, options = null) {
    return {
      type: AnimationMetadataType.Transition,
      expr: stateChangeExpr,
      animation: steps,
      options
    };
  }
  /**
   * Produces a reusable animation that can be invoked in another animation or sequence,
   * by calling the `useAnimation()` function.
   *
   * @param steps One or more animation objects, as returned by the `animate()`
   * or `sequence()` function, that form a transformation from one state to another.
   * A sequence is used by default when you pass an array.
   * @param options An options object that can contain a delay value for the start of the
   * animation, and additional developer-defined parameters.
   * Provided values for additional parameters are used as defaults,
   * and override values can be passed to the caller on invocation.
   * @returns An object that encapsulates the animation data.
   *
   * @usageNotes
   * The following example defines a reusable animation, providing some default parameter
   * values.
   *
   * ```typescript
   * var fadeAnimation = animation([
   *   style({ opacity: '{{ start }}' }),
   *   animate('{{ time }}',
   *   style({ opacity: '{{ end }}'}))
   *   ],
   *   { params: { time: '1000ms', start: 0, end: 1 }});
   * ```
   *
   * The following invokes the defined animation with a call to `useAnimation()`,
   * passing in override parameter values.
   *
   * ```js
   * useAnimation(fadeAnimation, {
   *   params: {
   *     time: '2s',
   *     start: 1,
   *     end: 0
   *   }
   * })
   * ```
   *
   * If any of the passed-in parameter values are missing from this call,
   * the default values are used. If one or more parameter values are missing before a step is
   * animated, `useAnimation()` throws an error.
   *
   * @publicApi
   */
  function animation(steps, options = null) {
    return {
      type: AnimationMetadataType.Reference,
      animation: steps,
      options
    };
  }
  /**
   * Executes a queried inner animation element within an animation sequence.
   *
   * @param options An options object that can contain a delay value for the start of the
   * animation, and additional override values for developer-defined parameters.
   * @return An object that encapsulates the child animation data.
   *
   * @usageNotes
   * Each time an animation is triggered in Angular, the parent animation
   * has priority and any child animations are blocked. In order
   * for a child animation to run, the parent animation must query each of the elements
   * containing child animations, and run them using this function.
   *
   * Note that this feature is designed to be used with `query()` and it will only work
   * with animations that are assigned using the Angular animation library. CSS keyframes
   * and transitions are not handled by this API.
   *
   * @publicApi
   */
  function animateChild(options = null) {
    return {
      type: AnimationMetadataType.AnimateChild,
      options
    };
  }
  /**
   * Starts a reusable animation that is created using the `animation()` function.
   *
   * @param animation The reusable animation to start.
   * @param options An options object that can contain a delay value for the start of
   * the animation, and additional override values for developer-defined parameters.
   * @return An object that contains the animation parameters.
   *
   * @publicApi
   */
  function useAnimation(animation, options = null) {
    return {
      type: AnimationMetadataType.AnimateRef,
      animation,
      options
    };
  }
  /**
   * Finds one or more inner elements within the current element that is
   * being animated within a sequence. Use with `animate()`.
   *
   * @param selector The element to query, or a set of elements that contain Angular-specific
   * characteristics, specified with one or more of the following tokens.
   *  - `query(":enter")` or `query(":leave")` : Query for newly inserted/removed elements (not
   *     all elements can be queried via these tokens, see
   *     [Entering and Leaving Elements](#entering-and-leaving-elements))
   *  - `query(":animating")` : Query all currently animating elements.
   *  - `query("@triggerName")` : Query elements that contain an animation trigger.
   *  - `query("@*")` : Query all elements that contain an animation triggers.
   *  - `query(":self")` : Include the current element into the animation sequence.
   *
   * @param animation One or more animation steps to apply to the queried element or elements.
   * An array is treated as an animation sequence.
   * @param options An options object. Use the 'limit' field to limit the total number of
   * items to collect.
   * @return An object that encapsulates the query data.
   *
   * @usageNotes
   *
   * ### Multiple Tokens
   *
   * Tokens can be merged into a combined query selector string. For example:
   *
   * ```typescript
   *  query(':self, .record:enter, .record:leave, @subTrigger', [...])
   * ```
   *
   * The `query()` function collects multiple elements and works internally by using
   * `element.querySelectorAll`. Use the `limit` field of an options object to limit
   * the total number of items to be collected. For example:
   *
   * ```js
   * query('div', [
   *   animate(...),
   *   animate(...)
   * ], { limit: 1 })
   * ```
   *
   * By default, throws an error when zero items are found. Set the
   * `optional` flag to ignore this error. For example:
   *
   * ```js
   * query('.some-element-that-may-not-be-there', [
   *   animate(...),
   *   animate(...)
   * ], { optional: true })
   * ```
   *
   * ### Entering and Leaving Elements
   *
   * Not all elements can be queried via the `:enter` and `:leave` tokens, the only ones
   * that can are those that Angular assumes can enter/leave based on their own logic
   * (if their insertion/removal is simply a consequence of that of their parent they
   * should be queried via a different token in their parent's `:enter`/`:leave` transitions).
   *
   * The only elements Angular assumes can enter/leave based on their own logic (thus the only
   * ones that can be queried via the `:enter` and `:leave` tokens) are:
   *  - Those inserted dynamically (via `ViewContainerRef`)
   *  - Those that have a structural directive (which, under the hood, are a subset of the above ones)
   *
   * <div class="alert is-helpful">
   *
   *  Note that elements will be successfully queried via `:enter`/`:leave` even if their
   *  insertion/removal is not done manually via `ViewContainerRef`or caused by their structural
   *  directive (e.g. they enter/exit alongside their parent).
   *
   * </div>
   *
   * <div class="alert is-important">
   *
   *  There is an exception to what previously mentioned, besides elements entering/leaving based on
   *  their own logic, elements with an animation trigger can always be queried via `:leave` when
   * their parent is also leaving.
   *
   * </div>
   *
   * ### Usage Example
   *
   * The following example queries for inner elements and animates them
   * individually using `animate()`.
   *
   * ```typescript
   * @Component({
   *   selector: 'inner',
   *   template: `
   *     <div [@queryAnimation]="exp">
   *       <h1>Title</h1>
   *       <div class="content">
   *         Blah blah blah
   *       </div>
   *     </div>
   *   `,
   *   animations: [
   *    trigger('queryAnimation', [
   *      transition('* => goAnimate', [
   *        // hide the inner elements
   *        query('h1', style({ opacity: 0 })),
   *        query('.content', style({ opacity: 0 })),
   *
   *        // animate the inner elements in, one by one
   *        query('h1', animate(1000, style({ opacity: 1 }))),
   *        query('.content', animate(1000, style({ opacity: 1 }))),
   *      ])
   *    ])
   *  ]
   * })
   * class Cmp {
   *   exp = '';
   *
   *   goAnimate() {
   *     this.exp = 'goAnimate';
   *   }
   * }
   * ```
   *
   * @publicApi
   */
  function query(selector, animation, options = null) {
    return {
      type: AnimationMetadataType.Query,
      selector,
      animation,
      options
    };
  }
  /**
   * Use within an animation `query()` call to issue a timing gap after
   * each queried item is animated.
   *
   * @param timings A delay value.
   * @param animation One ore more animation steps.
   * @returns An object that encapsulates the stagger data.
   *
   * @usageNotes
   * In the following example, a container element wraps a list of items stamped out
   * by an `ngFor`. The container element contains an animation trigger that will later be set
   * to query for each of the inner items.
   *
   * Each time items are added, the opacity fade-in animation runs,
   * and each removed item is faded out.
   * When either of these animations occur, the stagger effect is
   * applied after each item's animation is started.
   *
   * ```html
   * <!-- list.component.html -->
   * <button (click)="toggle()">Show / Hide Items</button>
   * <hr />
   * <div [@listAnimation]="items.length">
   *   <div *ngFor="let item of items">
   *     {{ item }}
   *   </div>
   * </div>
   * ```
   *
   * Here is the component code:
   *
   * ```typescript
   * import {trigger, transition, style, animate, query, stagger} from '@angular/animations';
   * @Component({
   *   templateUrl: 'list.component.html',
   *   animations: [
   *     trigger('listAnimation', [
   *     ...
   *     ])
   *   ]
   * })
   * class ListComponent {
   *   items = [];
   *
   *   showItems() {
   *     this.items = [0,1,2,3,4];
   *   }
   *
   *   hideItems() {
   *     this.items = [];
   *   }
   *
   *   toggle() {
   *     this.items.length ? this.hideItems() : this.showItems();
   *    }
   *  }
   * ```
   *
   * Here is the animation trigger code:
   *
   * ```typescript
   * trigger('listAnimation', [
   *   transition('* => *', [ // each time the binding value changes
   *     query(':leave', [
   *       stagger(100, [
   *         animate('0.5s', style({ opacity: 0 }))
   *       ])
   *     ]),
   *     query(':enter', [
   *       style({ opacity: 0 }),
   *       stagger(100, [
   *         animate('0.5s', style({ opacity: 1 }))
   *       ])
   *     ])
   *   ])
   * ])
   * ```
   *
   * @publicApi
   */
  function stagger(timings, animation) {
    return {
      type: AnimationMetadataType.Stagger,
      timings,
      animation
    };
  }

  /**
   * An injectable service that produces an animation sequence programmatically within an
   * Angular component or directive.
   * Provided by the `BrowserAnimationsModule` or `NoopAnimationsModule`.
   *
   * @usageNotes
   *
   * To use this service, add it to your component or directive as a dependency.
   * The service is instantiated along with your component.
   *
   * Apps do not typically need to create their own animation players, but if you
   * do need to, follow these steps:
   *
   * 1. Use the <code>[AnimationBuilder.build](api/animations/AnimationBuilder#build)()</code> method
   * to create a programmatic animation. The method returns an `AnimationFactory` instance.
   *
   * 2. Use the factory object to create an `AnimationPlayer` and attach it to a DOM element.
   *
   * 3. Use the player object to control the animation programmatically.
   *
   * For example:
   *
   * ```ts
   * // import the service from BrowserAnimationsModule
   * import {AnimationBuilder} from '@angular/animations';
   * // require the service as a dependency
   * class MyCmp {
   *   constructor(private _builder: AnimationBuilder) {}
   *
   *   makeAnimation(element: any) {
   *     // first define a reusable animation
   *     const myAnimation = this._builder.build([
   *       style({ width: 0 }),
   *       animate(1000, style({ width: '100px' }))
   *     ]);
   *
   *     // use the returned factory object to create a player
   *     const player = myAnimation.create(element);
   *
   *     player.play();
   *   }
   * }
   * ```
   *
   * @publicApi
   */
  let AnimationBuilder = /*#__PURE__*/ /* unused pure expression or super */null && (() => {
    class AnimationBuilder {
      static #_ = (() => this.ɵfac = function AnimationBuilder_Factory(__ngFactoryType__) {
        return new (__ngFactoryType__ || AnimationBuilder)();
      })();
      static #_2 = (() => this.ɵprov = /* @__PURE__ */i0.ɵɵdefineInjectable({
        token: AnimationBuilder,
        factory: () => (() => inject(BrowserAnimationBuilder))(),
        providedIn: "root"
      }))();
    }
    return AnimationBuilder;
  })();
  /*#__PURE__*/
  (() => {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      undefined;
    }
  })();
  /**
   * A factory object returned from the
   * <code>[AnimationBuilder.build](api/animations/AnimationBuilder#build)()</code>
   * method.
   *
   * @publicApi
   */
  class AnimationFactory {}
  let BrowserAnimationBuilder = /*#__PURE__*/ /* unused pure expression or super */null && (() => {
    class BrowserAnimationBuilder extends AnimationBuilder {
      constructor(rootRenderer, doc) {
        super();
        this.animationModuleType = inject(ANIMATION_MODULE_TYPE, {
          optional: true
        });
        this._nextAnimationId = 0;
        const typeData = {
          id: "0",
          encapsulation: ViewEncapsulation.None,
          styles: [],
          data: {
            animation: []
          }
        };
        this._renderer = rootRenderer.createRenderer(doc.body, typeData);
        if (this.animationModuleType === null && !isAnimationRenderer(this._renderer)) {
          // We only support AnimationRenderer & DynamicDelegationRenderer for this AnimationBuilder
          throw new ɵRuntimeError(3600 /* RuntimeErrorCode.BROWSER_ANIMATION_BUILDER_INJECTED_WITHOUT_ANIMATIONS */, (typeof ngDevMode === "undefined" || ngDevMode) && "Angular detected that the `AnimationBuilder` was injected, but animation support was not enabled. Please make sure that you enable animations in your application by calling `provideAnimations()` or `provideAnimationsAsync()` function.");
        }
      }
      build(animation) {
        const id = this._nextAnimationId;
        this._nextAnimationId++;
        const entry = Array.isArray(animation) ? sequence(animation) : animation;
        issueAnimationCommand(this._renderer, null, id, "register", [entry]);
        return new BrowserAnimationFactory(id, this._renderer);
      }
      static #_ = (() => this.ɵfac = function BrowserAnimationBuilder_Factory(__ngFactoryType__) {
        return new (__ngFactoryType__ || BrowserAnimationBuilder)(i0.ɵɵinject(i0.RendererFactory2), i0.ɵɵinject(DOCUMENT));
      })();
      static #_2 = (() => this.ɵprov = /* @__PURE__ */i0.ɵɵdefineInjectable({
        token: BrowserAnimationBuilder,
        factory: BrowserAnimationBuilder.ɵfac,
        providedIn: "root"
      }))();
    }
    return BrowserAnimationBuilder;
  })();
  /*#__PURE__*/
  (() => {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      undefined;
    }
  })();
  class BrowserAnimationFactory extends AnimationFactory {
    constructor(_id, _renderer) {
      super();
      this._id = _id;
      this._renderer = _renderer;
    }
    create(element, options) {
      return new RendererAnimationPlayer(this._id, element, options || {}, this._renderer);
    }
  }
  class RendererAnimationPlayer {
    constructor(id, element, options, _renderer) {
      this.id = id;
      this.element = element;
      this._renderer = _renderer;
      this.parentPlayer = null;
      this._started = false;
      this.totalTime = 0;
      this._command("create", options);
    }
    _listen(eventName, callback) {
      return this._renderer.listen(this.element, `@@${this.id}:${eventName}`, callback);
    }
    _command(command, ...args) {
      issueAnimationCommand(this._renderer, this.element, this.id, command, args);
    }
    onDone(fn) {
      this._listen("done", fn);
    }
    onStart(fn) {
      this._listen("start", fn);
    }
    onDestroy(fn) {
      this._listen("destroy", fn);
    }
    init() {
      this._command("init");
    }
    hasStarted() {
      return this._started;
    }
    play() {
      this._command("play");
      this._started = true;
    }
    pause() {
      this._command("pause");
    }
    restart() {
      this._command("restart");
    }
    finish() {
      this._command("finish");
    }
    destroy() {
      this._command("destroy");
    }
    reset() {
      this._command("reset");
      this._started = false;
    }
    setPosition(p) {
      this._command("setPosition", p);
    }
    getPosition() {
      return unwrapAnimationRenderer(this._renderer)?.engine?.players[this.id]?.getPosition() ?? 0;
    }
  }
  function issueAnimationCommand(renderer, element, id, command, args) {
    renderer.setProperty(element, `@@${id}:${command}`, args);
  }
  /**
   * The following 2 methods cannot reference their correct types (AnimationRenderer &
   * DynamicDelegationRenderer) since this would introduce a import cycle.
   */
  function unwrapAnimationRenderer(renderer) {
    const type = renderer.ɵtype;
    if (type === 0 /* AnimationRendererType.Regular */) {
      return renderer;
    } else if (type === 1 /* AnimationRendererType.Delegated */) {
      return renderer.animationRenderer;
    }
    return null;
  }
  function isAnimationRenderer(renderer) {
    const type = renderer.ɵtype;
    return type === 0 /* AnimationRendererType.Regular */ || type === 1 /* AnimationRendererType.Delegated */;
  }

  /**
   * An empty programmatic controller for reusable animations.
   * Used internally when animations are disabled, to avoid
   * checking for the null case when an animation player is expected.
   *
   * @see {@link animate}
   * @see {@link AnimationPlayer}
   *
   * @publicApi
   */
  class NoopAnimationPlayer {
    constructor(duration = 0, delay = 0) {
      this._onDoneFns = [];
      this._onStartFns = [];
      this._onDestroyFns = [];
      this._originalOnDoneFns = [];
      this._originalOnStartFns = [];
      this._started = false;
      this._destroyed = false;
      this._finished = false;
      this._position = 0;
      this.parentPlayer = null;
      this.totalTime = duration + delay;
    }
    _onFinish() {
      if (!this._finished) {
        this._finished = true;
        this._onDoneFns.forEach(fn => fn());
        this._onDoneFns = [];
      }
    }
    onStart(fn) {
      this._originalOnStartFns.push(fn);
      this._onStartFns.push(fn);
    }
    onDone(fn) {
      this._originalOnDoneFns.push(fn);
      this._onDoneFns.push(fn);
    }
    onDestroy(fn) {
      this._onDestroyFns.push(fn);
    }
    hasStarted() {
      return this._started;
    }
    init() {}
    play() {
      if (!this.hasStarted()) {
        this._onStart();
        this.triggerMicrotask();
      }
      this._started = true;
    }
    /** @internal */
    triggerMicrotask() {
      queueMicrotask(() => this._onFinish());
    }
    _onStart() {
      this._onStartFns.forEach(fn => fn());
      this._onStartFns = [];
    }
    pause() {}
    restart() {}
    finish() {
      this._onFinish();
    }
    destroy() {
      if (!this._destroyed) {
        this._destroyed = true;
        if (!this.hasStarted()) {
          this._onStart();
        }
        this.finish();
        this._onDestroyFns.forEach(fn => fn());
        this._onDestroyFns = [];
      }
    }
    reset() {
      this._started = false;
      this._finished = false;
      this._onStartFns = this._originalOnStartFns;
      this._onDoneFns = this._originalOnDoneFns;
    }
    setPosition(position) {
      this._position = this.totalTime ? position * this.totalTime : 1;
    }
    getPosition() {
      if (this.totalTime) {
        return this._position / this.totalTime;
      } else {
        return 1;
      }
    }
    /** @internal */
    triggerCallback(phaseName) {
      const methods = phaseName == "start" ? this._onStartFns : this._onDoneFns;
      methods.forEach(fn => fn());
      methods.length = 0;
    }
  }

  /**
   * A programmatic controller for a group of reusable animations.
   * Used internally to control animations.
   *
   * @see {@link AnimationPlayer}
   * @see {@link animations/group group}
   *
   */
  class AnimationGroupPlayer {
    constructor(_players) {
      this._onDoneFns = [];
      this._onStartFns = [];
      this._finished = false;
      this._started = false;
      this._destroyed = false;
      this._onDestroyFns = [];
      this.parentPlayer = null;
      this.totalTime = 0;
      this.players = _players;
      let doneCount = 0;
      let destroyCount = 0;
      let startCount = 0;
      const total = this.players.length;
      if (total == 0) {
        queueMicrotask(() => this._onFinish());
      } else {
        this.players.forEach(player => {
          player.onDone(() => {
            if (++doneCount == total) {
              this._onFinish();
            }
          });
          player.onDestroy(() => {
            if (++destroyCount == total) {
              this._onDestroy();
            }
          });
          player.onStart(() => {
            if (++startCount == total) {
              this._onStart();
            }
          });
        });
      }
      this.totalTime = this.players.reduce((time, player) => Math.max(time, player.totalTime), 0);
    }
    _onFinish() {
      if (!this._finished) {
        this._finished = true;
        this._onDoneFns.forEach(fn => fn());
        this._onDoneFns = [];
      }
    }
    init() {
      this.players.forEach(player => player.init());
    }
    onStart(fn) {
      this._onStartFns.push(fn);
    }
    _onStart() {
      if (!this.hasStarted()) {
        this._started = true;
        this._onStartFns.forEach(fn => fn());
        this._onStartFns = [];
      }
    }
    onDone(fn) {
      this._onDoneFns.push(fn);
    }
    onDestroy(fn) {
      this._onDestroyFns.push(fn);
    }
    hasStarted() {
      return this._started;
    }
    play() {
      if (!this.parentPlayer) {
        this.init();
      }
      this._onStart();
      this.players.forEach(player => player.play());
    }
    pause() {
      this.players.forEach(player => player.pause());
    }
    restart() {
      this.players.forEach(player => player.restart());
    }
    finish() {
      this._onFinish();
      this.players.forEach(player => player.finish());
    }
    destroy() {
      this._onDestroy();
    }
    _onDestroy() {
      if (!this._destroyed) {
        this._destroyed = true;
        this._onFinish();
        this.players.forEach(player => player.destroy());
        this._onDestroyFns.forEach(fn => fn());
        this._onDestroyFns = [];
      }
    }
    reset() {
      this.players.forEach(player => player.reset());
      this._destroyed = false;
      this._finished = false;
      this._started = false;
    }
    setPosition(p) {
      const timeAtPosition = p * this.totalTime;
      this.players.forEach(player => {
        const position = player.totalTime ? Math.min(1, timeAtPosition / player.totalTime) : 1;
        player.setPosition(position);
      });
    }
    getPosition() {
      const longestPlayer = this.players.reduce((longestSoFar, player) => {
        const newPlayerIsLongest = longestSoFar === null || player.totalTime > longestSoFar.totalTime;
        if (newPlayerIsLongest) {
          return player;
        } else {
          return longestSoFar;
        }
      }, null);
      if (longestPlayer != null) {
        return longestPlayer.getPosition();
      } else {
        return 0;
      }
    }
    beforeDestroy() {
      this.players.forEach(player => {
        if (player.beforeDestroy) {
          player.beforeDestroy();
        }
      });
    }
    /** @internal */
    triggerCallback(phaseName) {
      const methods = phaseName == "start" ? this._onStartFns : this._onDoneFns;
      methods.forEach(fn => fn());
      methods.length = 0;
    }
  }
  const ɵPRE_STYLE = "!";

  /**
   * @module
   * @description
   * Entry point for all animation APIs of the animation package.
   */

  /**
   * @module
   * @description
   * Entry point for all public APIs of this package.
   */

  // This file is not used to build this module. It is only used during editing

  /**
   * Generated bundle index. Do not edit.
   */

  /***/
}),
/***/5771: (/***/(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    Pd: () => (/* binding */A11yModule),
    Au: () => (/* binding */ActiveDescendantKeyManager),
    vr: () => (/* binding */AriaDescriber),
    vR: () => (/* binding */CdkMonitorFocus),
    Bu: () => (/* binding */FocusKeyManager),
    FN: () => (/* binding */FocusMonitor),
    GX: () => (/* binding */FocusTrapFactory),
    Q_: () => (/* binding */HighContrastModeDetector),
    Z7: () => (/* binding */InteractivityChecker),
    Ai: () => (/* binding */LiveAnnouncer),
    Z2: () => (/* binding */TREE_KEY_MANAGER),
    px: () => (/* binding */addAriaReferencedId),
    _G: () => (/* binding */isFakeMousedownFromScreenReader),
    w6: () => (/* binding */isFakeTouchstartFromScreenReader),
    Ae: () => (/* binding */removeAriaReferencedId)
  });
