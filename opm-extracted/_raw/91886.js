// EXPORTS

// EXTERNAL MODULE: ./src/app/configuration/rappidEnviromentFunctionality/shared.ts + 1 modules
var shared = require("./1185.js");
; // CONCATENATED MODULE: ./src/app/models/DrawnPart/components/halo/halo-config.ts

class HaloConfiguration {
  constructor(cellView, handles) {
    this.cellView = cellView;
    this.handles = handles;
  }
  createHandles() {
    const handles = [];
    for (const handle of this.handles) {
      handles.push({
        name: handle.name,
        icon: `assets/SVG/${handle.svg}.svg`,
        events: {
          pointerdown: "remove"
        },
        attrs: {
          ".slice": {
            "data-tooltip-class-name": "small",
            "data-tooltip": handle.displayTitle,
            "data-tooltip-position": "bottom",
            "data-tooltip-padding": 15
          }
        }
      });
    }
    return handles;
  }
  configure() {
    if (this.handles.length === 0) {
      return {
        render: () => {},
        toggleState: () => {}
      };
    }
    const handles = this.createHandles();
    const pies = handles.length > 1 ? handles.length : 2;
    const pieSlice = 360 / pies;
    const halo = new (shared /* joint */.FP.ui.Halo.extend({
      PIE_INNER_RADIUS: 30,
      PIE_OUTER_RADIUS: 70
    }))({
      cellView: this.cellView,
      handles: handles,
      type: "pie",
      boxContent: false,
      pieToggles: [{
        name: "default",
        position: "nw"
      }],
      pieIconSize: 36,
      pieSliceAngle: pieSlice
    });
    for (const handle of this.handles) {
      halo.on(`action:${handle.name}:pointerdown`, function () {
        handle.action.act();
        this.remove();
      });
    }
    const that = this;
    halo.on("state:open", function () {
      for (const handle of that.handles) {
        halo.$handles?.find("." + handle.name)[0]?.addEventListener("mouseenter", $event => {
          if (handle.gif) {
            shared /* OPCloudUtils */.e2.showGIF($event, handle.gif, true);
          }
        });
        halo.$handles?.find("." + handle.name)[0]?.addEventListener("mouseleave", $event => {
          shared /* OPCloudUtils */.e2.removeAllExplainationsDivs();
        });
      }
    });
    return halo;
  }
}
; // CONCATENATED MODULE: ./src/app/models/DrawnPart/OpmEntityRappid.ts

const OpmEntityRappidDefinition = {
  defaults: shared._.defaultsDeep({}, shared /* joint */.FP.shapes.basic.Generic.prototype.defaults)
};
export class _ extends shared /* joint */.FP.dia.Element.extend(OpmEntityRappidDefinition) {
  getVisual() {
    return (0, shared /* getInitRappidShared */.Km)().getOpmModel().getVisualElementById(this.id);
  }
  longTouchHandle(cellView, options) {}
  getDefaultStyleParams(init) {
    return null;
  }
  pointerUpHandle(cellView, options) {
    if (cellView && !options.selection.collection.contains(cellView.model) && !options.isReadOnlyOpd()) {
      options.graph.startBatch("free-transform");
      new shared /* joint */.FP.ui.FreeTransform({
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