// EXPORTS

// EXTERNAL MODULE: ./src/app/models/DrawnPart/OpmThing.ts
var OpmThing = require("./64633.js");
// EXTERNAL MODULE: ./src/app/models/DrawnPart/OpmState.ts
var OpmState = require("./14168.js");
// EXTERNAL MODULE: ./src/app/configuration/rappidEnviromentFunctionality/shared.ts + 1 modules
var shared = require("./1185.js");
// EXTERNAL MODULE: ./src/app/models/DrawnPart/Links/ExhibitionLink.ts
var ExhibitionLink = require("./93000.js");
// EXTERNAL MODULE: ./src/app/models/DrawnPart/Links/GeneralizationLink.ts
var GeneralizationLink = require("./81313.js");
// EXTERNAL MODULE: ./src/app/configuration/elementsFunctionality/textWrapping.ts
var textWrapping = require("./72081.js");
// EXTERNAL MODULE: ./src/app/models/VisualPart/OpmVisualObject.ts + 8 modules
var OpmVisualObject = require("./86922.js");
// EXTERNAL MODULE: ./src/app/models/DrawnPart/EllipsisState.ts
var EllipsisState = require("./81499.js");
// EXTERNAL MODULE: ./src/app/models/ConfigurationOptions.ts
var ConfigurationOptions = require("./13641.js");
// EXTERNAL MODULE: ./src/app/rappid-components/services/linkConstraints.ts
var linkConstraints = require("./25051.js");
// EXTERNAL MODULE: ./src/app/models/DrawnPart/Links/OrXorArcs.ts
var OrXorArcs = require("./83898.js");
// EXTERNAL MODULE: ./src/app/models/DrawnPart/components/units/units.popup.ts
var units_popup = require("./93375.js");
; // CONCATENATED MODULE: ./src/app/models/DrawnPart/components/alias/alias.popup.ts

