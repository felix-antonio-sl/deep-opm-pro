// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/DrawnPart/CMMNShapes.ts
// Extracted by opm-extracted/tools/extract.mjs

/**
 * Custom CMMN Shapes for Rappid
 * Based on OpmEntityRappid pattern
 */

/**
 * CMMN Human Task Shape
 */
const CMMNHumanTask = joint.dia.Element.define("cmmn.HumanTask", {
  size: {
    width: 130,
    height: 50
  },
  attrs: {
    body: {
      refWidth: 1,
      refHeight: 1,
      fill: "#FFFFFF",
      stroke: "#0070c0",
      // OPCloud process color
      "stroke-width": 2,
      rx: 3,
      ry: 3
    },
    icon: {
      refX: 5,
      refY: 5,
      width: 20,
      height: 20,
      "xlink:href": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjNjY2NjY2Ii8+Cjwvc3ZnPg=="
    },
    label: {
      refX: 0.5,
      refY: 0.5,
      "x-alignment": "middle",
      "y-alignment": "middle",
      fill: "#1a3763",
      "font-size": 11,
      "font-family": "Roboto, \"Helvetica Neue\", sans-serif",
      text: "",
      "text-anchor": "middle",
      "text-vertical-anchor": "middle",
      "text-wrap": {
        width: 120,
        height: 40,
        maxLineCount: 2,
        ellipsis: true
      }
    },
    entryCriterion: {
      refX: -8,
      refY: 0.5,
      r: 8,
      fill: "#0070c0",
      // OPCloud process color
      stroke: "#005a9e",
      "stroke-width": 1,
      display: "none" // Show only if entry criteria exist
    }
  }
}, {
  markup: [{
    tagName: "rect",
    selector: "body"
  }, {
    tagName: "image",
    selector: "icon"
  }, {
    tagName: "text",
    selector: "label"
  }, {
    tagName: "circle",
    selector: "entryCriterion"
  }]
});
/**
 * CMMN Process Task Shape (with gear icon)
 */
const CMMNProcessTask = joint.dia.Element.define("cmmn.ProcessTask", {
  size: {
    width: 130,
    height: 50
  },
  attrs: {
    body: {
      refWidth: 1,
      refHeight: 1,
      fill: "#FFFFFF",
      stroke: "#0070c0",
      "stroke-width": 2,
      rx: 3,
      ry: 3
    },
    icon: {
      refX: 5,
      refY: 5,
      width: 20,
      height: 20,
      "xlink:href": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjNjY2NjY2Ii8+Cjwvc3ZnPg=="
    },
    label: {
      refX: 0.5,
      refY: 0.5,
      "x-alignment": "middle",
      "y-alignment": "middle",
      fill: "#1a3763",
      "font-size": 11,
      "font-family": "Roboto, \"Helvetica Neue\", sans-serif",
      text: "",
      "text-anchor": "middle",
      "text-vertical-anchor": "middle",
      "text-wrap": {
        width: 120,
        height: 40,
        maxLineCount: 2,
        ellipsis: true
      }
    }
  }
}, {
  markup: [{
    tagName: "rect",
    selector: "body"
  }, {
    tagName: "image",
    selector: "icon"
  }, {
    tagName: "text",
    selector: "label"
  }]
});
/**
 * CMMN Case Task Shape (with folder icon)
 */
const CMMNCaseTask = joint.dia.Element.define("cmmn.CaseTask", {
  size: {
    width: 130,
    height: 50
  },
  attrs: {
    body: {
      refWidth: 1,
      refHeight: 1,
      fill: "#FFFFFF",
      stroke: "#0070c0",
      "stroke-width": 2,
      rx: 3,
      ry: 3
    },
    icon: {
      refX: 5,
      refY: 5,
      width: 20,
      height: 20,
      "xlink:href": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjNjY2NjY2Ii8+Cjwvc3ZnPg=="
    },
    label: {
      refX: 0.5,
      refY: 0.5,
      "x-alignment": "middle",
      "y-alignment": "middle",
      fill: "#1a3763",
      "font-size": 11,
      "font-family": "Roboto, \"Helvetica Neue\", sans-serif",
      text: "",
      "text-anchor": "middle",
      "text-vertical-anchor": "middle",
      "text-wrap": {
        width: 120,
        height: 40,
        maxLineCount: 2,
        ellipsis: true
      }
    }
  }
}, {
  markup: [{
    tagName: "rect",
    selector: "body"
  }, {
    tagName: "image",
    selector: "icon"
  }, {
    tagName: "text",
    selector: "label"
  }]
});
/**
 * CMMN Decision Task Shape (with decision table icon)
 */
