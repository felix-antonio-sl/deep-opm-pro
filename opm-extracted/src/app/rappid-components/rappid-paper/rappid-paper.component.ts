// Source: decompiled/deobfuscated.js
// Original path: ./src/app/rappid-components/rappid-paper/rappid-paper.component.ts
// Extracted by opm-extracted/tools/extract.mjs

const rappid_paper_component_c0 = ["paperContainer"];
let RappidPaperComponent = /*#__PURE__*/(() => {
  class RappidPaperComponent {
    constructor() {}
    ngAfterViewInit() {
      // this.initPaperScroller();
      this.paperContainer.element.nativeElement.appendChild(this.paperScroller.el);
    }
    initPaperScroller() {
      /*this.paperScroller = new joint.ui.PaperScroller({
        paper: this.paper,
        autoResizePaper: true,
        padding: 50
      });*/
    }
    static #_ = (() => this.ɵfac = function RappidPaperComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || RappidPaperComponent)();
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: RappidPaperComponent,
      selectors: [["opcloud-rappid-paper"]],
      viewQuery: function RappidPaperComponent_Query(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵviewQuery */.GBs(rappid_paper_component_c0, 5, ViewContainerRef);
        }
        if (rf & 2) {
          let _t;
          if (core /* ɵɵqueryRefresh */.mGM(_t = core /* ɵɵloadQuery */.lsd())) {
            ctx.paperContainer = _t.first;
          }
        }
      },
      inputs: {
        paper: "paper",
        paperScroller: "paperScroller"
      },
      decls: 2,
      vars: 0,
      consts: [["paperContainer", ""], ["id", "paper-container", 1, "paper-container", 2, "position", "relative", "touch-action", "none"]],
      template: function RappidPaperComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelement */.nrm(0, "div", 1, 0);
        }
      }
    }))();
  }
  return RappidPaperComponent;
})();