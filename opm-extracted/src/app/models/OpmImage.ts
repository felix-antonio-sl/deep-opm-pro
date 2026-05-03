// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/OpmImage.ts
// Extracted by opm-extracted/tools/extract.mjs

class OpmImage extends joint.shapes.devs.Model.extend({
  markup: "<image/>",
  defaults: shared._.defaultsDeep({
    type: "opm.image",
    inPorts: ["in"],
    outPorts: ["out"],
    ports: {
      groups: {
        in: {
          position: {
            name: "top"
          },
          attrs: {
            ".port-body": {
              fill: "red",
              magnet: true,
              r: 5
            }
          },
          label: {
            markup: "<text class=\"label-text\"/>"
          }
        },
        out: {
          position: {
            name: "bottom",
            args: {
              dy: 150
            }
          },
          attrs: {
            ".port-body": {
              fill: "green",
              magnet: true,
              r: 5
            }
          },
          label: {
            markup: "<text class=\"label-text\"/>"
          }
        }
      }
    },
    attrs: {
      image: {},
      body: {
        rx: 10,
        // add a corner radius
        ry: 10,
        strokeWidth: 100,
        fill: "black"
      },
      label: {
        textAnchor: "left",
        // align text to left
        refX: 10,
        // offset text from right edge of model bbox
        fill: "black",
        fontSize: 18
      }
    }
  }, joint.shapes.devs.Model.prototype.defaults)
}) {
  doubleClickHandle() {
    (0, getInitRappidShared)().graphService.changeGraphModel(this.opd.id, (0, getInitRappidShared)().getTreeView(), null);
    (0, getInitRappidShared)().paperScroller.scrollToContent();
    (0, setShowMapButton)(false);
  }
  pointerUpHandle(cellView, options) {}
  changeAttributesHandle(options) {}
  changeSizeHandle(initRappid) {}
  changePositionHandle(initRappid) {}
  removeHandle(options) {}
  addHandle(options) {}
  pointerDownHandle() {}
  getParams() {}
}