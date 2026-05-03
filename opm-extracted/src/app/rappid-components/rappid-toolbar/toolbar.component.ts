// Source: decompiled/deobfuscated.js
// Original path: ./src/app/rappid-components/rappid-toolbar/toolbar.component.ts
// Extracted by opm-extracted/tools/extract.mjs

class ToolbarComponent {
  constructor() {
    this.title = "The Best Toolbar In The World";
    this.commands = this.getCommands();
  }
  buttonClick(command) {
    const func = command.name.substring(0, command.name.indexOf("(")) || command.name;
    const args = command.name.substring(command.name.indexOf("(") + 1, command.name.indexOf(")")) || "";
    return this[func](args);
  }
}