const CMMNDecisionTask = joint.dia.Element.define("cmmn.DecisionTask", {
  size: {
    width: 130,
    height: 50
  },
  attrs: {
    body: {
      refWidth: 1,
      refHeight: 1,
      fill: "#FFFFFF",
      stroke: "#0070c0",
      "stroke-width": 2,
      rx: 3,
      ry: 3
    },
    icon: {
      refX: 5,
      refY: 5,
      width: 20,
      height: 20,
      "xlink:href": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjNjY2NjY2Ii8+Cjwvc3ZnPg=="
    },
    label: {
      refX: 0.5,
      refY: 0.5,
      "x-alignment": "middle",
      "y-alignment": "middle",
      fill: "#1a3763",
      "font-size": 11,
      "font-family": "Roboto, \"Helvetica Neue\", sans-serif",
      text: "",
      "text-anchor": "middle",
      "text-vertical-anchor": "middle",
      "text-wrap": {
        width: 120,
        height: 40,
        maxLineCount: 2,
        ellipsis: true
      }
    }
  }
}, {
  markup: [{
    tagName: "rect",
    selector: "body"
  }, {
    tagName: "image",
    selector: "icon"
  }, {
    tagName: "text",
    selector: "label"
  }]
});
/**
 * CMMN Stage Shape
 */
const CMMNStage = joint.dia.Element.define("cmmn.Stage", {
  size: {
    width: 400,
    height: 300
  },
  attrs: {
    body: {
      refWidth: 1,
      refHeight: 1,
      fill: "#E8F4F8",
      stroke: "#0070c0",
      // OPCloud process color
      "stroke-width": 4,
      // Very thick for maximum visibility
      rx: 5,
      ry: 5,
      opacity: 1,
      // Ensure fully visible
      visibility: "visible" // Force visibility
    },
    label: {
      refX: 0.5,
      refY: 10,
      "x-alignment": "middle",
      fill: "#0070c0",
      // OPCloud process color
      "font-size": 13,
      "font-weight": "500",
      "font-family": "Roboto, \"Helvetica Neue\", sans-serif",
      text: "",
      "text-anchor": "middle"
    }
  }
}, {
  markup: [{
    tagName: "rect",
    selector: "body"
  }, {
    tagName: "text",
    selector: "label"
  }]
});
/**
 * CMMN Milestone Shape (Diamond)
 */
const CMMNMilestone = joint.dia.Element.define("cmmn.Milestone", {
  size: {
    width: 80,
    height: 40
  },
  attrs: {
    body: {
      refWidth: 1,
      refHeight: 1,
      fill: "#FFD700",
      stroke: "#FFA500",
      "stroke-width": 2,
      // Diamond shape using path - calculated for default size (80x40)
      // Top, Right, Bottom, Left points
      d: "M 40,0 L 80,20 L 40,40 L 0,20 Z"
    },
    label: {
      refX: 0.5,
      refY: 0.5,
      "x-alignment": "middle",
      "y-alignment": "middle",
      fill: "#1a3763",
      "font-size": 10,
      "font-family": "Roboto, \"Helvetica Neue\", sans-serif",
      text: "",
      "text-anchor": "middle",
      "text-vertical-anchor": "middle",
      "text-wrap": {
        width: 70,
        // Limit text width to prevent overflow
        maxLineCount: 2,
        ellipsis: true
      }
    }
  }
}, {
  markup: [{
    tagName: "path",
    selector: "body"
  }, {
    tagName: "text",
    selector: "label"
  }]
});
/**
 * CMMN Entry Criterion (White Rhombus) - per CMMN standard
 */
const CMMNEntryCriterion = joint.dia.Element.define("cmmn.EntryCriterion", {
  size: {
    width: 30,
    height: 30
  },
  // Increased size for better visibility
  attrs: {
    body: {
      refWidth: 1,
      refHeight: 1,
      fill: "#FFFFFF",
      stroke: "#1A3763",
      "stroke-width": 3,
      // Increased for better visibility
      // Rhombus shape: points for diamond (adjusted for larger size)
      d: "M 15,0 L 30,15 L 15,30 L 0,15 Z",
      opacity: 1 // Ensure fully visible
    }
  }
}, {
  markup: [{
    tagName: "path",
    selector: "body"
  }]
});
/**
 * CMMN Exit Criterion (Black Rhombus) - per CMMN standard
 */
