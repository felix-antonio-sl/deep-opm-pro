// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/DrawnPart/components/halo/halo-config.ts
// Extracted by opm-extracted/tools/extract.mjs

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
    const halo = new (joint.ui.Halo.extend({
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
            OPCloudUtils.showGIF($event, handle.gif, true);
          }
        });
        halo.$handles?.find("." + handle.name)[0]?.addEventListener("mouseleave", $event => {
          OPCloudUtils.removeAllExplainationsDivs();
        });
      }
    });
    return halo;
  }
}