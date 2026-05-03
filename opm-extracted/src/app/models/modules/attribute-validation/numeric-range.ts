// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/modules/attribute-validation/numeric-range.ts
// Extracted by opm-extracted/tools/extract.mjs

const CHARACTERS = {
  SPERATOR: "..",
  UNLIMITED: "*",
  OPEN_E: "(",
  OPEN_BE: "[",
  CLOSE_E: ")",
  CLOSE_SE: "]"
};
let NumericRange = /*#__PURE__*/(() => {
  class NumericRange {
    static #_ = (() => this.integer_pattern = /(\-?\d+|\*)/g)();
    static #_2 = (() => this.float_pattern = /((\-?\d+(\.\d+)?)|\*)/g)();
    constructor(type) {
      this.ranges = [];
      this.type = type;
    }
    _getPattern() {
      if (this.type == "integer") {
        return NumericRange.integer_pattern;
      }
      return NumericRange.float_pattern;
    }
    setPattern(value) {
      const pattern = this._getPattern();
      const extractPattern = function (value) {
        const numbers = value.match(pattern);
        const open = value[0];
        const close = value[value.length - 1];
        if (numbers == null) {
          return undefined;
        }
        if (((numbers.length == 2 || numbers.length == 3) && (open == "(" || open == "[") && (close == ")" || close == "]")) == false) {
          return undefined;
        }
        if (numbers.length == 3 && numbers[1] == CHARACTERS.UNLIMITED) {
          return undefined;
        }
        const org = open + numbers.join("..") + close;
        if (org != value) {
          return undefined;
        }
        const range = {
          def: undefined,
          max: undefined,
          min: undefined,
          inf: undefined,
          sup: undefined
        };
        // check first number as min or inf
        if (numbers[0] == CHARACTERS.UNLIMITED) {
          range.inf = "inf";
        } else if (open == CHARACTERS.OPEN_E) {
          range.inf = Number(numbers[0]);
        } else {
          range.min = Number(numbers[0]);
        }
        // check last number as max or sup
        if (numbers[numbers.length - 1] == CHARACTERS.UNLIMITED) {
          range.sup = "inf";
        } else if (close == CHARACTERS.CLOSE_E) {
          range.sup = Number(numbers[numbers.length - 1]);
        } else {
          range.max = Number(numbers[numbers.length - 1]);
        }
        // check middle number, if exists, as def
        if (numbers.length == 3) {
          range.def = Number(numbers[1]);
        }
        return range;
      };
      const newRanges = [];
      let newDefault;
      for (const f of value.split(",")) {
        const range = extractPattern(f);
        if (range == undefined) {
          return {
            wasSet: false
          };
        }
        if ((verify(range) && validate(range)) == false) {
          return {
            wasSet: false
          };
        }
        newRanges.push(range);
      }
      for (const range of newRanges) {
        if (range.def) {
          if (newDefault == undefined) {
            newDefault = range.def;
          } else {
            return {
              wasSet: false
            };
          }
        }
      }
      this.pattern = value;
      this.ranges = newRanges;
      this.default = newDefault;
      return {
        wasSet: true
      };
    }
    getDefault() {
      if (this.default) {
        return this.default.toString();
      }
      return undefined;
    }
    getPattern() {
      return this.pattern;
    }
    validate(value) {
      const num = Number(value);
      if (!value || String(num) === "NaN") {
        return false;
      }
      if (this.type === "integer" && value.indexOf(".") > 0) {
        return false;
      }
      const match = num.toString().match(this._getPattern());
      if (!match || match.length != 1) {
        return false;
      }
      for (const range of this.ranges) {
        const valid = compare(range.inf, "<", num) && compare(range.min, "<=", num) && compare(range.sup, ">", num) && compare(range.max, ">=", num);
        if (valid) {
          return true;
        }
      }
      return false;
    }
    getType() {
      if (this.type === "integer") {
        return ValueAttributeType.INTEGER;
      } else {
        return ValueAttributeType.FLOAT;
      }
    }
    isSubRange(newValidator) {
      for (const newRange of newValidator.ranges) {
        const newRangeSup = newRange.sup === "inf" ? Infinity : newRange.sup;
        const newRangeInf = newRange.inf === "inf" ? -Infinity : newRange.inf;
        const isLegal = this.ranges.find(r => {
          const rSup = r.sup === "inf" ? Infinity : r.sup;
          const rInf = r.inf === "inf" ? -Infinity : r.inf;
          const bottomLimit = r.min <= newRange.min || rInf < newRange.min || r.min <= newRangeInf || rInf <= newRangeInf;
          const topLimit = r.max >= newRange.max || rSup > newRange.max || r.max >= newRangeSup || rSup >= newRangeSup;
          const equal = r.def === newRange.def && r.max === newRange.max && r.min === newRange.min && r.inf === newRange.inf && r.sup === newRange.sup;
          if (bottomLimit && topLimit || equal) {
            return true;
          }
          return false;
        });
        if (!isLegal) {
          return false;
        }
      }
      return true;
    }
  }
  return NumericRange;
})();
const compare = function (src, op, dst) {
  if (src == undefined || src == "inf") {
    return true;
  } else if (dst == undefined || dst == "inf") {
    return true;
  }
  if (op == "<") {
    return src < dst;
  } else if (op == "<=") {
    return src <= dst;
  } else if (op == ">") {
    return src > dst;
  } else if (op == ">=") {
    return src >= dst;
  }
  return false;
};
const validate = function (range) {
  return compare(range.inf, "<", range.def) && compare(range.inf, "<", range.max) && compare(range.inf, "<", range.sup) && compare(range.min, "<=", range.def) && compare(range.min, "<=", range.max) && compare(range.min, "<", range.sup) && compare(range.def, "<=", range.max) && compare(range.def, "<", range.sup);
};
const verify = function (range) {
  return (range.inf != undefined || range.min != undefined) && (range.sup != undefined || range.max != undefined);
};