const CMMNExitCriterion = joint.dia.Element.define("cmmn.ExitCriterion", {
  size: {
    width: 30,
    height: 30
  },
  // Increased size for better visibility
  attrs: {
    body: {
      refWidth: 1,
      refHeight: 1,
      fill: "#000000",
      stroke: "#1A3763",
      "stroke-width": 3,
      // Increased for better visibility
      // Rhombus shape: points for diamond (adjusted for larger size)
      d: "M 15,0 L 30,15 L 15,30 L 0,15 Z",
      opacity: 1 // Ensure fully visible
    }
  }
}, {
  markup: [{
    tagName: "path",
    selector: "body"
  }]
});
/**
 * CMMN Case Plan Model Shape (Container)
 */
const CMMNCasePlanModel = joint.dia.Element.define("cmmn.CasePlanModel", {
  size: {
    width: 1200,
    height: 800
  },
  attrs: {
    body: {
      refWidth: 1,
      refHeight: 1,
      fill: "#F9F9F9",
      stroke: "#CCCCCC",
      "stroke-width": 1,
      rx: 3,
      ry: 3
    }
  }
}, {
  markup: [{
    tagName: "rect",
    selector: "body"
  }]
});
/**
 * CMMN Discretionary Task (Dashed Rectangle) - per CMMN standard
 */
const CMMNDiscretionaryTask = joint.dia.Element.define("cmmn.DiscretionaryTask", {
  size: {
    width: 130,
    height: 50
  },
  attrs: {
    body: {
      refWidth: 1,
      refHeight: 1,
      fill: "#FFFFFF",
      stroke: "#0070c0",
      "stroke-width": 2,
      "stroke-dasharray": "5 5",
      // Dashed line
      rx: 3,
      ry: 3
    },
    label: {
      refX: 0.5,
      refY: 0.5,
      "x-alignment": "middle",
      "y-alignment": "middle",
      fill: "#1a3763",
      "font-size": 11,
      "font-family": "Roboto, \"Helvetica Neue\", sans-serif",
      text: "",
      "text-anchor": "middle",
      "text-vertical-anchor": "middle",
      "text-wrap": {
        width: 120,
        height: 40,
        maxLineCount: 2,
        ellipsis: true
      }
    }
  }
}, {
  markup: [{
    tagName: "rect",
    selector: "body"
  }, {
    tagName: "text",
    selector: "label"
  }]
});
/**
 * CMMN Discretionary Stage (Dashed Rectangle with Angled Corners) - per CMMN standard
 */
const CMMNDiscretionaryStage = joint.dia.Element.define("cmmn.DiscretionaryStage", {
  size: {
    width: 400,
    height: 300
  },
  attrs: {
    body: {
      refWidth: 1,
      refHeight: 1,
      fill: "#E8F4F8",
      stroke: "#0070c0",
      "stroke-width": 2,
      "stroke-dasharray": "5 5",
      // Dashed line
      rx: 5,
      ry: 5
    },
    label: {
      refX: 0.5,
      refY: 10,
      "x-alignment": "middle",
      fill: "#0070c0",
      "font-size": 13,
      "font-weight": "500",
      "font-family": "Roboto, \"Helvetica Neue\", sans-serif",
      text: "",
      "text-anchor": "middle"
    }
  }
}, {
  markup: [{
    tagName: "rect",
    selector: "body"
  }, {
    tagName: "text",
    selector: "label"
  }]
});
/**
 * CMMN Timer Event Listener (Circle with Double Line + Clock Icon) - per CMMN standard
 */
const CMMNTimerEventListener = joint.dia.Element.define("cmmn.TimerEventListener", {
  size: {
    width: 40,
    height: 40
  },
  attrs: {
    outerCircle: {
      r: 18,
      cx: 20,
      cy: 20,
      fill: "none",
      stroke: "#1A3763",
      "stroke-width": 2
    },
    innerCircle: {
      r: 15,
      cx: 20,
      cy: 20,
      fill: "#FFFFFF",
      stroke: "#1A3763",
      "stroke-width": 2
    },
    clockHands: {
      // Clock icon: hour hand at 3, minute hand at 12
      d: "M 20,20 L 20,10 M 20,20 L 26,20",
      stroke: "#1A3763",
      "stroke-width": 2,
      "stroke-linecap": "round"
    },
    clockCenter: {
      r: 1.5,
      cx: 20,
      cy: 20,
      fill: "#1A3763"
    }
  }
}, {
  markup: [{
    tagName: "circle",
    selector: "outerCircle"
  }, {
    tagName: "circle",
    selector: "innerCircle"
  }, {
    tagName: "path",
    selector: "clockHands"
  }, {
    tagName: "circle",
    selector: "clockCenter"
  }]
});
/**
 * CMMN User Event Listener (Circle with Double Line + User Icon) - per CMMN standard
 */
