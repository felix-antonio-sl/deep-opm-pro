// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/LogicalPart/components/units-text-module.ts
// Extracted by opm-extracted/tools/extract.mjs

class UnitsTextModule {
  constructor(computation) {
    this.units = undefined;
    this.computation = computation;
  }
  getText() {
    const unitsToWrite = this.units && this.units !== "None" ? this.units : "";
    if (this.isActive()) {
      return "[" + unitsToWrite + "]";
    } else {
      return "";
    }
  }
  isTextActive() {
    return this.isActive();
  }
  isActive() {
    //return (this.units !== undefined && this.units !== null);
    const unitsCondition = this.units !== null && this.units !== undefined && this.units !== "None" && this.units !== "";
    const userSelection = (0, getInitRappidShared)()?.oplService?.settings?.unitsOpt || "Show only when applicable";
    const unitsSettingsBool = userSelection === "Show only when applicable" || userSelection === "Always show units";
    const computational = this.computation.isActive();
    return (userSelection === "Always show units" || unitsCondition && userSelection === "Show only when applicable") && computational;
  }
  getPriority() {
    return 2; // to appear before the alias
  }
}