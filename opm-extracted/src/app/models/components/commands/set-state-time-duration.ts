// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/components/commands/set-state-time-duration.ts
// Extracted by opm-extracted/tools/extract.mjs

class SetStateTimeDurationCommand {
  constructor(init, state, visual) {
    this.init = init;
    this.state = state;
    this.visual = visual;
  }
  createHaloHandle() {
    return {
      flag: false,
      name: "set-time-duration",
      displayTitle: "Add Time Duration",
      svg: "timeDuration",
      action: new SetStateTimeDurationAction(this.init, this.state, this.visual),
      gif: "assets/gifs/state_set_time_duration.gif"
    };
  }
  createToolbarHandle() {
    return {
      name: "set-time-duration",
      displayTitle: "Add Time Duration",
      svg: "timeDuration",
      action: new SetStateTimeDurationAction(this.init, this.state, this.visual),
      gif: "assets/gifs/state_set_time_duration.gif"
    };
  }
}
class SetStateTimeDurationAction {
  constructor(init, drawn, visual) {
    this.init = init;
    this.drawn = drawn;
    this.visual = visual;
  }
  act() {
    const cell = this.init.graph.getCell(this.drawn.id);
    const vis = this.init.opmModel.getVisualElementById(this.drawn.id);
    if (cell && vis) {
      cell.openTimeDuration(this.init.paper.findViewByModel(cell).el, vis.logicalElement.getDurationManager(), {
        digits: this.init.oplService.settings.timeDurationUnitsDigits
      });
    }
  }
}