const CMMNUserEventListener = joint.dia.Element.define("cmmn.UserEventListener", {
  size: {
    width: 40,
    height: 40
  },
  attrs: {
    outerCircle: {
      r: 18,
      cx: 20,
      cy: 20,
      fill: "none",
      stroke: "#1A3763",
      "stroke-width": 2
    },
    innerCircle: {
      r: 15,
      cx: 20,
      cy: 20,
      fill: "#FFFFFF",
      stroke: "#1A3763",
      "stroke-width": 2
    },
    userHead: {
      // User icon: head (circle)
      r: 5,
      cx: 20,
      cy: 14,
      fill: "none",
      stroke: "#1A3763",
      "stroke-width": 2
    },
    userBody: {
      // User icon: body (line)
      d: "M 20,19 L 20,28",
      stroke: "#1A3763",
      "stroke-width": 2,
      "stroke-linecap": "round"
    }
  }
}, {
  markup: [{
    tagName: "circle",
    selector: "outerCircle"
  }, {
    tagName: "circle",
    selector: "innerCircle"
  }, {
    tagName: "circle",
    selector: "userHead"
  }, {
    tagName: "path",
    selector: "userBody"
  }]
});
/**
 * CMMN Case File Item (Document with Broken Upper Right Corner) - per CMMN standard
 */
const CMMNCaseFileItem = joint.dia.Element.define("cmmn.CaseFileItem", {
  size: {
    width: 80,
    height: 100
  },
  attrs: {
    body: {
      refWidth: 1,
      refHeight: 1,
      fill: "#FFFFFF",
      stroke: "#1A3763",
      "stroke-width": 2,
      rx: 2,
      ry: 2
    },
    corner: {
      // Broken corner effect (folded corner)
      d: "M 60,0 L 80,0 L 80,20 L 60,0",
      fill: "#E8E8E8",
      stroke: "#1A3763",
      "stroke-width": 2
    },
    cornerLine: {
      // Line showing the fold
      d: "M 60,0 L 80,20",
      stroke: "#1A3763",
      "stroke-width": 1,
      "stroke-dasharray": "2 2"
    },
    label: {
      refX: 0.5,
      refY: 0.5,
      "x-alignment": "middle",
      "y-alignment": "middle",
      fill: "#1a3763",
      "font-size": 10,
      "font-family": "Roboto, \"Helvetica Neue\", sans-serif",
      text: "",
      "text-anchor": "middle",
      "text-vertical-anchor": "middle",
      "text-wrap": {
        width: 60,
        height: 80,
        maxLineCount: 3,
        ellipsis: true
      }
    }
  }
}, {
  markup: [{
    tagName: "rect",
    selector: "body"
  }, {
    tagName: "path",
    selector: "corner"
  }, {
    tagName: "path",
    selector: "cornerLine"
  }, {
    tagName: "text",
    selector: "label"
  }]
});
/**
 * CMMN Participant (Role) - per CMMN standard
 * Participant icon: person silhouette
 */
const CMMNParticipant = joint.dia.Element.define("cmmn.Participant", {
  size: {
    width: 60,
    height: 80
  },
  attrs: {
    body: {
      refWidth: 1,
      refHeight: 1,
      fill: "#FFFFFF",
      stroke: "#1A3763",
      "stroke-width": 2,
      rx: 3,
      ry: 3
    },
    personIcon: {
      // Person silhouette icon
      d: "M 30,15 A 8,8 0 0,1 30,31 A 8,8 0 0,1 30,15 M 20,40 L 30,50 L 40,40",
      fill: "none",
      stroke: "#1A3763",
      "stroke-width": 2,
      "stroke-linecap": "round"
    },
    label: {
      refX: 0.5,
      refY: 60,
      "x-alignment": "middle",
      fill: "#1a3763",
      "font-size": 10,
      "font-family": "Roboto, \"Helvetica Neue\", sans-serif",
      text: "",
      "text-anchor": "middle",
      "text-wrap": {
        width: 55,
        height: 20,
        maxLineCount: 2,
        ellipsis: true
      }
    }
  }
}, {
  markup: [{
    tagName: "rect",
    selector: "body"
  }, {
    tagName: "path",
    selector: "personIcon"
  }, {
    tagName: "text",
    selector: "label"
  }]
});