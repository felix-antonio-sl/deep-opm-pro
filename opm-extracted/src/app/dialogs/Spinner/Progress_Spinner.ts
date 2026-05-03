// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/Spinner/Progress_Spinner.ts
// Extracted by opm-extracted/tools/extract.mjs

let ProgressSpinner = /*#__PURE__*/(() => {
  class ProgressSpinner {
    constructor() {}
    Show() {}
    Hide() {}
    static #_ = (() => this.ɵfac = function ProgressSpinner_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ProgressSpinner)();
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: ProgressSpinner,
      selectors: [["progress-spinner"]],
      decls: 2,
      vars: 0,
      consts: [["width", "130px", "height", "130px", "viewBox", "0 0 66 66", "xmlns", "http://www.w3.org/2000/svg", 1, "spinner"], ["fill", "none", "stroke-width", "6", "stroke-linecap", "round", "cx", "33", "cy", "33", "r", "30", 1, "path"]],
      template: function ProgressSpinner_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵnamespaceSVG */.qSk();
          core /* ɵɵelementStart */.j41(0, "svg", 0);
          core /* ɵɵelement */.nrm(1, "circle", 1);
          core /* ɵɵelementEnd */.k0s();
        }
      },
      styles: ["html[_ngcontent-%COMP%], body[_ngcontent-%COMP%]{height:100%}body[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center}.spinner[_ngcontent-%COMP%]{height:120px;animation:_ngcontent-%COMP%_rotator 1.9s linear infinite}@keyframes _ngcontent-%COMP%_rotator{0%{transform:rotate(0)}to{transform:rotate(270deg)}}.path[_ngcontent-%COMP%]{stroke-dasharray:187;stroke-dashoffset:0;transform-origin:center;animation:_ngcontent-%COMP%_dash 1.9s ease-in-out infinite,_ngcontent-%COMP%_colors 7.6s ease-in-out infinite}@keyframes _ngcontent-%COMP%_colors{0%{stroke:#4285f4}25%{stroke:#4285f4}50%{stroke:#4285f4}75%{stroke:#4285f4}to{stroke:#4285f4}}@keyframes _ngcontent-%COMP%_dash{0%{stroke-dashoffset:187}50%{stroke-dashoffset:46.75;transform:rotate(135deg)}to{stroke-dashoffset:187;transform:rotate(450deg)}}"]
    }))();
  }
  return ProgressSpinner;
})();