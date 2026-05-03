// EXPORTS

// EXTERNAL MODULE: ./src/app/models/modules/attribute-validation/attribute-range.ts
var attribute_range = require("./86132.js");
; // CONCATENATED MODULE: ./src/app/models/modules/attribute-validation/boolean-range.ts

const TRUE = "true";
const FALSE = "false";
class BooleanRange {
  constructor() {}
  setPattern(value) {
    return {
      wasSet: true
    };
  }
  getDefault() {
    return String(FALSE);
  }
  getPattern() {
    return "BOOLEAN";
  }
  validate(value) {
    return value && (value.toLowerCase() === TRUE || value.toLowerCase() === FALSE);
  }
  getType() {
    return attribute_range /* ValueAttributeType */.y.BOOLEAN;
  }
  isSubRange(newRange) {
    return true;
  }
}
; // CONCATENATED MODULE: ./src/app/models/modules/attribute-validation/char-range.ts

class CharRange {
  constructor() {}
  setPattern(value) {
    return {
      wasSet: true
    };
  }
  getDefault() {
    return "a";
  }
  getPattern() {
    return "CHAR";
  }
  validate(value) {
    if (!value) {
      return false;
    }
    return value.length == 1;
  }
  getType() {
    return attribute_range /* ValueAttributeType */.y.CHAR;
  }
  isSubRange(newRange) {
    return true;
  }
}
; // CONCATENATED MODULE: ./src/app/models/modules/attribute-validation/numeric-range.ts

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
        return attribute_range /* ValueAttributeType */.y.INTEGER;
      } else {
        return attribute_range /* ValueAttributeType */.y.FLOAT;
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
; // CONCATENATED MODULE: ./src/app/models/modules/attribute-validation/string-range.ts

const DEFAULT_CHAR = "$";
const WILDCARD = {
  STRING: "*",
  CHAR: "%"
};
class StringRange {
  constructor() {
    this.words = [];
  }
  setPattern(pattern) {
    const words = pattern.split(",");
    const clean = [];
    for (let w of words) {
      let def = false;
      if (w.startsWith(DEFAULT_CHAR)) {
        def = true;
        w = w.substring(1);
      }
      if ((w.startsWith("\"") && w.endsWith("\"")) == false) {
        return {
          wasSet: false
        };
      }
      if ((w.match(/"/g) || []).length % 2 !== 0) {
        // if there is an odd number of "
        return {
          wasSet: false
        };
      }
      w = w.substring(1, w.length - 1);
      if (w.match(/^[A-Za-z.*%]+$/).length == 0) {
        return {
          wasSet: false
        };
      }
      if (def) {
        this.default = w;
      }
      clean.push(w);
    }
    this.words = clean;
    this.pattern = pattern;
    return {
      wasSet: true
    };
  }
  getPattern() {
    return this.pattern;
  }
  validate(value) {
    for (const w of this.words) {
      if (string_range_validate(value, w) == true) {
        return true;
      }
    }
    return false;
  }
  getDefault() {
    return this.default;
  }
  getType() {
    return attribute_range /* ValueAttributeType */.y.STRING;
  }
  isSubRange(newRange) {
    let validated = 0;
    for (const w of newRange.words) {
      if (this.words.find(word => string_range_validate(w, word))) {
        validated++;
      }
    }
    return validated === newRange.words.length;
  }
}
const string_range_validate = function (value, pattern) {
  let i = 0;
  for (i; i < pattern.length; i++) {
    if (pattern[i] == WILDCARD.CHAR) {
      // all good
    } else if (pattern[i] == WILDCARD.STRING) {
      if (pattern === value) {
        return true;
      }
      if (pattern.substring(i + 1) == "" && value.substring(i + 1) != "") {
        return true;
      }
      for (let j = 1; j < value.length; j++) {
        if (string_range_validate(value.substring(i + j), pattern.substring(i + 1)) == true) {
          return true;
        }
      }
      return false;
    } else if (pattern[i] == value[i]) {
      // all good
    } else {
      return false;
    }
  }
  return i == value.length;
};
; // CONCATENATED MODULE: ./src/app/models/modules/attribute-validation/attribute-value.ts

class AttributeValue {
  constructor() {
    this.active = false;
  }
  setRange(type, range, stereotypeValidator) {
    const validator = factory(type);
    const result = validator.setPattern(range);
    if (result.wasSet == false) {
      return false;
    }
    if (stereotypeValidator && !checkIsSubRange(stereotypeValidator, validator)) {
      return false;
    }
    this.active = true;
    this.type = type;
    this.validator = validator;
    return true;
  }
  remove() {
    this.active = false;
    this.type = undefined;
    this.validator = undefined;
  }
  validate(value) {
    if (this.active == false || this.validator == undefined) {
      return false;
    }
    return this.validator.validate(value);
  }
  getDefault() {
    if (this.validator) {
      return this.validator.getDefault();
    }
    return undefined;
  }
  isActive() {
    return this.active;
  }
  getType() {
    return this.type;
  }
  getRange() {
    if (this.validator) {
      return this.validator.getPattern();
    }
    return "";
  }
  getValidator() {
    return this.validator;
  }
}
const factory = function (type) {
  if (type == attribute_range /* ValueAttributeType */.y.INTEGER) {
    return new NumericRange("integer");
  } else if (type == attribute_range /* ValueAttributeType */.y.FLOAT) {
    return new NumericRange("float");
  } else if (type == attribute_range /* ValueAttributeType */.y.STRING) {
    return new StringRange();
  } else if (type == attribute_range /* ValueAttributeType */.y.CHAR) {
    return new CharRange();
  } else if (type == attribute_range /* ValueAttributeType */.y.BOOLEAN) {
    return new BooleanRange();
  }
  return new NumericRange("integer");
};
function checkIsSubRange(originalValidator, newValidator) {
  if (originalValidator.getType() !== newValidator.getType()) {
    return false;
  }
  return originalValidator.isSubRange(newValidator);
}
; // CONCATENATED MODULE: ./src/app/models/modules/attribute-validation/validation-module.ts
export class i {
  constructor() {
    this.attribute = new AttributeValue();
  }
  isActive() {
    return this.attribute.isActive();
  }
  setValueTypeElement(object) {
    this.valueTypeElement = object;
  }
  getValueTypeElement() {
    return this.valueTypeElement;
  }
  getType() {
    return this.attribute.getType();
  }
  getRange() {
    return this.attribute.getRange();
  }
  getDefault() {
    const val = this.attribute.getDefault();
    if (val) {
      return val;
    }
    return "value";
  }
  getValidator() {
    return this.attribute.getValidator();
  }
  setRange(type, range, stereotypeValidator) {
    const wasSet = this.attribute.setRange(type, range, stereotypeValidator);
    if (wasSet == false) {
      return {
        wasSet,
        errors: ["The range entered wasn't valid"]
      };
    }
    return {
      wasSet
    };
  }
  validateValue(value) {
    return this.attribute.validate(value);
  }
  removeRange() {
    this.valueTypeElement = undefined;
    this.attribute.remove();
  }
  toJson() {
    if (this.isActive()) {
      return {
        valueTypeElementId: this.valueTypeElement.lid,
        attribute: {
          range: this.attribute.getRange(),
          type: this.attribute.getType()
        }
      };
    }
    return {};
  }
}
export function b(logicalObject) {
  const status = logicalObject.states[0].visualElements[0].getValidationStatus();
  if (status.status === "value-set-invalid") {
    return "ff7474";
  }
  if (status.status === "value-set-valid") {
    return "00ff85";
  }
  if (status.status === "value-not-set") {
    return "73c7ff";
  }
  return "FFFFFF";
}
/***/