function aliasValidation(aliasStr) {
  const new_val = aliasStr.trim();
  // Allow empty string to delete alias
  if (new_val === "") {
    (0, shared /* validationAlert */.iW)("The alias has been removed and will no longer be used.", 3000, "warning");
    return "";
  }
  const notAllowedWords = ["do", "if", "in", "for", "let", "new", "try", "var", "case", "else", "enum", "eval", "false", "null", "this", "true", "void", "with", "break", "catch", "class", "const", "super", "throw", "while", "yield", "delete", "export", "import", "public", "return", "static", "switch", "typeof", "default", "extends", "finally", "package", "private", "continue", "debugger", "function", "arguments", "interface", "protected", "implements", "instanceof"];
  if (new_val.indexOf(" ") > 0) {
    const errorMessage = "You can use spaces in an alias.";
    (0, shared /* validationAlert */.iW)(errorMessage, 3000, "Error");
    return;
  }
  if (notAllowedWords.includes(new_val)) {
    const errorMessage = "You can not use reserved words in an alias.";
    (0, shared /* validationAlert */.iW)(errorMessage, 3000, "Error");
    return;
  }
  if (new_val.indexOf("_") > 0 || new_val.indexOf(".") > 0) {
    const errorMessage = "You can not use '_' or '.' in aliases.";
    (0, shared /* validationAlert */.iW)(errorMessage, 3000, "Error");
    return;
  }
  return new_val;
}
function AliasPopup(drawn, initRappid, onFinish = () => {}) {
  const view = initRappid.paper.findViewByModel(drawn);
  const visual = initRappid.opmModel.getVisualElementById(drawn.get("id"));
  const alias = visual.logicalElement.alias ? visual.logicalElement.alias : "";
  const popup = new shared /* joint */.FP.ui.Popup({
    id: "alias_popup",
    events: {
      keypress: function (event) {
        if (event.which == 13) {
          const new_val = aliasValidation(this.$("#value").val());
          if (new_val === undefined) {
            return;
          }
          visual.logicalElement.alias = new_val;
          drawn.updateSiblings(visual, initRappid);
          shared /* joint */.FP.ui.Popup.close();
          onFinish();
        }
      },
      "click #update": function () {
        const new_val = aliasValidation(this.$("#value").val());
        if (new_val === undefined) {
          return;
        }
        visual.logicalElement.alias = new_val;
        drawn.updateSiblings(visual, initRappid);
        shared /* joint */.FP.ui.Popup.close();
        onFinish();
      }
    },
    content: "<div class=\"alias-popup\"><label class=\"popupHeader\">Edit Alias:</label><br><input class=\"inputAlias\" placeholder=\"insert alias\" value=\"" + alias + "\" id=\"value\" type=\"text\" autofocus><button id=\"update\" class=\"btnUpdate Popup\">Update</button></div>",
    target: view.el
  }).render();
  const fieldInput = popup.$("#value");
  const fldLength = fieldInput.val().length;
  fieldInput.focus();
  fieldInput[0].setSelectionRange(0, fldLength);
  (0, shared /* stylePopup */.O0)();
}
// EXTERNAL MODULE: ./src/app/opl-generation/opl.service.ts
var opl_service = require("./39917.js");
// EXTERNAL MODULE: ./src/app/models/components/range-validation/range-validation.ts
var range_validation = require("./12629.js");
; // CONCATENATED MODULE: ./src/app/models/DrawnPart/components/range/range.ts
function setRangePopUpContent(range, type = "int") {
  return `<div class="text-popup"><textarea class="text" rows="3" cols="26" style="min-width: 244px;min-height: 40px">${range}</textarea><br><span>Values type: </span><select value="${type}" id="range-type"><option value="integer" ${type == "boolean" ? "selected" : ""}>int</option><option value="float" ${type == "float" ? "selected" : ""}>float</option><option value="string" ${type == "string" ? "selected" : ""}>string</option><option value="char" ${type == "char" ? "selected" : ""}>char</option><option value="boolean" ${type == "boolean" ? "selected" : ""}>boolean</option></select><span class="btnReset">  Reset  </span><br><button class="btnUpdate Popup" style="width: 64px;">  Set  </button></div>`;
}
// EXTERNAL MODULE: ./src/app/models/modules/attribute-validation/attribute-range.ts
var attribute_range = require("./86132.js");
// EXTERNAL MODULE: ./src/app/models/VisualPart/backgroundImageEnum.ts
var backgroundImageEnum = require("./58091.js");
; // CONCATENATED MODULE: ./src/app/models/DrawnPart/OpmObject.ts
export let U = /*#__PURE__*/(() => {
  class OpmObject extends OpmThing /* OpmThing */.N {
    static #_ = (() => this.counter = 0)();
    static resetCounter() {
      OpmObject.counter = 0;
    }
    constructor() {
      super();
      this.shape = "rect";
      this.set(this.objectAttributes());
      this.attr(this.objectAttrs());
      this.previousStatesOrder = [];
      this.attr({
        image: {
          "ref-width": "-20",
          "ref-height": "-20",
          "ref-x": "10",
          "ref-y": "10"
        }
      });
    }
    convertOldPortToRelativePosition(portId) {
      const covnvertionTable = [{
        id: 0,
        refX: 0.05,
        refY: 0
      }, {
        id: 1,
        refX: 0.15,
        refY: 0
      }, {
        id: 2,
        refX: 0.25,
        refY: 0
      }, {
        id: 3,
        refX: 0.35,
        refY: 0
      }, {
        id: 4,
        refX: 0.45,
        refY: 0
      }, {
        id: 5,
        refX: 0.55,
        refY: 0
      }, {
        id: 6,
        refX: 0.65,
        refY: 0
      }, {
        id: 7,
        refX: 0.75,
        refY: 0
      }, {
        id: 8,
        refX: 0.85,
        refY: 0
      }, {
        id: 9,
        refX: 0.95,
        refY: 0
      }, {
        id: 10,
        refX: 1,
        refY: 0.1
      }, {
        id: 11,
        refX: 1,
        refY: 0.3
      }, {
        id: 12,
        refX: 1,
        refY: 0.5
      }, {
        id: 13,
        refX: 1,
        refY: 0.7
      }, {
        id: 14,
        refX: 1,
        refY: 0.9
      }, {
        id: 15,
        refX: 0.05,
        refY: 1
      }, {
        id: 16,
        refX: 0.15,
        refY: 1
      }, {
        id: 17,
        refX: 0.25,
        refY: 1
      }, {
        id: 18,
        refX: 0.35,
        refY: 1
      }, {
        id: 19,
        refX: 0.45,
        refY: 1
      }, {
        id: 20,
        refX: 0.55,
        refY: 1
      }, {
        id: 21,
        refX: 0.65,
        refY: 1
      }, {
        id: 22,
        refX: 0.75,
        refY: 1
      }, {
        id: 23,
        refX: 0.85,
        refY: 1
      }, {
        id: 24,
        refX: 0.95,
        refY: 1
      }, {
        id: 25,
        refX: 0,
        refY: 0.1
      }, {
        id: 26,
        refX: 0,
        refY: 0.3
      }, {
        id: 27,
        refX: 0,
        refY: 0.5
      }, {
        id: 28,
        refX: 0,
        refY: 0.7
      }, {
        id: 29,
        refX: 0,
        refY: 0.9
      }];
      return covnvertionTable.find(item => Number(portId) === item.id);
    }
    // createPorts(visual) {
    //
    //   // for (const index of Array.from({length: 30}, (x, i) => i)) {
    //   //   const refData = this.convertOldPortToRelativePosition(index);
    //   //   this.addPort({ id: index, group: 'aaa', args: { x: refData.refX*100+'%', y: refData.refY*100+'%' }, markup: this.defaultPortMarkup });
    //   // }
    // }
    checkIfStatesOrderChanged() {
      const currentOrder = this.getStatesOnly().map(st => st.id);
      if (currentOrder.length !== this.previousStatesOrder.length) {
        return true;
      }
      for (let i = 0; i < currentOrder.length; i++) {
        if (currentOrder[i] !== this.previousStatesOrder[i]) {
          return true;
        }
      }
      return false;
    }
    // DO NOT REMOVE. It is in a comment until a decision about states order syncing.
    syncStatesOrder(init, newlyCreated, order = undefined) {
      // const father = this.getVisual();
      // const correctOrder = order || this.getStatesOnly().map(s => s.getVisual().logicalElement.lid);
      // for (const visFather of father.logicalElement.visualElements) {
      //   if ((visFather === father && newlyCreated === false) || (visFather !== father && newlyCreated === true))
      //     continue;
      //   const isVerticalOrder = (<any>visFather).statesArrangement === statesArrangement.Right || (<any>visFather).statesArrangement === statesArrangement.Left;
      //   for (const state of (<any>visFather).states) {
      //     if (isVerticalOrder) {
      //       const i = correctOrder.indexOf(state.logicalElement.lid);
      //       if (i !== -1)
      //         state.yPos = (<any>visFather).yPos + i;
      //     } else {
      //       const i = correctOrder.indexOf(state.logicalElement.lid);
      //       if (i !== -1)
      //         state.xPos = (<any>visFather).xPos + i;
      //     }
      //   }
      //   (<any>visFather).rearrange((<any>visFather).statesArrangement);
      //   const cell = this.graph.getCell(visFather.id);
      //   if (cell) {
      //     init.graphService.updateEntity(visFather);
      //     cell.shiftEmbeddedToEdge(init);
      //     if (cell.get('duplicationMark'))
      //       cell.addDuplicationMarkToThisElement(cell, init);
      //     Arc.redrawAllArcs(cell, init, true);
      //     for (const st of cell.getStatesOnly())
      //       Arc.redrawAllArcs(st, init, true);
      //   }
      // }
    }
    getPortGroups() {
      return {
        aaa: {
          markup: this.defaultPortMarkup,
          position: "absolute"
        }
      };
    }
    /**
     * Alon: check if there is an Exhibition link connected to the Object
     * @returns {boolean}
     */
    hasExhibitionLink() {
      const links = this.graph.getConnectedLinks(this);
      for (let i = 0; i < links.length; i++) {
        if (links[i] instanceof ExhibitionLink /* ExhibitionLink */.G) {
          return true;
        }
      }
      return false;
    }
    objectAttributes() {
      return {
        markup: `<rect/><text/>`,
        type: "opm.Object",
        padding: 10
      };
    }
    getCounter() {
      return ++OpmObject.counter;
    }
    objectAttrs() {
      const styleSettings = this.setStyleSettings();
      const init = (0, shared /* getInitRappidShared */.Km)();
      if (init) {
        const oplService = init.oplService;
        if (oplService) {
          this.setRelevantStyleSettings(styleSettings, oplService);
        }
      }
      return {
        rect: {
          ...this.entityShape(),
          ...this.thingShape(),
          ...{
            stroke: styleSettings.border_color,
            fill: styleSettings.fill_color
          },
          ...{
            refWidth: "100%",
            refHeight: "100%"
          }
        },
        statesArrange: "bottom",
        text: {
          textWrap: {
            text: "Object"
          },
          fill: styleSettings.text_color,
          "font-size": styleSettings.font_size,
          "font-family": styleSettings.font
        },
        value: {
          value: "None",
          valueType: ConfigurationOptions /* valueType */._x.None,
          units: "None"
        }
      };
    }
    getShape() {
      return this.shape;
    }
    getParams() {
      const params = {
        statesArrangement: this.attr("statesArrange"),
        valueType: this.attr("value/valueType"),
        value: this.attr("value/value"),
        units: this.attr("value/units"),
        digitalTwin: this.digitalTwin,
        predigitalTwin: this.predigitalTwin,
        originalObj: this.originalObj,
        preoriginalObj: this.preoriginalObj,
        digitalTwinConnected: this.digitalTwinConnected
      };
      return {
        ...super.getThingParams(),
        ...params
      };
    }
    greyOutEntity() {
      if ((0, shared /* getInitRappidShared */.Km)().exportingOpl || !this.getVisual()?.logicalElement) {
        return;
      }
      if (this.getVisual().logicalElement.shouldBeGreyed === true && (0, shared /* getInitRappidShared */.Km)().shouldGreyOut) {
        this.graph.startBatch("ignoreChange");
        const attr = {
          rect: {
            stroke: "grey",
            fill: "lightgrey"
          }
        };
        this.attr(attr);
        this.graph.stopBatch("ignoreChange");
      } else {
        this.graph.startBatch("ignoreChange");
        const vis = this.getVisual();
        if (vis.fill === "lightgrey" && vis.strokeColor === "grey") {
          vis.fill = (0, shared /* getStyles */.$f)("opm.Object").fill;
          vis.strokeColor = (0, shared /* getStyles */.$f)("opm.Object").stroke;
        }
        this.updateParamsFromOpmModel(vis);
        this.graph.stopBatch("ignoreChange");
      }
    }
    getCameraSvgTooltip() {
      if (this.getStatesOnly().length) {
        return "The image is enable when the states are suppressed";
      } else {
        return super.getCameraSvgTooltip();
      }
    }
    updateURLArray() {
      if ((0, shared /* getInitRappidShared */.Km)().exportingOpl || !(0, shared /* getInitRappidShared */.Km)().paper || !(0, shared /* getInitRappidShared */.Km)().paper.findViewByModel(this)) {
        return;
      }
      const init = (0, shared /* getInitRappidShared */.Km)();
      const format = val => "'{}'".replace("{}", String(val));
      let urlMarkup = "";
      let descriptionMarkup = "";
      let cameraIconMarkup = "";
      if (this.hasURLs()) {
        const urlSignPosition = this.getUrlSignPosition();
        urlMarkup = this.getUrlSvgIcon(format(urlSignPosition.x), format(urlSignPosition.y));
      }
      const title = this.clearSvgTitle(this.hasDescription().desc || "");
      if (this.hasDescription().value) {
        const descriptionSignPosition = this.getDescriptionSignPosition();
        descriptionMarkup = this.getDescriptionSvgIcon(format(descriptionSignPosition.x), format(descriptionSignPosition.y), title);
      }
      const visual = this.getVisual();
      if (!visual) {
        return;
      }
      if (this.hasBackgroundImage() && !init.currentlyExportingPdf) {
        const cameraSignPosition = this.getCameraSvgPosition();
        if (this.shouldShowBackgroundImage()) {
          const textState = visual.getShowBackgroundImageState();
          const url = this.getVisual().logicalElement.getBackgroundImageUrl();
          this.attr("image/xlinkHref", url);
          (0, shared /* checkImageURL */.Zc)(url).then(res => {}).catch(err => this.attr("image/xlinkHref", "assets/SVG/redx.png"));
          cameraIconMarkup = this.getCameraSvgIcon(format(cameraSignPosition.x), format(cameraSignPosition.y), true);
          this.attr("image/opacity", [backgroundImageEnum /* BackgroundImageState */.b.IMAGEONLY, backgroundImageEnum /* BackgroundImageState */.b.TEXTANDIMAGEFULL].includes(textState) ? "1" : "0.5");
          this.attr("text/fill", textState === backgroundImageEnum /* BackgroundImageState */.b.IMAGEONLY ? "transparent" : visual.textColor);
        } else {
          cameraIconMarkup = this.getCameraSvgIcon(format(cameraSignPosition.x), format(cameraSignPosition.y), false);
          this.removeAttr("image/xlinkHref");
          this.removeAttr("image/opacity");
          this.attr("text/fill", visual.textColor);
        }
      } else {
        this.removeAttr("image/xlinkHref");
        this.removeAttr("image/opacity");
        this.attr("text/fill", visual.textColor);
      }
      const imageUrl = this.attr("image/xlinkHref");
      const imageMarkup = imageUrl ? `<image magnet="false" cursor="crosshair"/>` : ``;
      const markup = `<rect/>${imageMarkup}${urlMarkup}${descriptionMarkup}${cameraIconMarkup}<text/>`;
      this.set("markup", markup);
      if (this.get("duplicationMark")) {
        this.redrawDuplicationMark(init);
      }
      this.addSvgsClickEvents(init);
    }
    getCameraSvgPosition() {
      const visual = this.getVisual();
      if (!visual) {
        return {
          x: 0,
          y: 0
        };
      }
      const size = this.get("size");
      const arrangement = visual.statesArrangement;
      if (this.hasStates()) {
        if ([ConfigurationOptions /* statesArrangement */.vF.Bottom, null, undefined].includes(arrangement)) {
          return {
            x: this.hasURLs() ? 25 : 5,
            y: 5
          };
        } else if (arrangement === ConfigurationOptions /* statesArrangement */.vF.Top) {
          return {
            x: this.hasURLs() ? 25 : 5,
            y: size.height - 20
          };
        } else if (arrangement === ConfigurationOptions /* statesArrangement */.vF.Left) {
          return {
            x: size.width - 25,
            y: this.hasURLs() ? 22 : 5
          };
        } else if (arrangement === ConfigurationOptions /* statesArrangement */.vF.Right) {
          return {
            x: 5,
            y: this.hasURLs() ? 22 : 5
          };
        }
      } else {
        return {
          x: this.hasURLs() ? 25 : 5,
          y: 5
        };
      }
    }
    getUrlSignPosition() {
      const visual = this.getVisual();
      if (!visual) {
        return {
          x: 0,
          y: 0
        };
      }
      const size = this.get("size");
      const arrangement = visual.statesArrangement;
      if (this.hasStates()) {
        if ([ConfigurationOptions /* statesArrangement */.vF.Bottom, ConfigurationOptions /* statesArrangement */.vF.Right, null, undefined].includes(arrangement)) {
          return {
            x: 5,
            y: 5
          };
        } else if (arrangement === ConfigurationOptions /* statesArrangement */.vF.Top) {
          return {
            x: 5,
            y: size.height - 20
          };
        } else if (arrangement === ConfigurationOptions /* statesArrangement */.vF.Left) {
          return {
            x: size.width - 25,
            y: 5
          };
        }
      } else {
        return {
          x: 5,
          y: 5
        };
      }
    }
    getDescriptionSignPosition() {
      const visual = this.getVisual();
      if (!visual) {
        return {
          x: 0,
          y: 0
        };
      }
      const size = this.get("size");
      const arrangement = visual.statesArrangement;
      if (this.hasStates()) {
        if ([ConfigurationOptions /* statesArrangement */.vF.Bottom, null, undefined].includes(arrangement)) {
          return {
            x: size.width - 20,
            y: 5
          };
        } else if (arrangement === ConfigurationOptions /* statesArrangement */.vF.Top) {
          return {
            x: size.width - 20,
            y: size.height - 20
          };
        } else if (arrangement === ConfigurationOptions /* statesArrangement */.vF.Right) {
          return {
            x: 5,
            y: size.height - 20
          };
        } else if (arrangement === ConfigurationOptions /* statesArrangement */.vF.Left) {
          return {
            x: size.width - 20,
            y: size.height - 20
          };
        }
      } else {
        return {
          x: size.width - 20,
          y: 5
        };
      }
    }
    addState(stateName = null, initRappid) {
      // this.objectChangedSize = false;
      const statesOnly = this.getEmbeddedCells().filter(child => child instanceof OpmState /* OpmState */.g);
      this.createNewState(stateName ? stateName : "state" + (statesOnly.length + 1));
      if (!stateName && statesOnly.length === 0) {
        this.createNewState("state" + (statesOnly.length + 2));
      }
      // Add the new state using the current states arrangement
      // arrangeEmbedded(this, this.attr('statesArrange'));
      if (initRappid) {
        this.arrangeEmbedded(initRappid);
      }
    }
    updateParamsFromOpmModel(visualElement) {
      this.attr({
        ".": {
          opacity: visualElement.belongsToSubModel || visualElement.logicalElement.visualElements.some(v => v.protectedFromBeingChangedBySubModel || v.belongsToFatherModelId) ? 0.6 : 1
        }
      });
      const attr = {
        rect: {
          ...this.updateEntityFromOpmModel(visualElement),
          ...this.updateThingFromOpmModel(visualElement),
          ...{
            "stroke-width": this.getCorrectStrokeWidth(visualElement)
          }
        },
        statesArrange: this.getStateArrangement(visualElement.statesArrangement),
        value: {
          value: visualElement.logicalElement.value,
          valueType: visualElement.logicalElement.valueType,
          units: visualElement.logicalElement.units
        },
        originalObj: visualElement.originalObj,
        preoriginalObj: visualElement.preoriginalObj,
        digitalTwin: visualElement.digitalTwin,
        predigitalTwin: visualElement.predigitalTwin,
        digitalTwinConnected: visualElement.digitalTwinConnected
      };
      this.attr(attr);
      this.set("id", visualElement.id);
      if (this.attributes.attrs.text.textWrap.text === "Default Name") {
        this.attr({
          text: {
            textWrap: {
              text: visualElement.logicalElement.getNumberedName()
            }
          }
        });
      }
      this.updateURLArray();
      this.rangeTooltip(visualElement);
      // Restore pattern if present
      this.restorePatternIfNeeded(visualElement);
    }
    restorePatternIfNeeded(visualElement) {
      const fill = visualElement.fill;
      if (fill && fill.startsWith && fill.startsWith("url(#")) {
        // Fill is a pattern - restore using new static template system
        const init = (0, shared /* getInitRappidShared */.Km)();
        if (!init?.elementToolbarReference) {
          return;
        }
        const predefinedPatternId = visualElement.predefinedPatternId;
        const patternConfig = visualElement.patternConfig;
        const baseFillColor = visualElement.baseFillColor || "#FFFFFF";
        if (predefinedPatternId) {
          // Predefined pattern - use static template
          const newPatternUrl = init.elementToolbarReference.createPatternInstance(predefinedPatternId, baseFillColor);
          if (newPatternUrl) {
            visualElement.fill = newPatternUrl;
          }
        } else if (patternConfig) {
          // Custom pattern - create element-specific pattern
          const elementId = this.id || `elem-${Date.now()}-${Math.random()}`;
          const newPatternUrl = init.elementToolbarReference.createPatternInstance(patternConfig, baseFillColor, elementId);
          if (newPatternUrl) {
            visualElement.fill = newPatternUrl;
          }
        } else {
          // Legacy: try to extract from pattern URL (backward compatibility)
          const match = fill.match(/url\(#([^)]+)\)/);
          if (match) {
            const patternId = match[1];
            // Check if it's a predefined pattern instance (pat-{patternId}-bg-{color})
            if (patternId.includes("-bg-")) {
              const predefinedId = patternId.split("-bg-")[0].replace("pat-", "");
              const predefinedPatterns = init.elementToolbarReference.getPredefinedPatterns();
              const patternDef = predefinedPatterns.find(p => p.id === predefinedId);
              if (patternDef) {
                visualElement.predefinedPatternId = predefinedId;
                visualElement.isCustomPattern = false;
                const bgColor = "#" + patternId.split("-bg-")[1];
                visualElement.baseFillColor = bgColor;
                const newPatternUrl = init.elementToolbarReference.createPatternInstance(predefinedId, bgColor);
                if (newPatternUrl) {
                  visualElement.fill = newPatternUrl;
                }
              }
            } else if (patternId.startsWith("pat-stripes-custom-")) {
              // Custom pattern - would need to extract config, but for now just restore URL
              // This is a fallback for old saved patterns
              visualElement.fill = fill;
            }
          }
        }
      } else if (fill && !fill.startsWith("url(#")) {
        // Solid fill - store as baseFillColor
        visualElement.baseFillColor = fill;
      }
    }
    ensurePatternInSVG(patternConfig, isCustom = false) {
      // This method is no longer needed with static templates, but kept for backward compatibility
      // Patterns are now created via createPatternInstance in element-tool-bar
      const init = (0, shared /* getInitRappidShared */.Km)();
      const paper = init?.paper;
      if (!paper || !paper.svg) {
        return;
      }
      // Check if this is a predefined pattern
      let isPredefined = false;
      if (init?.elementToolbarReference && init.elementToolbarReference.getPredefinedPatterns) {
        const predefinedPatterns = init.elementToolbarReference.getPredefinedPatterns();
        isPredefined = predefinedPatterns.some(p => p.config.angleDeg === patternConfig.angleDeg && p.config.gap === patternConfig.gap && p.config.stripeWidth === patternConfig.stripeWidth && p.config.stripeColor === patternConfig.stripeColor && p.config.useUserSpace === patternConfig.useUserSpace);
      }
      // If it's not predefined and not marked as custom, assume it's custom
      const isCustomPattern = isCustom || !isPredefined;
      const {
        angleDeg,
        gap,
        stripeWidth,
        stripeColor,
        background,
        useUserSpace
      } = patternConfig;
      const svg = paper.svg;
      const ns = "http://www.w3.org/2000/svg";
      // Ensure a <defs> exists
      let defs = svg.querySelector("defs");
      if (!defs) {
        defs = document.createElementNS(ns, "defs");
        svg.insertBefore(defs, svg.firstChild);
      }
      // Build pattern ID
      // Normalize angle to avoid issues with negative numbers (use 'n' prefix for negative)
      const angleStr = angleDeg < 0 ? `n${Math.abs(angleDeg)}` : String(angleDeg);
      const keyParts = [angleStr, gap, stripeWidth, stripeColor.replace("#", ""), (background || "none").replace("#", ""), useUserSpace ? "us" : "bb"];
      // For predefined patterns: use shared ID (no element ID)
      // For custom patterns: include element ID to make it unique per element
      const elementId = this.id || `elem-${Date.now()}-${Math.random()}`;
      const patternId = isCustomPattern ? `pat-stripes-custom-${elementId}-${keyParts.join("-")}` : `pat-stripes-${keyParts.join("-")}`;
      // Reuse if already present
      let pattern = svg.querySelector(`#${patternId}`);
      if (!pattern) {
        pattern = document.createElementNS(ns, "pattern");
        pattern.setAttribute("id", patternId);
        if (useUserSpace) {
          pattern.setAttribute("patternUnits", "userSpaceOnUse");
          pattern.setAttribute("width", String(gap));
          pattern.setAttribute("height", String(gap));
        } else {
          pattern.setAttribute("patternUnits", "objectBoundingBox");
          pattern.setAttribute("width", "1");
          pattern.setAttribute("height", "1");
        }
        if (angleDeg) {
          pattern.setAttribute("patternTransform", `rotate(${angleDeg})`);
        }
        // Add background rect if background color is provided
        if (background) {
          const bg = document.createElementNS(ns, "rect");
          bg.setAttribute("x", "0");
          bg.setAttribute("y", "0");
          bg.setAttribute("width", useUserSpace ? String(gap) : "1");
          bg.setAttribute("height", useUserSpace ? String(gap) : "1");
          bg.setAttribute("fill", background);
          pattern.appendChild(bg);
        }
        // Draw one vertical stripe; rotation handles orientation
        const stripe = document.createElementNS(ns, "rect");
        if (useUserSpace) {
          stripe.setAttribute("x", String(gap / 2 - stripeWidth / 2));
          stripe.setAttribute("y", "0");
          stripe.setAttribute("width", String(stripeWidth));
          stripe.setAttribute("height", String(gap));
        } else {
          const fracW = stripeWidth / gap;
          stripe.setAttribute("x", String(0.5 - fracW / 2));
          stripe.setAttribute("y", "0");
          stripe.setAttribute("width", String(fracW));
          stripe.setAttribute("height", "1");
        }
        stripe.setAttribute("fill", stripeColor);
        pattern.appendChild(stripe);
        defs.appendChild(pattern);
      }
    }
    getCorrectStrokeWidth(visual) {
      return visual.getCorrectStrokeWidth();
    }
    getStateArrangement(arrangement) {
      switch (arrangement) {
        case ConfigurationOptions /* statesArrangement */.vF.Top:
          return "top";
        case ConfigurationOptions /* statesArrangement */.vF.Bottom:
          return "bottom";
        case ConfigurationOptions /* statesArrangement */.vF.Left:
          return "left";
        case ConfigurationOptions /* statesArrangement */.vF.Right:
          return "right";
      }
    }
    createNewState(stateName) {
      const defaultState = new OpmState /* OpmState */.g(stateName);
      this.embed(defaultState); // makes the state stay in the bounds of the object
      this.graph.addCells([this, defaultState]);
      defaultState.toFront();
      // Placing the new state. By default it is outside the object.
      //const xNewState = this.getBBox().center().x - defaultState.get('size').width / 2;
      //const yNewState = this.get('position').y + this.get('size').height - defaultState.get('size').height;
      const list = this.getEmbeddedCells().filter(child => child instanceof OpmState /* OpmState */.g);
      list.sort(function (a, b) {
        return a.get("position").x - b.get("position").x;
      });
      let xNewState;
      let yNewState;
      if (list.length) {
        const state = list[list.length - 1];
        xNewState = state.get("position").x;
        yNewState = state.get("position").y;
      } else {
        xNewState = this.get("size").width + this.get("position").x;
        yNewState = this.get("size").height + this.get("position").y;
      }
      // this.graph.startBatch('ignoreEvents');
      defaultState.set("father", defaultState.get("parent"));
      defaultState.set({
        position: {
          x: xNewState,
          y: yNewState
        }
      });
      // this.graph.stopBatch('ignoreEvents');
    }
    getStatesToolbarAction(rappid) {
      const visual = rappid.opmModel.getVisualElementById(this.id);
      const tools = [{
        action: "add",
        content: "Add State"
      }];
      if (visual.hasAnyLogicalStates() === false) {
        return tools;
      }
      if (visual.allStatesExpressed()) {
        tools.push({
          action: "suppress",
          content: "Suppress"
        });
      } else {
        tools.push({
          action: "express",
          content: "Express"
        });
      }
      return tools;
    }
    get rev_padding() {
      return (this.get("size").height + 40) * -1;
    }
    shouldShowBackgroundImage() {
      const visual = this.getVisual();
      if (!visual || visual.states?.length) {
        return false;
      }
      return super.shouldShowBackgroundImage();
    }
    statesToolbarGenerator(target, tools) {
      const this_ = this;
      return new shared /* joint */.FP.ui.ContextToolbar({
        theme: "modern",
        tools: tools,
        target: target,
        padding: this_.rev_padding
      });
    }
    haloConfiguration(halo, options) {
      super.haloConfiguration(halo, options);
      this.halo = halo;
      const currentObject = this;
      halo.on("action:addState:pointerdown", function () {
        currentObject.addStateAction(currentObject.getVisual(), options);
        halo.toggleState("default");
        const statesOnly = currentObject.getEmbeddedCells().filter(child => shared /* OPCloudUtils */.e2.isInstanceOfDrawnState(child));
        for (const state of statesOnly) {
          OrXorArcs /* Arc */.l.redrawAllArcs(state, options, true);
        }
      });
      halo.on("action:editUnits:pointerdown", function () {
        currentObject.editUnitsPopup(options);
        halo.remove();
      });
      halo.on("action:editAlias:pointerdown", function () {
        currentObject.editAliasPopup(options);
        // new EditAliasAction(options, this).act();
        halo.remove();
      });
      halo.on("action:hideValueObject:pointerdown", function () {
        currentObject.hideValueObject(options);
        halo.remove();
      });
      halo.on("action:suppressValueStates:pointerdown", function () {
        currentObject.suppressValueStates(options);
        halo.remove();
      });
      halo.on("action:suppress:pointerdown", function () {
        (0, shared /* getInitRappidShared */.Km)().graph.startBatch("statesSuppression");
        currentObject.suppressAllAction(currentObject.getVisual(), options);
        halo.toggleState("default");
        if (!currentObject.getEmbeddedCells().find(s => s.constructor.name.includes("Object"))) {
          currentObject.setFatherObjectSizeToDefault(currentObject);
        }
        (0, shared /* getInitRappidShared */.Km)().graph.stopBatch("statesSuppression");
      });
      halo.on("action:express:pointerdown", function () {
        currentObject.expressAllAction(currentObject.getVisual(), options);
        halo.toggleState("default");
      });
    }
    showArrangeNavigation(show) {
      if (!this.halo) {
        return;
      }
      if (!show) {
        show = false;
      }
      this.halo.$handles.children(".arrange_up").toggleClass("hidden", !show);
      this.halo.$handles.children(".arrange_down").toggleClass("hidden", !show);
      this.halo.$handles.children(".arrange_left").toggleClass("hidden", !show);
      this.halo.$handles.children(".arrange_right").toggleClass("hidden", !show);
    }
    checkIfHasAgentConnected() {
      if (this.graph.getConnectedLinks(this, {
        outbound: true
      }).find(l => l.get("name") === "Agent")) {
        return true;
      } else {
        return false;
      }
    }
    // update value and states accordingly in all opds except the cuurent opd which will be updated automatically
    removeAllStatesFromObject(initRappid) {
      const drawnObject = this;
      const logicalObject = initRappid.opmModel.getLogicalElementByVisualId(drawnObject.get("id"));
      const states = logicalObject.states.map(s => s.visualElements[0]).filter(s => !!s);
      for (let i = states.length - 1; i >= 0; i--) {
        states[i].removeAction();
      }
      // remove from current view
      drawnObject.removeStates();
      // remove logical states and ellipsis state from logical object
      // logicalObject.removeAllStates();
    }
    addStateToAllLevels(initRappid) {
      const drawnObject = this;
      const logicalObject = initRappid.opmModel.getLogicalElementByVisualId(drawnObject.get("id"));
      const visualObject = initRappid.opmModel.getVisualElementById(drawnObject.get("id"));
      const visualState = visualObject.children[0];
      for (let i = 0; i < logicalObject.visualElements.length; i++) {
        const parentObject = logicalObject.visualElements[i];
        if (parentObject.id !== visualState.fatherObject.id) {
          // current opd object already has the state
          const clonedState = visualState.clone();
          // Placing the new state.
          const xclonedState = parentObject.xPos + parentObject.width / 2 - clonedState.width / 2;
          const yclonedState = parentObject.yPos + parentObject.height - clonedState.height;
          clonedState.xPos = xclonedState;
          clonedState.yPos = yclonedState;
          clonedState.fatherObject = parentObject;
          parentObject.children.push(clonedState);
          parentObject.rearrange(ConfigurationOptions /* statesArrangement */.vF.Bottom);
          initRappid.opmModel.getOpdByThingId(parentObject.id).add(clonedState);
        }
      }
    }
    defineAsComputationalObject(initRappid, shouldOpenTextEditor = true) {
      const drawnObject = this;
      const visualCell = initRappid.opmModel.getVisualElementById(drawnObject.get("id"));
      if (visualCell.logicalElement.getBelongsToStereotyped() || visualCell.logicalElement.getStereotype()) {
        (0, shared /* validationAlert */.iW)("Cannot add states to a stereotyped object.");
        return;
      }
      if (!drawnObject.CanBeComputational()) {
        drawnObject.toggleEssence(visualCell);
      }
      // if the object has logical states (states at any opd) the they need to be deleted
      this.removeAllStatesFromObject(initRappid);
      drawnObject.attr({
        value: {
          value: "value",
          valueType: ConfigurationOptions /* valueType */._x.Number
        }
      });
      // if (drawnObject.attr('text/textWrap/text').indexOf('[') < 0)  // if value wasn't defined yet
      // drawnObject.attr({ text: { textWrap: { text: drawnObject.attr('text/textWrap/text') + '\n[] {}' } } });
      // visualCell.states[0].text = 'value';
      visualCell.logicalElement.value = "value";
      visualCell.logicalElement.valueType = ConfigurationOptions /* valueType */._x.Number;
      drawnObject.updateTextFromModel(visualCell.logicalElement);
      drawnObject.addStateAction(visualCell, initRappid, shouldOpenTextEditor);
      drawnObject.graph.getCell(drawnObject.get("embeds")[0]).setText("value");
      // drawnObject.addState('value', initRappid); // add state with not defined value - creates logical and visual instance
      this.addStateToAllLevels(initRappid);
      visualCell.children[0].logicalElement.text = "value";
      if (drawnObject.halo) {
        drawnObject.halo.removeHandle("add_state");
      }
      // return the new state
      return drawnObject.getEmbeddedCells()[0];
    }
    computation(target, initRappid) {
      if (this.checkIfHasAgentConnected()) {
        let text = "The object " + this.attributes.attrs.text.textWrap.text + " can't be changed to computational because it has an agent link.";
        (0, shared /* validationAlert */.iW)(text, null, "Error");
        return;
      } else if (!linkConstraints /* LinkConstraints */.Nj.CanBeComputational(this.id, initRappid, this)) {
        let text = "The object " + this.attributes.attrs.text.textWrap.text + " can't be computational because it can't be informatical.";
        (0, shared /* validationAlert */.iW)(text, null, "Error");
        return;
      } else if (this.getVisual().logicalElement.belongsToFatherModelId) {
        let text = "The object " + this.attributes.attrs.text.textWrap.text + " can't be changed to computational because it belongs to a father model.";
        (0, shared /* validationAlert */.iW)(text, null, "Error");
        return;
      } else if (this.isComputational()) {
        let text = "The object " + this.attributes.attrs.text.textWrap.text + " is already computational.";
        (0, shared /* validationAlert */.iW)(text, null, "Error");
        return;
      }
      // initRappid.getOpmModel().logForUndo((<OpmLogicalThing<OpmVisualThing>>this.getVisual().logicalElement).text + ' computation');
      const this_ = this;
      // const ret = initRappid.opmModel.getLogicalElementByVisualId(this.get('id')).setAsComputational();
      const drawnState = this.defineAsComputationalObject(initRappid, false);
      if (drawnState) {
        const onFinishUnitsEditing = () => this_.editAliasPopup(initRappid);
        const onFinishNameEditing = () => this_.editUnitsPopup(initRappid, onFinishUnitsEditing);
        drawnState.openTextEditor(initRappid.paper.findViewByModel(drawnState), initRappid, onFinishNameEditing);
      }
      // const currentValue = initRappid.opmModel.getLogicalElementByVisualId(this.get('id')).value;
      // let drawnState;
      // If the user choose the computational icon while the object is already has a value then we reset the value.
      // value will be set to value string and the text on the state will be 'velue'
      /*if (currentValue && (currentValue !== 'None')) {
        drawnState = this.getEmbeddedCells()[0];
        this.attr({ value: { value: 'value', valueType: valueType.String } });
        drawnState.attr('text/textWrap/text', 'value');
      } else {
        drawnState = defineAsComputationalObject(this, initRappid);
      }
      drawnState.openTextEditor(initRappid.paper.findViewByModel(drawnState), initRappid);*/
    }
    updateObjectValueType(initRappid, value) {
      this.graph.startBatch("ignoreEvents");
      if (value !== this.attr("value/value")) {
        const type = (0, shared /* isNumber */.Et)(value) ? ConfigurationOptions /* valueType */._x.Number : ConfigurationOptions /* valueType */._x.String;
        this.attr({
          value: {
            value: value,
            valueType: type
          }
        });
        const logical = initRappid.getOpmModel().getLogicalElementByVisualId(this.id);
        logical.valueType = type;
        logical.value = value;
      }
      this.graph.stopBatch("ignoreEvents");
      this.rangeTooltip(this.getVisual());
    }
    getNewDimensions(leftSideX, topSideY, rightSideX, bottomSideY, includeSemiFolded = false) {
      shared._.each(this.getEmbeddedCells(), function (child) {
        const childBbox = child.getBBox();
        // Updating the new size of the object to have margins of at least paddingObject so that the state will not touch the object
        if (childBbox.x <= leftSideX + shared /* paddingObject */.RE) {
          leftSideX = childBbox.x - shared /* paddingObject */.RE;
        }
        if (childBbox.y <= topSideY + shared /* paddingObject */.RE) {
          topSideY = childBbox.y - shared /* paddingObject */.RE;
        }
        if (childBbox.corner().x >= rightSideX - shared /* paddingObject */.RE) {
          rightSideX = childBbox.corner().x + shared /* paddingObject */.RE;
        }
        if (childBbox.corner().y >= bottomSideY - shared /* paddingObject */.RE) {
          bottomSideY = childBbox.corner().y + shared /* paddingObject */.RE;
        }
      });
      return {
        leftSideX: leftSideX,
        topSideY: topSideY,
        rightSideX: rightSideX,
        bottomSideY: bottomSideY
      };
    }
    //  remove all drawn states
    removeStates() {
      const embedded = this.getEmbeddedCells();
      // delete all embedded cells - each object can have only one value at a time
      for (let i = 0; i < embedded.length; i++) {
        embedded[i].remove();
      }
    }
    /*changeAttributesHandle(initRappid) {
      super.changeAttributesHandle(initRappid);
         // This logic shouldn't be here but inside the TextualModule
         const logical: OpmLogicalObject = initRappid.opmModel.getLogicalElementByVisualId(this.get('id'));
      if (logical.isComputational() == false)
        return;
      const text = this.getText();
      const start_units = text.indexOf('[') + 1;
      const end_units = text.indexOf(']');
      const start_alias = text.indexOf('{') + 1;
      const end_alias = text.indexOf('}');
      const units = text.substring(start_units, end_units);
      const alias = text.substring(start_alias, end_alias);
      if (logical.units !== units && start_units > 0 && end_units > 0) { // units changed
        logical.units = units;
        this.handleChangeOfUnits(initRappid, units);
      } else if (logical.alias !== alias && start_alias > 0 && end_alias > 0) {
        logical.alias = alias;
      }
    }*/
    editUnitsPopup(initRappid, onFinish = () => {}) {
      (0, units_popup /* UnitsPopup */.KD)(this, initRappid, onFinish);
    }
    editAliasPopup(initRappid, onFinish = () => {}) {
      const visual = this.getVisual();
      if (!visual.logicalElement.getBelongsToStereotyped()) {
        // prevent edit/add an alias for an object that belongs to a stereotype (except the main thing of the stereotype)
        AliasPopup(this, initRappid, onFinish);
      }
    }
    hideValueObject(init) {
      const visual = this.getVisual();
      const model = init.opmModel;
      const ret = new range_validation /* RangeValidationAccess */.P(model).hideValueObject(visual);
      if (ret.hide) {
        init.setSelectedElementToNull();
        init.graphService.renderGraph(init.opmModel.currentOpd, init);
        return;
      }
      (0, shared /* validationAlert */.iW)("Could not hide");
    }
    suppressValueStates(init) {
      const visual = this.getVisual();
      const model = init.opmModel;
      const ret = model.suppressValueObjectStates(visual);
      if (ret.success) {
        init.graphService.renderGraph(init.opmModel.currentOpd, init);
        return;
      }
    }
    setRangePopup(init) {
      const view = init.paper.findViewByModel(this);
      const model = init.opmModel;
      const visual = init.opmModel.getVisualElementById(this.get("id"));
      const logical = visual.logicalElement;
      if (logical.isSatisfiedRequirementObject()) {
        (0, shared /* validationAlert */.iW)("Cannot set range to a requirement object.", 5000, "error");
        return;
      }
      // if (!logical.rangeTypeElement) {
      //   console.log('sss')
      //   if (!(<any>this).isComputational(initRappid))
      //     this.defineAsComputationalObject(initRappid);
      //   const ret = this.addRangeTypeElement(initRappid);
      //   initRappid.graphService.updateEntity(ret.rangeObject);
      //   const cell = this.graph.getCell(ret.rangeObject.id);
      //   if (cell)
      //     cell.shiftEmbeddedToEdge(initRappid);
      //   initRappid.graphService.updateLinksView([ret.link])
      // } else {
      //   console.log('www')
      //   const rte = logical.rangeTypeElement;
      //   let rteInOpd = rte.visualElements.find(v => initRappid.opmModel.getOpdByThingId(v.id) === initRappid.opmModel.currentOpd);
      //   if (!rteInOpd) {
      //     const ret2 = this.bringRangeTypeElementToOpd(initRappid, rte, visual, initRappid.opmModel.currentOpd);
      //     initRappid.graphService.updateEntity(ret2.newVis);
      //     initRappid.graphService.updateLinksView([ret2.link]);
      //   }
      // }
      const stringToType = value => {
        if (value == "integer") {
          return attribute_range /* ValueAttributeType */.y.INTEGER;
        } else if (value == "float") {
          return attribute_range /* ValueAttributeType */.y.FLOAT;
        } else if (value == "string") {
          return attribute_range /* ValueAttributeType */.y.STRING;
        } else if (value == "char") {
          return attribute_range /* ValueAttributeType */.y.CHAR;
        } else if (value == "boolean") {
          return attribute_range /* ValueAttributeType */.y.BOOLEAN;
        }
        return attribute_range /* ValueAttributeType */.y.INTEGER;
      };
      const typeToString = value => {
        if (value == attribute_range /* ValueAttributeType */.y.INTEGER) {
          return "integer";
        } else if (value == attribute_range /* ValueAttributeType */.y.FLOAT) {
          return "float";
        } else if (value == attribute_range /* ValueAttributeType */.y.STRING) {
          return "string";
        } else if (value == attribute_range /* ValueAttributeType */.y.CHAR) {
          return "char";
        } else if (value == attribute_range /* ValueAttributeType */.y.BOOLEAN) {
          return "boolean";
        }
        return "integer";
      };
      const onFinish = (pattern, type) => {
        const ret = model.setRange(visual, {
          type: stringToType(type),
          pattern
        });
        if (ret.wasSet == false) {
          (0, shared /* validationAlert */.iW)(ret.errors[0]);
          return {
            closePopup: false
          };
        }
        init.graphService.renderGraph(init.opmModel.currentOpd, init);
        return {
          closePopup: true
        };
      };
      const disableTextarea = function () {
        const type = this.$("#range-type :selected").val();
        if (type == "boolean" || type == "char") {
          this.$(".text").prop("disabled", true);
          this.$(".text").val("");
        } else {
          this.$(".text").prop("disabled", false);
        }
      };
      const popup = new shared /* joint */.FP.ui.Popup({
        id: "set_range_popup",
        events: {
          keypress: function (event) {
            if (event.which == 13) {
              const value = this.$(".text").val();
              const type = this.$("#range-type :selected").val();
              const ret = onFinish(value, type);
              if (ret.closePopup) {
                popup.remove();
              }
            }
          },
          "click .btnUpdate": function () {
            const value = this.$(".text").val();
            const type = this.$("#range-type :selected").val();
            const ret = onFinish(value, type);
            if (ret.closePopup) {
              popup.remove();
            }
          },
          "click .btnReset": function () {
            const equivalent = visual.logicalElement.equivalentFromStereotypeLID;
            const stereotypeEquivalentLogical = init.opmModel.getEquivalentLogicalThingFromStereotype(equivalent);
            if (stereotypeEquivalentLogical) {
              const validator = stereotypeEquivalentLogical.getValidationModule().getValidator();
              const ret = onFinish(validator.getPattern(), validator.getType());
              if (ret.closePopup) {
                popup.remove();
              }
            }
          },
          "change #range-type": function () {
            disableTextarea.call(this);
          }
        },
        content: [setRangePopUpContent(logical.getValidationModule().getRange(), typeToString(logical.getValidationModule().getType()))],
        target: view.el
      }).render();
      (0, shared /* stylePopup */.O0)();
      this.removeResetButtonFromPopup(visual);
      disableTextarea.call(popup);
    }
    removeResetButtonFromPopup(visual) {
      if (!visual.logicalElement.equivalentFromStereotypeLID) {
        $(".text-popup .btnReset").remove();
      }
    }
    removeRange(init) {
      const model = init.opmModel;
      const visual = init.opmModel.getVisualElementById(this.get("id"));
      const ret = new range_validation /* RangeValidationAccess */.P(model).removeRange(visual);
      if (ret.removed) {
        init.graphService.renderGraph(init.opmModel.currentOpd, init);
        return;
      }
    }
    toggleValueTypeObject(init) {
      const model = init.opmModel;
      const visual = init.opmModel.getVisualElementById(this.get("id"));
      model.toggleValueTypeObject(visual);
      init.graphService.renderGraph(init.opmModel.currentOpd, init);
    }
    /* updateUnits(units, initRappid) {
       const logical: OpmLogicalObject = initRappid.opmModel.getLogicalElementByVisualId(this.get('id'));
       logical.units = units;
       this.graph.startBatch('ignoreEvents');
       // I don't know if this line is needed.
       this.attr({ value: { units: logical.units } });
       this.graph.stopBatch('ignoreEvents');
       /*
          const alias = logicalObject.alias;
       const objectText = logicalObject.getName();
       if (units !== 'None') {
         const newText = objectText + '\n[' + units + '] {' + alias + '}';
         this.attr('text/textWrap/text', newText);
       }
        }*/
    /**
     * open new text editor for this object, start editing at index of units
     * @param initRappid
     */
    setCursorToUnits(initRappid) {
      // TODO:
      /*
      if (this.attr('value/units') !== 'None' && this.attr('value/units') !== '') {
        return;
      }
      this.updateUnits(' ', initRappid);  // insert space manually, in order to have a char to select
      const cellView = initRappid.paper.findViewByModel(this.id);
      this.openTextEditor(cellView, initRappid);
      const editor = initRappid.textEditor;
      const text = this.attr('text/textWrap/text');
      const indexUnits = text.lastIndexOf('[') + 1;
      editor.select(indexUnits, indexUnits + 1);*/
    }
    setCursorToAlias(initRappid) {
      const logicalObject = initRappid.opmModel.getLogicalElementByVisualId(this.get("id"));
      const alias = logicalObject.alias;
      if (alias === "") {
        const text = this.attr("text/textWrap/text");
        const aliasIndex = text.lastIndexOf("{");
        const newText = text.substring(0, aliasIndex + 1) + " }";
        this.attr("text/textWrap/text", newText);
        this.openTextEditor(initRappid.paper.findViewByModel(this), initRappid);
        const indexAlias = this.attr("text/textWrap/text").lastIndexOf("{") + 1;
        initRappid.textEditor.select(indexAlias, indexAlias + 1);
      }
    }
    // after finishing text editing, need to update units if exist.
    closeTextEditor(init) {
      super.closeTextEditor(init);
      this.updateURLArray();
      /*const indexOfStartUnits = text.lastIndexOf('[');
      const indexOfEndUnits = text.lastIndexOf(']');
      let units = 'None';
      // if units were inserted
      if ((indexOfStartUnits > 0) && (indexOfEndUnits > 0) && (indexOfEndUnits > indexOfStartUnits)) {
        units = text.substring(indexOfStartUnits + 1, indexOfEndUnits);
        if (units === ' ') {
          this.updateUnits('', initRappid);
        } else {
          this.attr('value/units', units);
        }
        // if entered units are unsupported, display alert
        const allUnits = convert().possibilities().map(function (item) {
          return item.toLowerCase();
        });
        if (!allUnits.includes(units.toLowerCase())) {
          validationAlert('Warning! unsupported units: ' + units);
        }
      }*/
    }
    updateShapeAttr(newValue) {
      this.attr(this.getShape(), newValue);
    }
    getShapeAttr() {
      return this.attr(this.getShape());
    }
    // Kfir: redundent function
    // changeAffiliation() {
    //   (this.attr('rect')['stroke-dasharray'] === '0') ? this.attr('rect', {
    //     'stroke-dasharray':
    //       '10,5'
    //   }) : this.attr('rect', { 'stroke-dasharray': '0' });
    // }
    getShapeFillColor() {
      return this.attr(this.getShape() + "/fill");
    }
    getShapeOutline() {
      return this.attr(this.getShape() + "/stroke");
    }
    getImageAffiliation() {
      return "assets/icons/essenceAffil/AffilObject.JPG";
    }
    getImageEssnce() {
      return "assets/icons/essenceAffil/EssObject.JPG";
    }
    checkForGenerilizationSpecification() {
      const links = this.graph.getConnectedLinks(this);
      for (let i = 0; i < links.length; i++) {
        // if ( links[i].atrributes.type instance)
      }
    }
    getStatesOnly() {
      const embeddCells = this.getEmbeddedCells().filter(function (child) {
        return child && child.get("type") === "opm.State";
      });
      return embeddCells;
    }
    addStateAction(visual, init, shouldOpenTextEditor = true) {
      this.closeTextEditor(init);
      if (!visual) {
        return;
      }
      if (visual.logicalElement.protectedFromBeingRefinedBySubModel) {
        (0, shared /* validationAlert */.iW)("Cannot add states to an object which belongs to sub model.");
        return;
      }
      if (visual.logicalElement.belongsToFatherModelId) {
        (0, shared /* validationAlert */.iW)("Cannot add states to an object which belongs to a father model.");
        return;
      }
      const added = visual.addState();
      if (!added.length) {
        if (visual.logicalElement.getBelongsToStereotyped() || visual.logicalElement.getStereotype()) {
          (0, shared /* validationAlert */.iW)("Cannot add states to a stereotyped object.");
        }
        return;
      }
      visual.rearrange();
      this.updateSiblings(visual, init);
      OrXorArcs /* Arc */.l.redrawAllArcs(this, init, true);
      if (this.removeDuplicationMark()) {
        this.addDuplicationMark(init, visual);
      }
      this.shiftEmbeddedToEdge(init);
      visual.width = this.get("size").width;
      visual.height = this.get("size").height;
      this.getEmbeddedCells().forEach(cell => {
        if (cell.getVisual()) {
          cell.getVisual().xPos = cell.get("position").x;
          cell.getVisual().yPos = cell.get("position").y;
        }
      });
      const statesOnly = this.getEmbeddedCells().filter(child => child instanceof OpmState /* OpmState */.g);
      if (shouldOpenTextEditor) {
        if (added.length == 1) {
          statesOnly[statesOnly.length - 1].openTextEditor(init.paper.findViewByModel(statesOnly[statesOnly.length - 1]), init);
        } else {
          const onFinishFirstEditing = () => statesOnly[1].openTextEditor(init.paper.findViewByModel(statesOnly[1]), init);
          statesOnly[0].openTextEditor(init.paper.findViewByModel(statesOnly[0]), init, onFinishFirstEditing);
        }
      }
      /*
      let cell;
      this.updateParamsFromOpmModel(visual);
      for (let i = 0; i < visual.children.length; i++) {
        cell = this.getEmbeddedCells().find(c => c.id === visual.children[i].id);
        if (!cell) {
          cell = createDrawnEntity('State');
          cell.updateParamsFromOpmModel(visual.children[i]);
          this.graph.addCell(cell);
          this.embed(cell);
          cell.set('father', cell.get('parent'));
          continue;
        }
        cell.updateParamsFromOpmModel(visual.children[i]);
      }
           if (visual.ellipsis) {
        this.getEmbeddedCells().find(c => c.id === visual.ellipsis.id).updateParamsFromOpmModel(visual.ellipsis);
      }
      this.autosize(init);
      this.setCellViewForTextEditor(cell, init);
      this.graph.stopBatch('ignoreAddEvent');
      this.graph.stopBatch('ignoreEvents');
      this.graph.stopBatch('ignoreChange');
      Arc.redrawAllArcs(this, init, true);
      if (this.removeDuplicationMark()) {
        this.addDuplicationMark(init, visual);
      }*/
    }
    addDuplicationMark(init, duplication, direction = null) {
      const drawn = this.graph.getCell(duplication.id);
      if (!drawn) {
        return;
      }
      const cellView = init.paper.findViewByModel(duplication.id);
      if (!cellView) {
        return;
      }
      const w = cellView.el.getBBox().width;
      let fillColor = drawn.attr("rect/fill") ? drawn.attr("rect/fill") : duplication.fill;
      if (!fillColor) {
        fillColor = "#ffffff";
      }
      let strokeColor = drawn.attr("rect/stroke") ? drawn.attr("rect/stroke") : duplication.strokeColor;
      if (!strokeColor) {
        strokeColor = "#71E582";
      }
      const duplicationMark = shared /* vectorizer */.hN.V("path", {
        name: "duplicationMark",
        fill: fillColor,
        stroke: strokeColor,
        "stroke-width": "2"
      });
      const path = "M0 0 L20 0 L20 20 L15 20 L15 5 L0 5 Z";
      duplicationMark.attr("d", path);
      duplicationMark.translate(w - 15, -5);
      if (cellView.el) {
        shared /* vectorizer */.hN.V(cellView.el).append(duplicationMark);
        drawn.removeDuplicationMark();
        drawn.set("duplicationMark", duplicationMark);
      }
    }
    enlargeObjectIfTextOverrideState(init, object) {
      if (!init.paper) {
        return;
      }
      const textBbox = init.paper.findViewByModel(object)?.$("text")[0]?.getBBox();
      if (!textBbox) {
        return;
      }
      const topSideY = object.getBBox().origin().y;
      const bottomSideY = object.getBBox().corner().y;
      const totalHeight = Math.abs(topSideY - bottomSideY);
      const totalWidth = Math.abs(object.getBBox().origin().x - object.getBBox().corner().x);
      let highestState = 0;
      let widestState = 0;
      const side = init.opmModel.getVisualElementById(this.id).statesArrangement;
      const isHorizontalOrder = side === ConfigurationOptions /* statesArrangement */.vF.Top || side === ConfigurationOptions /* statesArrangement */.vF.Bottom;
      const isVerticalOrder = side === ConfigurationOptions /* statesArrangement */.vF.Right || side === ConfigurationOptions /* statesArrangement */.vF.Left;
      this.getStatesAndEllipsis().forEach(s => {
        const height = s.get("size").height;
        const width = s.get("size").width;
        if (height > highestState) {
          highestState = height;
        }
        if (width > widestState) {
          widestState = width;
        }
      });
      if (isHorizontalOrder && totalHeight - textBbox.height - highestState < 25) {
        const size = object.get("size");
        object.set("size", {
          width: size.width,
          height: size.height + 10
        });
      }
      if (isVerticalOrder && totalWidth - textBbox.width - widestState < 25) {
        const size = object.get("size");
        object.set("size", {
          width: size.width + 10,
          height: size.height
        });
      }
    }
    changeSizeHandle(initRappid, direction = null) {
      super.changeSizeHandle(initRappid, direction);
      const states = this.getStatesAndEllipsis();
      const visual = initRappid.getOpmModel().getVisualElementById(this.id);
      if (visual.isInzoomed()) {
        this.updateSizePositionToFitEmbeded();
      }
      if (states.length > 0 && initRappid.getAutomaticResizingForCell(this)) {
        this.minimumSizeHandle(initRappid);
        this.enlargeObjectIfTextOverrideState(initRappid, this);
      }
      this.updateURLArray();
    }
    getStatesAndEllipsis() {
      return this.getEmbeddedCells().filter(child => child instanceof OpmState /* OpmState */.g || child instanceof EllipsisState /* OpmEllipsis */.U);
    }
    minimumSizeHandle(initRappid) {
      const side = initRappid.opmModel.getVisualElementById(this.id).statesArrangement;
      const minSize = this.calcMinObjectSize(initRappid, side);
      const currentSize = this.get("size");
      initRappid?.graph?.startBatch("ignoreEvents");
      if ((side === ConfigurationOptions /* statesArrangement */.vF.Bottom || side === ConfigurationOptions /* statesArrangement */.vF.Top) && currentSize.width < minSize) {
        this.set("size", {
          width: minSize,
          height: currentSize.height
        });
      }
      if ((side === ConfigurationOptions /* statesArrangement */.vF.Left || side === ConfigurationOptions /* statesArrangement */.vF.Right) && currentSize.height < minSize) {
        this.set("size", {
          width: currentSize.width,
          height: minSize
        });
      }
      initRappid?.graph?.stopBatch("ignoreEvents");
    }
    calcMinObjectSize(initRappid, arrangement) {
      const states = this.getEmbeddedCells().filter(child => child instanceof OpmState /* OpmState */.g || child instanceof EllipsisState /* OpmEllipsis */.U);
      let statesTotalWidth = 0;
      let statesTotalHeight = 0;
      states.forEach(state => {
        statesTotalWidth = statesTotalWidth + state.get("size").width;
        statesTotalHeight = statesTotalHeight + state.get("size").height;
      });
      const minGap = 10;
      if (arrangement === ConfigurationOptions /* statesArrangement */.vF.Top || arrangement === ConfigurationOptions /* statesArrangement */.vF.Bottom) {
        return statesTotalWidth + (states.length + 1) * minGap;
      } else {
        return statesTotalHeight + (states.length + 1) * minGap;
      }
    }
    updateSizePositionToFitEmbeded(includeSemiFolded = false) {
      const isInZoomedObject = this.getEmbeddedCells().filter(e => ["opm.Process", "opm.Object"].includes(e.get("type"))).length;
      const leftSideX = this.getBBox().origin().x;
      const topSideY = this.getBBox().origin().y;
      const rightSideX = this.getBBox().corner().x;
      const bottomSideY = this.getBBox().corner().y;
      const newDimensions = this.getNewDimensions(leftSideX, topSideY, rightSideX, bottomSideY);
      if (isInZoomedObject > 0) {
        this.graph.startBatch("ignoreEvents");
        this.set({
          position: {
            x: newDimensions.leftSideX,
            y: newDimensions.topSideY
          },
          size: {
            width: newDimensions.rightSideX - newDimensions.leftSideX,
            height: newDimensions.bottomSideY - newDimensions.topSideY
          }
        });
        // rappid bug!
        if ((0, shared /* getInitRappidShared */.Km)().paper) {
          this.findView((0, shared /* getInitRappidShared */.Km)().paper)?.update();
        }
        //
        this.graph.stopBatch("ignoreEvents");
      } else {
        this.set({
          size: {
            width: newDimensions.rightSideX - newDimensions.leftSideX,
            height: newDimensions.bottomSideY - newDimensions.topSideY
          }
        });
      }
    }
    // Arranging the states in symmetry order
    shiftEmbeddedToEdge(initRappid) {
      if (initRappid.graph.hasActiveBatch("rendering") || initRappid?.selectedElement?.get("type").includes("State")) {
        return;
      }
      const side = initRappid.opmModel.getVisualElementById(this.id)?.statesArrangement;
      let states = this.getStatesAndEllipsis();
      if (side === ConfigurationOptions /* statesArrangement */.vF.Bottom || side === ConfigurationOptions /* statesArrangement */.vF.Top) {
        if (states.length > 0) {
          this.enlargeObjectIfTextOverrideState(initRappid, this);
        }
        states.sort((state1, state2) => {
          return state1.getBBox().x - state2.getBBox().x;
        });
      }
      if (side === ConfigurationOptions /* statesArrangement */.vF.Left || side === ConfigurationOptions /* statesArrangement */.vF.Right) {
        if (states.length > 0) {
          this.enlargeObjectIfTextOverrideState(initRappid, this);
        }
        states.sort((state1, state2) => {
          return state1.getBBox().x - state2.getBBox().x;
        });
      }
      const paddfix = 1.5;
      const leftSideX = this.getBBox().origin().x;
      const topSideY = this.getBBox().origin().y;
      const rightSideX = this.getBBox().corner().x;
      const bottomSideY = this.getBBox().corner().y;
      const totalWidth = Math.abs(rightSideX - leftSideX);
      const totalHeight = Math.abs(topSideY - bottomSideY);
      let statesTotalWidth = 0;
      let statesTotalHeight = 0;
      states.forEach(state => {
        statesTotalWidth = statesTotalWidth + state.get("size").width;
        statesTotalHeight = statesTotalHeight + state.get("size").height;
      });
      // Calculate Gaps between states in vertical and horizontal order
      const heightGap = (totalHeight - statesTotalHeight) / (states.length + 1) < 0 ? 5 : (totalHeight - statesTotalHeight) / (states.length + 1);
      const widthGap = (totalWidth - statesTotalWidth) / (states.length + 1) < 0 ? 5 : (totalWidth - statesTotalWidth) / (states.length + 1);
      let cumulativeHeightsSum = 0;
      let statesCounter = 0;
      let cumulativeWidthsSum = 0;
      let xPosition;
      let yPosition;
      if (states.length === 1 && states[0] instanceof EllipsisState /* OpmEllipsis */.U) {
        this.shiftEllipsisOnly(states[0], rightSideX, bottomSideY);
      } else {
        // puts the ellipsis last after the states
        states = states.sort(function (n1, n2) {
          if (n1 instanceof OpmState /* OpmState */.g && n2 instanceof EllipsisState /* OpmEllipsis */.U) {
            return -1;
          }
          if (n2 instanceof OpmState /* OpmState */.g && n1 instanceof EllipsisState /* OpmEllipsis */.U) {
            return 1;
          }
          if (n1 instanceof OpmState /* OpmState */.g && n2 instanceof OpmState /* OpmState */.g) {
            if (side === ConfigurationOptions /* statesArrangement */.vF.Bottom || side === ConfigurationOptions /* statesArrangement */.vF.Top) {
              if (n1.get("position").x > n2.get("position").x) {
                return 1;
              } else {
                return -1;
              }
            } else if (n1.get("position").y > n2.get("position").y) {
              return 1;
            } else {
              return -1;
            }
          }
        });
        states.forEach(state => {
          statesCounter += 1;
          if (side === ConfigurationOptions /* statesArrangement */.vF.Bottom) {
            xPosition = leftSideX + cumulativeWidthsSum + widthGap * statesCounter;
            yPosition = bottomSideY - state.get("size").height - shared /* paddingObject */.RE - paddfix;
          } else if (side === ConfigurationOptions /* statesArrangement */.vF.Top) {
            xPosition = leftSideX + cumulativeWidthsSum + widthGap * statesCounter;
            yPosition = topSideY + shared /* paddingObject */.RE;
          } else if (side === ConfigurationOptions /* statesArrangement */.vF.Left) {
            xPosition = leftSideX + shared /* paddingObject */.RE;
            yPosition = topSideY + cumulativeHeightsSum + heightGap * statesCounter;
          } else if (side === ConfigurationOptions /* statesArrangement */.vF.Right) {
            xPosition = rightSideX - shared /* paddingObject */.RE - state.get("size").width;
            yPosition = topSideY + cumulativeHeightsSum + heightGap * statesCounter;
          }
          cumulativeHeightsSum += state.get("size").height;
          cumulativeWidthsSum += state.get("size").width;
          state.set("position", {
            x: xPosition,
            y: yPosition
          });
        });
      }
      const visualObject = this.getVisual();
      if (visualObject.semiFolded.length > 0) {
        visualObject.arrangeInnerSemiFoldedThings();
        this.attr("text/ref-y", visualObject.refY);
        for (const visSemi of visualObject.semiFolded) {
          const drwn = this.graph.getCell(visSemi.id);
          drwn.set("position", {
            x: visSemi.xPos + visualObject.xPos,
            y: visSemi.yPos + visualObject.yPos
          });
        }
      }
      if (!this.graph.hasActiveBatch("free-transform")) {
        OrXorArcs /* Arc */.l.redrawAllArcs(this, initRappid, true);
      }
      if (this.removeDuplicationMark()) {
        this.addDuplicationMark(initRappid, initRappid.opmModel.getVisualElementById(this.id));
      }
    }
    shiftEllipsisOnly(ellipsis, rightSideX, bottomSideY) {
      const x = rightSideX - ellipsis.get("size").width - 10;
      const y = bottomSideY - ellipsis.get("size").height - 10;
      ellipsis.set("position", {
        x: x,
        y: y
      });
    }
    setCellViewForTextEditor(cell, init) {
      const statesOnly = this.getEmbeddedCells().filter(child => child instanceof OpmState /* OpmState */.g);
      if (statesOnly.length <= 2) {
        statesOnly[0].openTextEditor(init.paper.findViewByModel(statesOnly[0]), init);
      } else {
        cell.openTextEditor(init.paper.findViewByModel(statesOnly[statesOnly.indexOf(cell)]), init);
      }
    }
    expressAllAction(visual, initRappid, isNewlyCreated = false) {
      visual.expressAll(isNewlyCreated);
      this.updateView(visual);
      this.shiftEmbeddedToEdge(initRappid);
      // if (2 > 1)
      //   return;
      // this.graph.startBatch('ignoreAddEvent');
      // this.graph.startBatch('ignoreEvents');
      // this.graph.startBatch('ignoreChange');
      // this.updateParamsFromOpmModel(visual);
      // for (let i = 0; i < visual.children.length; i++) {
      //   const child = (visual.children[i] instanceof OpmVisualState) ? visual.children[i] : null;
      //   if (child) {
      //     let embedded = this.getStatesOnly().find(c => c.id === child.id);
      //     if (!embedded)
      //       embedded = createDrawnEntity('State');
      //     embedded.updateParamsFromOpmModel(child);
      //     this.embed(embedded);
      //     this.graph.addCell(embedded);
      //     embedded.set('father', embedded.get('parent'));
      //     while (embedded.isTextCut(initRappid)) {
      //       embedded.set('size', {
      //         width: embedded.get('size').width * 1.02,
      //         height: embedded.get('size').height
      //       });
      //       embedded.changeAttributesHandle(initRappid);
      //     }
      //   }
      // }
      // // Draw Ellipsis
      // const ellipsis_cell = this.getEmbeddedCells().find(c => c instanceof OpmEllipsis);
      // if (ellipsis_cell)
      //   ellipsis_cell.remove();
      // this.graph.stopBatch('ignoreChange');
      // this.graph.stopBatch('ignoreEvents');
      // this.graph.stopBatch('ignoreAddEvent');
      // this.shiftEmbeddedToEdge(initRappid);
    }
    suppressAllAction(visual, initRappid) {
      initRappid.getOpmModel().logForUndo(visual.logicalElement.text + " states suppression");
      const suppressed = visual.suppressAll();
      if (suppressed.length === 0) {
        return;
      }
      this.updateView(visual);
      this.shiftEmbeddedToEdge(initRappid);
      // this.graph.startBatch('ignoreEvents');
      // this.graph.startBatch('ignoreChange');
      // for (let i = 0; i < suppressed.length; i++) {
      //   const embedded = this.getEmbeddedCells().find(c => c.id === suppressed[i].id);
      //   if (embedded)
      //     embedded.remove();
      // }
      // // Draw Ellipsis
      // const ellipsis = visual.createEllipsis().setDefaultPosition();
      // this.updateEntityFromOpmModel(visual);
      // let ellipsis_cell = this.getEmbeddedCells().find(c => c.id === ellipsis.id);
      // if (ellipsis) {
      //   if (ellipsis_cell) {
      //     ellipsis_cell.updateParamsFromOpmModel(ellipsis);
      //   } else {
      //     ellipsis_cell = createDrawnEntity('Ellipsis');
      //     ellipsis_cell.updateParamsFromOpmModel(ellipsis);
      //     this.embed(ellipsis_cell);
      //     this.graph.addCell(ellipsis_cell);
      //     ellipsis_cell.set('father', ellipsis_cell.get('parent'));
      //   }
      // } else if (ellipsis_cell) {
      //   ellipsis_cell.remove();
      // }
      // this.graph.stopBatch('ignoreChange');
      // this.graph.stopBatch('ignoreEvents');
      // this.shiftEmbeddedToEdge(initRappid);
    }
    arrageInzoomed(side) {
      const embeddedStates = this.getEmbeddedCells().filter(child => child instanceof OpmState /* OpmState */.g);
      const embeddedObjects = this.getEmbeddedCells().filter(child => child instanceof OpmObject);
      const x = this.get("position").x;
      const y = this.get("position").y;
      const w = this.get("size").width;
      const h = this.get("size").height;
      const p = this.get("padding");
      this.attr({
        text: {
          "ref-x": 0.5
        }
      });
      this.attr({
        text: {
          "x-alignment": "middle"
        }
      });
      this.attr({
        text: {
          "ref-y": 0.1
        }
      });
      this.attr({
        text: {
          "y-alignment": "top"
        }
      });
      if (side === "bottom" || side === "top") {
        embeddedStates.sort(function (a, b) {
          return a.get("position").x - b.get("position").x;
        });
        embeddedObjects.sort(function (a, b) {
          return a.get("position").y - b.get("position").y;
        });
        let x_size = 0;
        let maxH = 0;
        embeddedStates.forEach(state => {
          x_size += state.get("size").width + p;
          if (state.get("size").height > maxH) {
            maxH = state.get("size").height;
          }
        });
        x_size += p;
        const x_start = x + (w - x_size) / 2;
        let _object;
        if (side === "top") {
          _object = embeddedObjects[0];
          this.attr({
            text: {
              "ref-y": 0.18
            }
          });
          this.attr({
            text: {
              "y-alignment": "top"
            }
          });
        } else if (side === "bottom") {
          _object = embeddedObjects[embeddedObjects.length - 1];
        }
        const _object_pos = _object.get("position");
        const _object_size = _object.get("size");
        let left = 0;
        embeddedStates.forEach(state => {
          if (side === "top") {
            state.set("position", {
              x: x_start + left + p,
              y: y + p
            });
          } else if (side === "bottom") {
            state.set("position", {
              x: x_start + left + p,
              y: _object_pos.y + _object_size.height + p
            });
          }
          left += p + state.get("size").width;
        });
      } else if (side === "left" || side === "right") {
        embeddedStates.sort(function (a, b) {
          return a.get("position").y - b.get("position").y;
        });
        embeddedObjects.sort(function (a, b) {
          return a.get("position").x - b.get("position").x;
        });
        let y_size = 0;
        embeddedStates.forEach(state => {
          y_size += state.get("size").height + p;
        });
        y_size += p;
        const y_start = y + (h - y_size) / 2;
        let _object;
        if (side === "left") {
          _object = embeddedObjects[0];
        } else if (side === "right") {
          _object = embeddedObjects[embeddedObjects.length - 1];
        }
        const _object_pos = _object.get("position");
        const _object_size = _object.get("size");
        let left = p;
        let top = 0;
        let maxW = 0;
        embeddedStates.forEach(state => {
          if (side === "left") {
            state.set("position", {
              x: _object_pos.x - state.get("size").width - p,
              y: y_start + top + p
            });
          } else if (side === "right") {
            state.set("position", {
              x: _object_pos.x + _object_size.width + p,
              y: y_start + top + p
            });
          }
          top += p + state.get("size").height;
        });
      }
    }
    arrangeEmbedded(rappid, side) {
      const this_ = this;
      if (rappid) {
        const object = rappid.opmModel.currentOpd.visualElements.find(v => v.id === this_.id);
        if (!object) {
          return;
        }
        if (side) {
          let side_ = ConfigurationOptions /* statesArrangement */.vF.Bottom;
          switch (side) {
            case "top":
              side_ = ConfigurationOptions /* statesArrangement */.vF.Top;
              break;
            case "bottom":
              side_ = ConfigurationOptions /* statesArrangement */.vF.Bottom;
              break;
            case "right":
              side_ = ConfigurationOptions /* statesArrangement */.vF.Right;
              break;
            case "left":
              side_ = ConfigurationOptions /* statesArrangement */.vF.Left;
              break;
          }
          object.rearrange(side_);
        } else {
          object.rearrange();
        }
        this.graph.startBatch("ignoreEvents");
        this.graph.startBatch("ignoreChange");
        object.states.forEach(state => {
          const cell = this_.getEmbeddedCells().find(cell => state.id === cell.id);
          if (cell) {
            cell.set("position", {
              x: state.xPos,
              y: state.yPos
            });
          }
          //          cell.updateParamsFromOpmModel(state);
        });
        if (object.ellipsis) {
          const ellipsis = this_.getEmbeddedCells().find(cell => object.ellipsis.id === cell.id);
          if (ellipsis) {
            ellipsis.set("position", {
              x: object.ellipsis.xPos,
              y: object.ellipsis.yPos
            });
          }
          //          ellipsis.updateParamsFromOpmModel(object.ellipsis);
        }
        this_.updateParamsFromOpmModel(object);
        this_.autosize(rappid);
        this.graph.stopBatch("ignoreChange");
        this.graph.stopBatch("ignoreEvents");
        const embds = this.getEmbeddedCells();
        for (let i = 0; i < embds.length; i++) {
          OrXorArcs /* Arc */.l.redrawAllArcs(embds[i], rappid, true);
        }
        return;
      }
      if (side) {
        this.attr({
          statesArrange: side
        });
      } else {
        side = this.attr("statesArrange");
      }
      if (this.getEmbeddedCells().filter(child => child instanceof OpmObject).length) {
        this.arrageInzoomed(side);
        return;
      }
      const embedded = this.getEmbeddedCells().filter(child => child instanceof OpmState /* OpmState */.g);
      if (!embedded.length) {
        return;
      }
      //const ellipsis = this.getEmbeddedCells().find(s => s instanceof OpmEllipsis);
      const x = this.get("position").x;
      const y = this.get("position").y;
      const p = this.get("padding");
      const textH = textWrapping /* textWrapping */._.getParagraphHeight(this.attr("text/text"), this);
      const textW = textWrapping /* textWrapping */._.getParagraphWidth(this.attr("text/text"), this);
      this.graph.startBatch("ignoreEvents");
      if (side === "top" || side === "bottom") {
        embedded.sort(function (a, b) {
          return a.get("position").x - b.get("position").x;
        });
        //if (ellipsis)
        //  embedded.push(ellipsis);
        let left = 0;
        let top = p;
        let maxH = 0;
        if (side === "bottom") {
          top += textH + p;
        }
        embedded.forEach(state => {
          state.set("position", {
            x: x + p + left,
            y: y + top
          });
          left += p + state.get("size").width;
          if (state.get("size").height > maxH) {
            maxH = state.get("size").height;
          }
        });
        left += p;
        this.set("size", {
          width: Math.max(left, textW + p * 2),
          height: maxH + p * 3 + textH
        });
        this.attr({
          text: {
            "ref-x": 0.5
          }
        });
        this.attr({
          text: {
            "x-alignment": "middle"
          }
        });
        if (side === "top") {
          this.attr({
            text: {
              "ref-y": 0.9
            }
          });
          this.attr({
            text: {
              "y-alignment": "bottom"
            }
          });
        } else {
          this.attr({
            text: {
              "ref-y": 0.1
            }
          });
          this.attr({
            text: {
              "y-alignment": "top"
            }
          });
        }
      } else if (side === "left" || side === "right") {
        embedded.sort(function (a, b) {
          return a.get("position").y - b.get("position").y;
        });
        //if (ellipsis)
        //  embedded.push(ellipsis);
        let left = p;
        let top = 0;
        let maxW = 0;
        if (side === "right") {
          left += textW + p;
        }
        embedded.forEach(state => {
          state.set("position", {
            x: x + left,
            y: y + top + p
          });
          top += p + state.get("size").height;
          if (state.get("size").width > maxW) {
            maxW = state.get("size").width;
          }
        });
        top += p;
        this.set("size", {
          width: maxW + p * 3 + textW,
          height: Math.max(top, textH)
        });
        this.attr({
          text: {
            "ref-y": 0.5
          }
        });
        this.attr({
          text: {
            "y-alignment": "middle"
          }
        });
        if (side === "right") {
          this.attr({
            text: {
              "ref-x": 0.05
            }
          });
          this.attr({
            text: {
              "x-alignment": "left"
            }
          });
        } else {
          this.attr({
            text: {
              "ref-x": 0.95
            }
          });
          this.attr({
            text: {
              "x-alignment": "right"
            }
          });
        }
      }
      /*if (ellipsis) {
        const padding = 10;
        const size = this.get('size');
        const el_size = ellipsis.get('size');
        ellipsis.set('position', { x: x + size.width - el_size.width - padding, y: y + size.height - el_size.height - padding });
      }*/
      this.graph.stopBatch("ignoreEvents");
    }
    get counter() {
      return OpmObject.counter;
    }
    getNumberedText(text, counter) {
      return text + " " + counter;
    }
    hasStates() {
      const embeddedStates = this.getEmbeddedCells().filter(child => child instanceof OpmState /* OpmState */.g);
      const hasStates = embeddedStates.length > 0;
      return hasStates;
    }
    updateDeStating(newVisualObjectandLink, initRappid) {
      const visualFathers = [];
      for (let i = 0; i < newVisualObjectandLink.length; i++) {
        const fatherVisualObject = newVisualObjectandLink[i][0];
        const newVisualObject = newVisualObjectandLink[i][1];
        const newVisualLink = newVisualObjectandLink[i][2];
        const inboundLinks = newVisualObjectandLink[i][3];
        const outboundLinks = newVisualObjectandLink[i][4];
        if (visualFathers.includes(fatherVisualObject.id) === false) {
          visualFathers.push(fatherVisualObject.id);
        }
        const newDrawn = new OpmObject();
        newDrawn.updateParamsFromOpmModel(newVisualObject);
        const fatherDrawn = initRappid.graph.getCell(fatherVisualObject.id);
        fatherDrawn.updateParamsFromOpmModel(fatherVisualObject);
        const drawnLink = new GeneralizationLink /* GeneralizationLink */.R(fatherDrawn, newDrawn, initRappid.graph, newVisualLink.id);
        initRappid.graph.startBatch("ignoreAddEvent");
        initRappid.graph.addCell(newDrawn);
        initRappid.graph.addCell(drawnLink);
        initRappid.graph.stopBatch("ignoreAddEvent");
        if (newVisualObject.fatherObject !== null) {
          initRappid.graph.getCell(newVisualObject.fatherObject.id).attributes.embeds.push(newDrawn.id);
        }
        // inboundLinks
        for (let m = 0; m < inboundLinks.length; m++) {
          initRappid.graph.getCell(inboundLinks[m]).set("target", {
            id: newVisualObject.id
          });
        }
        // outboundLinks
        for (let m = 0; m < outboundLinks.length; m++) {
          initRappid.graph.getCell(outboundLinks[m]).set("source", {
            id: newVisualObject.id
          });
        }
      }
      for (let i = 0; i < visualFathers.length; i++) {
        const fatherVisualObject = visualFathers[i];
        const fatherDrawn = initRappid.graph.getCell(fatherVisualObject);
        const drawnStates = fatherDrawn.getStatesOnly();
        for (let n = 0; n < drawnStates.length; n++) {
          initRappid.graph.getCell(drawnStates[n].id).closeTextEditor(initRappid);
          initRappid.graph.getCell(drawnStates[n].id).remove();
        }
        this.setFatherObjectSizeToDefault(fatherDrawn);
      }
    }
    setFatherObjectSizeToDefault(object) {
      object.set({
        size: {
          width: object.thingAttributes().minSize.width,
          height: object.thingAttributes().minSize.height
        }
      });
    }
    checkIfDigitalTwinExists(model) {
      const visualThis_ = model.getVisualElementById(this.id);
      return visualThis_.isDigitallyTwin();
    }
    checkIfDigitaltwinIsConnected(graph) {
      const links = graph.getConnectedLinks(this, {
        outbound: true
      }).filter(link => link.attributes.OpmLinkType === "ExhibitionLink");
      for (let i = 0; i < links.length; i++) {
        if (graph.getConnectedLinks(links[i].getTargetElement(), {
          inbound: true
        })[i].getSourceElement().attributes.attrs.digitalTwinConnected) {
          return true;
        }
      }
      return false;
    }
    checkIfCHangesExist(originalObj, digitalTwin = this.graph.getCell(this.findDigitalTwin(model, originalObj)), model) {
      const originalObjText = originalObj.attr("text/textWrap/text");
      const twinText = digitalTwin.attr("text/textWrap/text");
      if (twinText.includes(originalObjText)) {
        if (originalObj.getStatesOnly().length === digitalTwin.getEmbeddedCells().length) {
          return true;
        }
      }
      return false;
    }
    updateCHanges(originalObj, digitalTwin, init) {
      const digitalTwinText = digitalTwin.attr("text/textWrap/text").slice(0, digitalTwin.attr("text/textWrap/text").indexOf("_"));
      if (originalObj.attr("text/textWrap/text") !== digitalTwinText) {
        this.updateDigitalTwinText(originalObj.attr("text/textWrap/text"), digitalTwin);
      }
      if (originalObj.getStatesOnly().length !== digitalTwin.getStatesOnly().length) {
        this.updateDigitalTwinStates(originalObj.getStatesOnly(), digitalTwin, init);
      }
    }
    updateDigitalTwinStates(statesArray, digitalTwin, init) {
      if (digitalTwin.getStatesOnly().length > 0) {
        const length = digitalTwin.getStatesOnly().length;
        digitalTwin.getStatesOnly().forEach(cell => {
          (0, shared /* removeCell */.D$)(cell, init);
        });
      }
      for (let i = 0; i < statesArray.length; i++) {
        digitalTwin.addState(statesArray[i].attr("text/textWrap/text"), init);
      }
    }
    updateDigitalTwinText(originalObjText, digitalTwin) {
      digitalTwin.attr({
        text: {
          textWrap: {
            text: originalObjText + "_DigitalTwin"
          }
        }
      });
    }
    findDigitalTwin(model, originalObject) {
      const opd = model.currentOpd;
      const opdVisualObjects = opd.visualElements.filter(visualElement => visualElement instanceof OpmVisualObject /* OpmVisualObject */.I);
      for (let i = 0; i < opdVisualObjects.length; i++) {
        if (opdVisualObjects[i].originalObj === originalObject.attributes.attrs.preoriginalObj) {
          return opdVisualObjects[i].id;
        }
      }
    }
    removedigitalTwinData(init) {
      const preTwin = init.getOpmModel().getLogicalElementByVisualId(this.attributes.attrs.predigitalTwin);
      const original = init.getOpmModel().getLogicalElementByVisualId(this.attributes.attrs.originalObj);
      if (original.visualElements.length) {
        for (let i = 0; i < original.visualElements.length; i++) {
          original.visualElements[i].preoriginalObj = undefined;
          original.visualElements[i].digitalTwin = undefined;
        }
      }
      if (preTwin.visualElements.length && preTwin.text.includes("_DigitalTwin")) {
        for (let i = 0; i < preTwin.visualElements.length; i++) {
          preTwin.removeVisual(preTwin.visualElements[i]);
        }
      }
    }
    getIconsForHalo() {
      const icons = this.getStatesOnly().length > 0 ? Object.assign(super.getIconsForHalo(), {
        editUnits: "assets/SVG/editUnits.svg"
      }, {
        editAlias: "assets/SVG/editAlias.svg"
      }, {
        addState: "assets/SVG/addStates.svg"
      }, {
        suppress: "assets/SVG/supressHalo.svg"
      }, {
        express: "assets/SVG/ExpressHalo.svg"
      }) : Object.assign(super.getIconsForHalo(), {
        addState: "assets/SVG/addStates.svg"
      }, {
        editAlias: "assets/SVG/editAlias.svg"
      });
      return icons;
    }
    updateView(visual) {
      super.updateView(visual);
      if (!this.graph.hasActiveBatch("rendering")) {
        this.statesView(visual);
      }
      this.ellipsisView(visual);
      this.greyOutEntity();
    }
    rangeTooltip(visual) {
      const pattern = visual.logicalElement.getValidationModule()?.getValidator()?.getPattern();
      const states = this.getStatesOnly();
      const value = this.attr("value/value");
      if (pattern && states.length === 1 && value && value !== "value" && pattern !== value) {
        states[0].attr({
          ".": {
            "data-tooltip": "Range: " + pattern,
            "data-tooltip-position": "top"
          }
        });
      } else if (states.length === 1) {
        states[0].removeAttr("./data-tooltip");
        states[0].removeAttr("./data-tooltip-position");
        (0, shared /* getInitRappidShared */.Km)().paper?.findViewByModel(states[0])?.$el?.removeAttr("data-tooltip");
      }
    }
    ellipsisView(visual) {
      if (visual.isEllipsisNeeded()) {
        if (visual.ellipsis) {
          const ellipsis = visual.createEllipsis().setDefaultPosition();
          this.updateEntityFromOpmModel(visual);
          let ellipsis_cell = this.getEmbeddedCells().find(c => c.id === ellipsis.id);
          if (ellipsis) {
            if (ellipsis_cell) {
              ellipsis_cell.updateParamsFromOpmModel(ellipsis);
            } else {
              ellipsis_cell = (0, shared /* getInitRappidShared */.Km)().getGraphService().createDrawnEntity("Ellipsis");
              ellipsis_cell.updateParamsFromOpmModel(ellipsis);
              this.embed(ellipsis_cell);
              this.graph.addCell(ellipsis_cell);
              ellipsis_cell.set("father", ellipsis_cell.get("parent"));
            }
          } else if (ellipsis_cell) {
            ellipsis_cell.remove();
          }
        } else if (!visual.ellipsis) {
          const ellipsis = visual.createEllipsis();
          ellipsis.setDefaultPosition();
          const e_cell = (0, shared /* getInitRappidShared */.Km)().getGraphService().createDrawnEntity("Ellipsis");
          e_cell.updateParamsFromOpmModel(ellipsis);
          this.graph.addCell(e_cell);
          this.embed(e_cell);
          e_cell.set("father", e_cell.get("parent"));
        }
      } else {
        const ellipsis = this.getEmbeddedCells().find(c => c instanceof EllipsisState /* OpmEllipsis */.U);
        if (ellipsis) {
          ellipsis.remove();
        }
      }
    }
    statesView(visual) {
      let cell;
      this.updateParamsFromOpmModel(visual);
      const states = this.getStatesOnly();
      for (const child of visual.states) {
        cell = states.find(c => c.id === child.id);
        if (cell) {
          cell.updateParamsFromOpmModel(child);
          cell.greyOutEntity();
        } else {
          cell = (0, shared /* getInitRappidShared */.Km)().getGraphService().createDrawnEntity("State");
          cell.updateParamsFromOpmModel(child);
          this.embed(cell);
          this.graph.addCell(cell);
          cell.greyOutEntity();
          cell.set("father", cell.get("parent"));
        }
      }
      for (const state of states) {
        if (!visual.states.find(s => s.id === state.id)) {
          state.remove();
        }
      }
      for (const state of this.getStatesOnly()) {
        state.embedText();
      }
      if (visual.children.length == 0 && visual.states.length == 0 && visual.ellipsis == undefined && visual.semiFolded.length === 0) {
        if (!visual.isManualTextPos) {
          this.attr({
            text: {
              "ref-y": 0.5
            }
          });
        }
        this.attr({
          text: {
            "y-alignment": "middle"
          }
        });
      }
      this.rangeTooltip(visual);
    }
    isComputational() {
      return this.attr("value/valueType") !== ConfigurationOptions /* valueType */._x.None;
    }
    removeComputational(init) {
      if (this.getVisual().logicalElement.getBelongsToStereotyped() || this.getVisual().logicalElement.getStereotype()) {
        (0, shared /* validationAlert */.iW)("Computational cannot be removed from a stereotyped thing.");
        return;
      }
      if (this.getVisual().logicalElement.isSatisfiedRequirementObject()) {
        (0, shared /* validationAlert */.iW)("Computational cannot be removed from a requirement object.");
        return;
      }
      const model = init.getOpmModel();
      model.logForUndo(this.getVisual().logicalElement.text + " remove computation");
      const visual = this.getVisual();
      const logical = visual.logicalElement;
      new range_validation /* RangeValidationAccess */.P(logical.opmModel).removeRange(visual);
      logical.removeComputation();
      this.removeAllStatesFromObject(init);
      this.arrangeEmbededParams(0.5, 0.5, "middle", "middle", "bottom", 0, 0);
      init.graphService.renderGraph(model.currentOpd, init);
      init.setSelectedElementToNull();
      // object.units = 'None';
      // object.value = 'None';
      // object.valueType = valueType.None;
      // // object.alias = '';
      // this.removeAllStatesFromObject(getInitRappidShared());
      // this.attr('text/textWrap/text', object.getDisplayText());
      // this.arrangeEmbededParams(0.5, 0.5, 'middle', 'middle', 'bottom', 0, 0);
      // this.attr('text/textWrap', { width: '80%', height: '80%' });
    }
    setValueAsDefault() {
      const visual = this.getVisual();
      visual.setValueAsDefault();
      this.updateParamsFromOpmModel(visual);
      this.getEmbeddedCells()[0].updateParamsFromOpmModel(visual.states[0]);
      this.graph.getCell(visual.states[0])?.updateView(visual.states[0]);
    }
    /**returns an object with default object style settings, as declared in opl service**/
    setStyleSettings() {
      return {
        font_size: opl_service /* defaultObjectStyleSettings */.tv.font_size,
        font: opl_service /* defaultObjectStyleSettings */.tv.font,
        text_color: opl_service /* defaultObjectStyleSettings */.tv.text_color,
        border_color: opl_service /* defaultObjectStyleSettings */.tv.border_color,
        fill_color: opl_service /* defaultObjectStyleSettings */.tv.fill_color
      };
    }
    getHaloHandles(init) {
      const visual = this.getVisual();
      if (!visual) {
        return [];
      }
      const decider = visual.getCommandsDecider();
      return decider.set(init, this, visual).getHaloHandle();
    }
    getToolbarHandles(init) {
      const visual = this.getVisual();
      if (!visual) {
        return [];
      }
      const decider = visual.getCommandsDecider();
      return decider.set(init, this, visual).getToolabarHandle();
    }
    /**
     * default style settings should be according to the organization (it will be overridden by the user's if exist)
     * */
    setRelevantStyleSettings(styleSettingsToUpdate, oplService) {
      Object.keys(styleSettingsToUpdate).forEach(function (key) {
        if (oplService.orgOplSettings && oplService.orgOplSettings.style && oplService.orgOplSettings.style.object && oplService.orgOplSettings.style.object.hasOwnProperty(key) && oplService.orgOplSettings.style.object[key] !== undefined && oplService.orgOplSettings.style.object[key] !== null) {
          styleSettingsToUpdate[key] = oplService.orgOplSettings.style.object[key];
        }
      });
      Object.keys(styleSettingsToUpdate).forEach(function (key) {
        if (oplService.settings && oplService.settings.style && oplService.settings.style.object.hasOwnProperty(key) && oplService.settings.style.object[key] !== undefined && oplService.settings.style.object[key] !== null) {
          styleSettingsToUpdate[key] = oplService.settings.style.object[key];
        }
      });
    }
  }
  return OpmObject;
})();
/***/