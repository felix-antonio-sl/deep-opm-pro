// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/modules/attribute-validation/string-range.ts
// Extracted by opm-extracted/tools/extract.mjs

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
    return ValueAttributeType.STRING;
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