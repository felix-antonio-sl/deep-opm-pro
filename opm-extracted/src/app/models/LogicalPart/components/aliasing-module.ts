// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/LogicalPart/components/aliasing-module.ts
// Extracted by opm-extracted/tools/extract.mjs

class AliasingModule {
  constructor(computation) {
    this.computation = computation;
  }
  getText() {
    if (this.isActive()) {
      return "{" + (this.alias || "") + "}";
    } else {
      return "";
    }
  }
  isTextActive() {
    // show alias (even if it is empty) if the object computational, otherwise show only if exists.
    return this.isActive() || this.computation.isActive();
  }
  isActive() {
    const aliasCondition = this.alias !== null && this.alias !== undefined && this.alias !== "None" && this.alias !== "";
    // tslint:disable-next-line:max-line-length
    const userSelectAlias = (0, getInitRappidShared)()?.oplService?.settings?.aliasOpt || "Show only when applicable";
    // const aliasSettingsBool = (userSelectAlias === 'Show only when applicable' || userSelectAlias === 'Always show alias');
    const computational = this.computation.isActive();
    const computationalCondition = (userSelectAlias === "Show only when applicable" && aliasCondition || userSelectAlias === "Always show alias") && computational;
    const nonComputationalCondition = !computational && aliasCondition;
    return computationalCondition || nonComputationalCondition;
  }
  getPriority() {
    return 3;
  }
}