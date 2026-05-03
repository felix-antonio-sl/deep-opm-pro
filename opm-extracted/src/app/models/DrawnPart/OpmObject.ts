// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/DrawnPart/OpmObject.ts
// Extracted by opm-extracted/tools/extract.mjs

  let OpmObject = /*#__PURE__*/(() => {
    class OpmObject extends OpmThing {
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
          if (links[i] instanceof ExhibitionLink) {
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
        const init = (0, getInitRappidShared)();
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
            valueType: valueType.None,
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
        if ((0, getInitRappidShared)().exportingOpl || !this.getVisual()?.logicalElement) {
          return;
        }
        if (this.getVisual().logicalElement.shouldBeGreyed === true && (0, getInitRappidShared)().shouldGreyOut) {
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
            vis.fill = (0, getStyles)("opm.Object").fill;
            vis.strokeColor = (0, getStyles)("opm.Object").stroke;
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
        if ((0, getInitRappidShared)().exportingOpl || !(0, getInitRappidShared)().paper || !(0, getInitRappidShared)().paper.findViewByModel(this)) {
          return;
        }
        const init = (0, getInitRappidShared)();
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
            (0, checkImageURL)(url).then(res => {}).catch(err => this.attr("image/xlinkHref", "assets/SVG/redx.png"));
            cameraIconMarkup = this.getCameraSvgIcon(format(cameraSignPosition.x), format(cameraSignPosition.y), true);
            this.attr("image/opacity", [BackgroundImageState.IMAGEONLY, BackgroundImageState.TEXTANDIMAGEFULL].includes(textState) ? "1" : "0.5");
            this.attr("text/fill", textState === BackgroundImageState.IMAGEONLY ? "transparent" : visual.textColor);
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
          if ([statesArrangement.Bottom, null, undefined].includes(arrangement)) {
            return {
              x: this.hasURLs() ? 25 : 5,
              y: 5
            };
          } else if (arrangement === statesArrangement.Top) {
            return {
              x: this.hasURLs() ? 25 : 5,
              y: size.height - 20
            };
          } else if (arrangement === statesArrangement.Left) {
            return {
              x: size.width - 25,
              y: this.hasURLs() ? 22 : 5
            };
          } else if (arrangement === statesArrangement.Right) {
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
          if ([statesArrangement.Bottom, statesArrangement.Right, null, undefined].includes(arrangement)) {
            return {
              x: 5,
              y: 5
            };
          } else if (arrangement === statesArrangement.Top) {
            return {
              x: 5,
              y: size.height - 20
            };
          } else if (arrangement === statesArrangement.Left) {
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
          if ([statesArrangement.Bottom, null, undefined].includes(arrangement)) {
            return {
              x: size.width - 20,
              y: 5
            };
          } else if (arrangement === statesArrangement.Top) {
            return {
              x: size.width - 20,
              y: size.height - 20
            };
          } else if (arrangement === statesArrangement.Right) {
            return {
              x: 5,
              y: size.height - 20
            };
          } else if (arrangement === statesArrangement.Left) {
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
        const statesOnly = this.getEmbeddedCells().filter(child => child instanceof OpmState);
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
          const init = (0, getInitRappidShared)();
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
        const init = (0, getInitRappidShared)();
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
          case statesArrangement.Top:
            return "top";
          case statesArrangement.Bottom:
            return "bottom";
          case statesArrangement.Left:
            return "left";
          case statesArrangement.Right:
            return "right";
        }
      }
      createNewState(stateName) {
        const defaultState = new OpmState(stateName);
        this.embed(defaultState); // makes the state stay in the bounds of the object
        this.graph.addCells([this, defaultState]);
        defaultState.toFront();
        // Placing the new state. By default it is outside the object.
        //const xNewState = this.getBBox().center().x - defaultState.get('size').width / 2;
        //const yNewState = this.get('position').y + this.get('size').height - defaultState.get('size').height;
        const list = this.getEmbeddedCells().filter(child => child instanceof OpmState);
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
        return new joint.ui.ContextToolbar({
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
          const statesOnly = currentObject.getEmbeddedCells().filter(child => OPCloudUtils.isInstanceOfDrawnState(child));
          for (const state of statesOnly) {
            Arc.redrawAllArcs(state, options, true);
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
          (0, getInitRappidShared)().graph.startBatch("statesSuppression");
          currentObject.suppressAllAction(currentObject.getVisual(), options);
          halo.toggleState("default");
          if (!currentObject.getEmbeddedCells().find(s => s.constructor.name.includes("Object"))) {
            currentObject.setFatherObjectSizeToDefault(currentObject);
          }
          (0, getInitRappidShared)().graph.stopBatch("statesSuppression");
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
            parentObject.rearrange(statesArrangement.Bottom);
            initRappid.opmModel.getOpdByThingId(parentObject.id).add(clonedState);
          }
        }
      }
      defineAsComputationalObject(initRappid, shouldOpenTextEditor = true) {
        const drawnObject = this;
        const visualCell = initRappid.opmModel.getVisualElementById(drawnObject.get("id"));
        if (visualCell.logicalElement.getBelongsToStereotyped() || visualCell.logicalElement.getStereotype()) {
          (0, validationAlert)("Cannot add states to a stereotyped object.");
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
            valueType: valueType.Number
          }
        });
        // if (drawnObject.attr('text/textWrap/text').indexOf('[') < 0)  // if value wasn't defined yet
        // drawnObject.attr({ text: { textWrap: { text: drawnObject.attr('text/textWrap/text') + '\n[] {}' } } });
        // visualCell.states[0].text = 'value';
        visualCell.logicalElement.value = "value";
        visualCell.logicalElement.valueType = valueType.Number;
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
          (0, validationAlert)(text, null, "Error");
          return;
        } else if (!LinkConstraints.CanBeComputational(this.id, initRappid, this)) {
          let text = "The object " + this.attributes.attrs.text.textWrap.text + " can't be computational because it can't be informatical.";
          (0, validationAlert)(text, null, "Error");
          return;
        } else if (this.getVisual().logicalElement.belongsToFatherModelId) {
          let text = "The object " + this.attributes.attrs.text.textWrap.text + " can't be changed to computational because it belongs to a father model.";
          (0, validationAlert)(text, null, "Error");
          return;
        } else if (this.isComputational()) {
          let text = "The object " + this.attributes.attrs.text.textWrap.text + " is already computational.";
          (0, validationAlert)(text, null, "Error");
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
          const type = (0, isNumber)(value) ? valueType.Number : valueType.String;
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
          if (childBbox.x <= leftSideX + paddingObject) {
            leftSideX = childBbox.x - paddingObject;
          }
          if (childBbox.y <= topSideY + paddingObject) {
            topSideY = childBbox.y - paddingObject;
          }
          if (childBbox.corner().x >= rightSideX - paddingObject) {
            rightSideX = childBbox.corner().x + paddingObject;
          }
          if (childBbox.corner().y >= bottomSideY - paddingObject) {
            bottomSideY = childBbox.corner().y + paddingObject;
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
        (0, UnitsPopup)(this, initRappid, onFinish);
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
        const ret = new RangeValidationAccess(model).hideValueObject(visual);
        if (ret.hide) {
          init.setSelectedElementToNull();
          init.graphService.renderGraph(init.opmModel.currentOpd, init);
          return;
        }
        (0, validationAlert)("Could not hide");
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
          (0, validationAlert)("Cannot set range to a requirement object.", 5000, "error");
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
            return ValueAttributeType.INTEGER;
          } else if (value == "float") {
            return ValueAttributeType.FLOAT;
          } else if (value == "string") {
            return ValueAttributeType.STRING;
          } else if (value == "char") {
            return ValueAttributeType.CHAR;
          } else if (value == "boolean") {
            return ValueAttributeType.BOOLEAN;
          }
          return ValueAttributeType.INTEGER;
        };
        const typeToString = value => {
          if (value == ValueAttributeType.INTEGER) {
            return "integer";
          } else if (value == ValueAttributeType.FLOAT) {
            return "float";
          } else if (value == ValueAttributeType.STRING) {
            return "string";
          } else if (value == ValueAttributeType.CHAR) {
            return "char";
          } else if (value == ValueAttributeType.BOOLEAN) {
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
            (0, validationAlert)(ret.errors[0]);
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
        const popup = new joint.ui.Popup({
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
        (0, stylePopup)();
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
        const ret = new RangeValidationAccess(model).removeRange(visual);
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
          (0, validationAlert)("Cannot add states to an object which belongs to sub model.");
          return;
        }
        if (visual.logicalElement.belongsToFatherModelId) {
          (0, validationAlert)("Cannot add states to an object which belongs to a father model.");
          return;
        }
        const added = visual.addState();
        if (!added.length) {
          if (visual.logicalElement.getBelongsToStereotyped() || visual.logicalElement.getStereotype()) {
            (0, validationAlert)("Cannot add states to a stereotyped object.");
          }
          return;
        }
        visual.rearrange();
        this.updateSiblings(visual, init);
        Arc.redrawAllArcs(this, init, true);
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
        const statesOnly = this.getEmbeddedCells().filter(child => child instanceof OpmState);
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
        const duplicationMark = vectorizer.V("path", {
          name: "duplicationMark",
          fill: fillColor,
          stroke: strokeColor,
          "stroke-width": "2"
        });
        const path = "M0 0 L20 0 L20 20 L15 20 L15 5 L0 5 Z";
        duplicationMark.attr("d", path);
        duplicationMark.translate(w - 15, -5);
        if (cellView.el) {
          vectorizer.V(cellView.el).append(duplicationMark);
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
        const isHorizontalOrder = side === statesArrangement.Top || side === statesArrangement.Bottom;
        const isVerticalOrder = side === statesArrangement.Right || side === statesArrangement.Left;
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
        return this.getEmbeddedCells().filter(child => child instanceof OpmState || child instanceof OpmEllipsis);
      }
      minimumSizeHandle(initRappid) {
        const side = initRappid.opmModel.getVisualElementById(this.id).statesArrangement;
        const minSize = this.calcMinObjectSize(initRappid, side);
        const currentSize = this.get("size");
        initRappid?.graph?.startBatch("ignoreEvents");
        if ((side === statesArrangement.Bottom || side === statesArrangement.Top) && currentSize.width < minSize) {
          this.set("size", {
            width: minSize,
            height: currentSize.height
          });
        }
        if ((side === statesArrangement.Left || side === statesArrangement.Right) && currentSize.height < minSize) {
          this.set("size", {
            width: currentSize.width,
            height: minSize
          });
        }
        initRappid?.graph?.stopBatch("ignoreEvents");
      }
      calcMinObjectSize(initRappid, arrangement) {
        const states = this.getEmbeddedCells().filter(child => child instanceof OpmState || child instanceof OpmEllipsis);
        let statesTotalWidth = 0;
        let statesTotalHeight = 0;
        states.forEach(state => {
          statesTotalWidth = statesTotalWidth + state.get("size").width;
          statesTotalHeight = statesTotalHeight + state.get("size").height;
        });
        const minGap = 10;
        if (arrangement === statesArrangement.Top || arrangement === statesArrangement.Bottom) {
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
          if ((0, getInitRappidShared)().paper) {
            this.findView((0, getInitRappidShared)().paper)?.update();
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
        if (side === statesArrangement.Bottom || side === statesArrangement.Top) {
          if (states.length > 0) {
            this.enlargeObjectIfTextOverrideState(initRappid, this);
          }
          states.sort((state1, state2) => {
            return state1.getBBox().x - state2.getBBox().x;
          });
        }
        if (side === statesArrangement.Left || side === statesArrangement.Right) {
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
        if (states.length === 1 && states[0] instanceof OpmEllipsis) {
          this.shiftEllipsisOnly(states[0], rightSideX, bottomSideY);
        } else {
          // puts the ellipsis last after the states
          states = states.sort(function (n1, n2) {
            if (n1 instanceof OpmState && n2 instanceof OpmEllipsis) {
              return -1;
            }
            if (n2 instanceof OpmState && n1 instanceof OpmEllipsis) {
              return 1;
            }
            if (n1 instanceof OpmState && n2 instanceof OpmState) {
              if (side === statesArrangement.Bottom || side === statesArrangement.Top) {
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
            if (side === statesArrangement.Bottom) {
              xPosition = leftSideX + cumulativeWidthsSum + widthGap * statesCounter;
              yPosition = bottomSideY - state.get("size").height - paddingObject - paddfix;
            } else if (side === statesArrangement.Top) {
              xPosition = leftSideX + cumulativeWidthsSum + widthGap * statesCounter;
              yPosition = topSideY + paddingObject;
            } else if (side === statesArrangement.Left) {
              xPosition = leftSideX + paddingObject;
              yPosition = topSideY + cumulativeHeightsSum + heightGap * statesCounter;
            } else if (side === statesArrangement.Right) {
              xPosition = rightSideX - paddingObject - state.get("size").width;
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
          Arc.redrawAllArcs(this, initRappid, true);
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
        const statesOnly = this.getEmbeddedCells().filter(child => child instanceof OpmState);
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
        const embeddedStates = this.getEmbeddedCells().filter(child => child instanceof OpmState);
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
            let side_ = statesArrangement.Bottom;
            switch (side) {
              case "top":
                side_ = statesArrangement.Top;
                break;
              case "bottom":
                side_ = statesArrangement.Bottom;
                break;
              case "right":
                side_ = statesArrangement.Right;
                break;
              case "left":
                side_ = statesArrangement.Left;
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
            Arc.redrawAllArcs(embds[i], rappid, true);
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
        const embedded = this.getEmbeddedCells().filter(child => child instanceof OpmState);
        if (!embedded.length) {
          return;
        }
        //const ellipsis = this.getEmbeddedCells().find(s => s instanceof OpmEllipsis);
        const x = this.get("position").x;
        const y = this.get("position").y;
        const p = this.get("padding");
        const textH = textWrapping.getParagraphHeight(this.attr("text/text"), this);
        const textW = textWrapping.getParagraphWidth(this.attr("text/text"), this);
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
        const embeddedStates = this.getEmbeddedCells().filter(child => child instanceof OpmState);
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
          const drawnLink = new GeneralizationLink(fatherDrawn, newDrawn, initRappid.graph, newVisualLink.id);
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
            (0, removeCell)(cell, init);
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
        const opdVisualObjects = opd.visualElements.filter(visualElement => visualElement instanceof OpmVisualObject);
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
          (0, getInitRappidShared)().paper?.findViewByModel(states[0])?.$el?.removeAttr("data-tooltip");
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
                ellipsis_cell = (0, getInitRappidShared)().getGraphService().createDrawnEntity("Ellipsis");
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
            const e_cell = (0, getInitRappidShared)().getGraphService().createDrawnEntity("Ellipsis");
            e_cell.updateParamsFromOpmModel(ellipsis);
            this.graph.addCell(e_cell);
            this.embed(e_cell);
            e_cell.set("father", e_cell.get("parent"));
          }
        } else {
          const ellipsis = this.getEmbeddedCells().find(c => c instanceof OpmEllipsis);
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
            cell = (0, getInitRappidShared)().getGraphService().createDrawnEntity("State");
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
        return this.attr("value/valueType") !== valueType.None;
      }
      removeComputational(init) {
        if (this.getVisual().logicalElement.getBelongsToStereotyped() || this.getVisual().logicalElement.getStereotype()) {
          (0, validationAlert)("Computational cannot be removed from a stereotyped thing.");
          return;
        }
        if (this.getVisual().logicalElement.isSatisfiedRequirementObject()) {
          (0, validationAlert)("Computational cannot be removed from a requirement object.");
          return;
        }
        const model = init.getOpmModel();
        model.logForUndo(this.getVisual().logicalElement.text + " remove computation");
        const visual = this.getVisual();
        const logical = visual.logicalElement;
        new RangeValidationAccess(logical.opmModel).removeRange(visual);
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
          font_size: defaultObjectStyleSettings.font_size,
          font: defaultObjectStyleSettings.font,
          text_color: defaultObjectStyleSettings.text_color,
          border_color: defaultObjectStyleSettings.border_color,
          fill_color: defaultObjectStyleSettings.fill_color
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
}),
/***/43622: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    U: () => (/* binding */OpmSemifoldedFundamental)

  });

  class OpmSemifoldedFundamental extends configuration_rappidEnviromentFunctionality_shared /* .joint */.FP.shapes.standard.EmbeddedImage {
    constructor(fundamentalType, entityType) {
      super();
      this.triangleType = fundamentalType;
      let entType;
      if (entityType.includes("Object")) {
        entType = "opm.Object";
      } else if (entityType.includes("Process")) {
        entType = "opm.Process";
      } else if (entityType.includes("State")) {
        entType = "opm.State";
      }
      this.set("type", entType);
      this.set(this.semiFoldedAttributes());
      this.semiFoldedAttrs();
      this.removeIrrelevantAttrs();
      if (fundamentalType === ConfigurationOptions /* .linkType */.h6.Aggregation) {
        this.attr("image/xlinkHref", "assets/SVG/links/structural/aggregation.svg");
      } else if (fundamentalType === ConfigurationOptions /* .linkType */.h6.Instantiation) {
        this.attr("image/xlinkHref", "assets/SVG/links/structural/classification.svg");
      } else if (fundamentalType === ConfigurationOptions /* .linkType */.h6.Generalization) {
        this.attr("image/xlinkHref", "assets/SVG/links/structural/generalization.svg");
      } else if (fundamentalType === ConfigurationOptions /* .linkType */.h6.Exhibition) {
        this.attr("image/xlinkHref", "assets/SVG/links/structural/exhibition.svg");
      }
      // this.set('ports', this.getPortGroups());
      // this.addPort({ group: 'left', id: 1 });
      // this.addPort({ group: 'right', id: 2 });
      const leftPort = {
        id: "1",
        group: "left",
        args: {},
        attrs: {
          magnet: true
        },
        markup: "<g><rect width=\"5\" height=\"5\" x=\"28\" y=\"19\" strokegit =\"red\" fill=\"transparent\" pointer-events=\"none\"/></g>"
      };
      const rightPort = {
        id: "2",
        group: "right",
        args: {},
        attrs: {
          magnet: true
        },
        markup: "<g><rect width=\"5\" height=\"5\" y=\"19\" x=\"0\" strokegit =\"red\" fill=\"transparent\" pointer-events=\"none\"/></g>"
        // markup: '<g transform="translate(150,0)"><rect width="5" height="5" y="21" x="0" strokegit ="red" fill="red"/></g>'
      };
      this.addPort(leftPort);
      this.addPort(rightPort);
    }
    static bestSemiFoldedPort(semiFoldedContainer, target) {
      if (!semiFoldedContainer || !target) {
        return 1;
      }
      const sourceMidPoint = semiFoldedContainer.xPos + semiFoldedContainer.width / 2;
      if (target.xPos < sourceMidPoint) {
        return 1;
      }
      return 2;
    }
    hasStates() {
      return false;
    }
    getStatesOnly() {
      return [];
    }
    semiFoldedAttributes() {
      return {
        size: {
          width: 150,
          height: 40
        }
      };
    }
    updateText(newText) {
      this.attr("label/text", newText);
      this.attr("text/textWrap/text", newText);
    }
    semiFoldedAttrs() {
      this.attr("label/text", "");
      this.attr("body/refWidth", "100%");
      this.attr("body/refHeight", "100%");
      this.attr("body/height", "40px");
      this.attr("image/x", "10px");
      this.attr("image/y", "-5px");
      this.attr("image/width", "50px");
      this.attr("image/height", "50px");
      this.attr("label/refX", "30px");
      this.attr("root/magnet", false);
      this.attr("image/magnet", true);
      this.attr("label/fontWeight", 600);
      this.attr("label/fontSize", 12);
      this.attr("label/refY", 15);
      this.attr("body/fill", "rgba(0, 0, 0, 0)");
      this.attr("value/value", "None");
    }
    updateParamsFromOpmModel(visual) {
      const parent = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().graph.getCell(visual.fatherObject.id);
      this.set("position", {
        x: parent.get("position").x + visual.xPos,
        y: parent.get("position").y + visual.yPos
      });
    }
    removeIrrelevantAttrs() {
      // this.removeAttr('body/refHeight');
      // this.removeAttr('body/refWidth');
      this.removeAttr("body/stroke");
      this.removeAttr("image/refHeight");
      this.removeAttr("image/refWidth");
    }
    getVisual() {
      return (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().getOpmModel().getVisualElementById(this.id);
    }
    getParams() {
      // return undefined;
      return {
        xPos: this.getParentCell() ? this.get("position").x - this.getParentCell().get("position").x : undefined,
        yPos: this.getParentCell() ? this.get("position").y - this.getParentCell().get("position").y : undefined,
        width: this.get("size").width,
        height: this.get("size").height,
        // textFontWeight: this.attr('text/font-weight'),
        // textFontSize: this.attr('text/font-size'),
        // textFontFamily: this.attr('text/font-family'),
        // textColor: this.attr('text/fill'),
        // refX: this.attr('text/ref-x'),
        // refY: this.attr('text/ref-y'),
        // xAlign: this.attr('text/x-alignment'),
        // yAlign: this.attr('text/y-alignment'),
        // textWidth: this.attr('text/textWrap/width'),
        // textHeight: this.attr('text/textWrap/height'),
        // text: this.attr('text/textWrap/text'),
        // fill: this.getShapeAttr().fill,
        // strokeColor: this.getShapeAttr().stroke,
        // strokeWidth: this.attr('rect/stroke-width') || this.attr('ellipse/stroke-width'),
        id: this.get("id"),
        fatherObjectId: this.get("parent"),
        // essence: Essence.Physical,
        // affiliation: (this.getShapeAttr()[this.dashArrayKey] === this.dashArrayValues[0]) ? Affiliation.Systemic : Affiliation.Environmental,
        // statesArrangement: this.attr('statesArrange'),
        // valueType: this.attr('value/valueType'),
        // value: this.attr('value/value'),
        // units: this.attr('value/units'),
        // digitalTwin: this.digitalTwin,
        // predigitalTwin: this.predigitalTwin,
        // originalObj: this.originalObj,
        // preoriginalObj: this.preoriginalObj,
        // digitalTwinConnected: this.digitalTwinConnected,
        ////////////////////
        // unique attrs  //
        //////////////////
        bodyFill: this.attr("body/fill"),
        bodyHeight: this.attr("body/height"),
        bodyWidth: this.attr("body/height"),
        imgaeX: this.attr("image/x"),
        imgaeY: this.attr("image/y"),
        imageXlinkRef: this.attr("image/xlinkHref"),
        labelFill: this.attr("label/fill"),
        labelFontSize: this.attr("label/fontSize"),
        labelFontWeight: this.attr("label/fontWeight"),
        labelRefX: this.attr("label/refX"),
        labelRefX2: this.attr("label/refX2"),
        labelRefY: this.attr("label/refY"),
        labelText: this.attr("label/text")
      };
    }
    getPortAttr(x, y, width, height) {
      return {
        rect: {
          stroke: "red",
          fill: "green",
          width: width,
          height: height,
          x: x,
          y: y,
          magnet: "true"
        }
      };
    }
    createPortGroup(name, args, x, y, width, height) {
      return {
        position: {
          name: name,
          args: {
            x: 10,
            y: 10,
            angle: 30,
            dx: 1,
            dy: 1
          }
        },
        attrs: this.getPortAttr(x, y, width, height),
        markup: "<g><rect/></g>"
      };
    }
    getPortGroups() {
      return {
        left: this.createPortGroup("1", null, 0, 0, 5, 5),
        right: this.createPortGroup("2", null, 0, 0, 5, 5)
      };
    }
    updateView(vis) {}
    setPorts(side) {
      return 1;
    }
    getEssence() {
      return this.getVisual().logicalElement.essence;
    }
    getAffiliation() {
      return this.getVisual().logicalElement.affiliation;
    }
    isComputational() {
      return this.getVisual()?.logicalElement?.isComputational();
    }
    takeThingOut() {
      const init = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)();
      const model = init.getOpmModel();
      model.logForUndo("Fold out relation");
      model.setShouldLogForUndoRedo(false, "OpmSemifoldedFundamental-takeThingOut");
      const drawnParent = this.getParentCell();
      const ret = model.foldOutFundamentalRelation(this.getVisual());
      init.graph.getCell(ret.thing.id).updateView(ret.thing);
      ret.createdEntities.forEach(ent => init.getGraphService().updateEntity(ent));
      for (const semf of ret.thing.semiFolded) {
        const cell = this.graph.getCell(semf.id);
        cell.set("position", {
          x: semf.xPos + ret.thing.xPos,
          y: semf.yPos + ret.thing.yPos
        });
      }
      for (const removed of ret.removed) {
        if (init.graph.getCell(removed.id)) {
          init.graph.getCell(removed.id).remove();
        }
      }
      ret.createdEntities.forEach(ent => {
        const entCell = init.graph.getCell(ent.id);
        if (entCell && (entCell.constructor.name.includes("Object") || entCell.constructor.name.includes("Process"))) {
          entCell.shiftEmbeddedToEdge(init);
        }
      });
      init.getGraphService().updateLinksView(ret.createdLinks);
      // init.graph.resetCells(init.graph.getCells());
      for (const sm of init.graph.getCells().filter(cl => cl.constructor.name.includes("OpmSemifoldedFund"))) {
        if (init) {
          sm.addHandle(init);
        }
      }
      model.setShouldLogForUndoRedo(true, "OpmSemifoldedFundamental-takeThingOut");
    }
    hasURLs() {
      return false;
    }
    getParent() {
      return this.getParentCell();
    }
    doubleClickHandle(cellView, initRappid) {
      this.foldOut();
    }
    foldOut() {
      if (configuration_rappidEnviromentFunctionality_shared /* .initRappidShared */.i1.opmModel.currentOpd.stereotypeOpd) {
        return;
      }
      const parent = this.getParentCell();
      this.takeThingOut();
      if (parent.shiftEmbeddedToEdge) {
        parent.shiftEmbeddedToEdge(configuration_rappidEnviromentFunctionality_shared /* .initRappidShared */.i1);
      }
      parent.updateSizePositionToFitEmbeded(true);
    }
    fixRightPortPosition(init) {
      if (!init.paper) {
        return;
      }
      const el = init.paper.findViewByModel(this)?.el;
      if (!el) {
        return;
      }
      const textbbox = el.children[2]?.getBBox();
      if (textbbox) {
        const xDist = 50 + textbbox.width;
        const rightPortMarkup = `<g><rect width="5" height="5" y="19" x="0" strokegit ="red" fill="transparent" pointer-events="none" transform="translate(${xDist},0)"/></g>`;
        this.portProp("2", "markup", rightPortMarkup);
      }
    }
    removeDuplicationMark() {}
    pointerUpHandle(cellView, options) {
      options.setSelectedElementToNull();
    }
    changeAttributesHandle(options) {
      this.fixRightPortPosition(options);
    }
    changeSizeHandle(initRappid) {}
    changePositionHandle(initRappid) {}
    removeHandle(options) {}
    addHandle(options) {
      this.fixRightPortPosition(options);
      this.updateSize(options);
      if (options.paper && this.findView(options.paper)) {
        this.findView(options.paper).setInteractivity({
          elementMove: false
        });
      }
    }
    updateSize(options) {
      const el = options.paper.findViewByModel(this).el;
      const width = el.getBBox().width;
      if (width && !isNaN(width)) {
        this.set("size", {
          width: width,
          height: this.get("size").height
        });
        if (this.getVisual()) {
          this.getVisual().width = width;
        }
      }
    }
    pointerDownHandle(cellView, options, event) {
      options.setSelectedElementToNull();
    }
  }

  /***/
}),
/***/14168: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    g: () => (/* binding */OpmState)

  });

  class OpmState extends OpmEntity /* .OpmEntity */.Q {
    constructor(stateName = "State") {
      super();
      this.originalColor = "#FFFFFF";
      this.set(this.stateAttributes());
      if (typeof stateName === "string" || typeof stateName === "number") {
        this.attr(this.stateAttrs(String(stateName)));
      } else {
        this.attr(this.stateAttrs(stateName.attrs.text.textWrap.text));
      }
    }
    // createPorts(visual) {
    //   // const portsInUse = (<any>this.getVisual()).getPortsInUse();
    //   // for (const index of Array.from({length: 16}, (x, i) => i)) {
    //   //   const refData = this.convertOldPortToRelativePosition(index);
    //   //   this.addPort({ id: index, group: 'aaa', args: { x: refData.refX*100+'%', y: refData.refY*100+'%' }, markup: this.defaultPortMarkup });
    //   // }
    // }
    convertOldPortToRelativePosition(portId) {
      const covnvertionTable = [{
        id: 0,
        refX: 0.1,
        refY: 0
      }, {
        id: 1,
        refX: 0.3,
        refY: 0
      }, {
        id: 2,
        refX: 0.5,
        refY: 0
      }, {
        id: 3,
        refX: 0.7,
        refY: 0
      }, {
        id: 4,
        refX: 0.9,
        refY: 0
      }, {
        id: 5,
        refX: 1,
        refY: 0.167
      }, {
        id: 6,
        refX: 1,
        refY: 0.5
      }, {
        id: 7,
        refX: 1,
        refY: 0.83
      }, {
        id: 8,
        refX: 0.1,
        refY: 1
      }, {
        id: 9,
        refX: 0.3,
        refY: 1
      }, {
        id: 10,
        refX: 0.5,
        refY: 1
      }, {
        id: 11,
        refX: 0.7,
        refY: 1
      }, {
        id: 12,
        refX: 0.9,
        refY: 1
      }, {
        id: 13,
        refX: 0,
        refY: 0.167
      }, {
        id: 14,
        refX: 0,
        refY: 0.5
      }, {
        id: 15,
        refX: 0,
        refY: 0.83
      }];
      return covnvertionTable.find(item => Number(portId) === item.id);
    }
    getPortGroups() {
      return {
        aaa: {
          markup: this.defaultPortMarkup,
          position: "absolute"
        }
      };
      // return {
      //   'top': this.createPortGroup('top', null, 0, -2, 5, 5),
      //   'bottom': this.createPortGroup('bottom', null, 0, -2, 5, 5),
      //   'left': this.createPortGroup('left', null, -2, 0, 5, 5),
      //   'right': this.createPortGroup('right', null, -2, 0, 5, 5)
      // };
    }
    stateAttributes() {
      return {
        markup: [{
          tagName: "g",
          className: "whole",
          children: [{
            tagName: "g",
            className: "scalable",
            selector: "scalable",
            children: [{
              tagName: "rect",
              className: "outer"
            }, {
              tagName: "rect",
              className: "inner"
            }]
          }, {
            tagName: "text"
          }, {
            tagName: "image"
          }, {
            tagName: "image",
            className: "currentImg"
          }, {
            tagName: "image",
            className: "rangeImg"
          }]
        }],
        type: "opm.State",
        size: {
          width: 60,
          height: 30
        },
        minSize: {
          width: 60,
          height: 30
        },
        padding: 5
      };
    }
    innerOuter(styleSettings) {
      const param = {
        fill: styleSettings.fill_color,
        stroke: styleSettings.border_color,
        rx: 5,
        ry: 5,
        "ref-x": 0.5,
        "ref-y": 0.5,
        "x-alignment": "middle",
        "y-alignment": "middle"
      };
      return {
        ...this.entityShape(),
        ...param
      };
    }
    createInner(styleSettings) {
      return {
        fill: styleSettings.fill_color,
        "stroke-width": 0,
        width: 60,
        height: 30,
        "ref-x": 0.5,
        "ref-y": 0.5,
        "x-alignment": "middle",
        "y-alignment": "middle"
      };
    }
    createOuter(styleSettings) {
      return {
        fill: styleSettings.fill_color,
        width: 70,
        height: 40
      };
    }
    getDefaultStyleSettings() {
      return {
        font_size: Defaults_style /* .defaultStateStyleSettings */.B.font_size,
        font: Defaults_style /* .defaultStateStyleSettings */.B.font,
        text_color: Defaults_style /* .defaultStateStyleSettings */.B.text_color,
        border_color: Defaults_style /* .defaultStateStyleSettings */.B.border_color,
        fill_color: Defaults_style /* .defaultStateStyleSettings */.B.fill_color
      };
    }
    stateAttrs(stateName) {
      const styleSettings = this.getDefaultStyleSettings();
      const init = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)();
      if (init) {
        const oplService = init.oplService;
        if (oplService) {
          this.setRelevantStyleSettings(styleSettings, oplService);
        }
      }
      return {
        rect: {
          fill: styleSettings.fill_color
        },
        ".outer": {
          ...this.innerOuter(styleSettings),
          ...this.createOuter(styleSettings)
        },
        ".inner": {
          ...this.innerOuter(styleSettings),
          ...this.createInner(styleSettings)
        },
        ".whole": {
          "ref-width": 0.99,
          "ref-height": 0.99
        },
        text: {
          textWrap: {
            text: stateName
          },
          "font-weight": 300,
          fill: styleSettings.text_color,
          "font-size": styleSettings.font_size,
          "font-family": styleSettings.font
        },
        image: {
          "xlink:href": "assets/SVG/defaultState.svg",
          // 'xlink:href': 'assets/SVG/currentState.svg',
          display: "none",
          "ref-x": 1,
          "ref-y": 1,
          x: -18,
          y: -18,
          ref: "rect",
          width: 25,
          height: 25
        },
        ".currentImg": {
          "xlink:href": "assets/SVG/currentState.svg",
          display: "none",
          "ref-x": 1,
          "ref-y": 1,
          x: -13,
          y: -18,
          ref: "rect",
          width: 25,
          height: 25
        },
        ".rangeImg": {
          "xlink:href": "assets/SVG/rangeState.svg",
          display: "none",
          "ref-x": 0.5,
          "ref-y": 1,
          x: -12,
          y: -8,
          ref: "rect",
          width: 24,
          height: 8
        }
      };
    }
    setRelevantStyleSettings(styleSettingsToUpdate, oplService) {
      Object.keys(styleSettingsToUpdate).forEach(function (key) {
        if (oplService.orgOplSettings?.style?.state?.hasOwnProperty(key) && oplService.orgOplSettings.style?.state[key] !== undefined && oplService.orgOplSettings?.style?.state[key] !== null) {
          styleSettingsToUpdate[key] = oplService.orgOplSettings.style?.state[key];
        }
      });
      Object.keys(styleSettingsToUpdate).forEach(function (key) {
        if (oplService.userOplSettings?.style?.state?.hasOwnProperty(key) && oplService.settings.style?.state[key] !== undefined && oplService.settings.style?.state[key] !== null) {
          styleSettingsToUpdate[key] = oplService.settings.style.state[key];
        }
      });
      this.originalColor = oplService.settings?.style?.state?.fill_color || oplService.orgOplSettings?.style?.state?.fill_color || this.originalColor;
    }
    getParams() {
      const params = {
        stateType: this.checkType(),
        fill: this.originalColor || this.attr("rect/fill"),
        strokeColor: this.attr("rect/stroke") || this.attr(".outer/stroke")
      };
      return {
        ...super.getEntityParams(),
        ...params
      };
    }
    setOriginalColor(color) {
      this.originalColor = color;
    }
    updateParamsFromOpmModel(visualElement) {
      this.attr({
        ".": {
          opacity: visualElement.belongsToSubModel || visualElement.fatherObject.logicalElement.visualElements.some(v => v.protectedFromBeingChangedBySubModel || v.belongsToFatherModelId) ? 0.6 : 1
        }
      });
      this.originalColor = visualElement.fill;
      const entityParams = this.updateEntityFromOpmModel(visualElement);
      const stroke = entityParams.stroke ? entityParams.stroke : visualElement.strokeColor ? visualElement.strokeColor : "#808000";
      const attr = {
        ".outer": {
          ...entityParams,
          ...{
            stroke: stroke
          }
        },
        ".inner": {
          ...entityParams,
          ...{
            stroke: stroke
          }
        },
        fill: visualElement.fill ? visualElement.fill : "#ffffff",
        strokeColor: stroke
      };
      this.attr(attr);
      this.updateStateByType(visualElement.logicalElement.stateType);
      const fillValue = visualElement.fill ? visualElement.fill : "#ffffff";
      this.attr("rect/fill", fillValue);
      this.attr(".inner/fill", fillValue);
      this.attr(".outer/fill", fillValue);
      this.attr(".inner/width", visualElement.width - 10);
      this.attr(".outer/width", visualElement.width);
      this.attr("text/textWrap/text", visualElement.logicalElement.getDisplayText());
      this.attr(".rangeImg/display", visualElement.hasRange() ? "block" : "none");
      if ((0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().paper) {
        this.findView((0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().paper)?.resize();
      }
      this.updateURLArray();
      // Restore pattern if present - this must be called AFTER setting the fill attributes
      this.restorePatternIfNeeded(visualElement);
    }
    restorePatternIfNeeded(visualElement) {
      const fill = visualElement.fill;
      if (fill && fill.startsWith && fill.startsWith("url(#")) {
        // Fill is a pattern - restore using new static template system
        const init = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)();
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
    restorePatternIfNeeded_OLD(visualElement) {
      const fill = visualElement.fill;
      if (fill && fill.startsWith && fill.startsWith("url(#")) {
        // Fill is a pattern - restore pattern config and ensure pattern exists in SVG
        const patternConfig = visualElement.patternConfig;
        const isCustomPattern = visualElement.isCustomPattern;
        let configToUse = patternConfig;
        if (!configToUse) {
          // Try to extract pattern config from pattern URL
          // Format: pat-stripes-{angle}-{gap}-{stripeWidth}-{stripeColor}-{background}-{useUserSpace} (predefined)
          // Or: pat-stripes-custom-{elementId}-{angle}-{gap}-{stripeWidth}-{stripeColor}-{background}-{useUserSpace} (custom)
          const match = fill.match(/url\(#([^)]+)\)/);
          if (match) {
            const patternId = match[1];
            const parts = patternId.replace("pat-stripes-", "").split("-");
            // Check if it's a custom pattern (starts with "custom-")
            let configStartIndex = 0;
            let bgIndex = 4;
            let isCustom = false;
            if (parts[0] === "custom" && parts.length >= 7) {
              // Custom pattern format: custom-{elementId}-{angle}-...
              isCustom = true;
              configStartIndex = 2; // Skip "custom" and elementId
              bgIndex = 6;
            } else if (parts.length >= 5) {
              // Predefined pattern format: {angle}-{gap}-{stripeWidth}-{stripeColor}-{background}-{useUserSpace}
              configStartIndex = 0;
              bgIndex = 4;
            }
            if (parts.length >= 5 + configStartIndex) {
              const bgPart = parts[bgIndex];
              const background = bgPart && bgPart !== "none" ? "#" + bgPart : "#FFFFFF";
              // Handle normalized angle format (n45 for -45, or regular number)
              let angleDeg = 45;
              const angleStr = parts[configStartIndex];
              if (angleStr.startsWith("n")) {
                angleDeg = -parseInt(angleStr.substring(1)) || -45;
              } else {
                angleDeg = parseInt(angleStr) || 45;
              }
              const extractedConfig = {
                angleDeg: angleDeg,
                gap: parseInt(parts[configStartIndex + 1]) || 10,
                stripeWidth: parseInt(parts[configStartIndex + 2]) || 3,
                stripeColor: "#" + parts[configStartIndex + 3],
                background: background,
                useUserSpace: parts[parts.length - 1] === "us"
              };
              visualElement.patternConfig = extractedConfig;
              visualElement.isCustomPattern = isCustom;
              configToUse = extractedConfig;
              visualElement.baseFillColor = background;
            }
          }
        } else {
          // Extract background color from pattern URL
          const match = fill.match(/url\(#([^)]+)\)/);
          if (match) {
            const patternId = match[1];
            const parts = patternId.replace("pat-stripes-", "").split("-");
            if (parts.length >= 5) {
              const bgPart = parts[4];
              const background = bgPart && bgPart !== "none" ? "#" + bgPart : "#FFFFFF";
              visualElement.patternConfig = patternConfig;
              visualElement.baseFillColor = background;
              configToUse = {
                ...patternConfig,
                background: background
              };
            }
          }
        }
        // Ensure pattern exists in SVG
        if (configToUse) {
          this.ensurePatternInSVG(configToUse, isCustomPattern || visualElement.isCustomPattern);
        }
      } else if (fill && !fill.startsWith("url(#")) {
        // Solid fill - store as baseFillColor
        visualElement.baseFillColor = fill;
      }
    }
    ensurePatternInSVG(patternConfig, isCustom = false) {
      const init = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)();
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
    updateStateByType(type) {
      let init = 2;
      let final = 0;
      let def = "none";
      if (type.indexOf("initial") > -1) {
        init = 3;
      }
      if (type.indexOf("final") > -1) {
        final = 2;
      }
      if (type.indexOf("default") > -1) {
        def = "flex";
      }
      if (type === "Initial" || type === "finInitial" || type === "DefInitial" || type === "all") {
        init = 3;
      }
      if (type === "finInitial" || type === "Final" || type === "all" || type === "DefFinal") {
        final = 2;
      }
      if (type === "Default" || type === "DefFinal" || type === "DefInitial" || type === "all") {
        def = "flex";
      }
      if (type.includes("Current")) {
        this.attr(".currentImg/display", "flex");
      }
      this.attr("image/display", def);
      this.attr(".outer/stroke-width", init);
      this.attr(".inner/stroke-width", final);
    }
    getDescriptionSvgIcon(descXpos, descYpos, title) {
      // Use clearSvgTitle to decode and escape the title safely
      const safeTitle = this.clearSvgTitle(title);
      // Add line breaks after every 6 words for better readability
      const formattedTitle = safeTitle.replace(/((?:[^\s]*\s){6}[^\s]*)\s/g, "$1\n");
      return `<svg class="descSign" x=${descXpos} y=${descYpos} width="9.6" height="12" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.9904 4.03649C11.9923 4.00564 11.9923 3.97472 11.9904 3.94387C11.9904 3.94387 11.9904 3.9298 11.9904 3.92375C11.9836 3.88758 11.9727 3.85244 11.9578 3.81905C11.9578 3.809 11.9578 3.80295 11.9482 3.7949C11.9387 3.78685 11.9214 3.74257 11.9061 3.71841L11.885 3.69223C11.864 3.66175 11.8402 3.63344 11.814 3.6077L8.16037 0.143077C8.13548 0.121178 8.10919 0.101003 8.08178 0.0826837L8.05112 0.0685921C8.03082 0.0562368 8.00966 0.045471 7.98785 0.0363816L7.96869 0.024303L7.89776 0.0021585H7.87666C7.84478 -0.000719501 7.81273 -0.000719501 7.78084 0.0021585H0.575081C0.424857 0.00211554 0.28058 0.0638069 0.173109 0.174039C0.065638 0.284268 0.00350547 0.434287 0 0.592006V14.3961C0 14.5563 0.0605887 14.7099 0.168437 14.8231C0.276286 14.9364 0.422561 15 0.575081 15H11.4249C11.5774 15 11.7237 14.9364 11.8316 14.8231C11.9394 14.7099 12 14.5563 12 14.3961V4.05259C12 4.05259 11.9904 4.04251 11.9904 4.03649ZM8.34826 1.94081L9.9393 3.45267H8.34826V1.94081ZM1.15016 13.7962V1.19595H7.20575V4.05259C7.20575 4.21276 7.26634 4.36637 7.37418 4.47962C7.48205 4.59291 7.62832 4.65654 7.78084 4.65654H10.8479V13.7962H1.15016Z" fill="#5A6F8F"/>
          <line x1="3" y1="5.5" x2="9" y2="5.5" stroke="#5A6F8F"/>
          <line x1="3" y1="9.5" x2="9" y2="9.5" stroke="#5A6F8F"/>
          <line x1="3" y1="11.5" x2="7" y2="11.5" stroke="#5A6F8F"/>
          <line x1="3" y1="7.5" x2="7" y2="7.5" stroke="#5A6F8F"/>
          <path d="M0 0H8L10 2L12 4V15H0V0Z" fill="white" fill-opacity="0.01"/>
          <title>${formattedTitle}</title>
          </svg>
    `;
    }
    updateURLArray() {
      const init = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)();
      if (init.exportingOpl || !init?.paper?.findViewByModel(this)) {
        return;
      }
      let markup;
      if (this.hasURLs() || this.hasDescription().value) {
        const statePos = init.paper.findViewByModel(this).el.getBoundingClientRect();
        const textPos = init.paper.findViewByModel(this).el.querySelector("text").getBoundingClientRect();
        const relativePos = {
          x: textPos.left - statePos.left - 8,
          y: textPos.top - statePos.top - 6
        };
        const xPos = "'{}'".replace("{}", String(relativePos.x));
        const yPos = "'{}'".replace("{}", String(relativePos.y));
        let urlMarkup = "";
        let descriptionMarkup = "";
        if (this.hasURLs()) {
          urlMarkup = this.getUrlSvgIcon(xPos, yPos);
        }
        const descXpos = "'{}'".replace("{}", String(relativePos.x + textPos.width + 9));
        const descYpos = "'{}'".replace("{}", String(relativePos.y + 1));
        const title = "'{}'".replace("{}", String(this.hasDescription().desc));
        if (this.hasDescription().value) {
          descriptionMarkup = this.getDescriptionSvgIcon(descXpos, descYpos, title);
        }
        markup = `<g class="whole"><g class="scalable"><rect class="outer"/><rect class="inner"/></g><text/><image/><image class="currentImg"/><image class="rangeImg"/>${urlMarkup}${descriptionMarkup}</g>`;
      } else {
        markup = this.stateAttributes().markup;
      }
      this.set("markup", markup);
      this.addSvgsClickEvents(init);
    }
    greyOutEntity() {
      if ((0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().exportingOpl) {
        return;
      }
      if (this.getVisual().fatherObject && this.getVisual().fatherObject.logicalElement.shouldBeGreyed === true && (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().shouldGreyOut) {
        this.graph.startBatch("ignoreChange");
        const attr = {
          rect: {
            fill: "lightgrey"
          },
          ".inner": {
            stroke: "grey"
          },
          ".outer": {
            stroke: "grey"
          }
        };
        this.attr(attr);
        this.graph.stopBatch("ignoreChange");
      } else {
        this.graph.startBatch("ignoreChange");
        const vis = this.getVisual();
        if (vis.fill === "lightgrey" || vis.strokeColor === "grey") {
          vis.fill = vis.fill === "lightgrey" || !vis.fill ? (0, configuration_rappidEnviromentFunctionality_shared /* .getStyles */.$f)("opm.State").fill : vis.fill;
          vis.strokeColor = vis.strokeColor === "lightgrey" || !vis.strokeColor ? (0, configuration_rappidEnviromentFunctionality_shared /* .getStyles */.$f)("opm.State").stroke : vis.strokeColor;
        }
        this.updateParamsFromOpmModel(this.getVisual());
        this.graph.stopBatch("ignoreChange");
      }
    }
    removeHandle(options) {
      /*const fatherObject = <OpmObject>options.graph.getCell(this.get('father'));
           if (fatherObject.get('embeds').length === 0) {
        fatherObject.arrangeEmbededParams(0.5, 0.5, 'middle', 'middle', 'bottom', 0, 0);
        fatherObject.attr('text/textWrap', { width: '80%', height: '80%' })
        //    fatherObject.updateTextSize(textWrapping.calculateNewTextSize(fatherObject.attr('text/textWrap/text'), fatherObject));
        // if the state was a value of the object then delete the value from the object
        if (fatherObject.attr('value/value') !== 'None') {
          fatherObject.removeValue(options, 'None', 'None', valueType.None);
        }
      } else {
        fatherObject.arrangeEmbedded(options);
      }
      Arc.redrawAllArcs(fatherObject, options, true);*/
    }
    removeAction(visual, init) {
      init.getOpmModel().logForUndo(visual.fatherObject.logicalElement.text + " state removal");
      const ret = visual.removeAction();
      if (ret.removed) {
        const parent = this.getParent();
        init.getGraphService().viewRemove(ret.elements);
        parent.updateSiblings(visual.fatherObject, init);
        if (visual.fatherObject.states.length === 0 && visual.fatherObject.children.length === 0) {
          if (!visual.fatherObject.isManualTextPos) {
            parent.attr("text/ref-x", "0.5");
            parent.attr("text/ref-y", "0.5");
          }
          parent.attr("text/x-alignment", "middle");
          parent.attr("text/y-alignment", "middle");
        }
        return;
      }
      init.getOpmModel().removeLastUndoOperation();
      (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)("Cannot Remove", 2500, undefined, true);
    }
    checkType() {
      let type = "";
      if (this.attr(".currentImg/display") === "flex") {
        type += "Current";
      }
      if (this.attr("image/display") === "flex") {
        type += "default";
      }
      if (this.attr(".inner/stroke-width") > 0) {
        type += "final";
      }
      if (this.attr(".outer/stroke-width") > 2) {
        type += "initial";
      }
      if (type === "") {
        return "none";
      }
      return type;
    }
    getTypeForOpl() {
      const type = this.checkType();
      const ret = [];
      if (type.includes("default")) {
        ret.push("default");
      }
      if (type.includes("initial")) {
        ret.push("initial");
      }
      if (type.includes("final")) {
        ret.push("final");
      }
      if (ret.length === 0) {
        return "none";
      }
      return ret.join("_");
    }
    changePositionHandle(initRappid, direction = null) {
      const parent = this.getParent();
      if (!parent) {
        return;
      }
      let changed = false;
      this.graph.startBatch("ignoreEvents");
      const parentPos = parent.get("position");
      if (parentPos.x + 10 > this.get("position").x) {
        changed = true;
        const widthDiff = 10 - (this.get("position").x - parent.get("position").x);
        parent.set("position", {
          x: parent.get("position").x - widthDiff,
          y: parent.get("position").y
        });
        parent.set("size", {
          width: parent.get("size").width + widthDiff,
          height: parent.get("size").height
        });
      }
      if (parentPos.y + 10 > this.get("position").y) {
        changed = true;
        const newYPos = Math.min(this.get("position").y - 10, parent.get("position").y);
        const heightDiff = parent.get("position").y - newYPos;
        parent.set("position", {
          x: parent.get("position").x,
          y: newYPos
        });
        parent.set("size", {
          width: parent.get("size").width,
          height: parent.get("size").height + heightDiff
        });
      }
      this.graph.stopBatch("ignoreEvents");
      parent.redrawDuplicationMark(initRappid);
      if (!changed) {
        super.changePositionHandle(initRappid, direction);
      }
    }
    getConfigurationTools(initRappid) {
      return [...super.getConfigurationTools(initRappid), {
        action: "suppress",
        content: "Suppress"
      }];
    }
    configurationContextToolbarEvents(target, contextToolbar, initRappid) {
      super.configurationContextToolbarEvents(target, contextToolbar, initRappid);
      const this_ = this;
      const visual = initRappid.opmModel.currentOpd.visualElements.find(c => c.id === this.id);
      contextToolbar.on("action:suppress", function () {
        initRappid.graph.startBatch("statesSuppression");
        this_.suppressAction(visual, initRappid);
        initRappid.graph.stopBatch("statesSuppression");
        this.remove();
      });
    }
    changeAttributesHandle(options) {
      super.changeAttributesHandle(options);
      /*if ((this.attr('text/textWrap/text') !== this.lastEnteredText) &&
        this.attr('text/textWrap/text').trim() !== '') { // if the text was changed
        const fatherObject = <OpmObject>options.graph.getCell(this.get('father'));
        if (fatherObject)
          fatherObject.minimumSizeHandle(options);
      }*/
    }
    getNextPort(port) {
      if (port === 15) {
        return 1;
      }
      return port + 1;
    }
    suppressAction(visual, init) {
      if (visual.suppress() === false) {
        (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)("The state " + visual.logicalElement.getBareName() + " cannot be suppressed because of its connected links.");
        return;
      }
      this.graph.startBatch("ignoreEvents");
      this.graph.startBatch("ignoreChange");
      const ellipsis = visual.fatherObject.ellipsis.setDefaultPosition();
      let e_cell = this.graph.getCell(ellipsis.id);
      if (!e_cell) {
        e_cell = new EllipsisState /* .OpmEllipsis */.U();
        e_cell.updateParamsFromOpmModel(ellipsis);
        this.graph.addCell(e_cell);
        this.getParent().embed(e_cell);
        e_cell.set("father", e_cell.get("parent"));
      }
      this.getParent().updateParamsFromOpmModel(ellipsis.fatherObject);
      this.graph.stopBatch("ignoreChange");
      this.graph.stopBatch("ignoreEvents");
      const graph = this.graph;
      const parent = this.getParent();
      graph.startBatch("ignoreRemoveEvent");
      this.remove();
      graph.stopBatch("ignoreRemoveEvent");
      parent.updateView(parent.getVisual());
      if (init) {
        init.setSelectedElementToNull();
        parent.shiftEmbeddedToEdge(init);
      }

    }
    isTextCut(init) {
      let fullText = this.attributes.attrs.text.textWrap.text;
      if (fullText) {
        fullText = fullText.replace(/(\r\n|\n|\r| )/g, "");
      }
      let shownText = init.paper.findViewByModel(this).$el[0].textContent;
      if (shownText) {
        shownText = shownText.replace(/(\r\n|\n|\r| )/g, "");
      }
      if (fullText && shownText && shownText.length < fullText.length) {
        return true;
      }
      return false;
    }
    haloConfiguration(halo, options) {
      super.haloConfiguration(halo, options);
      const this_ = this;
      const curentObject = this_.getAncestors()[0];
      const embeddedStates = curentObject.getEmbeddedCells().filter(child => child instanceof OpmState);
      const hasStates = embeddedStates.length > 0;
      const Dcheckbox = "<input id=\"Default\" class=\"Default\" name=\"Default\" type=\"checkbox\"" + (this.attr("image/display") === "flex" ? " checked" : "") + "> <label for=\"Default\">Default</label>";
      const Icheckbox = "<input  id=\"Initial\" class=\"Initial\" name=\"Initial\" type=\"checkbox\" " + (this.attr(".outer/stroke-width") === 3 ? " checked" : "") + "> <label for=\"Initial\">Initial</label>";
      const Fcheckbox = "<input id=\"Final\" class=\"Final\" name=\"Final\" type=\"checkbox\" " + (this.attr(".inner/stroke-width") === 2 ? " checked" : "") + "> <label for=\"Final\">Final</label>";
      // halo.addHandle(this.addHandleGenerator('stateType', 'sw', 'Click to define state type', 'right'));
      // halo.addHandle({name:'stateType', direction: 'bottom', icon: 'assets/SVG/stateTypeHalo.svg', attr: {
      //     '.handle': {
      //       'data-tooltip-class-name': 'small',
      //       'data-tooltip': 'stateType',
      //       'data-tooltip-position': 'top',
      //       'data-tooltip-padding': 15,
      //     }
      //   }});
      // halo.on('action:stateType:pointerdown', function () {
      //   console.log('stateType');
      //   const cellModel = this.options.cellView.model;
      //   const log: OpmLogicalState = options.opmModel.getLogicalElementByVisualId(this_.id);
      //
      //   // access properties using this keyword
      //   const popupEvents = {
      //     'click .Default': function toggleCheckboxD() {
      //       const DcheckInput = (<HTMLInputElement>document.getElementById('Default')).checked ? 'flex' : 'none';
      //       cellModel.attr('image/display', DcheckInput);
      //       log.stateType = this_.checkType();
      //     },
      //     'click .Initial': function toggleCheckboxI() {
      //       const IcheckedInput = (<HTMLInputElement>document.getElementById('Initial')).checked ? 3 : 2;
      //       cellModel.attr('.outer/stroke-width', IcheckedInput);
      //       log.stateType = this_.checkType();
      //     },
      //     'click .Final': function toggleCheckboxF() {
      //       const FcheckedInput = (<HTMLInputElement>document.getElementById('Final')).checked ? 2 : 0;
      //       cellModel.attr('.inner/stroke-width', FcheckedInput);
      //       log.stateType = this_.checkType();
      //     },
      //   };
      //   const popupContent = ['<form>', Dcheckbox, Icheckbox, Fcheckbox, '</form>'].join('');
      //   popupGenerator(this.el, popupContent, popupEvents).render();
      // });
      // if ( hasStates) {
      //   halo.addHandle({
      //     name: 'suppress', icon: 'assets/SVG/supressHalo.svg', attrs: {
      //       '.slice': {
      //         'data-tooltip-class-name': 'small',
      //         'data-tooltip': 'Suppress',
      //         'data-tooltip-position': 'bottom',
      //         'data-tooltip-padding': 15,
      //       }
      //     }
      //   });
      // }
      halo.on("action:suppress:pointerdown", function () {
        (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().getOpmModel().logForUndo(this_.getVisual().logicalElement.text + " state suppression");
        (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().graph.startBatch("statesSuppression");
        this_.suppressAction(this_.getVisual(), options);
        halo.toggleState("default");
        curentObject.redrawDuplicationMark(options);
        curentObject.greyOutEntity();
        Links_OrXorArcs /* .Arc */.l.redrawAllArcs(curentObject, options, true);
        curentObject.shiftEmbeddedToEdge(options);
        (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)().graph.stopBatch("statesSuppression");
      });
      halo.on("action:timeDurationFunction:pointerdown", function () {
        this_.openTimeDuration(options.paper.findViewByModel(this_).el, this_.getVisual().logicalElement.getDurationManager(), {
          digits: options.oplService.settings.timeDurationUnitsDigits
        });
        this.remove();
      });
    }
    pointerDownHandle(cellView, init) {
      super.pointerDownHandle(cellView, init);
      this.getParent().previousStatesOrder = this.getParent().getStatesOnly().map(st => st.id);
    }
    pointerUpHandle(cellView, init) {
      if (!this.getVisual()) {
        return;
      }
      super.pointerUpHandle(cellView, init);
      this.getParent().getVisual()?.updateLastStatesOrder();
      const changed = this.getParent().checkIfStatesOrderChanged();
      this.getParent().previousStatesOrder = [];
      if (!changed) {
        return;
      }
      this.getParent().syncStatesOrder(init, false);
    }
    updateShapeAttr(newValue) {
      this.attr(".inner", newValue);
      this.attr(".outer", newValue);
    }
    getShapeAttr() {
      return this.attr(".inner");
    }
    getShapeFillColor() {
      return this.attr(".inner/fill");
    }
    getShapeOutline() {
      return this.attr(".inner/stroke");
    }
    // change the first letter to lower case
    toggleFirstLetter(word) {
      return word.charAt(0).toLowerCase() + word.substring(1); // capitalizing the first letter of the word
    }
    toggleLetter(letter) {
      return letter.toLowerCase();
    }
    // after closing the text editor, need to update the value of the object if the state
    // is a value
    closeTextEditor(initRappid) {
      // super.closeTextEditor(initRappid);
      const parent = this.getParent();
      if (parent && parent.attr("value/valueType") !== ConfigurationOptions /* .valueType */._x.None) {
        parent.updateObjectValueType(initRappid, this.attr("text/textWrap/text"));
        parent.lastEnteredText = parent.attr("text/textWrap/text");
        // parent.setCursorToUnits(initRappid);
      }
    }
    getExhibitors() {
      const links = this.graph.getConnectedLinks(this, {
        inbound: true
      });
      const exibitors = [];
      for (const link of links) {
        if (link.attributes.name === "Exhibition-Characterization") {
          exibitors.push(link.getSource());
        }
      }
      return exibitors;
    }
    updateView(visual) {
      super.updateView(visual);
      this.setValidationView(visual);
    }
    setValidationView(visual) {
      const status = visual.getValidationView();
      this.attr("rect/fill", status.color || this.originalColor);
      this.attr(".inner/fill", status.color || this.originalColor);
      this.attr(".outer/fill", status.color || this.originalColor);
    }
    canBeSuppressed() {
      // Should be moved to the logica part...
      return !this.graph.getConnectedLinks(this).length;
    }
    updateDuplicationMarkFillColor(fillColor) {}
    updateDuplicationMarkBorderColor(fillColor) {}
    getIconsForHalo() {
      return Object.assign(super.getIconsForHalo(), {
        suppress: "assets/SVG/supressHalo.svg"
      }, {
        styling: "assets/SVG/styleElement.svg"
      }, {
        timeDurationFunction: "assets/SVG/timeDuration.svg"
      });
    }
    embedText() {
      const padding = 10;
      const fullText = String(this.attr("text/textWrap/text"));
      const attrs = {
        "font-size": this.attr("text/font-size")
      };
      const size = {
        width: this.get("size").width + 0,
        height: this.get("size").height + 0
      };
      let sizeToTest = {
        width: size.width - padding,
        height: size.height - padding
      };
      let brokenText = configuration_rappidEnviromentFunctionality_shared /* .joint */.FP.util.breakText(fullText, sizeToTest, attrs, {
        ellipsis: true
      });
      let changed = false;
      while (brokenText.endsWith("…") || brokenText === "") {
        // the text is bigger then the shape
        size.width = size.width + 10;
        size.height = size.height + 5;
        sizeToTest = {
          width: size.width - padding,
          height: size.height - padding
        };
        brokenText = configuration_rappidEnviromentFunctionality_shared /* .joint */.FP.util.breakText(fullText, sizeToTest, attrs, {
          ellipsis: true
        });
        changed = true;
      }
      this.manuallyResized = false;
      if (changed) {
        size.width += padding;
      }
      this.set("size", size);
    }
    updateTextView() {
      super.updateTextView();
      this.getParent().changeSizeHandle((0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)());
    }
    changeSizeHandle(initRappid, direction = null) {
      super.changeSizeHandle(initRappid, direction);
      this.updateURLArray();
    }
    getEssence() {
      return this.getParent().getEssence();
    }
    openTimeDuration(target, manager, params) {
      (0, TimeDurationPopup /* .openTimeDurationPopup */.s)(target, this, manager, params);
    }
    // public updateTextFromModel(logical) {
    //   this.getParent().changeSizeHandle(getInitRappidShared());
    // }
    isTimeDuration() {
      const init = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)();
      const visual = init.getOpmModel().getVisualElementById(this.id);
      if (visual) {
        return visual.logicalElement.isTimeDuration();
      } else {
        return false;
      }
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
  }

  /***/
}),
/***/64633: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    N: () => (/* binding */OpmThing)

  });

  class OpmThing extends OpmEntity /* .OpmEntity */.Q {
    constructor() {
      super();
      this.dashArrayValues = ["0", "10,5"];
      this.dashArrayKey = "stroke-dasharray";
      this.essenceValues = [{
        dx: this.getAxisEssence(),
        dy: this.getAxisEssence() * 2
      }, {
        dx: 0,
        dy: 0
      }];
      this.argsAtt = "/filter/args";
      this.isActive = true;
      this.menuOpen = false;
      this.set(this.thingAttributes());
      this.attr({
        text: {
          "font-weight": 600
        }
      });
      this.attr({
        value: {
          value: "None",
          valueType: ConfigurationOptions /* .valueType */._x.None,
          units: ""
        }
      });
      this.setEssence(opl_generation_opl_database /* .oplDefaultSettings */.iT.essence);
    }
    numberThing(val) {
      const counter = val ? val : this.getCounter();
      let thisText = this.attributes.attrs.text.textWrap.text;
      thisText = this.getNumberedText(thisText, counter);
      this.attr({
        text: {
          textWrap: {
            text: thisText
          }
        }
      });
    }
    thingShape() {
      return {
        filter: {
          name: "dropShadow",
          args: {
            ...this.essenceValues[opl_generation_opl_database /* .oplDefaultSettings */.iT.essence],
            ...{
              blur: 0,
              color: "grey"
            }
          }
        },
        [this.dashArrayKey]: this.dashArrayValues[opl_generation_opl_database /* .oplDefaultSettings */.iT.affiliation],
        width: 10,
        height: 10
      };
    }
    thingAttributes() {
      return {
        minSize: {
          width: 135,
          height: 60
        },
        statesWidthPadding: 0,
        statesHeightPadding: 0
        //essense: 1,
      };
    }
    CanBeComputational() {
      return this.getVisual().CanBeComputational();
    }
    getThingParams() {
      const essence = this.attr(this.getShape() + this.argsAtt);
      const params = {
        essence: essence.dx === this.essenceValues[1].dx && essence.dy === this.essenceValues[1].dy ? ConfigurationOptions /* .Essence */.tg.Informatical : ConfigurationOptions /* .Essence */.tg.Physical,
        affiliation: this.getShapeAttr()[this.dashArrayKey] === this.dashArrayValues[0] ? ConfigurationOptions /* .Affiliation */.n9.Systemic : ConfigurationOptions /* .Affiliation */.n9.Environmental
      };
      return {
        ...super.getEntityParams(),
        ...params
      };
    }
    getAffiliation() {
      if (this.getShapeAttr()[this.dashArrayKey] === this.dashArrayValues[0]) {
        return ConfigurationOptions /* .Affiliation */.n9.Systemic;
      } else {
        return ConfigurationOptions /* .Affiliation */.n9.Environmental;
      }
    }
    getAxisEssence() {
      return 3;
    }
    updateThingFromOpmModel(visualElement) {
      const essenceArgs = {
        ...this.essenceValues[visualElement.logicalElement.essence],
        ...{
          blur: 0,
          color: "grey"
        }
      };
      // const essenceArgs = visualElement.logicalElement.essence ? { dx: 0, dy: 0, blur: 0, color: 'grey' } : {
      //   dx: 3,
      //   dy: 5,
      //   blur: 0,
      //   color: 'grey'
      // };
      //  const affiliation = visualElement.logicalElement.affiliation ? '10,5' : '0';
      return {
        filter: {
          name: "dropShadow",
          args: essenceArgs
        },
        // 'stroke-dasharray': affiliation,
        [this.dashArrayKey]: this.dashArrayValues[visualElement.logicalElement.affiliation]
      };
    }
    // Function gets cell and update the default configuration in the all fields that embeded cells arrangement used.
    arrangeEmbededParams(refX, refY, alignX, alignY, arrangeState, stateWidthPadding, statesHeightPadding) {
      this.attr({
        text: {
          "ref-x": refX
        }
      });
      this.attr({
        text: {
          "ref-y": refY
        }
      });
      this.attr({
        text: {
          "x-alignment": alignX
        }
      });
      this.attr({
        text: {
          "y-alignment": alignY
        }
      });
      this.attr({
        statesArrange: arrangeState
      });
      this.set("statesWidthPadding", stateWidthPadding);
      this.set("statesHeightPadding", statesHeightPadding);
    }
    updateSizePositionToFitEmbeded(includeSemiFolded = false, calledByChild = false) {
      const leftSideX = this.getBBox().origin().x;
      const topSideY = this.getBBox().origin().y;
      const rightSideX = this.getBBox().corner().x;
      const bottomSideY = this.getBBox().corner().y;
      const newDimensions = this.getNewDimensions(leftSideX, topSideY, rightSideX, bottomSideY, includeSemiFolded);
      if (!calledByChild) {
        this.keepChildrenPositionByPosition((0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)());
      }
      // a block of code that shouldn't be followed by any event
      this.graph.startBatch("ignoreEvents");
      if (calledByChild) {
        this.set({
          position: {
            x: newDimensions.leftSideX,
            y: newDimensions.topSideY
          }
        });
        this.set({
          size: {
            width: newDimensions.rightSideX - newDimensions.leftSideX,
            height: newDimensions.bottomSideY - newDimensions.topSideY
          }
        });
      }
      if (this.get("duplicationMark")) {
        this.redrawDuplicationMark((0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)());
      }
      this.graph.stopBatch("ignoreEvents");
    }
    // function called from changeSize event and checks only case of changing
    // size from right or bottom sides. when changing size from left or top
    // the position is change as well and therefore these cases will be handled in
    // changePosition event
    updateSizeToFitEmbeded() {
      const rightSideX = this.getBBox().corner().x;
      const bottomSideY = this.getBBox().corner().y;
      const leftSideX = this.getBBox().origin().x;
      const topSideY = this.getBBox().origin().y;
      let restoreSize = false;
      let restorePosition = false;
      configuration_rappidEnviromentFunctionality_shared._.each(this.getEmbeddedCells(), function (child) {
        const childBbox = child.getBBox();
        // Updating the new size of the thing to have margins
        // of at least paddingObject so that the embedded entity will not touch the thing
        if (childBbox.corner().x > rightSideX - configuration_rappidEnviromentFunctionality_shared /* .paddingObject */.RE + 1) {
          restoreSize = true;
        }
        if (childBbox.corner().y > bottomSideY - configuration_rappidEnviromentFunctionality_shared /* .paddingObject */.RE + 1) {
          restoreSize = true;
        }
        if (childBbox.origin().x < leftSideX + configuration_rappidEnviromentFunctionality_shared /* .paddingObject */.RE - 1) {
          restorePosition = true;
        }
        if (childBbox.corner().y < topSideY + configuration_rappidEnviromentFunctionality_shared /* .paddingObject */.RE - 1) {
          restorePosition = true;
        }
      });
      this.graph.startBatch("ignoreEvents");
      if (restoreSize) {
        this.set({
          size: this.previousAttributes().size
        });
      }
      if (restoreSize || !restorePosition) {
        this.graph.stopBatch("changeSize");
      }
      this.graph.stopBatch("ignoreEvents");
    }
    // Function updatePositionToFitEmbeded Update the position and size
    // of the object so that no embedded cell will not exceed the father border
    // from left and top with padding of 10p.
    updatePositionToFitEmbeded() {
      let leftSideX = this.getBBox().origin().x;
      let topSideY = this.getBBox().origin().y;
      let restorePosition = false;
      configuration_rappidEnviromentFunctionality_shared._.each(this.getEmbeddedCells(), function (child) {
        const childBbox = child.getBBox();
        if (childBbox.x < leftSideX + configuration_rappidEnviromentFunctionality_shared /* .paddingObject */.RE - 1) {
          restorePosition = true;
        }
        if (childBbox.y < topSideY + configuration_rappidEnviromentFunctionality_shared /* .paddingObject */.RE - 1) {
          restorePosition = true;
        }
      });
      if (restorePosition) {
        this.graph.startBatch("ignoreEvents");
        const position = this.previousAttributes().position;
        this.set({
          position: position
        });
        this.graph.stopBatch("ignoreEvents");
      }
    }
    addHandle(options, greyEntity) {
      super.addHandle(options, greyEntity);
    }
    pointerDownHandle(cellView, options) {
      super.pointerDownHandle(cellView, options);
      // Gal : If the thing has embedded cells in it with arcs we need to make them transparent when the thing moves
      const embedded = this.getEmbeddedCells();
      for (let i = 0; i < embedded.length; i++) {
        Links_OrXorArcs /* .Arc */.l.makeThingArcsTransparent(embedded[i], options, true);
        if (embedded[i].removeDuplicationMark) {
          embedded[i].removeDuplicationMark();
        }
      }
      const duplicationMarkCell = options.graph.getCell(this.id);
      if (duplicationMarkCell) {
        duplicationMarkCell.removeDuplicationMark();
      }
    }
    pointerUpHandle(cellView, options) {
      super.pointerUpHandle(cellView, options);
      const elementsUnder = options.graph.findModelsUnderElement(this, {
        searchBy: "center"
      }).filter(dr => configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnThing(dr)).map(dr => dr.getVisual());
      if (this.lastPosition && !this.getParent() && elementsUnder.find(vis => vis.getRefineeInzoom()?.id === vis.id)) {
        this.set("position", this.lastPosition);
        const elementsUnderPrevPos = options.graph.findModelsUnderElement(this, {
          searchBy: "center"
        }).filter(dr => configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnThing(dr)).map(dr => dr.getVisual());
        const intersectThingCell = options.graph.getCell(elementsUnderPrevPos.find(vis => vis.getRefineeInzoom()?.id === vis.id));
        if (intersectThingCell) {
          this.set("position", {
            x: this.lastPosition.x,
            y: intersectThingCell.get("position").y - 100
          });
        }
        (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)("An external thing should not overlap an in-zoomed thing. To insert a thing into an in-zoomed thing (to contain it), drag the thing from the Draggable OPM Things module.", 5000, "warning");
      }
      // Gal : If the thing has embedded cells with arcs we need to redraw them in the new position
      const embedded = this.getEmbeddedCells();
      for (let i = 0; i < embedded.length; i++) {
        Links_OrXorArcs /* .Arc */.l.redrawAllArcs(embedded[i], options, true);
        if (embedded[i].attributes.type !== "opm.State") {
          this.addDuplicationMarkToThisElement(embedded[i], options);
        }
      }
      this.addDuplicationMarkToThisElement(this, options);
    }
    addDuplicationMarkToThisElement(thing, options) {
      // const myOPD = options.opmModel.getOpdByThingId(thing.id);
      const myOPD = options.opmModel.currentOpd;
      let duplicates;
      let dupls;
      const dpls = new Array();
      try {
        duplicates = options.opmModel.currentOpd.visualElements.find(v => v.id === thing.id);
        dupls = duplicates.logicalElement.visualElements.filter(v => options.opmModel.getOpdByThingId(v.id) === myOPD && v.isFoldedUnderThing().isFolded === false);
        dupls.forEach(value => {
          if (!dpls.some(x => x.id === value.id)) {
            dpls.push(value);
          }
        });
      } catch (e) {
        return;
      }
      if (dpls.length > 1) {
        const duplicationMarkCell = options.graph.getCell(thing.id);
        if (duplicationMarkCell) {
          duplicationMarkCell.removeDuplicationMark();
        }
        const visualElement = options.opmModel.getVisualElementById(thing.id);
        if (visualElement) {
          this.addDuplicationMark(options, visualElement);
        }
      }
    }
    drawDuplicationMarkToAllDuplicatesInSameOPD(rappid) {
      const this_ = this;
      // const myOPD = rappid.opmModel.getOpdByThingId(this.id);
      const myOPD = rappid.opmModel.currentOpd;
      const duplicates = rappid.opmModel.currentOpd.visualElements.find(v => v.id === this_.id);
      if (!duplicates) {
        return;
      }
      const dupls = duplicates.logicalElement.visualElements.filter(v => rappid.opmModel.getOpdByThingId(v.id) === myOPD && v.isFoldedUnderThing().isFolded === false);
      // array without the same things twice
      const dpls = new Array();
      dupls.forEach(value => {
        if (!dpls.some(x => x.id === value.id)) {
          dpls.push(value);
        }
      });
      if (dpls.length > 1) {
        for (let i = 0; i < dpls.length; i++) {
          const currentElement = dpls[i];
          this.addDuplicationMarkToThisElement(currentElement, rappid);
        }
      }
    }
    addDuplicationMark(init, duplications, direction = null) {}
    removeDuplicationMarkWhenNoDuplicats(rappid) {
      const all = rappid.opmModel.currentOpd.visualElements;
      const myOpd = rappid.opmModel.currentOpd;
      for (let i = 0; i < all.length; i++) {
        if (!all[i].id) {
          continue;
        }
        const cellView = rappid.graph.getCell(all[i].id);
        if (!cellView) {
          continue;
        }
        const duplicationMark = cellView.get("duplicationMark");
        if (!duplicationMark) {
          continue;
        }
        const dupls = all[i].logicalElement.visualElements.filter(v => rappid.opmModel.getOpdByThingId(v.id) === myOpd);
        const dpls = new Array();
        dupls.forEach(value => {
          if (!dpls.some(x => x.id === value.id)) {
            dpls.push(value);
          }
        });
        if (dpls.length <= 1) {
          cellView.removeDuplicationMark();
        }
      }
    }
    updateDuplicationMarkBorderColor(borderColor) {
      const duplicationMark = this.get("duplicationMark");
      if (duplicationMark) {
        duplicationMark.attr("stroke", borderColor);
      }
    }
    updateDuplicationMarkFillColor(fillColor) {
      const duplicationMark = this.get("duplicationMark");
      if (duplicationMark) {
        duplicationMark.attr("fill", fillColor);
      }
    }
    toggleEssence(thing) {
      const model = thing.logicalElement.opmModel;
      const newEssence = this.getEssence() === ConfigurationOptions /* .Essence */.tg.Physical ? ConfigurationOptions /* .Essence */.tg.Informatical : ConfigurationOptions /* .Essence */.tg.Physical;
      const isLeagal = this.getVisual().isLegalEssence(newEssence);
      if (isLeagal.isLegal && newEssence === ConfigurationOptions /* .Essence */.tg.Informatical) {
        const links = thing.getAllLinks().outGoing.filter(l => l.type === ConfigurationOptions /* .linkType */.h6.Aggregation);
        if (links.find(lnk => [model_entities_enum /* .EntityType */.c.Process, model_entities_enum /* .EntityType */.c.Object].includes(lnk.target.type) && lnk.target.getEssence() === ConfigurationOptions /* .Essence */.tg.Physical)) {
          let txt = "An informatical thing cannot consist of physical things.<br>";
          txt += "Please change " + this.attributes.attrs.text.textWrap.text + " physical parts to informatical at: ";
          const aggLinks = links.filter(lnk => [model_entities_enum /* .EntityType */.c.Process, model_entities_enum /* .EntityType */.c.Object].includes(lnk.target.type) && lnk.target.getEssence() === ConfigurationOptions /* .Essence */.tg.Physical);
          for (const lk of aggLinks) {
            txt += "<br>" + lk.target.logicalElement.getBareName() + " at " + model.getOpdByThingId(lk.target.id).getNumberedName();
          }
          (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)(txt, null, "Error");
          return;
        }
      }
      const ret = thing.toggleEssence();
      if (ret.changed) {
        this.updateSiblingsEssenceAndAffiliation(thing);
      } else {
        if (ret.reason) {
          (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)(ret.reason, 3500, "Error");
          return;
        }
        if (thing.logicalElement.getBelongsToStereotyped() && !thing.isComputational()) {
          (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)("A thing which originally came from a stereotype as non-computational cannot be changed to computational.", null, "Error");
        } else if (ret.value === ConfigurationOptions /* .Essence */.tg.Informatical) {
          const text = this.getVisual().logicalElement.getBareName() + " can't be physical.";
          (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)(text, null, "Error");
        } else if (ret.value === ConfigurationOptions /* .Essence */.tg.Physical) {
          const text = this.getVisual().logicalElement.getBareName() + " can't be informatical.";
          (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)(text, null, "Error");
        }
      }
    }
    updateSiblingsEssenceAndAffiliation(visual) {
      for (const v of visual.logicalElement.opmModel.currentOpd.visualElements) {
        if (v.logicalElement === visual.logicalElement) {
          const cell = this.graph.getCell(v.id);
          cell.setEssence(visual.getEssence());
          cell.setAffiliation(visual.getAffiliation());
        }
      }
    }
    setEssence(essence) {
      this.attr(this.getShape() + this.argsAtt, this.essenceValues[essence]);
    }
    toggleAffiliation(thing) {
      const ret = thing.toggleAffiliation();
      if (ret.changed) {
        this.updateSiblings(thing, (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)());
      } else {
        if (ret.reason) {
          (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)(ret.reason, 3500, "Error");
          return;
        }
        if (ret.value === ConfigurationOptions /* .Affiliation */.n9.Environmental) {
          const text = this.attributes.attrs.text.textWrap.text + " can't be systemic.";
          (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)(text, null, "Error");
        }
        if (ret.value === ConfigurationOptions /* .Affiliation */.n9.Systemic) {
          const text = this.attributes.attrs.text.textWrap.text + " can't be environmental.";
          (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)(text, null, "Error");
        }
      }
    }
    setAffiliation(affiliation) {
      this.attr(this.getShape(), {
        [this.dashArrayKey]: this.dashArrayValues[affiliation]
      });
    }
    haloConfiguration(halo, options) {
      super.haloConfiguration(halo, options);
      this.initializeHaloForComplexityManagement(halo, options);
    }
    display(msg) {}
    getCameraSvgTooltip() {
      const visual = this.getVisual();
      if (visual.semiFolded.length) {
        return "The image is unabled in semi-fold view";
      }
      if (visual.getRefineeInzoom() === visual) {
        return "The image view is unabled in inzoomed thing";
      }
      return "Toggle Image/Text, Right Click to Edit";
    }
    getCameraSvgIcon(xPos, yPos, shouldShowBackground) {
      if (shouldShowBackground) {
        return `<svg class="cameraSign" x=${xPos} y=${yPos} width="18" height="14" viewBox="0 0 30 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.5 3.5H28C29.1046 3.5 30 4.39543 30 5.5V19.5C30 21.1569 28.6569 22.5 27 22.5H3C1.34315 22.5 0 21.1569 0 19.5V6.5C0 4.84315 1.34315 3.5 3 3.5H8V2C8 0.895431 8.89543 0 10 0H19.5C20.6046 0 21.5 0.895431 21.5 2V3.5Z" fill="#5A6F8F"/>
        <circle cx="15" cy="13" r="7" fill="#F8F8F8"/>
        <circle cx="15" cy="13" r="4" fill="#5A6F8F"/>
        <path d="M22 7V5H25H28V7H22Z" fill="#F8F8F8"/>
        <title>${this.getCameraSvgTooltip()}</title>
    </svg>`;
      }
      return `<svg class="cameraSign" x=${xPos} y=${yPos} width="18" height="14" viewBox="0 0 30 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.5" d="M21.5 3.5H28C29.1046 3.5 30 4.39543 30 5.5V19.5C30 21.1569 28.6569 22.5 27 22.5H3C1.34315 22.5 0 21.1569 0 19.5V6.5C0 4.84315 1.34315 3.5 3 3.5H8V2C8 0.895431 8.89543 0 10 0H19.5C20.6046 0 21.5 0.895431 21.5 2V3.5Z" fill="#5A6F8F"/>
      <path opacity="0.5" d="M22 7V5H25H28V7H22Z" fill="#F8F8F8"/>
      <circle opacity="0.5" cx="15" cy="13" r="7" fill="#F8F8F8"/>
      <circle opacity="0.5" cx="15" cy="13" r="4" fill="#5A6F8F"/>
      <title>${this.getCameraSvgTooltip()}</title>
    </svg>`;
    }
    setBackgroundImage(url) {
      const visual = this.getVisual();
      const logical = this.getVisual().logicalElement;
      visual.showBackgroundImage = VisualPart_backgroundImageEnum /* .BackgroundImageState */.b.TEXTANDIMAGE;
      logical.setBackgroundImage(url);
      this.attr("image/xlinkHref", url);
      this.updateURLArray();
    }
    toggleBackgroundPhoto() {
      const visual = this.getVisual();
      if (visual.showBackgroundImage === undefined) {
        visual.showBackgroundImage = VisualPart_backgroundImageEnum /* .BackgroundImageState */.b.TEXTONLY;
      }
      if (visual.showBackgroundImage === VisualPart_backgroundImageEnum /* .BackgroundImageState */.b.IMAGEONLY) {
        visual.showBackgroundImage = VisualPart_backgroundImageEnum /* .BackgroundImageState */.b.TEXTANDIMAGE;
      } else if (visual.showBackgroundImage === VisualPart_backgroundImageEnum /* .BackgroundImageState */.b.TEXTANDIMAGE) {
        visual.showBackgroundImage = VisualPart_backgroundImageEnum /* .BackgroundImageState */.b.TEXTANDIMAGEFULL;
        (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)("Pay attention, you can control the text location using the styling section on the left side of the toolbar.", 5000);
      } else if (visual.showBackgroundImage === VisualPart_backgroundImageEnum /* .BackgroundImageState */.b.TEXTANDIMAGEFULL) {
        visual.showBackgroundImage = VisualPart_backgroundImageEnum /* .BackgroundImageState */.b.TEXTONLY;
      } else if (visual.showBackgroundImage === VisualPart_backgroundImageEnum /* .BackgroundImageState */.b.TEXTONLY) {
        visual.showBackgroundImage = VisualPart_backgroundImageEnum /* .BackgroundImageState */.b.IMAGEONLY;
      }
      this.updateURLArray();
    }
    hasBackgroundImage() {
      const logical = this.getVisual().logicalElement;
      return logical.getBackgroundImageUrl()?.length > 0 && logical.getBackgroundImageUrl() !== "assets/SVG/redx.png";
    }
    shouldShowBackgroundImage() {
      const visual = this.getVisual();
      if (!visual || visual.getRefineeInzoom() === visual || visual.semiFolded.length) {
        return false;
      }
      return [VisualPart_backgroundImageEnum /* .BackgroundImageState */.b.IMAGEONLY, VisualPart_backgroundImageEnum /* .BackgroundImageState */.b.TEXTANDIMAGE, VisualPart_backgroundImageEnum /* .BackgroundImageState */.b.TEXTANDIMAGEFULL].includes(visual.showBackgroundImage);
    }
    updateParentSizeAfterChildAddedRequirement(init) {
      if (this.getParent()) {
        init.opmModel.setShouldLogForUndoRedo(false, "updateSizeBecauseOfRequirement");
        this.getParent().updateSizePositionToFitEmbeded(true, true);
        init.opmModel.setShouldLogForUndoRedo(true, "updateSizeBecauseOfRequirement");
      }
    }
    addRequirement(init) {
      if (this.getVisual().logicalElement.visualElements.find(v => v.protectedFromBeingChangedBySubModel)) {
        (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)("Cannot add requirements to a thing the is shared with a sub model.", 5000, "Error");
        return;
      }
      init.opmModel.addRequirement(this.getVisual());
      const cellsIds = init.graph.getCells().map(c => c.id);
      init.graphService.renderGraph(init.opmModel.currentOpd);
      this.updateParentSizeAfterChildAddedRequirement(init);
      this.beautifyOpdAfterNewRequirementAdded(init, cellsIds);
    }
    beautifyOpdAfterNewRequirementAdded(init, cellsIds) {
      const newCells = init.graph.getCells().filter(c => !cellsIds.includes(c.id)).filter(cell => configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnThing(cell));
      if (newCells.length === 0) {
        return;
      }
      const cellsInNewArea = init.paper.findViewsInArea(init.graph.getCellsBBox(newCells).inflate(10, 10)).map(v => v.model).filter(cell => configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnThing(cell));
      init.opmModel.setShouldLogForUndoRedo(false, "beautifyOpdAfterNewRequirementAdded");
      init.getGraphService().beautifyThings(cellsInNewArea, newCells.map(cell => cell.id));
      for (const cl of newCells.filter(c => configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnObject(c))) {
        cl.shiftEmbeddedToEdge(init);
        // cl.getVisual().setParams(cl.getParams());
      }
      init.opmModel.setShouldLogForUndoRedo(true, "beautifyOpdAfterNewRequirementAdded");
    }
    toggleAttributesSet(init, shouldHideSetObject = false) {
      init.opmModel.toggleAttributesSet(this.getVisual(), shouldHideSetObject);
      init.graphService.renderGraph(init.opmModel.currentOpd);
      this.updateParentSizeAfterChildAddedRequirement(init);
    }
    hideSingleRequirement(init) {
      init.opmModel.hideSingleRequirement(this.getVisual());
      this.remove();
    }
    doubleClickHandle(cellView, evt, initRappid) {
      const logical = this.getVisual()?.logicalElement;
      if (logical.isSatisfiedRequirementSetObject() || logical.isSatisfiedRequirementObject()) {
        return;
      }
      super.doubleClickHandle(cellView, evt, initRappid);
    }
    convertBringConnectedSettings(init) {
      const ret = [];
      const settings = init.currentBringConnectedSettings || init.oplService.settings.bringConnectedSettings;
      if (settings.proceduralEnablers) {
        ret.push(Actions_BringConnectedOptionsInterface /* .BringConnectedTypes */.J.proceduralEnablers);
      }
      if (settings.proceduralTransformers) {
        ret.push(Actions_BringConnectedOptionsInterface /* .BringConnectedTypes */.J.proceduralTransformers);
      }
      if (settings.fundamentals) {
        ret.push(Actions_BringConnectedOptionsInterface /* .BringConnectedTypes */.J.fundamental);
      }
      if (settings.tagged) {
        ret.push(Actions_BringConnectedOptionsInterface /* .BringConnectedTypes */.J.tagged);
      }
      return ret;
    }
    bringAction(init) {
      const model = init.getOpmModel();
      if (this.getVisual() !== init.opmModel.currentOpd.visualElements.filter(v => v.logicalElement.lid === this.getVisual().logicalElement.lid)[0]) {
        (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)("Cannot bring connected things to a duplicated entity.", 5000, "Error");
        return;
      }
      model.logForUndo("bring connected things");
      const visuals = [...model.currentOpd.visualElements];
      model.bring(model.getVisualElementById(this.id), this.convertBringConnectedSettings(init), this.getDefaultStyleParams(init));
      init.getGraphService().renderGraph(init.opmModel.currentOpd, init);
      for (const cell of init.graph.getCells()) {
        if (cell instanceof OpmThing && cell.getVisual() && !visuals.includes(cell.getVisual())) {
          cell.shiftEmbeddedToEdge(init);
        }
      }
      const newRenderedCell = init.graph.getCell(this.id);
      if (newRenderedCell) {
        newRenderedCell.setFundamentalLinksAnchors();
      }
      for (const link of init.graph.getCells().filter(c => c.constructor.name.includes("Unidirectional"))) {
        if (link.isForkedLink()) {
          const vertices = link.vertices()?.length ? link.vertices() : [{
            x: (link.getSourcePoint().x + link.getTargetPoint().x) / 2,
            y: (link.getSourcePoint().y + link.getTargetPoint().y) / 2
          }];
          link.forkedLinkHandle(link, vertices);
        }
      }
      (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)("All known elements were connected", 5000, "Success");
    }
    setFundamentalLinksAnchors() {
      this.graph.getConnectedLinks(this, {
        outbound: true
      }).filter(l => configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnTriangle(l.getTargetElement())).forEach(link => {
        link.onChangedSource(link, {});
        link.getTargetElement().getBottomLinks().forEach(bLink => bLink.onChangedTarget(bLink, {}));
      });
      this.graph.getConnectedLinks(this, {
        inbound: true
      }).filter(l => configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnTriangle(l.getSourceElement())).forEach(link => {
        link.onChangedTarget(link, {});
        const upperLink = link.getMainUpperLink();
        upperLink.onChangedSource(upperLink, {});
      });
    }
    showRefineable(returnObject, init) {
      if (!returnObject) {
        return;
      }
      if (returnObject.isNewlyCreated) {
        init.getTreeView().createNewNode(returnObject.opd.id, returnObject.opd.parendId, undefined, true);
      } else {
        init.opdHierarchyRef.previousOpdId = init.opmModel.currentOpd.id;
      }
      init.getGraphService().renderGraph(returnObject.opd, init);
      init.opmModel.currentOpd = returnObject.opd;
      (0, configuration_rappidEnviromentFunctionality_shared /* .highlighSD */.it)(returnObject.opd.id, init);
    }
    getDefaultStyleParams(init) {
      return {
        process: {
          fill: init.oplService.settings.style?.process?.fill_color || init.oplService.getProcessStyleDefaultSettings().fill_color,
          border_color: init.oplService.settings.style?.process?.border_color || init.oplService.getProcessStyleDefaultSettings().border_color,
          font: init.oplService.settings.style?.process?.font || init.oplService.getProcessStyleDefaultSettings().font,
          font_size: init.oplService.settings.style?.process?.font_size || init.oplService.getProcessStyleDefaultSettings().font_size,
          text_color: init.oplService.settings.style?.process?.text_color || init.oplService.getProcessStyleDefaultSettings().text_color
        },
        object: {
          fill: init.oplService.settings.style?.object?.fill_color || init.oplService.getObjectStyleDefaultSettings().fill_color,
          border_color: init.oplService.settings.style?.object?.border_color || init.oplService.getObjectStyleDefaultSettings().border_color,
          font: init.oplService.settings.style?.object?.font || init.oplService.getObjectStyleDefaultSettings().font,
          font_size: init.oplService.settings.style?.object?.font_size || init.oplService.getObjectStyleDefaultSettings().font_size,
          text_color: init.oplService.settings.style?.object?.text_color || init.oplService.getObjectStyleDefaultSettings().text_color
        }
      };
    }
    inzoomAction(init, clean = false) {
      const model = init.getOpmModel();
      const currentOpdId = model.currentOpd.id;
      const visual = model.getVisualElementById(this.id);
      const ret = model.tryToInzoom(visual, this.getDefaultStyleParams(init), clean);
      if (ret.success === false) {
        (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)(ret.message, null, "Error");
        return;
      }
      init.opdHierarchyRef.previousOpdId = currentOpdId;
      this.showRefineable(ret, init);
      if (ret.isNewlyCreated === true) {
        init.graph.getCells().filter(cell => cell instanceof OpmThing && !cell.getVisual().isInzoomed() && !cell.getParentCell()).forEach(cl => {
          cl.set("size", cl.get("minSize"));
          cl.updateSizePositionToFitEmbeded();
        });
        const newRenderedCell = init.graph.getCell(this.id);
        if (newRenderedCell) {
          newRenderedCell.setFundamentalLinksAnchors();
        }
      }
      init.criticalChanges_.next(true);
    }
    inzoomInDiagramAction(init) {
      const model = init.getOpmModel();
      model.logForUndo("Inzoom In Diagram");
      model.setShouldLogForUndoRedo(false, "InzoomInDiagram");
      init.graph.startBatch("ignoreChange");
      const visual = this.getVisual();
      const ret = model.tryToInzoomInDiagram(visual);
      if (ret.success === false) {
        model.setShouldLogForUndoRedo(true, "InzoomInDiagram");
        if (init.graph.hasActiveBatch("ignoreEvents")) {
          init.graph.stopBatch("ignoreEvents");
        }
        return (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)(ret.message, null, "Error");
      }
      init.getGraphService().renderGraph(ret.opd, init);
      const updatedCell = init.graph.getCell(this.id);
      if (updatedCell && updatedCell.getParent()) {
        updatedCell.getParent().updateSizePositionToFitEmbeded();
      }
      model.setShouldLogForUndoRedo(true, "InzoomInDiagram");
      if (init.graph.hasActiveBatch("ignoreEvents")) {
        init.graph.stopBatch("ignoreEvents");
      }
      init.criticalChanges_.next(true);
    }
    unfoldAction(init, clean = false) {
      const visual = init.getOpmModel().getVisualElementById(this.id);
      const currentOpdId = init.getOpmModel().currentOpd.id;
      const ret = init.getOpmModel().canBeUnfold(visual, this.getDefaultStyleParams(init), clean);
      if (ret.success === false) {
        (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)(ret.message, null, "Error");
        return;
      }
      init.opdHierarchyRef.previousOpdId = currentOpdId;
      this.showRefineable(ret, init);
      if (ret.isNewlyCreated === true) {
        init.graph.getCells().filter(cell => cell instanceof OpmThing).forEach(cl => {
          // cl.set('size', cl.get('minSize'));
          cl.updateSizePositionToFitEmbeded();
          cl.shiftEmbeddedToEdge(init);
        });
        const refinee = visual.getRefineeUnfold();
        const refineeCell = init.graph.getCell(refinee?.id);
        if (refineeCell) {
          refineeCell.setFundamentalLinksAnchors();
        }
        init.graph.getCell(ret.opd.getUnfoldedThing()?.id)?.autosize(init);
      }
      init.criticalChanges_.next(true);
    }
    unfold(init, thingID, unfoldingOptions) {
      if (!this.checkIfUnfold(init)) {
        return init.opmModel.unfold(thingID, unfoldingOptions);
      }
    }
    checkIfUnfold(init) {
      return init.getOpmModel().isUnfolded(init);
    }
    removeHandle(options) {
      super.removeHandle(options);
      this.removeDuplicationMark();
      this.removeDuplicationMarkWhenNoDuplicats(options);
    }
    keepChildrenPositionBySize(initRappid) {
      const thisPos = this.get("position");
      const thisSize = this.get("size");
      const oldSize = this.previousAttributes().size;
      const bbox = this.getBBox();
      const shape = configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnProcess(this) ? configuration_rappidEnviromentFunctionality_shared /* .joint */.FP.g.ellipse.fromRect(bbox) : configuration_rappidEnviromentFunctionality_shared /* .joint */.FP.g.Rect(bbox.x, bbox.y, bbox.width, bbox.height);
      let embds = this.getEmbeddedCells().filter(cld => !cld.constructor.name.includes("Semi"));
      for (const child of embds) {
        const childBbox = child.getBBox();
        if (!shape.containsPoint(childBbox.topRight()) || !shape.containsPoint(childBbox.bottomLeft()) || !shape.containsPoint(childBbox.origin()) || !shape.containsPoint(childBbox.corner())) {
          if (thisSize.width < oldSize.width || thisSize.height < oldSize.height) {
            this.graph.startBatch("ignoreEvents");
            this.set("size", oldSize);
            this.graph.stopBatch("ignoreEvents");
            return;
          }
        }
      }
      for (const cell of this.getEmbeddedCells({
        deep: true
      }).filter(c => configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnThing(c))) {
        const cellPos = cell.get("position");
        const cellSize = cell.get("size");
        const relativeX = (cellPos.x - thisPos.x + cellSize.width / 2) / oldSize.width;
        const relativeY = (cellPos.y - thisPos.y + cellSize.height / 2) / oldSize.height;
        const newXPos = relativeX * thisSize.width + thisPos.x - cellSize.width / 2;
        const newYPos = relativeY * thisSize.height + thisPos.y - cellSize.height / 2;
        this.graph.startBatch("ignoreEvents");
        cell.set("position", {
          x: newXPos,
          y: newYPos
        });
        if (configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnThing(cell)) {
          cell.shiftEmbeddedToEdge(initRappid);
        }
        this.graph.stopBatch("ignoreEvents");
      }
    }
    keepChildrenPositionByPosition(initRappid) {
      const thisPos = this.get("position");
      const thisSize = this.get("size");
      const oldPos = this.previousAttributes().position;
      for (const cell of this.getEmbeddedCells({
        deep: true
      }).filter(c => configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnThing(c))) {
        const cellPos = cell.get("position");
        const cellSize = cell.get("size");
        const relativeX = (cellPos.x - oldPos.x + cellSize.width / 2) / thisSize.width;
        const relativeY = (cellPos.y - oldPos.y + cellSize.height / 2) / thisSize.height;
        const newXPos = relativeX * thisSize.width + thisPos.x - cellSize.width / 2;
        const newYPos = relativeY * thisSize.height + thisPos.y - cellSize.height / 2;
        this.graph.startBatch("ignoreEvents");
        cell.set("position", {
          x: newXPos,
          y: newYPos
        });
        if (configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnThing(cell)) {
          cell.shiftEmbeddedToEdge(initRappid);
        }
        this.graph.stopBatch("ignoreEvents");
      }
    }
    changeSizeHandle(initRappid, direction = null) {
      super.changeSizeHandle(initRappid, direction);
      this.keepChildrenPositionBySize(initRappid);
      const embedded = this.getEmbeddedCells();
      for (let i = 0; i < embedded.length; i++) {
        Links_OrXorArcs /* .Arc */.l.redrawAllArcs(embedded[i], initRappid, true);
      }
      if (this.get("duplicationMark")) {
        this.redrawDuplicationMark(initRappid);
      }
      if (this.getParent() && this.getParent().get("duplicationMark")) {
        this.getParent().redrawDuplicationMark(initRappid);
      }
      embedded.filter(sm => sm.constructor.name.includes("Semi")).forEach(semi => semi.updateSize(initRappid));
    }
    initializeHaloForComplexityManagement(halo, init) {
      const this_ = this;
      halo.on(`action:inzoom:pointerdown`, function () {
        this_.inzoomAction(init);
      });
      halo.on("action:ShowInZoom:pointerdown", function () {
        this_.inzoomAction(init);
      });
      halo.on("action:unfold:pointerdown", function () {
        this_.unfoldAction(init);
      });
      halo.on("action:ShowUnfold:pointerdown", function () {
        this_.unfoldAction(init);
      });
      halo.on("action:addConnected:pointerdown", function () {
        this_.bringAction(init);
      });
      halo.on("action:computation:pointerdown", function () {
        this_.graph.startBatch("computationAdd");
        this_.computation(init.paper.findViewByModel(this_).el, init);
        this_.graph.stopBatch("computationAdd");
        this.remove();
      });
      halo.on("action:timeDurationFunction:pointerdown", function () {
        this_.openTimeDuration(init.paper.findViewByModel(this_).el, init.opmModel.getVisualElementById(this_.id).logicalElement.getDurationManager(), {
          digits: init.oplService.settings.timeDurationUnitsDigits
        });
        this.remove();
      });
    }
    removeComputational(init) {}
    updateComputational(init) {}
    openTextEditor(cellView, initRappid, onFinish = () => {}) {
      if (this.getVisual().logicalElement.getBelongsToStereotyped()) {
        return;
      }
      super.openTextEditor(cellView, initRappid, onFinish);
    }
    createContentForUnfoldingOptions(icon, desc) {
      return "<img width=\"25\" height=\"20\" src=\"assets/icons/OPM_Links/" + icon + "\" ></img><span> " + desc + "</span><br>";
    }
    // Generic function for ContextToolbar creation
    createContextToolbar(actions, contents, target) {
      const tools = [];
      actions.forEach((action, index) => {
        tools.push({
          action: action,
          content: contents[index]
        });
      });
      return new configuration_rappidEnviromentFunctionality_shared /* .joint */.FP.ui.ContextToolbar({
        theme: "modern",
        tools: tools,
        target: target,
        autoClose: true,
        padding: 30
      });
    }
    createContextToolbarForComplexityOpts(halo, options = null) {
      const isInZoomed = options.opmModel.isInzoomed(this.id) ? "Show In-Zoomed" : "<button><svg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M20 0C31.0457 0 40 8.9543 40 20C40 31.0457 31.0457 40 20 40C8.9543 40 0 31.0457 0 20C0 8.9543 8.9543 0 20 0Z\" fill=\"#1A3763\" fill-opacity=\"0.8\"/>\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M32 20C32 25.2448 26.9277 30 20 30C13.0723 30 8 25.2448 8 20C8 14.7552 13.0723 10 20 10C26.9277 10 32 14.7552 32 20ZM34 20C34 26.6274 27.7319 32 20 32C12.2681 32 6 26.6274 6 20C6 13.3726 12.2681 8 20 8C27.7319 8 34 13.3726 34 20ZM17 12.9V15.2999C17 15.7418 17.4478 16.1 18 16.1H22C22.5522 16.1 23 15.7418 23 15.2999V12.9C23 12.4581 22.5522 12.1 22 12.1H18C17.4478 12.1 17 12.4581 17 12.9ZM18 18C17.4478 18 17 18.3582 17 18.7999V21.2C17 21.6417 17.4478 22 18 22H22C22.5522 22 23 21.6417 23 21.2V18.7999C23 18.3582 22.5522 18 22 18H18ZM17 27.2V24.7999C17 24.3582 17.4478 24 18 24H22C22.5522 24 23 24.3582 23 24.7999V27.2C23 27.6417 22.5522 28 22 28H18C17.4478 28 17 27.6417 17 27.2Z\" fill=\"white\"/>\n</svg>\n</button>";
      const isUnfolded = options.opmModel.isUnfolded(this.id) ? "Show Unfolded" : "Unfold";
      console.log(isUnfolded);
      return this.createContextToolbar(["In-Zoom", "Unfold"], [isInZoomed, isUnfolded], halo.el);
    }
    getConfigurationTools(initRappid) {
      const thingToolsArray = [{
        action: "bring",
        content: "Add Connected Things"
      }, {
        action: "value",
        content: "value"
      }, {
        action: "Affiliation",
        content: "<img src=" + this.getImageAffiliation() + " width=\"85\" height=\"25\">"
      }, {
        action: "essence",
        content: "<img src=" + this.getImageEssnce() + " width=\"85\" height=\"25\">"
      }];
      if (initRappid.opmModel.getVisualElementById(this.id).refineeInzooming !== undefined || initRappid.opmModel.getVisualElementById(this.id).refineable !== undefined) {
        thingToolsArray.splice(1, 1);
      }
      return super.getConfigurationTools(initRappid).concat(thingToolsArray);
    }
    configurationContextToolbarEvents(target, contextToolbar, initRappid) {
      super.configurationContextToolbarEvents(target, contextToolbar, initRappid);
      const thisThing = this;
      contextToolbar.on("action:value", function () {
        this.remove();
        thisThing.computation(target, initRappid);
      });
      contextToolbar.on("action:essence", function () {
        const visualThing = initRappid.opmModel.getVisualElementById(thisThing.get("id"));
        thisThing.toggleEssence(visualThing);
        this.remove();
      });
      contextToolbar.on("action:Affiliation", function () {
        const visualThing = initRappid.opmModel.getVisualElementById(thisThing.get("id"));
        thisThing.toggleAffiliation(visualThing);
        thisThing.toggleAffiliation(visualThing);
        this.remove();
      });
      contextToolbar.on("action:bring", function () {
        thisThing.bringAction(initRappid);
        this.remove();
      });
    }
    // createContextToolbarForUnfolding(halo, options, ctxThis) {
    //   const thisProcess = this;
    //   const cellModel = halo.options.cellView.model;
    //   let thingID = halo.options.cellView.model.id;
    //   if (options.opmModel.isUnfolded(thingID)) {
    //     ctxThis.remove();
    //     let unfoldedID = options.opmModel.getRefineeUnfoldingID(thingID);
    //     options.graphService.renderGraph(options.opmModel.getOpdByThingId(unfoldedID), options);
    //     options.opmModel.setCurrentOpd(thingID);
    //     return;
    //   }
    //   // thisProcess.startProcessUnfolding(options, null);
    //   ctxThis.remove();
    //   if (1 == 1) return;
    //   const popup = new joint.ui.Popup({
    //     events: {
    //       'click .btn-unfold': function () {
    //         popup.remove();
    //         const unfoldingOptions = {
    //           'Aggregation-Participation': this.$('.btn-c1')[0].checked,
    //           'Exhibition-Characterization-Attributes': this.$('.btn-c2')[0].checked,
    //           'Exhibition-Characterization-Operations': this.$('.btn-c3')[0].checked,
    //           'Generalization-Specialization': this.$('.btn-c4')[0].checked,
    //           'Classification-Instantiation': this.$('.btn-c5')[0].checked
    //         };
    //         thisProcess.startProcessUnfolding(options, unfoldingOptions);
    //       },
    //     },
    //     content: [
    //       '<div>',
    //       '<input type="checkbox" name="structural"  class="btn-c1">' + this.createContentForUnfoldingOptions('StructuralAgg.png', 'Parts') + '<br>',
    //       '<input type="checkbox" name="structural"  class="btn-c2">' + this.createContentForUnfoldingOptions('StructuralExhibit.png', 'Attributes') + '<br>',
    //       '<input type="checkbox" name="structural"  class="btn-c3">' + this.createContentForUnfoldingOptions('StructuralExhibit.png', 'Operations') + '<br>',
    //       '<input type="checkbox" name="structural"  class="btn-c4">' + this.createContentForUnfoldingOptions('StructuralGeneral.png', 'Specializations') + '<br>',
    //       '<input type="checkbox" name="structural"  class="btn-c5">' + this.createContentForUnfoldingOptions('StructuralSpecify.png', 'Instances') + '<br>',
    //       '<center><button class="btn-unfold" style="text-align:center">Unfold</button></center>',
    //       '</div>'
    //     ].join(''),
    //     target: halo.el,
    //     padding: 30,
    //   });
    //   ctxThis.remove();
    //   popup.render();
    // }
    startProcessUnfolding(options, unfoldingOptions) {
      let thisProcess = this;
      let opd = thisProcess.unfold(options, thisProcess.id, unfoldingOptions); // new Ahmad
      options.treeViewService.createNewNode(opd.id, opd.parendId);
      options.graphService.renderGraph(opd, options);
      options.treeViewService.treeView.treeModel.getNodeById(opd.id).toggleActivated();
      options.treeViewService.treeView.treeModel.getNodeById(opd.id).parent.expand();
    }
    toggleFirstLetter(word) {
      return word.charAt(0).toUpperCase() + word.substring(1); // capitalizing the first letter of the word
    }
    toggleLetter(letter) {
      // if(letter === letter.toUpperCase()){
      return letter.toUpperCase();
      // }
      // return letter.toLowerCase();
    }
    getExhibitors() {
      const links = this.graph.getConnectedLinks(this, {
        inbound: true
      });
      const exibitors = [];
      for (const link of links) {
        if (link.attributes.name === "Exhibition-Characterization") {
          exibitors.push(link.getSource());
        }
      }
      return exibitors;
    }
    getInZoomedThings() {
      let NUM_OF_PIXELS = 5;
      const processList = [];
      const objectList = [];
      const objectdict = {};
      const processdict = {};
      try {
        const cells = this.getEmbeddedCells();
        for (const cell of cells) {
          let inside = false;
          if (cell.attributes.type === "opm.Object") {
            for (const loc of Object.keys(objectdict)) {
              if (Math.abs(cell.get("position").y - Number(loc)) < NUM_OF_PIXELS) {
                objectdict[loc].push(cell);
                inside = true;
                break;
              }
            }
            if (!inside) {
              objectdict[cell.get("position").y] = [cell];
            }
            /*const l = objectList.length;
            if (l===0){
              objectList.push([cell]);
            }else if (Math.abs(objectList[l-1][0].get('position').y-cell.get('position').y)<NUM_OF_PIXELS){
              objectList[l-1].push(cell);
            }else{
              objectList.push([cell]);
            }*/
          } else if (cell.attributes.type === "opm.Process") {
            /*const l = processList.length;
            if (l===0){
              processList.push([cell]);
            }else if (Math.abs(processList[l-1][0].get('position').y - cell.get('position').y)<NUM_OF_PIXELS){
              processList[l-1].push(cell);
            }else{
              processList.push([cell]);
            }*/
            for (const loc of Object.keys(processdict)) {
              if (Math.abs(cell.get("position").y - Number(loc)) < NUM_OF_PIXELS) {
                processdict[loc].push(cell);
                inside = true;
                break;
              }
            }
            if (!inside) {
              processdict[cell.get("position").y] = [cell];
            }
          }
        }
      } catch (e) {}
      for (const loc of Object.keys(objectdict).map(k => Number(k)).sort((a, b) => a > b ? 1 : -1)) {
        objectList.push(objectdict[loc]);
      }
      for (const loc of Object.keys(processdict).map(k => Number(k)).sort((a, b) => a > b ? 1 : -1)) {
        processList.push(processdict[loc]);
      }
      return [processList, objectList];
    }
    getUnfoldedThings() {
      const aggregation = {
        objectsAndStates: [],
        processes: []
      };
      const exhibition = {
        objectsAndStates: [],
        processes: []
      };
      const instantiation = {
        objectsAndStates: [],
        processes: []
      };
      const generalization = {
        objectsAndStates: [],
        processes: []
      };
      const visual = this.getVisual();
      const links = visual.getLinks().outGoing;
      for (const link of links) {
        let targetType;
        if (configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfVisualObject(link.target)) {
          targetType = "objectsAndStates";
        } else if (configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfVisualState(link.target)) {
          targetType = "objectsAndStates";
        } else {
          targetType = "processes";
        }
        if (link.type === ConfigurationOptions /* .linkType */.h6.Aggregation) {
          aggregation[targetType].push(link.target);
        } else if (link.type === ConfigurationOptions /* .linkType */.h6.Exhibition) {
          exhibition[targetType].push(link.target);
        } else if (link.type === ConfigurationOptions /* .linkType */.h6.Generalization) {
          generalization[targetType].push(link.target);
        } else if (link.type === ConfigurationOptions /* .linkType */.h6.Instantiation) {
          instantiation[targetType].push(link.target);
        }
      }
      const sortFunc = (a, b) => a.xPos - b.xPos;
      aggregation.objectsAndStates.sort(sortFunc);
      exhibition.objectsAndStates.sort(sortFunc);
      instantiation.objectsAndStates.sort(sortFunc);
      generalization.objectsAndStates.sort(sortFunc);
      aggregation.processes.sort(sortFunc);
      exhibition.processes.sort(sortFunc);
      instantiation.processes.sort(sortFunc);
      generalization.processes.sort(sortFunc);
      return {
        aggregation,
        exhibition,
        instantiation,
        generalization
      };
    }
    changeAttributesHandle(init) {
      super.changeAttributesHandle(init);
      /*
      const currentOpd = init.getOpmModel().currentOpd;
      const visualArr = init.getOpmModel().getLogicalElementByVisualId(this.id).visualElements.filter(visualsOnCurrentOpd => init.getOpmModel().getOpdByThingId(visualsOnCurrentOpd.id) === currentOpd);
      for (const visualInstance of visualArr) {
        if (this.graph.getCell(visualInstance.id).getEssence() !== this.getEssence()) {
          this.graph.getCell(visualInstance.id).setEssence(this.getEssence());
        }
        if (this.graph.getCell(visualInstance.id).getAffiliation() !== this.getAffiliation()) {
          this.graph.getCell(visualInstance.id).setAffiliation(this.getAffiliation());
        }
      }
      */
    }
    getIconsForHalo() {
      if (this.isComputational()) {
        return Object.assign(super.getIconsForHalo(), {
          addConnected: "assets/SVG/addConnected.svg"
        }, {
          computation: "assets/SVG/computation.svg"
        }, {
          deleteFunction: "assets/SVG/deleteFunction.svg"
        }, {
          simulation: "assets/SVG/sim.svg"
        }, {
          updateComputationalProcess: "assets/SVG/updateComputationalProcess.svg"
        });
      } else {
        return Object.assign(super.getIconsForHalo(), {
          inzoom: "assets/SVG/inzoom.svg"
        }, {
          ShowInZoom: "assets/SVG/inzoom.svg"
        }, {
          unfold: "assets/SVG/unfold.svg"
        }, {
          ShowUnfold: "assets/SVG/unfold.svg"
        }, {
          addConnected: "assets/SVG/addConnected.svg"
        }, {
          computation: "assets/SVG/computation.svg"
        });
      }
    }
    updateView(visual) {
      super.updateView(visual);
      this.setAffiliation(visual.getAffiliation());
      this.setEssence(visual.getEssence());
      this.updateStrokeWidth(visual);
      this.attr("text/ref-y", visual.refY);
    }
    updateStrokeWidth(visual) {
      let width = 2;
      if (visual.getRefineeInzoom() || visual.getRefineeUnfold() || visual.logicalElement.getStereotype()) {
        width = 4;
      }
      this.setStrokeWidth(width);
    }
    setStrokeWidth(width) {
      this.attr(this.getShape(), {
        "stroke-width": width
      });
    }
    isComputational() {
      return this.isComputational();
    }
    addSemifolded() {
      const init = (0, configuration_rappidEnviromentFunctionality_shared /* .getInitRappidShared */.Km)();
      init.getOpmModel().logForUndo("Semi-folding");
      init.getOpmModel().setShouldLogForUndoRedo(false, "OpmThing-addSemifolded");
      const ret = init.getOpmModel().foldInAllFundamentalRelations(this.getVisual());
      if (ret.success) {
        init.getGraphService().viewSemiFoldedUpdate(ret);
      }
      this.updateSizePositionToFitEmbeded(true);
      this.set("size", {
        width: this.getVisual().calculateMinWidth(),
        height: this.getVisual().calculateMinHeight()
      });
      this.shiftEmbeddedToEdge(configuration_rappidEnviromentFunctionality_shared /* .initRappidShared */.i1);
      init.getOpmModel().setShouldLogForUndoRedo(true, "OpmThing-addSemifolded");
    }
  }

  /***/
}),
/***/71026: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    s: () => (/* binding */openTimeDurationPopup)

  });

  let lastEnteredUnits;
  function openTimeDurationPopup(target, drawn, manager, params) {
    let selectContent = "<select id=\"selectUnits\" class=\"Units td-select value\">";
    const relevantUnits = [...LogicalPart_components_time_duration_units /* .TIME_DURATION_ISO_UNITS */.$c];
    const duration = manager.getTimeDuration();
    const normUnits = (0, LogicalPart_components_time_duration_units /* .normalizeDurationUnit */.KV)(duration.units);
    lastEnteredUnits = normUnits;
    const selectedIndex = relevantUnits.indexOf(normUnits);
    for (let k = 0; k < relevantUnits.length; k++) {
      const isSelected = selectedIndex === k ? " selected" : "";
      selectContent = selectContent + "<option value=" + relevantUnits[k];
      selectContent = selectContent + " title=\"" + relevantUnits[k] + "\"";
      selectContent = selectContent + isSelected + ">" + relevantUnits[k] + "</option>";
    }
    selectContent += "</select>";
    const dist = duration.durationDistributionKind || "none";
    const dp = duration.durationDistributionParams || {};
    const distSelect = `<select id="selectDistribution" class="distKind td-select"><option value="none"${dist === "none" ? " selected" : ""}>None</option><option value="normal"${dist === "normal" ? " selected" : ""}>Normal</option><option value="uniform"${dist === "uniform" ? " selected" : ""}>Uniform</option><option value="exponential"${dist === "exponential" ? " selected" : ""}>Exponential</option></select>`;
    const minVal = duration.min ?? "";
    const nomVal = duration.nominal ?? "";
    const maxVal = duration.max ?? "";
    const content = "<div class=\"time-duration-popup\"><label class=\"popupHeader\">Time Duration Parameters</label><table class=\"td-table\" role=\"presentation\"><tr><td class=\"td-label-cell\">Units</td><td class=\"td-value-cell\">" + selectContent + "</td></tr><tr><td class=\"td-label-cell\">Minimal</td><td class=\"td-value-cell\"><input type=\"number\" step=\"any\" class=\"min td-input\" value=\"" + minVal + "\"></td></tr><tr><td class=\"td-label-cell\">Nominal (expected)</td><td class=\"td-value-cell\"><input type=\"number\" step=\"any\" class=\"nominal td-input\" value=\"" + nomVal + "\"></td></tr><tr><td class=\"td-label-cell\">Maximal</td><td class=\"td-value-cell\"><input type=\"number\" step=\"any\" class=\"max td-input\" value=\"" + maxVal + "\"></td></tr></table><div class=\"td-divider\" aria-hidden=\"true\"></div><div class=\"td-section-title\">Distribution</div><table class=\"td-table\" role=\"presentation\"><tr><td class=\"td-label-cell\">Kind</td><td class=\"td-value-cell\">" + distSelect + "</td></tr></table><div class=\"distParamsNormal\" style=\"display:" + (dist === "normal" ? "block" : "none") + "\"><table class=\"td-table\" role=\"presentation\"><tr><td class=\"td-label-cell\">Mean</td><td class=\"td-value-cell\"><input type=\"number\" step=\"any\" class=\"dMean td-input td-input-sm\" value=\"" + (dp.mean ?? "") + "\"></td></tr><tr><td class=\"td-label-cell\">Sd</td><td class=\"td-value-cell\"><input type=\"number\" step=\"any\" class=\"dSd td-input td-input-sm\" value=\"" + (dp.sd ?? "") + "\"></td></tr></table></div><div class=\"distParamsUniform\" style=\"display:" + (dist === "uniform" ? "block" : "none") + "\"><table class=\"td-table\" role=\"presentation\"><tr><td class=\"td-label-cell\">a</td><td class=\"td-value-cell\"><input type=\"number\" step=\"any\" class=\"dA td-input td-input-sm\" value=\"" + (dp.a ?? "") + "\"></td></tr><tr><td class=\"td-label-cell\">b</td><td class=\"td-value-cell\"><input type=\"number\" step=\"any\" class=\"dB td-input td-input-sm\" value=\"" + (dp.b ?? "") + "\"></td></tr></table></div><div class=\"distParamsExponential\" style=\"display:" + (dist === "exponential" ? "block" : "none") + "\"><table class=\"td-table\" role=\"presentation\"><tr><td class=\"td-label-cell\">Lambda</td><td class=\"td-value-cell\"><input type=\"number\" step=\"any\" class=\"dLambda td-input td-input-sm\" value=\"" + (dp.lambda ?? "") + "\"></td></tr></table></div><button type=\"button\" class=\"Popup btnUpdate td-btn-update\">Update</button></div>";
    (0, configuration_rappidEnviromentFunctionality_shared /* .popupGenerator */.sk)(target, content, timeDurationEvents(drawn, manager, params)).render();
    (0, configuration_rappidEnviromentFunctionality_shared /* .stylePopup */.O0)();
  }
  function toggleDistPanels($root, kind) {
    $root.$(".distParamsNormal").css("display", kind === "normal" ? "block" : "none");
    $root.$(".distParamsUniform").css("display", kind === "uniform" ? "block" : "none");
    $root.$(".distParamsExponential").css("display", kind === "exponential" ? "block" : "none");
  }
  function timeDurationEvents(drawn, manager, params) {
    return {
      "click .btnUpdate": function () {
        manager.setDisplayParams({
          digitsAfterDot: params.digits
        });
        const kind = String(this.$("#selectDistribution").val() || "none");
        const distParams = {};
        if (kind === "normal") {
          distParams.mean = extractNumber(this.$(".dMean").val());
          distParams.sd = extractNumber(this.$(".dSd").val());
        } else if (kind === "uniform") {
          distParams.a = extractNumber(this.$(".dA").val());
          distParams.b = extractNumber(this.$(".dB").val());
        } else if (kind === "exponential") {
          distParams.lambda = extractNumber(this.$(".dLambda").val());
        }
        const args = {
          units: this.$(".Units").val(),
          min: extractNumber(this.$(".min").val()),
          nominal: extractNumber(this.$(".nominal").val()),
          max: extractNumber(this.$(".max").val()),
          durationDistributionKind: kind,
          durationDistributionParams: distParams
        };
        const ret = setTimeDurationParams(drawn, manager, args);
        if (ret) {
          this.remove();
          if (drawn && drawn.getLink2) {
            drawn.getLink2().addTimerIcon();
          }
        }
      },
      "change #selectUnits": function () {
        const new_units = this.$(".Units").val();
        this.$(".min")[0].value = clearValue(this.$(".min")[0].value, {
          old: lastEnteredUnits,
          new: new_units
        });
        this.$(".max")[0].value = clearValue(this.$(".max")[0].value, {
          old: lastEnteredUnits,
          new: new_units
        });
        this.$(".nominal")[0].value = clearValue(this.$(".nominal")[0].value, {
          old: lastEnteredUnits,
          new: new_units
        });
        lastEnteredUnits = new_units;
      },
      "change #selectDistribution": function () {
        const kind = String(this.$("#selectDistribution").val() || "none");
        toggleDistPanels(this, kind);
      }
    };
  }
  function extractNumber(val) {
    try {
      if (val == "") {
        return null;
      }
      let ret = null;
      if (val.includes("e")) {
        ret = Number(Number(val).toPrecision());
      } else {
        ret = Number(val);
      }
      return ret;
    } catch (err) {
      return null;
    }
  }
  function clearValue(val, units) {
    try {
      if (val) {
        return (0, configuration_rappidEnviromentFunctionality_shared /* .convert */.C6)(val).from((0, LogicalPart_components_time_duration_units /* .durationUnitToConvertKey */.Ab)(units.old)).to((0, LogicalPart_components_time_duration_units /* .durationUnitToConvertKey */.Ab)(units.new));
      }
      return "";
    } catch (err) {
      return "";
    }
  }
  function setTimeDurationParams(drawn, manager, args) {
    const ret = manager.setTimeDuration(args);
    if (ret.success === true && configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfDrawnEntity(drawn)) {
      drawn.updateTextView();
    } else {
      for (const msg of ret.messages) {
        (0, configuration_rappidEnviromentFunctionality_shared /* .validationAlert */.iW)(msg);
      }
    }
    return ret.success;
  }

  /***/
}),
/***/93375: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    D4: () => (/* binding */createUnitsPopUpContent),
    KD: () => (/* binding */UnitsPopup),
    Np: () => (/* binding */click_li_selection_function),
    Pt: () => (/* binding */unitsHtml)

  });

  function UnitsPopup(drawn, initRappid, onFinish = () => {}) {
    const view = initRappid.paper.findViewByModel(drawn);
    const visual = initRappid.opmModel.getVisualElementById(drawn.get("id"));
    const logical = visual.logicalElement;
    const popup = new configuration_rappidEnviromentFunctionality_shared /* .joint */.FP.ui.Popup({
      id: "units_popup",
      events: {
        keypress: function (event) {
          if (event.which == 13) {
            const new_val = this.$("#value").val();
            logical.units = new_val;
            drawn.attr({
              value: {
                units: logical.units
              }
            }); // TODO: Make this line have no effect.
            drawn.updateSiblings(visual, initRappid);
            popup.remove();
            onFinish();
          }
        },
        "input #value": function () {
          const value = this.$("#value").val();
          const select = this.$("ul");
          select.empty();
          select.html(unitsHtml(value));
        },
        "click .li-selection": click_li_selection_function,
        "click #update": function () {
          const new_val = this.$("#value").val();
          logical.units = new_val;
          drawn.attr({
            value: {
              units: logical.units
            }
          }); // TODO: Make this line have no effect.
          drawn.updateSiblings(visual, initRappid);
          popup.remove();
          onFinish();
        }
      },
      content: [createUnitsPopUpContent(logical.units, " Edit Units:")],
      target: view.el
    }).render();
    const fieldInput = popup.$("#value");
    const fldLength = fieldInput.val().length;
    fieldInput.focus();
    fieldInput[0].setSelectionRange(0, fldLength);
    (0, configuration_rappidEnviromentFunctionality_shared /* .stylePopup */.O0)();
  }
  // return the string that represents the units pop content template
  function createUnitsPopUpContent(value, header) {
    return "<div class=\"units-popup\">           <label class=\"popupHeader\">" + header + "</label>           <br>           <div>             <div class=\"dropdown\">               <div id=\"myDropdown\" class=\"dropdown-content\">                 <input type=\"text\" placeholder=\"Insert units\" id=\"value\" value=\"" + value + "\">                 <ul id=\"select\">" + unitsHtml(value) + "</ul>               </div>               <button id=\"update\" class=\"btnUpdate Popup\" style=\"margin-top: 6px;\">Update</button>             </div>           </div>          </div>";
  }
  // show all units options
  function unitsHtml(value) {
    const allUnits = (0, configuration_rappidEnviromentFunctionality_shared /* .convert */.C6)().possibilities();
    value = value ? value.toLowerCase() : "";
    let relevantUnits = allUnits.filter(unit => unit.toLowerCase().includes(value) || value === "");
    let html = "";
    for (let k = 0; k < relevantUnits.length; k++) {
      html = html + "<li class=\"li-selection\" data-value=\"" + relevantUnits[k] + "\"";
      html = html + " title=\"" + (0, configuration_rappidEnviromentFunctionality_shared /* .convert */.C6)().describe(relevantUnits[k]).singular + ", " + (0, configuration_rappidEnviromentFunctionality_shared /* .convert */.C6)().describe(relevantUnits[k]).measure + "\">";
      html = html + relevantUnits[k] + "</li>";
    }
    return html;
  }
  // handling choosing a unit
  function click_li_selection_function(event) {
    const value = $(event.target).data("value");
    this.$("#value").val(value);
    this.$("#value").focus();
    const select = this.$("ul");
    select.empty();
    select.html(unitsHtml(value));
  }

  /***/
}),
/***/811: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    Q: () => (/* binding */OpmFundamentalRelation)

  });

  class OpmFundamentalRelation extends OpmStructuralRelation /* .OpmStructuralRelation */.A {
    constructor(params, model, addToCurrentOPD = true) {
      super(params, model);
    }
    createVisual(params) {
      return new VisualPart_OpmFundamentalLink /* .OpmFundamentalLink */.s(params, this);
    }
    getParams() {
      const visualElementsParams = new Array();
      for (let i = 0; i < this.visualElements.length; i++) {
        visualElementsParams.push(this.visualElements[i].getParams());
      }
      const params = {
        visualElementsParams: visualElementsParams
      };
      return {
        ...super.getStructuredParams(),
        ...params
      };
    }
    getParamsFromJsonElement(jsonElement) {
      return super.getStructuralParamsFromJsonElement(jsonElement);
    }
    removeVisual(visual) {
      for (let i = this.visualElements.length - 1; i >= 0; i--) {
        if (this.visualElements[i] === visual) {
          this.visualElements.splice(i, 1);
          this.opmModel.removeElementFromOpds(visual);
          break;
        }
      }
    }
  }

  /***/
}),
/***/31119: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    s: () => (/* binding */OpmLogicalElement)

  });

  var uuid = jointjs__WEBPACK_IMPORTED_MODULE_0__ /* .uuid */.uR;
  let OpmLogicalElement = /*#__PURE__*/(() => {
    class OpmLogicalElement {
      static #_ = (() => this.objectText = "Object")();
      static #_2 = (() => this.processText = "Process")();
      static #_3 = (() => this.stateText = "State")();
      constructor(params, model) {
        this.name = "";
        this.visualElements = new Array();
        this.name = this.constructor.name;
        this.opmModel = model;
        // if (params)
        // this.updateParams(params);
        if (params && params.URLarray) {
          // if params and params._URLarray are exists
          this._URLarray = params.URLarray; // update opm model
        } else {
          // alocate a new arrey
          this._URLarray = new Array();
          // URL array has: Type(selection- video, picture, article ..), link and description.
          this._URLarray.push({
            iconType: "picture",
            url: "http://",
            description: " "
          });
        }
        this.createVisualOnInit(params);
      }
      createVisualOnInit(params) {
        const visual = this.createVisual(params);
        this.addVisual(visual);
        return visual;
      }
      generateId() {
        this.lid = uuid();
      }
      isLink() {
        return false;
      }
      add(opmVisualElement, addToCurrentOpd = true) {
        // USED ONLY FROM OPX
        // push only if not exist
        if (this.findVisualElement(opmVisualElement.id) === opmVisualElement) {
          console.log("prevented a visual from being created more than once.");
          return;
        }
        this.visualElements.push(opmVisualElement);
        opmVisualElement.pointToFather(this);
        if (addToCurrentOpd) {
          this.opmModel.currentOpd.add(opmVisualElement);
        }
      }
      addVisual(visual) {
        if (this.findVisualElement(visual.id)) {
          // If we remove this statement, models won't be loaded correctly.
          // TODO: Remove it after refactoring model load.
          this.remove(visual.id);
        }
        // TODO: Remove any
        this.visualElements.push(visual);
      }
      removeVisual(visual) {
        for (let i = this.visualElements.length - 1; i >= 0; i--) {
          if (this.visualElements[i] === visual) {
            this.visualElements.splice(i, 1);
          }
        }
      }
      remove(opmVisualElementId) {
        for (let i = this.visualElements.length - 1; i >= 0; i--) {
          if (this.visualElements[i].id === opmVisualElementId) {
            this.visualElements.splice(i, 1);
            const opd = this.opmModel.getOpdByThingId(opmVisualElementId);
            if (opd) {
              opd.remove(opmVisualElementId);
            }
            this.opmModel.currentOpd.remove(opmVisualElementId);
            break;
          }
        }
      }
      findVisualElement(id) {
        for (let k = 0; k < this.visualElements.length; k++) {
          if (this.visualElements[k].id === id) {
            return this.visualElements[k];
          }
        }
        return null;
      }
      updateParams(params) {
        if (params.lid) {
          this.lid = params.lid;
        }
        if (params && params._URLarray) {
          // if params and params._URLarray are exists
          this._URLarray = params.URLarray; // update database
        }
        if (params?.hasOwnProperty("belongsToFatherModelId")) {
          this.belongsToFatherModelId = params.belongsToFatherModelId;
        }
      }
      setParams(params) {}
      getElementParams() {
        return {
          name: this.name,
          lid: this.lid,
          URLarray: this.URLarray,
          // URL saving
          belongsToFatherModelId: this.belongsToFatherModelId
        };
      }
      get URLarray() {
        return this._URLarray;
      }
      set URLarray(arr) {
        this._URLarray = arr;
      }
      updateSourceAndTargetFromJson() {}
      removeFromFather() {}
      get alias() {
        return "";
      }
      // needed for computational part
      getName() {
        return this.name;
      }
      isAtOPD(opd) {
        const opds = [];
        for (const vis of this.visualElements) {
          opds.push(this.opmModel.getOpdByThingId(vis.id));
        }
        if (opds.indexOf(opd) === -1) {
          return false;
        }
        return true;
      }
      isBasicThing() {
        return false;
      }
      setReferencesFromJson(json, map) {}
      getElementParamsFromJsonElement(jsonElement) {
        const params = {
          belongsToFatherModelId: jsonElement.belongsToFatherModelId
        };
        return params;
      }
    }
    return OpmLogicalElement;
  })();

  /***/
}),
/***/43894: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    r: () => (/* binding */OpmLogicalEntity)
  });
