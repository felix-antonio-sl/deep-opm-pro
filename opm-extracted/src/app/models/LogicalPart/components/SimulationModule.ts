// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/LogicalPart/components/SimulationModule.ts
// Extracted by opm-extracted/tools/extract.mjs

class SimulationModule {
  constructor(thing, params = undefined) {
    this.params = params || this.getDefaultParams();
    this.thing = thing;
  }
  get simulationParams() {
    return this.params;
  }
  set simulationParams(params) {
    this.params = params;
  }
  getDefaultParams() {
    return new simulatedElementParams();
  }
  resetParams() {
    this.params = this.getDefaultParams();
  }
  getRandomValues(numberOfValues) {

    const MAX_TRIES = 100000;
    const ret = [];
    for (let i = 0; i < numberOfValues; i++) {
      const values = new Array();
      let tries = 0;
      // simulate textual value
      if (this.params.textual) {
        const val = this.randWeightedValues(this.params.textualArray);
        ret.push(val);
      } else if (this.params.numerical) {
        this.params.min_range = (this.params.min_range === undefined || this.params.min_range === null) === false ? this.params.min_range : -Infinity;
        this.params.max_range = (this.params.max_range === undefined || this.params.max_range === null) === false ? this.params.max_range : Infinity;
        const min = Number(this.params.min_range);
        const max = Number(this.params.max_range);
        this.params.selectedValue = this.params.selectedValue ? this.params.selectedValue : "uniform";
        switch (this.params.selectedValue) {
          case "uniform":
            {
              const minUniform = (this.params.min_uniform === undefined || this.params.min_uniform === null) === false ? Number(this.params.min_uniform) : -1000000000;
              const maxUniform = (this.params.max_uniform === undefined || this.params.max_uniform === null) === false ? Number(this.params.max_uniform) : 1000000000;
              const uniform = random.default.uniform(minUniform, maxUniform);
              let uniformValue = this.params.integer ? Math.round(uniform()) : uniform();
              if (this.params.integer) {
                uniformValue = this.params.integer ? Math.round(uniform()) : uniform();
              }
              ret.push(uniformValue);
              break;
            }
          case "normal":
            {
              const mu = Number(this.params.normal_mu);
              const sigma = Number(this.params.normal_sigma);
              const normal = random.default.normal(mu, sigma);
              let normalValue = this.params.integer ? Math.round(normal()) : normal();
              while (tries < MAX_TRIES && (normalValue > max || normalValue < min)) {
                tries++;
                normalValue = this.params.integer ? Math.round(normal()) : normal();
              }
              ret.push(tries >= MAX_TRIES ? undefined : normalValue);
              break;
            }
          case "bernoulli":
            {
              const p = this.params.Bernoulli_p;
              const bernoulli = random.default.bernoulli(Number(p));
              let berValue = this.params.integer ? Math.round(bernoulli()) : bernoulli();
              while (tries < MAX_TRIES && (berValue > max || berValue < min)) {
                tries++;
                berValue = this.params.integer ? Math.round(bernoulli()) : bernoulli();
              }
              ret.push(tries >= MAX_TRIES ? undefined : berValue);
              break;
            }
          case "geometric":
            {
              const p = this.params.Geometric;
              const geometric = random.default.geometric(Number(p));
              let geoValue = this.params.integer ? Math.round(geometric()) : geometric();
              while (tries < MAX_TRIES && (geoValue > max || geoValue < min)) {
                tries++;
                geoValue = this.params.integer ? Math.round(geometric()) : geometric();
              }
              ret.push(tries >= MAX_TRIES ? undefined : geoValue);
              break;
            }
          case "binomial":
            {
              const n = this.params.binomial_n;
              const p = this.params.binomial_p;
              const binomial = random.default.binomial(Number(n), Number(p));
              let binValue = this.params.integer ? Math.round(binomial()) : binomial();
              while (tries < MAX_TRIES && (binValue > max || binValue < min)) {
                tries++;
                binValue = this.params.integer ? Math.round(binomial()) : binomial();
              }
              ret.push(tries >= MAX_TRIES ? undefined : binValue);
              break;
            }
          case "exponential":
            {
              const lambda = this.params.exponential_Lambda;
              const exponential = random.default.exponential(Number(lambda));
              let expValue = this.params.integer ? Math.round(exponential()) : exponential();
              while (tries < MAX_TRIES && (expValue > max || expValue < min)) {
                tries++;
                expValue = this.params.integer ? Math.round(exponential()) : exponential();
              }
              ret.push(tries >= MAX_TRIES ? undefined : expValue);
              break;
            }
          case "poisson":
            {
              const lambda = this.params.poisson_Lambda;
              const poisson = random.default.poisson(Number(lambda));
              let piossValue = this.params.integer ? Math.round(poisson()) : poisson();
              while (tries < MAX_TRIES && (piossValue > max || piossValue < min)) {
                tries++;
                piossValue = this.params.integer ? Math.round(poisson()) : poisson();
              }
              ret.push(tries >= MAX_TRIES ? undefined : piossValue);
              break;
            }
        }
        if (tries >= MAX_TRIES) {
          (0, validationAlert)("Cannot randomize a valid value for " + this.thing.getBareName() + ", please check its parameters.");
        }
      }
    }
    return ret;
  }
  randWeightedValues(arr) {
    if (!arr || arr.length === 0 || arr.find(item => !(0, isNumber)(item.percent))) {
      return undefined;
    }
    let allItemsSum = 0;
    arr.forEach(item => allItemsSum += Number(item.percent));
    if (allItemsSum !== 100) {
      return undefined;
    }
    const rand = Math.random() * 100;
    let sum = 0;
    for (const item of arr) {
      sum += Number(item.percent);
      if (rand <= sum) {
        return item.text;
      }
    }
    return arr[0].text;
  }
}
class simulatedElementParams {
  constructor() {
    this.simulated = false;
    this.numerical = false;
    this.textualArray = [{
      text: "",
      percent: ""
    }];
    this.distribution = "uniform";
    this.uniform = true;
    this.normal = false;
    this.binomial = false;
    this.geometric = false;
    this.bernoulli = false;
    this.exponential = false;
    this.poisson = false;
    this.range1 = -Infinity;
    this.range2 = Infinity;
  }
}