// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/DrawnPart/OpmEntityRappid.ts
// Extracted by opm-extracted/tools/extract.mjs

  const OpmEntityRappidDefinition = {
    defaults: shared._.defaultsDeep({}, joint.shapes.basic.Generic.prototype.defaults)
  };
  class OpmEntityRappid extends joint.dia.Element.extend(OpmEntityRappidDefinition) {
    getVisual() {
      return (0, getInitRappidShared)().getOpmModel().getVisualElementById(this.id);
    }
    longTouchHandle(cellView, options) {}
    getDefaultStyleParams(init) {
      return null;
    }
    pointerUpHandle(cellView, options) {
      if (cellView && !options.selection.collection.contains(cellView.model) && !options.isReadOnlyOpd()) {
        options.graph.startBatch("free-transform");
        new joint.ui.FreeTransform({
          cellView: cellView,
          allowRotation: false,
          preserveAspectRatio: false,
          allowOrthogonalResize: true
        }).render();
        const visual = options.getOpmModel().getVisualElementById(this.id);
        const commands = this.getHaloHandles(options);
        const halo = new HaloConfiguration(cellView, commands);
        if (!options.opmModel.currentOpd.requirementViewOf) {
          const haloView = halo.configure();
          haloView.render();
          if (options.defaultHalo && !options.graph.hasActiveBatch("addNewThing")) {
            haloView.toggleState();
          }
        }
        // touch support for halo (fix for halo closing itself)
        const haloOpenBtn = $(".pie-toggle").length > 0 ? $(".pie-toggle")[0] : null;
        if (haloOpenBtn) {
          haloOpenBtn.addEventListener("touchstart", function (evnt) {
            evnt.stopPropagation();
          });
          haloOpenBtn.addEventListener("touchend", function (evnt) {
            evnt.stopPropagation();
          });
        }
        options.selection.collection.reset([]);
        options.selection.collection.add(this, {
          silent: true
        });
      }
    }
    getHaloHandles(init) {
      return [];
    }
    getPortAttr(x, y, width, height) {
      return {
        rect: {
          stroke: "transparent",
          fill: "transparent",
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
          args: args
        },
        // attrs: this.getPortAttr(x, y, width, height),
        // markup: '<g><rect/></g>',
        markup: [{
          tagName: "g",
          children: [{
            tagName: "rect",
            attributes: {
              stroke: "transparent",
              fill: "transparent",
              width: width,
              height: height,
              x: x,
              y: y,
              magnet: "true"
            }
          }]
        }]
      };
    }
    doubleClickHandle(cellView, evt, initRappid) {
      this.lastEnteredText = this.attr("text/textWrap/text");
      this.openTextEditor(cellView, initRappid);
    }
    // trims the text in each entity and closes the text editor
    closeTextEditor(initRappid, textPlace = "text") {
      const lastOp = initRappid.getOpmModel().getLastUndoOpertaion();
      if (this.lastEnteredText === this.attr(textPlace + "/textWrap/text") && lastOp && lastOp.reason && lastOp.reason.includes(" text change")) {
        initRappid.getOpmModel().removeLastUndoOperation();
      } else if (lastOp && lastOp.reason && lastOp.reason.includes(" text change")) {
        initRappid.getOpmModel().lastUndoOpReasonUpdate(this.attr(textPlace + "/textWrap/text") + " text change");
      }
    }
    haloConfiguration(halo, options) {}
    changeAttributesHandle(options) {}
    changeSizeHandle(initRappid) {}
    changePositionHandle(initRappid) {}
    removeHandle(options) {}
    addHandle(options) {}
    isComputational() {}
  }

  /***/
}),
/***/68506: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    U: () => (/* binding */OpmObject)
  });
