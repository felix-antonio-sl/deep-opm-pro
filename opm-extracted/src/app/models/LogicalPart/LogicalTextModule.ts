// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/LogicalPart/LogicalTextModule.ts
// Extracted by opm-extracted/tools/extract.mjs

class BasicNameModule {
  constructor(formatter) {
    this.formatter = formatter;
    this.name = "";
    this.autoFormatting = true;
  }
  shouldAutoFormat(val) {
    this.autoFormatting = val;
  }
  isAutoFormat() {
    return this.autoFormatting;
  }
  formatText(val) {
    return this.formatter(val);
  }
  setText(val) {
    // TODO: Add some validation function
    val = val.trim();
    if (val.length == 0) {
      return;
    }
    if (this.autoFormatting) {
      this.name = this.formatter(val);
      return;
    }
    this.name = val;
  }
  getText() {
    return this.name;
  }
}
class BasicLogicalTextModule {
  constructor(name) {
    this.name = name;
    this.modules = new Array();
  }
  getDisplayText() {
    const ret = [];
    const modules = this.getActiveModules();
    modules.filter(m => m.getPriority() < 0).forEach(mdl => ret.push(mdl.getText()));
    ret.push(this.name.getText());
    modules.filter(m => m.getPriority() > 0).forEach(mdl => ret.push(mdl.getText()));
    return ret.join(" ").trim();
  }
  getName() {
    return this.name.getText();
  }
  // Set name only from input. Other modules are set directly currently.
  updateFromInput(text) {
    this.updateNameFromInput(text);
  }
  addTextualModules(...modules) {
    this.modules.push(...modules);
  }
  updateNameFromInput(text) {
    if (!text) {
      return;
    }
    let name = this.removeSpecialChars(text);
    const addOn = this.getAddOnText();
    if (addOn.length > 0) {
      const addOnIndex = name.indexOf(addOn);
      if (addOnIndex >= 0) {
        name = text.substr(0, addOnIndex - 1).trim();
      }
    }
    this.name.setText(name);
  }
  getAddOnText() {
    return this.modules.filter(m => m.isTextActive()).map(m => m.getText()).join(" ").trim();
  }
  getActiveModules() {
    let ret = this.modules.filter(m => m.isTextActive());
    ret = ret.sort(function (a, b) {
      if (a.getPriority() > b.getPriority()) {
        return 1;
      } else {
        return -1;
      }
    });
    return ret;
  }
  removeSpecialChars(text) {
    return text.split(String.fromCharCode(160)).join(String.fromCharCode(32)).split(String.fromCharCode(10)).join(String.fromCharCode(32));
  }
  getNameModule() {
    return this.name;
  }
}
