// Source: decompiled/deobfuscated.js
// Original path: ./src/app/modules/rappid.module.ts
// Extracted by opm-extracted/tools/extract.mjs

let RappidModule = /*#__PURE__*/(() => {
  class RappidModule {
    static #_ = (() => this.ɵfac = function RappidModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || RappidModule)();
    })();
    static #_2 = (() => this.ɵmod = /*@__PURE__*/core /* ɵɵdefineNgModule */.$C({
      type: RappidModule
    }))();
    static #_3 = (() => this.ɵinj = /*@__PURE__*/core /* ɵɵdefineInjector */.G2t({
      imports: [CommonModule, SharedModule]
    }))();
  }
  return RappidModule;
})();
(function () {
  if (typeof ngJitMode === "undefined" || ngJitMode) {
    core /* ɵɵsetNgModuleScope */.Obh(RappidModule, {
      declarations: [RappidPaperComponent, RappidOplComponent, NoteComponent],
      imports: [CommonModule, SharedModule],
      exports: [RappidPaperComponent, RappidOplComponent]
    });
  }
})();